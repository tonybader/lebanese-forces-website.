import type { Metadata } from "next";
import { ThemeDock } from "@/components/theme-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "القوات اللبنانية | Lebanese Forces",
  description:
    "الموقع التفاعلي للقوات اللبنانية: التاريخ، القيادة، الكتل، الأخبار والمنشورات والميديا.",
  icons: {
    icon: "/lf-logo.png",
    shortcut: "/lf-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <ThemeDock />
        </ThemeProvider>
      </body>
    </html>
  );
}
