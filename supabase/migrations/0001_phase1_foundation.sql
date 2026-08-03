-- TK Mooc Phase 1: Foundation System
-- Run this file in Supabase SQL Editor.

create extension if not exists pgcrypto;

begin;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'teacher', 'student');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null,
  display_name text not null,
  avatar_path text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teacher_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  teacher_code text unique,
  email text,
  department text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  student_code char(5) unique not null check (student_code ~ '^[0-9]{5}$'),
  title text,
  first_name text not null,
  last_name text not null,
  nickname text,
  level text,
  room text,
  student_number integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teacher_profiles(user_id) on delete restrict,
  class_code text unique not null,
  subject_name text not null,
  class_name text not null,
  level text,
  room text,
  semester integer,
  academic_year integer,
  description text,
  status text not null default 'active' check (status in ('active', 'inactive', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.student_profiles(user_id) on delete cascade,
  student_number integer,
  group_name text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  enrolled_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (class_id, student_id)
);

create index if not exists idx_classes_teacher_id on public.classes(teacher_id);
create index if not exists idx_enrollments_class_id on public.enrollments(class_id);
create index if not exists idx_enrollments_student_id on public.enrollments(student_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists teacher_profiles_set_updated_at on public.teacher_profiles;
create trigger teacher_profiles_set_updated_at before update on public.teacher_profiles
for each row execute function public.set_updated_at();

drop trigger if exists student_profiles_set_updated_at on public.student_profiles;
create trigger student_profiles_set_updated_at before update on public.student_profiles
for each row execute function public.set_updated_at();

drop trigger if exists classes_set_updated_at on public.classes;
create trigger classes_set_updated_at before update on public.classes
for each row execute function public.set_updated_at();

drop trigger if exists enrollments_set_updated_at on public.enrollments;
create trigger enrollments_set_updated_at before update on public.enrollments
for each row execute function public.set_updated_at();

create or replace function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'admin', false);
$$;

create or replace function public.is_teacher_of_class(target_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.classes c
    where c.id = target_class_id
      and c.teacher_id = auth.uid()
  );
$$;

create or replace function public.is_enrolled_in_class(target_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.enrollments e
    where e.class_id = target_class_id
      and e.student_id = auth.uid()
      and e.status = 'active'
  );
$$;

create or replace function public.can_teacher_view_student(target_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.enrollments e
    join public.classes c on c.id = e.class_id
    where e.student_id = target_student_id
      and c.teacher_id = auth.uid()
      and e.status = 'active'
  );
$$;

revoke all on function public.current_user_role() from public;
revoke all on function public.is_admin() from public;
revoke all on function public.is_teacher_of_class(uuid) from public;
revoke all on function public.is_enrolled_in_class(uuid) from public;
revoke all on function public.can_teacher_view_student(uuid) from public;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_teacher_of_class(uuid) to authenticated;
grant execute on function public.is_enrolled_in_class(uuid) to authenticated;
grant execute on function public.can_teacher_view_student(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.teacher_profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.classes enable row level security;
alter table public.enrollments enable row level security;

-- Profiles
create policy "profiles_select_own_or_admin"
on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin());

create policy "profiles_admin_all"
on public.profiles for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Teacher profiles
create policy "teacher_profiles_select_own_or_admin"
on public.teacher_profiles for select to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "teacher_profiles_admin_all"
on public.teacher_profiles for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Student profiles: student can read self, teacher can read students in owned classes, admin can read all.
create policy "student_profiles_select_authorized"
on public.student_profiles for select to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
  or public.can_teacher_view_student(user_id)
);

create policy "student_profiles_admin_all"
on public.student_profiles for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Classes
create policy "classes_select_accessible"
on public.classes for select to authenticated
using (
  teacher_id = auth.uid()
  or public.is_enrolled_in_class(id)
  or public.is_admin()
);

create policy "classes_teacher_insert"
on public.classes for insert to authenticated
with check (
  teacher_id = auth.uid()
  and public.current_user_role() = 'teacher'
);

create policy "classes_teacher_update"
on public.classes for update to authenticated
using (teacher_id = auth.uid() or public.is_admin())
with check (teacher_id = auth.uid() or public.is_admin());

create policy "classes_teacher_delete"
on public.classes for delete to authenticated
using (teacher_id = auth.uid() or public.is_admin());

-- Enrollments
create policy "enrollments_select_accessible"
on public.enrollments for select to authenticated
using (
  student_id = auth.uid()
  or public.is_teacher_of_class(class_id)
  or public.is_admin()
);

create policy "enrollments_teacher_insert"
on public.enrollments for insert to authenticated
with check (public.is_teacher_of_class(class_id) or public.is_admin());

create policy "enrollments_teacher_update"
on public.enrollments for update to authenticated
using (public.is_teacher_of_class(class_id) or public.is_admin())
with check (public.is_teacher_of_class(class_id) or public.is_admin());

create policy "enrollments_teacher_delete"
on public.enrollments for delete to authenticated
using (public.is_teacher_of_class(class_id) or public.is_admin());

revoke all on public.profiles from anon, authenticated;
revoke all on public.teacher_profiles from anon, authenticated;
revoke all on public.student_profiles from anon, authenticated;
revoke all on public.classes from anon, authenticated;
revoke all on public.enrollments from anon, authenticated;

grant select on public.profiles to authenticated;
grant select on public.teacher_profiles to authenticated;
grant select on public.student_profiles to authenticated;
grant select, insert, update, delete on public.classes to authenticated;
grant select, insert, update, delete on public.enrollments to authenticated;

commit;
