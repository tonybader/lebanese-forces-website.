"use client";

import { ArrowLeft, CalendarDays, Globe2, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
import type { Article, ArticleLanguage } from "@/lib/article-types";
import { articleText, formatArticleDate } from "@/lib/article-types";

const labels = {
  ar: { back: "كل الأخبار", home: "الرئيسية", article: "خبر", fallback: "النسخة العربية" },
  en: { back: "All news", home: "Home", article: "Article", fallback: "Arabic version" },
  fr: { back: "Toutes les actualités", home: "Accueil", article: "Article", fallback: "Version arabe" },
};

export function ArticleView({ article }: { article: Article }) {
  const [language, setLanguage] = useState<ArticleLanguage>("ar");
  const rtl = language === "ar";
  const t = labels[language];
  const localizedBody = articleText(article.body, language);
  const isFallback = language !== "ar" && !article.body[language]?.trim();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [language, rtl]);

  return (
    <main dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-[#f7f7f5] text-[#171717]">
      <header className="sticky top-0 z-30 border-b border-black/[.06] bg-[#f7f7f5]/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-[74px] max-w-[1180px] items-center gap-4 px-5 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <img src="/lf-logo.png" alt="Lebanese Forces" className="h-11 w-11 rounded-full bg-white object-contain shadow-sm" />
            <span className="hidden text-[15px] font-extrabold sm:block">القوات اللبنانية</span>
          </a>
          <nav className="ms-auto flex items-center gap-2">
            <a href="/news" className="hidden text-[12px] font-bold text-black/45 hover:text-[#df1f2d] sm:block">{t.back}</a>
            <div className="flex items-center gap-1 rounded-full border border-black/[.08] bg-white p-1 shadow-sm">
              <Globe2 className="ms-2 text-black/35" size={14} />
              {(["ar", "en", "fr"] as ArticleLanguage[]).map((code) => (
                <button key={code} onClick={() => setLanguage(code)} className={`rounded-full px-2.5 py-1.5 text-[10px] font-extrabold transition ${language === code ? "bg-[#191919] text-white" : "text-black/40"}`}>{code.toUpperCase()}</button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <article>
        <div className="mx-auto max-w-[1180px] px-5 pt-9 lg:px-8 lg:pt-14">
          <div className="flex flex-wrap items-center gap-3 text-[12px] font-bold text-black/42">
            <a href="/news" className="inline-flex items-center gap-2 transition hover:text-[#df1f2d]"><ArrowLeft size={15} className={rtl ? "" : "rotate-180"} />{t.back}</a>
            <span className="text-black/15">/</span>
            <span>{t.article}</span>
          </div>
          <div className="mt-10 max-w-5xl">
            <div className="flex flex-wrap items-center gap-2 text-[12px] font-extrabold text-[#df1f2d]"><Newspaper size={15} />{articleText(article.category, language)}<span className="text-black/15">·</span><CalendarDays size={14} />{formatArticleDate(article.publishedAt, language)}</div>
            <h1 className="section-title mt-5 text-[clamp(2.4rem,6vw,5.8rem)] font-extrabold leading-[1.2] tracking-[-.045em]">{articleText(article.title, language)}</h1>
            {isFallback && <div className="mt-5 inline-flex rounded-full bg-amber-100 px-4 py-2 text-[11px] font-bold text-amber-900">{t.fallback}</div>}
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-[1280px] px-5 lg:px-8">
          <div className="relative aspect-[16/8.4] min-h-[320px] overflow-hidden rounded-[30px] bg-[#191919] shadow-[0_25px_75px_rgba(0,0,0,.13)] sm:rounded-[38px]">
            <img src={article.imageUrl} alt={articleText(article.imageAlt, language)} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>
        </div>

        <div className="mx-auto max-w-[880px] px-5 py-14 lg:px-8 lg:py-20">
          <div className="space-y-7 text-[17px] leading-[2.05] text-black/75 sm:text-[19px]">
            {localizedBody.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => (
              <p key={index} className="whitespace-pre-line">{paragraph}</p>
            ))}
          </div>
          <div className="mt-14 border-t border-black/[.08] pt-8">
            <a href="/news" className="inline-flex items-center gap-2 rounded-full bg-[#191919] px-6 py-3 text-[13px] font-extrabold text-white transition hover:bg-[#df1f2d]"><ArrowLeft size={16} className={rtl ? "" : "rotate-180"} />{t.back}</a>
          </div>
        </div>
      </article>
    </main>
  );
}
