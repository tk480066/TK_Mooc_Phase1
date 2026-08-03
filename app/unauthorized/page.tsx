import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="max-w-lg rounded-[2rem] border border-white bg-white p-8 text-center shadow-2xl shadow-blue-100">
        <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-amber-100 text-amber-700"><ShieldAlert size={30} /></span>
        <h1 className="mt-5 text-3xl font-black">ไม่มีสิทธิ์เข้าถึงหน้านี้</h1>
        <p className="mt-3 leading-7 text-slate-600">บัญชีของคุณไม่ตรงกับบทบาทที่กำหนด กรุณากลับไปยังหน้าระบบหลัก</p>
        <Link href="/dashboard" className="mt-6 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white">กลับไปยังระบบ</Link>
      </div>
    </main>
  );
}
