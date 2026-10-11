"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

type ThemeToggleProps = {
  className?: string;
  compact?: boolean;
};

export function ThemeToggle({ className = "", compact = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const dark = mounted && resolvedTheme === "dark";
  const label = dark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={`theme-toggle ${compact ? "theme-toggle--compact" : ""} ${className}`}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__thumb">
          {dark ? <Moon size={15} /> : <Sun size={15} />}
        </span>
      </span>
      {!compact && <span className="theme-toggle__label">{dark ? "Dark" : "Light"}</span>}
    </button>
  );
}

export function ThemeDock() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/v2") return null;
  const publicRoute = ["/classic", "/news", "/people", "/publications", "/samir-geagea", "/where-we-stand"]
    .some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!publicRoute) return null;
  return <ThemeToggle compact className="theme-dock" />;
}
