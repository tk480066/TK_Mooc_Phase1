"use client";

import { useActionState, useState } from "react";
import { GraduationCap, School, ShieldCheck } from "lucide-react";
import {
  studentSignIn,
  teacherSignIn,
  type AuthActionState,
} from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";

const initialState: AuthActionState = {};

export function LoginPanel() {
  const [mode, setMode] = useState<"teacher" | "student">("teacher");
  const [teacherState, teacherAction] = useActionState(teacherSignIn, initialState);
  const [studentState, studentAction] = useActionState(studentSignIn, initialState);

  return (
    <div className="grid overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-2xl shadow-blue-100 lg:grid-cols-[1.05fr_.95fr]">
      <section className="hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="mb-8 inline-flex rounded-2xl bg-white/15 p-3 backdrop-blur">
            <School size={34} />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">
            TK Mooc Foundation
          </p>
          <h1 className="text-4xl font-black leading-tight">
            ระบบพื้นฐานสำหรับครูและนักเรียน
          </h1>
          <p className="mt-5 max-w-md leading-8 text-blue-50">
            ระบบเข้าสู่ระบบ แยกบทบาท โปรไฟล์ผู้ใช้ และการป้องกันข้อมูลด้วย Supabase Row Level Security
          </p>
        </div>
        <div className="mt-10 flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-sm backdrop-blur">
          <ShieldCheck />
          ตรวจสอบสิทธิ์ทั้งในหน้าเว็บและฐานข้อมูล
        </div>
      </section>

      <section className="p-6 sm:p-10">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">ยินดีต้อนรับ</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">เข้าสู่ระบบ TK Mooc</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            เลือกประเภทผู้ใช้งาน แล้วกรอกข้อมูลบัญชี
          </p>
        </div>

        <div className="mb-7 grid grid-cols-2 rounded-2xl bg-slate-100 p-1.5">
          <button
            type="button"
            onClick={() => setMode("teacher")}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition ${
              mode === "teacher"
                ? "bg-white text-blue-700 shadow"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <School size={19} /> ครู
          </button>
          <button
            type="button"
            onClick={() => setMode("student")}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition ${
              mode === "student"
                ? "bg-white text-blue-700 shadow"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <GraduationCap size={19} /> นักเรียน
          </button>
        </div>

        {mode === "teacher" ? (
          <form action={teacherAction} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">อีเมลครู</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="teacher@school.ac.th"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">รหัสผ่าน</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            {teacherState.error && <ErrorMessage message={teacherState.error} />}
            <SubmitButton label="เข้าสู่ระบบครู" />
          </form>
        ) : (
          <form action={studentAction} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">รหัสนักเรียน</span>
              <input
                name="studentCode"
                inputMode="numeric"
                pattern="[0-9]{5}"
                maxLength={5}
                required
                placeholder="ตัวเลข 5 หลัก"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-lg tracking-[0.25em] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">PIN</span>
              <input
                name="pin"
                type="password"
                inputMode="numeric"
                autoComplete="current-password"
                required
                minLength={6}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            {studentState.error && <ErrorMessage message={studentState.error} />}
            <SubmitButton label="เข้าสู่ระบบนักเรียน" />
          </form>
        )}
      </section>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      {message}
    </div>
  );
}
