-- Verify TK Mooc Phase 1 after running the migration.

select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('profiles', 'teacher_profiles', 'student_profiles', 'classes', 'enrollments')
order by table_name;

select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('profiles', 'teacher_profiles', 'student_profiles', 'classes', 'enrollments')
order by tablename;

select schemaname, tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('profiles', 'teacher_profiles', 'student_profiles', 'classes', 'enrollments')
order by tablename, policyname;
