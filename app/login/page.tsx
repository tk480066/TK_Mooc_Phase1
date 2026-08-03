import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginPanel } from "@/components/login-panel";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

export default function LoginPage() {
  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:grid lg:place-items-center">
      <div className="mx-auto w-full max-w-5xl">
        <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
          <ArrowLeft size={17} /> กลับหน้าหลัก
        </Link>
        <LoginPanel />
      </div>
    </main>
  );
}
