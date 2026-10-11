"use client";

import {
  ArrowLeft,
  Building2,
  Check,
  ChevronLeft,
  CircleDollarSign,
  Gavel,
  HeartPulse,
  Landmark,
  Leaf,
  Lightbulb,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  positionPillars,
  positionText,
  type PositionCategory,
  type PositionLanguage,
} from "@/lib/positions";

const copy = {
  ar: {
    brand: "القوات اللبنانية",
    back: "العودة إلى الرئيسية",
    eyebrow: "من المبادئ إلى السياسات العامة",
    title: "موقفنا واضح.\nومشروعنا قابل للتنفيذ.",
    intro: "رؤية متكاملة لدولة سيّدة، اقتصاد منتج ومجتمع يحفظ كرامة الإنسان. استكشف الأولويات التي تنطلق من التزاماتنا الانتخابية لعام 2022 وتستمر كمسار عمل سياسي وتشريعي.",
    source: "خلاصة تفاعلية مبنية على برنامج القوات اللبنانية الانتخابي لعام 2022، ومصاغة لتشرح الموقف لا لعرض الوثيقة.",
    search: "ابحث في المواقف…",
    filters: { all: "الكل", state: "الدولة", economy: "الاقتصاد", society: "المجتمع", future: "المستقبل" },
    explore: "اختر محوراً لاستكشافه",
    priority: "أولويات التنفيذ",
    position: "موقفنا",
    results: "محاور",
    noResults: "لا توجد نتائج مطابقة. جرّب كلمة أخرى.",
  },
  en: {
    brand: "Lebanese Forces",
    back: "Back to the homepage",
    eyebrow: "From principles to public policy",
    title: "A clear position.\nA plan that can be delivered.",
    intro: "An integrated vision for a sovereign state, a productive economy and a society that protects human dignity. Explore priorities drawn from our 2022 electoral commitments and carried forward as a political and legislative path.",
    source: "An interactive synthesis based on the Lebanese Forces’ 2022 electoral program—written to explain each position, not to reproduce the document.",
    search: "Search our positions…",
    filters: { all: "All", state: "The state", economy: "Economy", society: "Society", future: "The future" },
    explore: "Choose a pillar to explore",
    priority: "Delivery priorities",
    position: "Our position",
    results: "pillars",
    noResults: "No matching position. Try another search.",
  },
  fr: {
    brand: "Forces Libanaises",
    back: "Retour à l’accueil",
    eyebrow: "Des principes aux politiques publiques",
    title: "Une position claire.\nUn projet réalisable.",
    intro: "Une vision intégrée pour un État souverain, une économie productive et une société qui protège la dignité humaine. Découvrez les priorités issues de nos engagements électoraux de 2022 et poursuivies dans notre action politique et législative.",
    source: "Une synthèse interactive fondée sur le programme électoral 2022 des Forces Libanaises, conçue pour expliquer les positions et non reproduire le document.",
    search: "Rechercher une position…",
    filters: { all: "Tout", state: "L’État", economy: "Économie", society: "Société", future: "Avenir" },
    explore: "Choisissez un pilier",
    priority: "Priorités d’exécution",
    position: "Notre position",
    results: "piliers",
    noResults: "Aucun résultat. Essayez une autre recherche.",
  },
} as const;

const iconById = {
  sovereignty: ShieldCheck,
  institutions: Landmark,
  accountability: Gavel,
  recovery: CircleDollarSign,
  "productive-economy": Lightbulb,
  infrastructure: Zap,
  "social-protection": HeartPulse,
  rights: UsersRound,
  environment: Leaf,
} as const;

const categories: Array<"all" | PositionCategory> = ["all", "state", "economy", "society", "future"];

export function PositionExplorer() {
  const [language, setLanguage] = useState<PositionLanguage>("ar");
  const [category, setCategory] = useState<"all" | PositionCategory>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(positionPillars[0].id);
  const t = copy[language];
  const rtl = language === "ar";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [language, rtl]);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(language === "ar" ? "ar-LB" : language);
    return positionPillars.filter((pillar) => {
      if (category !== "all" && pillar.category !== category) return false;
      if (!needle) return true;
      const searchable = [
        positionText(pillar.title, language),
        positionText(pillar.short, language),
        positionText(pillar.statement, language),
        ...pillar.priorities.map((priority) => positionText(priority, language)),
      ].join(" ").toLocaleLowerCase(language === "ar" ? "ar-LB" : language);
      return searchable.includes(needle);
    });
  }, [category, language, query]);

  const selected = positionPillars.find((pillar) => pillar.id === selectedId) || visible[0] || positionPillars[0];
  const SelectedIcon = iconById[selected.id as keyof typeof iconById] || Building2;

  const chooseCategory = (next: "all" | PositionCategory) => {
    setCategory(next);
    const first = positionPillars.find((pillar) => next === "all" || pillar.category === next);
    if (first) setSelectedId(first.id);
  };

  return (
    <main className="theme-page overflow-x-hidden" dir={rtl ? "rtl" : "ltr"}>
      <header className="sticky top-0 z-40 border-b border-black/[.07] bg-[color-mix(in_srgb,var(--site-bg)_88%,transparent)] backdrop-blur-2xl">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center gap-5 px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3 text-start">
            <Image src="/lf-logo.png" alt="" width={43} height={43} className="rounded-full bg-white object-cover" priority />
            <span>
              <strong className="block text-[15px] font-extrabold">{t.brand}</strong>
              <span className="mt-1 block text-[9px] font-bold tracking-[.15em] text-black/38" lang="en">LEBANESE FORCES</span>
            </span>
          </Link>
          <div className="ms-auto flex items-center gap-2">
            <div className="flex rounded-full border border-black/[.08] bg-white p-1 shadow-sm">
              {(["ar", "en", "fr"] as PositionLanguage[]).map((code) => (
                <button key={code} onClick={() => setLanguage(code)} className={`grid h-8 min-w-9 place-items-center rounded-full px-2 text-[10px] font-extrabold transition ${language === code ? "bg-[#df1f2d] text-white" : "text-black/45 hover:text-[#df1f2d]"}`}>{code.toUpperCase()}</button>
              ))}
            </div>
            <Link href="/" className="hidden h-10 items-center gap-2 rounded-full bg-[#191919] px-5 text-[11px] font-extrabold text-white transition hover:bg-[#df1f2d] sm:inline-flex">
              <ArrowLeft size={15} className={rtl ? "rotate-180" : ""} />{t.back}
            </Link>
          </div>
        </div>
      </header>

      <section className="relative isolate overflow-hidden border-b border-black/[.06]">
        <div className="absolute inset-0 -z-30 bg-[linear-gradient(120deg,#faf7ef_0%,#edf3ed_52%,#f8f6ef_100%)] dark-hidden" />
        <Image src="/hero-v2/cedar.webp" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-[28%_46%] opacity-[.24] grayscale-[.25]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_left,var(--site-bg)_5%,color-mix(in_srgb,var(--site-bg)_92%,transparent)_40%,color-mix(in_srgb,var(--site-bg)_38%,transparent)_82%)]" />
        <div className="mx-auto grid min-h-[610px] max-w-[1400px] items-center gap-12 px-5 py-24 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
          <div className="max-w-4xl" data-reveal>
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#0b7740]/18 bg-white/70 px-4 py-2 text-[11px] font-extrabold text-[#0b7740] shadow-sm backdrop-blur">
              <Sparkles size={15} />{t.eyebrow}
            </div>
            <h1 className="display-title whitespace-pre-line text-[clamp(3rem,7vw,7.2rem)] font-extrabold leading-[1.12] tracking-[-.055em] text-[var(--site-text)]">{t.title}</h1>
            <p className="mt-7 max-w-3xl text-[15px] font-normal leading-8 text-[var(--site-muted)] sm:text-[17px] sm:leading-9">{t.intro}</p>
          </div>
          <div className="hidden justify-self-end lg:block" aria-hidden="true">
            <div className="relative h-[340px] w-[340px] rounded-full border border-black/10 bg-white/30 p-8 backdrop-blur-sm">
              <div className="grid h-full w-full place-items-center rounded-full border border-[#df1f2d]/20 bg-white/55 shadow-[0_30px_90px_rgba(30,40,32,.12)]">
                <Image src="/lf-logo.png" alt="" width={188} height={188} className="rounded-full object-cover mix-blend-multiply" />
              </div>
              <span className="absolute -start-4 top-16 h-4 w-4 rounded-full bg-[#df1f2d] shadow-[0_0_0_10px_rgba(223,31,45,.1)]" />
              <span className="absolute -end-2 bottom-20 h-3 w-3 rounded-full bg-[#0b7740] shadow-[0_0_0_9px_rgba(11,119,64,.1)]" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-10 xl:grid-cols-[390px_1fr]">
          <aside className="xl:sticky xl:top-28 xl:self-start">
            <div className="rounded-[30px] border border-black/[.07] bg-white p-5 shadow-[0_18px_55px_var(--site-shadow)] sm:p-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[.13em] text-[#df1f2d]">{t.explore}</p>
              <div className="relative mt-5">
                <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-black/32" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} className="h-12 w-full rounded-2xl border border-black/[.08] bg-[var(--site-surface-soft)] pe-11 ps-11 text-[13px] font-bold outline-none transition focus:border-[#df1f2d]/35 focus:ring-4 focus:ring-[#df1f2d]/8" />
                {query && <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute end-4 top-1/2 -translate-y-1/2 text-black/35 hover:text-[#df1f2d]"><X size={15} /></button>}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button key={item} onClick={() => chooseCategory(item)} className={`rounded-full px-4 py-2 text-[11px] font-extrabold transition ${category === item ? "bg-[#191919] text-white" : "bg-[var(--site-surface-soft)] text-[var(--site-muted)] hover:text-[#df1f2d]"}`}>{t.filters[item]}</button>
                ))}
              </div>
              <div className="mt-5 border-t border-black/[.07] pt-4 text-[11px] font-bold text-black/35">{visible.length} {t.results}</div>
            </div>

            <p className="mt-5 rounded-[24px] border border-[#0b7740]/14 bg-[#0b7740]/[.055] p-5 text-[11px] font-normal leading-6 text-[var(--site-muted)]">{t.source}</p>
          </aside>

          <div>
            {visible.length === 0 ? (
              <div className="grid min-h-64 place-items-center rounded-[30px] border border-dashed border-black/15 bg-white p-8 text-center text-[14px] font-bold text-black/42">{t.noResults}</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {visible.map((pillar) => {
                  const Icon = iconById[pillar.id as keyof typeof iconById] || Building2;
                  const active = pillar.id === selected.id;
                  return (
                    <button key={pillar.id} onClick={() => setSelectedId(pillar.id)} className={`group min-h-[245px] rounded-[28px] border p-6 text-start transition duration-300 sm:p-7 ${active ? "border-[#df1f2d] bg-[#191919] text-white shadow-[0_24px_65px_rgba(0,0,0,.16)]" : "border-black/[.07] bg-white shadow-[0_12px_40px_var(--site-shadow)] hover:-translate-y-1 hover:border-[#df1f2d]/30"}`}>
                      <div className="flex items-start justify-between gap-4">
                        <span className={`grid h-12 w-12 place-items-center rounded-2xl ${active ? "bg-[#df1f2d] text-white" : "bg-[var(--site-surface-soft)] text-[#0b7740]"}`}><Icon size={21} /></span>
                        <span className={`font-mono text-[11px] font-bold ${active ? "text-white/35" : "text-black/25"}`}>{pillar.number}</span>
                      </div>
                      <h2 className="section-title mt-7 text-[22px] font-extrabold leading-[1.45] sm:text-[25px]">{positionText(pillar.title, language)}</h2>
                      <p className={`mt-3 text-[12px] font-normal leading-7 ${active ? "text-white/55" : "text-black/48"}`}>{positionText(pillar.short, language)}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#171b18] text-white">
        <div className="absolute -end-40 -top-40 h-[460px] w-[460px] rounded-full bg-[#df1f2d]/18 blur-3xl" />
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 lg:grid-cols-[.72fr_1.28fr] lg:px-8 lg:py-28">
          <div>
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-[20px] bg-[#df1f2d]"><SelectedIcon size={24} /></span>
              <span className="font-mono text-[12px] font-bold tracking-[.18em] text-white/32">{selected.number} / 09</span>
            </div>
            <div className="mt-12 text-[11px] font-extrabold uppercase tracking-[.13em] text-[#67c892]">{t.position}</div>
            <h2 className="section-title mt-4 text-[clamp(2.3rem,5vw,4.9rem)] font-extrabold leading-[1.24] tracking-[-.045em]">{positionText(selected.title, language)}</h2>
          </div>
          <div className="lg:border-s lg:border-white/10 lg:ps-12">
            <p className="text-[17px] font-normal leading-9 text-white/68 sm:text-[20px] sm:leading-10">{positionText(selected.statement, language)}</p>
            <div className="mt-10 border-t border-white/10 pt-8">
              <div className="mb-5 text-[11px] font-extrabold uppercase tracking-[.13em] text-[#ff6771]">{t.priority}</div>
              <ol className="space-y-3">
                {selected.priorities.map((priority, index) => (
                  <li key={index} className="flex gap-4 rounded-[20px] border border-white/[.07] bg-white/[.035] p-5 text-[13px] font-bold leading-7 text-white/78">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0b7740] text-white"><Check size={14} /></span>
                    <span>{positionText(priority, language)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/[.07] bg-[var(--site-bg)]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link href="/" className="inline-flex items-center gap-3 text-[12px] font-extrabold hover:text-[#df1f2d]"><ChevronLeft size={17} className={rtl ? "rotate-180" : ""} />{t.back}</Link>
          <span className="text-[10px] font-bold text-black/30">© 2026 Lebanese Forces</span>
        </div>
      </footer>
    </main>
  );
}
