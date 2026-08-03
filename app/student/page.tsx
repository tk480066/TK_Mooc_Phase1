import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireRole } from "@/lib/auth/require-role";

export const metadata: Metadata = { title: "ระบบนักเรียน" };

export default async function StudentPage() {
  const user = await requireRole("student");

  return (
    <DashboardShell
      user={user}
      title="ระบบนักเรียน"
      description="นักเรียนเข้าสู่ระบบด้วยรหัส 5 หลักและ PIN โดยข้อมูลบัญชีถูกแยกตามผู้ใช้"
    >
      <div className="rounded-3xl bg-gradient-to-br from-blue-700 to-cyan-500 p-7 text-white shadow-2xl">
        <p className="text-sm font-semibold text-blue-100">NEXT · PHASE 2</p>
        <h2 className="mt-2 text-2xl font-black">รายวิชาและบทเรียนของฉัน</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {["ดูรายวิชาที่ลงทะเบียน", "เปิดบทเรียน", "ติดตามความก้าวหน้า", "ดูงานที่ต้องส่ง"].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/15 p-4 backdrop-blur"><CheckCircle2 size={20} />{item}</div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
