import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TK Mooc",
    template: "%s | TK Mooc",
  },
  description: "ระบบพื้นฐาน TK Mooc สำหรับครูและนักเรียน",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
