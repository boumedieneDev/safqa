import type { Metadata } from "next";
import "@fontsource-variable/cairo/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Safqa | منصة الشفافية وتحليل المخاطر",
  description: "منصة عربية لإدارة الصفقات العمومية وتحليل المخاطر ومؤشر الشفافية.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
