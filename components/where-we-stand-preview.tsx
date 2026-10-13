"use client";

import { ArrowUpLeft, CircleDollarSign, Scale, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { positionPillars, positionText, type PositionLanguage } from "@/lib/positions";

const copy = {
  ar: {
    kicker: "رؤيتنا للبنان",
    title: "أين نقف؟",
    browse: "عرض المواقف التسعة",
    open: "اقرأ الموقف",
    close: "إخفاء التفاصيل",
  },
  en: {
    kicker: "Our vision for Lebanon",
    title: "Where we stand",
    browse: "View all nine positions",
    open: "Read the position",
    close: "Hide details",
  },
  fr: {
    kicker: "Notre vision pour le Liban",
    title: "Nos positions",
    browse: "Voir les neuf positions",
    open: "Lire la position",
    close: "Masquer les détails",
  },
} as const;

const featured = [positionPillars[0], positionPillars[4], positionPillars[7]];
const icons = [ShieldCheck, CircleDollarSign, Scale];

export function WhereWeStandPreview({ lang }: { lang: PositionLanguage }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const t = copy[lang];

  return (
    <section id="stand" className="relative overflow-hidden border-y border-black/[.06] bg-[var(--site-surface-soft)] px-5 py-16 lg:px-8 lg:py-20">
      <div className="absolute -start-52 top-0 h-96 w-96 rounded-full bg-[#1a5632]/7 blur-3xl" />
      <div className="absolute -end-48 bottom-0 h-96 w-96 rounded-full bg-[#cd1e25]/8 blur-3xl" />
      <div className="relative mx-auto max-w-[1280px]">
        <div className="max-w-2xl" data-reveal>
            <div className="arabic-safe mb-3 flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#1a5632]"><span className="h-2 w-2 rounded-full bg-[#1a5632]" />{t.kicker}</div>
            <h2 className="section-title text-[clamp(2.25rem,4.5vw,4.25rem)] font-extrabold leading-[1.12] tracking-[-.045em]">{t.title}</h2>
            <Link href="/where-we-stand" className="mt-6 inline-flex w-fit items-center gap-3 rounded-2xl bg-[#cd1e25] px-6 py-4 text-[13px] font-extrabold text-white shadow-[0_14px_34px_rgba(205, 30, 37,.24)] transition hover:-translate-y-0.5 hover:bg-[#cd1e25] hover:shadow-[0_18px_40px_rgba(205, 30, 37,.3)]">
              {t.browse}
              <span className="grid h-7 min-w-7 place-items-center rounded-full bg-white/16 px-1.5 font-mono text-[9px]">09</span>
              <ArrowUpLeft size={16} />
            </Link>
        </div>

        <div className="mt-9 grid items-start gap-4 lg:grid-cols-3" data-reveal>
          {featured.map((pillar, index) => {
            const Icon = icons[index];
            const active = activeIndex === index;
            return (
              <button
                key={pillar.id}
                type="button"
                aria-expanded={active}
                onClick={() => setActiveIndex(active ? null : index)}
                className={`group flex min-h-[365px] w-full flex-col overflow-hidden rounded-[27px] border p-6 text-start shadow-[0_12px_36px_var(--site-shadow)] transition duration-300 sm:p-7 ${active ? "border-[#cd1e25]/30 bg-[var(--site-surface)] shadow-[0_20px_55px_var(--site-shadow)]" : "border-black/[.07] bg-[var(--site-surface)] hover:-translate-y-1 hover:border-[#1a5632]/25"}`}
              >
                <span className="flex items-center justify-between">
                  <span className={`grid h-12 w-12 place-items-center rounded-[17px] transition ${active ? "bg-[#cd1e25] text-white" : "bg-[#1a5632]/9 text-[#1a5632] group-hover:bg-[#1a5632] group-hover:text-white"}`}><Icon size={21} /></span>
                  <span className={`font-mono text-[10px] font-bold tracking-[.14em] ${active ? "text-[#cd1e25]" : "text-[var(--site-muted)]"}`}>{pillar.number} / 09</span>
                </span>
                <span className="section-title mt-7 block min-h-[3.25em] max-w-[285px] text-[clamp(1.55rem,2.5vw,2.15rem)] font-extrabold leading-[1.3] tracking-[-.025em] [text-wrap:balance]">{positionText(pillar.title, lang)}</span>
                <span className="mt-3 block min-h-[5.25rem] text-[13px] font-normal leading-7 text-[var(--site-muted)]">{positionText(pillar.short, lang)}</span>
                <span className={`grid transition-[grid-template-rows,opacity] duration-300 ${active ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <span className="overflow-hidden">
                    <span className="block border-t border-black/[.07] pt-5 text-[12px] font-normal leading-7 text-[var(--site-muted)]">{positionText(pillar.statement, lang)}</span>
                  </span>
                </span>
                <span className={`mt-auto inline-flex items-center gap-2 pt-5 text-[10px] font-extrabold ${active ? "text-[#cd1e25]" : "text-[#1a5632]"}`}>{active ? t.close : t.open}<span aria-hidden="true">{active ? "−" : "+"}</span></span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
