import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireRole } from "@/lib/auth/require-role";

export const metadata: Metadata = { title: "ระบบครู" };

export default async function TeacherPage() {
  const user = await requireRole("teacher");

  return (
    <DashboardShell
      user={user}
      title="ระบบครู"
      description="บัญชีครูได้รับการตรวจสอบจาก Supabase Auth และโปรไฟล์บทบาท teacher แล้ว"
    >
      <PhaseCard items={["สร้างและจัดการชั้นเรียน", "นำเข้ารายชื่อนักเรียน", "สร้างบทเรียนและงาน", "เช็กชื่อและสมุดคะแนน"]} />
    </DashboardShell>
  );
}

function PhaseCard({ items }: { items: string[] }) {
  return (
    <div className="rounded-3xl bg-slate-950 p-7 text-white shadow-2xl">
      <p className="text-sm font-semibold text-blue-300">NEXT · PHASE 2</p>
      <h2 className="mt-2 text-2xl font-black">ชั้นเรียนและบทเรียน</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4"><CheckCircle2 className="text-cyan-300" size={20} />{item}</div>)}
      </div>
    </div>
  );
}
