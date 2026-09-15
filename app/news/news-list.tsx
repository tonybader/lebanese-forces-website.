"use client";

import { ArrowLeft, ArrowUpLeft, CalendarDays, Globe2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Article, ArticleLanguage } from "@/lib/article-types";
import { articleHref, articleText, formatArticleDate } from "@/lib/article-types";

const copy = {
  ar: { kicker: "آخر المستجدات", title: "الأخبار والمواقف", intro: "الأخبار مرتّبة تلقائياً من الأحدث إلى الأقدم.", back: "العودة إلى الرئيسية", read: "اقرأ الخبر", empty: "لا توجد أخبار منشورة بعد." },
  en: { kicker: "Latest updates", title: "News and positions", intro: "Articles are automatically ordered from newest to oldest.", back: "Back to homepage", read: "Read article", empty: "No articles have been published yet." },
  fr: { kicker: "Dernières nouvelles", title: "Actualités et positions", intro: "Les articles sont automatiquement classés du plus récent au plus ancien.", back: "Retour à l’accueil", read: "Lire l’article", empty: "Aucun article n’a encore été publié." },
};

export function NewsList({ initialArticles }: { initialArticles: Article[] }) {
  const [language, setLanguage] = useState<ArticleLanguage>("ar");
  const rtl = language === "ar";
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [language, rtl]);

  return (
    <main dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-[#f7f7f5] text-[#171717]">
      <header className="sticky top-0 z-30 border-b border-black/[.06] bg-[#f7f7f5]/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-[74px] max-w-[1380px] items-center gap-4 px-5 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <img src="/lf-logo.png" alt="Lebanese Forces" className="h-11 w-11 rounded-full bg-white object-contain shadow-sm" />
            <span className="hidden sm:block">
              <span className="block text-[15px] font-extrabold">القوات اللبنانية</span>
              <span className="block text-[9px] font-bold uppercase tracking-[.13em] text-black/35">Lebanese Forces</span>
            </span>
          </a>
          <div className="ms-auto flex items-center gap-2 rounded-full border border-black/[.08] bg-white p-1 shadow-sm">
            <Globe2 className="ms-2 text-black/35" size={15} />
            {(["ar", "en", "fr"] as ArticleLanguage[]).map((code) => (
              <button key={code} onClick={() => setLanguage(code)} className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold transition ${language === code ? "bg-[#191919] text-white" : "text-black/40 hover:text-black"}`}>{code.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </header>

      <section className="soft-grid border-b border-black/[.05]">
        <div className="mx-auto max-w-[1380px] px-5 py-16 lg:px-8 lg:py-24">
          <a href="/" className="inline-flex items-center gap-2 text-[13px] font-bold text-black/45 transition hover:text-[#df1f2d]"><ArrowLeft size={16} className={rtl ? "" : "rotate-180"} />{t.back}</a>
          <div className="mt-12 max-w-4xl">
            <div className="flex items-center gap-2 text-[12px] font-extrabold text-[#df1f2d]"><span className="h-2 w-2 rounded-full bg-[#df1f2d]" />{t.kicker}</div>
            <h1 className="section-title mt-5 text-[clamp(2.8rem,7vw,6.8rem)] font-extrabold leading-[1.12] tracking-[-.05em]">{t.title}</h1>
            <p className="mt-5 text-[16px] leading-8 text-black/50 sm:text-[18px]">{t.intro}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1380px] px-5 py-14 lg:px-8 lg:py-20">
        {!initialArticles.length ? (
          <div className="rounded-[28px] border border-black/[.07] bg-white p-12 text-center text-black/45">{t.empty}</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {initialArticles.map((article, index) => (
              <a key={article.id} href={articleHref(article)} target={article.externalUrl ? "_blank" : undefined} rel={article.externalUrl ? "noreferrer" : undefined} className={`group overflow-hidden rounded-[28px] border border-black/[.07] bg-white shadow-[0_12px_40px_rgba(0,0,0,.045)] transition duration-300 hover:-translate-y-1 hover:border-[#df1f2d]/25 hover:shadow-[0_24px_65px_rgba(0,0,0,.1)] ${index === 0 ? "md:col-span-2 xl:col-span-2 xl:grid xl:grid-cols-[1.08fr_.92fr]" : ""}`}>
                <div className={`relative overflow-hidden bg-[#191919] ${index === 0 ? "min-h-[320px]" : "aspect-[16/10]"}`}>
                  <img src={article.imageUrl} alt={articleText(article.imageAlt, language)} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
                </div>
                <div className={`flex flex-col ${index === 0 ? "p-7 sm:p-9 lg:p-11" : "p-6"}`}>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#df1f2d]"><CalendarDays size={14} />{articleText(article.category, language)} · {formatArticleDate(article.publishedAt, language)}</div>
                  <h2 className={`section-title mt-4 font-extrabold leading-[1.45] ${index === 0 ? "text-[clamp(1.9rem,4vw,3.4rem)]" : "text-[19px]"}`}>{articleText(article.title, language)}</h2>
                  <div className="mt-auto flex items-center gap-2 pt-7 text-[13px] font-extrabold text-black/55 transition group-hover:text-[#df1f2d]">{t.read}<ArrowUpLeft size={16} /></div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
