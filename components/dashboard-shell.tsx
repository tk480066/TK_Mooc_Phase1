import Link from "next/link";
import { BookOpen, LogOut, School, ShieldCheck, UserRound } from "lucide-react";
import { signOut } from "@/app/actions";
import type { AuthUserWithProfile } from "@/lib/types";

export function DashboardShell({
  user,
  title,
  description,
  children,
}: {
  user: AuthUserWithProfile;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 rounded-3xl border border-white bg-white/90 p-5 shadow-lg shadow-blue-100/70 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-blue-600 text-white"><School /></span>
            <div><p className="font-black">TK Mooc</p><p className="text-xs text-slate-500">Foundation System</p></div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-slate-900">{user.profile.display_name}</p>
              <p className="text-xs uppercase tracking-wider text-blue-600">{user.profile.role}</p>
            </div>
            <form action={signOut}>
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700">
                <LogOut size={17} /> ออกจากระบบ
              </button>
            </form>
          </div>
        </header>

        <section className="py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Phase 1 Dashboard</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950">{title}</h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <InfoCard icon={<UserRound />} title="บัญชีผู้ใช้" detail={user.profile.display_name} />
          <InfoCard icon={<ShieldCheck />} title="บทบาทและสิทธิ์" detail={user.profile.role} />
          <InfoCard icon={<BookOpen />} title="สถานะระบบ" detail="พร้อมเริ่มพัฒนาระยะที่ 2" />
        </section>

        <section className="mt-7">{children}</section>
      </div>
    </main>
  );
}

function InfoCard({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return (
    <article className="rounded-3xl border border-white bg-white/90 p-6 shadow-lg shadow-blue-100/60">
      <span className="grid size-12 place-items-center rounded-2xl bg-blue-100 text-blue-700">{icon}</span>
      <p className="mt-5 text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-1 text-xl font-black text-slate-900">{detail}</p>
    </article>
  );
}
