import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}

const [role, ...rawArgs] = process.argv.slice(2);
const args = Object.fromEntries(
  rawArgs
    .filter((item) => item.startsWith("--") && item.includes("="))
    .map((item) => {
      const [key, ...value] = item.slice(2).split("=");
      return [key, value.join("=")];
    }),
);

function requireArg(name) {
  const value = args[name]?.trim();
  if (!value) throw new Error(`Missing --${name}=...`);
  return value;
}

if (!['teacher', 'student'].includes(role)) {
  console.error(`Usage:
  npm run create-user -- teacher --email=teacher@school.ac.th --password=StrongPassword --name=ครูปิง --code=T001 --department=เทคโนโลยี
  npm run create-user -- student --code=12345 --pin=123456 --firstName=สมชาย --lastName=ใจดี --title=เด็กชาย --level=ม.2 --room=1 --number=1`);
  process.exit(1);
}

const admin = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  let page = 1;
  while (page <= 20) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const found = data.users.find((user) => user.email === email);
    if (found) return found;
    if (data.users.length < 100) return null;
    page += 1;
  }
  return null;
}

async function ensureUser(email, password, displayName) {
  const existing = await findUserByEmail(email);
  if (existing) return existing;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName },
  });
  if (error) throw error;
  return data.user;
}

async function createTeacher() {
  const email = requireArg('email');
  const password = requireArg('password');
  const name = requireArg('name');
  if (password.length < 8) throw new Error('Teacher password must be at least 8 characters');

  const user = await ensureUser(email, password, name);
  const { error: profileError } = await admin.from('profiles').upsert({
    id: user.id,
    role: 'teacher',
    display_name: name,
    status: 'active',
  });
  if (profileError) throw profileError;

  const { error: detailError } = await admin.from('teacher_profiles').upsert({
    user_id: user.id,
    teacher_code: args.code || null,
    email,
    department: args.department || null,
  });
  if (detailError) throw detailError;
  console.log(`Teacher created: ${email}`);
}

async function createStudent() {
  const code = requireArg('code');
  const pin = requireArg('pin');
  const firstName = requireArg('firstName');
  const lastName = requireArg('lastName');
  if (!/^\d{5}$/.test(code)) throw new Error('Student code must contain exactly 5 digits');
  if (pin.length < 6) throw new Error('Student PIN must be at least 6 characters');

  const email = `${code}@students.tkmooc.local`;
  const displayName = [args.title, firstName, lastName].filter(Boolean).join(' ');
  const user = await ensureUser(email, pin, displayName);

  const { error: profileError } = await admin.from('profiles').upsert({
    id: user.id,
    role: 'student',
    display_name: displayName,
    status: 'active',
  });
  if (profileError) throw profileError;

  const { error: detailError } = await admin.from('student_profiles').upsert({
    user_id: user.id,
    student_code: code,
    title: args.title || null,
    first_name: firstName,
    last_name: lastName,
    nickname: args.nickname || null,
    level: args.level || null,
    room: args.room || null,
    student_number: args.number ? Number(args.number) : null,
  });
  if (detailError) throw detailError;
  console.log(`Student created: ${code}`);
}

(role === 'teacher' ? createTeacher() : createStudent()).catch((error) => {
  console.error(error);
  process.exit(1);
});
