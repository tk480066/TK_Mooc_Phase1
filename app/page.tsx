import Link from "next/link";
import { ArrowRight, Database, LockKeyhole, School } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/require-role";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <nav className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/85 px-5 py-4 shadow-lg shadow-blue-100/60 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-blue-600 text-white">
              <School size={23} />
            </span>
            <div>
              <p className="font-black text-slate-900">TK Mooc</p>
              <p className="text-xs text-slate-500">ศูนย์การเรียนรู้ครูปิง</p>
            </div>
          </div>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {user ? "ไปยังระบบ" : "เข้าสู่ระบบ"} <ArrowRight size={17} />
          </Link>
        </nav>

        <section className="grid items-center gap-10 py-20 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Phase 1 · Foundation System
            </span>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.12] text-slate-950 sm:text-6xl">
              ระบบพื้นฐานสำหรับพัฒนา LMS บน Vercel และ Supabase
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              พร้อมระบบเข้าสู่ระบบครูและนักเรียน โปรไฟล์ บทบาท การป้องกันเส้นทาง และฐานข้อมูลที่กำหนดสิทธิ์ด้วย RLS
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                เริ่มใช้งาน <ArrowRight size={19} />
              </Link>
              <a
                href="#features"
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
              >
                ดูองค์ประกอบระบบ
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-blue-300/50 to-cyan-200/30 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white bg-white/90 p-7 shadow-2xl shadow-blue-200/70 backdrop-blur">
              <p className="text-sm font-semibold text-blue-600">SYSTEM STATUS</p>
              <h2 className="mt-2 text-2xl font-black">โครงสร้างพร้อมต่อยอด</h2>
              <div className="mt-6 space-y-4">
                <StatusItem icon={<LockKeyhole />} title="Authentication" detail="Teacher / Student login" />
                <StatusItem icon={<Database />} title="PostgreSQL" detail="Profiles, Roles, Classes, Enrollments" />
                <StatusItem icon={<School />} title="Role Dashboard" detail="แยกหน้าตามสิทธิ์ผู้ใช้" />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="grid gap-5 pb-16 md:grid-cols-3">
          {[
            ["Supabase Auth", "ครูเข้าสู่ระบบด้วยอีเมล นักเรียนใช้รหัส 5 หลักร่วมกับ PIN"],
            ["Row Level Security", "กำหนดสิทธิ์ระดับแถวที่ฐานข้อมูล ไม่พึ่งการซ่อนเมนูเพียงอย่างเดียว"],
            ["Vercel Ready", "มี Environment template และโครงสร้าง Next.js พร้อม Deploy"],
          ].map(([title, detail]) => (
            <article key={title} className="rounded-3xl border border-white bg-white/85 p-6 shadow-lg shadow-blue-100/70">
              <h3 className="text-xl font-black text-slate-900">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{detail}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

function StatusItem({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
      <span className="grid size-11 place-items-center rounded-xl bg-blue-100 text-blue-700">{icon}</span>
      <div>
        <p className="font-bold text-slate-900">{title}</p>
        <p className="text-sm text-slate-500">{detail}</p>
      </div>
    </div>
  );
}
