"use client";

import { ArrowUpLeft, Building2, CircleDollarSign, Landmark, Leaf, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { positionPillars, positionText, type PositionLanguage } from "@/lib/positions";

const copy = {
  ar: {
    kicker: "رؤيتنا للبنان",
    title: "أين نقف؟",
    description: "ليست السياسة مجموعة شعارات. هي خيارات واضحة في السيادة، بناء الدولة، الاقتصاد، المجتمع والمستقبل.",
    browse: "استكشف كل مواقفنا",
    choose: "تصفّح المحاور",
    position: "موقف واضح",
  },
  en: {
    kicker: "Our vision for Lebanon",
    title: "Where we stand",
    description: "Politics is more than slogans. It is a set of clear choices on sovereignty, state building, the economy, society and the future.",
    browse: "Explore every position",
    choose: "Browse the pillars",
    position: "A clear position",
  },
  fr: {
    kicker: "Notre vision pour le Liban",
    title: "Nos positions",
    description: "La politique ne se résume pas à des slogans. Elle repose sur des choix clairs concernant la souveraineté, l’État, l’économie, la société et l’avenir.",
    browse: "Découvrir toutes nos positions",
    choose: "Parcourir les piliers",
    position: "Une position claire",
  },
} as const;

const featured = positionPillars.slice(0, 5);
const icons = [ShieldCheck, Landmark, CircleDollarSign, Building2, Leaf];

export function WhereWeStandPreview({ lang }: { lang: PositionLanguage }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const t = copy[lang];
  const active = featured[activeIndex];
  const ActiveIcon = icons[activeIndex];

  return (
    <section id="stand" className="relative overflow-hidden border-y border-black/[.06] bg-[var(--site-surface-soft)] px-5 py-24 lg:px-8 lg:py-30">
      <div className="absolute -start-48 top-0 h-[440px] w-[440px] rounded-full bg-[#0b7740]/8 blur-3xl" />
      <div className="absolute -end-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#df1f2d]/9 blur-3xl" />
      <div className="relative mx-auto max-w-[1380px]">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div className="max-w-3xl" data-reveal>
            <div className="arabic-safe mb-4 flex items-center gap-3 text-[12px] font-extrabold uppercase tracking-[.12em] text-[#0b7740]"><span className="h-2 w-2 rounded-full bg-[#0b7740]" />{t.kicker}</div>
            <h2 className="section-title text-[clamp(2.6rem,6vw,5.8rem)] font-extrabold leading-[1.15] tracking-[-.055em]">{t.title}</h2>
            <p className="mt-5 max-w-2xl text-[15px] font-normal leading-8 text-[var(--site-muted)] sm:text-[17px]">{t.description}</p>
          </div>
          <Link href="/where-we-stand" className="inline-flex w-fit items-center gap-3 rounded-full bg-[#191919] px-6 py-3.5 text-[12px] font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#df1f2d]">{t.browse}<ArrowUpLeft size={16} /></Link>
        </div>

        <div className="mt-12 grid gap-4 xl:grid-cols-[.9fr_1.1fr]" data-reveal>
          <div className="relative min-h-[450px] overflow-hidden rounded-[34px] bg-[#171b18] p-7 text-white shadow-[0_28px_80px_rgba(0,0,0,.18)] sm:p-10">
            <div className="absolute -end-24 -top-24 h-72 w-72 rounded-full bg-[#df1f2d]/24 blur-3xl" />
            <div className="absolute -bottom-24 -start-20 h-64 w-64 rounded-full bg-[#0b7740]/25 blur-3xl" />
            <div className="relative flex h-full flex-col">
              <div className="flex items-center justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-[19px] bg-[#df1f2d]"><ActiveIcon size={24} /></span>
                <span className="font-mono text-[11px] font-bold tracking-[.16em] text-white/30">{active.number} / 09</span>
              </div>
              <div className="mt-auto pt-20">
                <div className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#6ed298]">{t.position}</div>
                <h3 className="section-title mt-4 max-w-2xl text-[clamp(2rem,4.5vw,4.4rem)] font-extrabold leading-[1.24] tracking-[-.045em]">{positionText(active.title, lang)}</h3>
                <p className="mt-5 max-w-xl text-[14px] font-normal leading-8 text-white/55 sm:text-[16px]">{positionText(active.short, lang)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[34px] border border-black/[.07] bg-white p-4 shadow-[0_16px_55px_var(--site-shadow)] sm:p-6">
            <div className="mb-3 px-2 text-[11px] font-extrabold uppercase tracking-[.12em] text-black/35">{t.choose}</div>
            <div className="divide-y divide-black/[.07]">
              {featured.map((pillar, index) => {
                const Icon = icons[index];
                const activeRow = index === activeIndex;
                return (
                  <button key={pillar.id} onClick={() => setActiveIndex(index)} className={`group flex w-full items-center gap-4 rounded-[22px] px-3 py-5 text-start transition sm:px-4 ${activeRow ? "bg-[var(--site-surface-soft)]" : "hover:bg-[var(--site-surface-soft)]"}`}>
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl transition ${activeRow ? "bg-[#df1f2d] text-white" : "bg-[var(--site-surface-soft)] text-[#0b7740] group-hover:bg-[#0b7740] group-hover:text-white"}`}><Icon size={19} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-extrabold leading-7 sm:text-[17px]">{positionText(pillar.title, lang)}</span>
                      <span className="mt-1 block line-clamp-1 text-[11px] font-normal text-black/40">{positionText(pillar.short, lang)}</span>
                    </span>
                    <span className={`font-mono text-[10px] font-bold ${activeRow ? "text-[#df1f2d]" : "text-black/22"}`}>{pillar.number}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
