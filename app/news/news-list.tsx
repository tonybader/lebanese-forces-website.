"use client";

import {
  ArrowLeft,
  ArrowUpLeft,
  CalendarDays,
  Globe2,
  SlidersHorizontal,
  Pin,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ArticleTagLinks } from "@/components/article-tag-links";
import {
  ARTICLE_CHANNELS,
  articleChannelHref,
  articleChannelText,
  articleHref,
  articleText,
  formatArticleDate,
  getArticleChannel,
  type Article,
  type ArticleChannel,
  type ArticleLanguage,
} from "@/lib/article-types";

export type NewsFilters = {
  channel?: ArticleChannel;
  region?: string;
  activity?: string;
  person?: string;
  q?: string;
};

const copy = {
  ar: {
    kicker: "غرفة الأخبار",
    title: "الأخبار والبيانات والمواقف",
    intro: "تابع آخر بيانات الحزب والرئيس، مواقف النواب والوزراء، المقالات الخاصة ونشاطات الحزب والانتشار.",
    back: "العودة إلى الرئيسية",
    read: "اقرأ الخبر",
    empty: "لا توجد مواد منشورة ضمن هذا التصنيف بعد.",
    all: "كل المواد",
    filter: "تصفية الأخبار",
    showing: "عرض النتائج المرتبطة بـ",
    clear: "إلغاء التصفية",
    region: "المنطقة",
    activity: "نوع النشاط",
    person: "الشخصية",
    search: "البحث في الأخبار",
    searchPlaceholder: "ابحث بعنوان، اسم، منطقة أو كلمة…",
  },
  en: {
    kicker: "Newsroom",
    title: "News, statements and positions",
    intro: "Follow the latest statements, MPs’ and ministers’ positions, special articles, party news and diaspora activity.",
    back: "Back to homepage",
    read: "Read article",
    empty: "No stories have been published in this section yet.",
    all: "All coverage",
    filter: "Filter coverage",
    showing: "Showing coverage related to",
    clear: "Clear filter",
    region: "Region",
    activity: "Activity type",
    person: "Public figure",
    search: "Search coverage",
    searchPlaceholder: "Search title, person, region or keyword…",
  },
  fr: {
    kicker: "Salle de presse",
    title: "Actualités, communiqués et positions",
    intro: "Suivez les communiqués, les positions des députés et ministres, les articles spéciaux et les activités du parti et de la diaspora.",
    back: "Retour à l’accueil",
    read: "Lire l’article",
    empty: "Aucun contenu n’a encore été publié dans cette rubrique.",
    all: "Toute l’actualité",
    filter: "Filtrer l’actualité",
    showing: "Actualités liées à",
    clear: "Effacer le filtre",
    region: "Région",
    activity: "Type d’activité",
    person: "Personnalité",
    search: "Rechercher",
    searchPlaceholder: "Titre, personne, région ou mot-clé…",
  },
};

function sameTag(values: string[] | undefined, selected: string | undefined): boolean {
  if (!selected) return true;
  const normalized = selected.normalize("NFKC").toLocaleLowerCase("ar-LB");
  return (values || []).some(
    (value) => value.normalize("NFKC").toLocaleLowerCase("ar-LB") === normalized,
  );
}

function searchableArticle(article: Article): string {
  return [
    article.title.ar,
    article.title.en,
    article.title.fr,
    article.body.ar,
    article.body.en,
    article.body.fr,
    ...(article.regions || []),
    ...(article.activityTypes || []),
    ...(article.people || []),
  ].join(" ").normalize("NFKC").toLocaleLowerCase("ar-LB");
}

export function NewsList({
  initialArticles,
  filters,
}: {
  initialArticles: Article[];
  filters: NewsFilters;
}) {
  const [language, setLanguage] = useState<ArticleLanguage>("ar");
  const rtl = language === "ar";
  const t = copy[language];

  const visibleArticles = useMemo(
    () => initialArticles.filter((article) =>
      (!filters.channel || getArticleChannel(article) === filters.channel) &&
      sameTag(article.regions, filters.region) &&
      sameTag(article.activityTypes, filters.activity) &&
      sameTag(article.people, filters.person) &&
      (!filters.q || searchableArticle(article).includes(filters.q.normalize("NFKC").toLocaleLowerCase("ar-LB"))),
    ),
    [filters, initialArticles],
  );

  const tagFilter = filters.region
    ? { label: t.region, value: filters.region }
    : filters.activity
      ? { label: t.activity, value: filters.activity }
      : filters.person
        ? { label: t.person, value: filters.person }
        : null;

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
        <div className="mx-auto max-w-[1380px] px-5 py-14 lg:px-8 lg:py-20">
          <a href="/" className="inline-flex items-center gap-2 text-[13px] font-bold text-black/45 transition hover:text-[#df1f2d]"><ArrowLeft size={16} className={rtl ? "" : "rotate-180"} />{t.back}</a>
          <div className="mt-10 max-w-5xl">
            <div className="flex items-center gap-2 text-[12px] font-extrabold text-[#df1f2d]"><span className="h-2 w-2 rounded-full bg-[#df1f2d]" />{t.kicker}</div>
            <h1 className="section-title mt-5 text-[clamp(2.6rem,6vw,6rem)] font-extrabold leading-[1.14] tracking-[-.045em]">{t.title}</h1>
            <p className="mt-5 max-w-4xl text-[16px] leading-8 text-black/50 sm:text-[18px]">{t.intro}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1380px] px-5 pt-10 lg:px-8 lg:pt-14">
        <form action="/news" className="mb-8 flex max-w-3xl items-center gap-3 rounded-[20px] border border-black/[.08] bg-white p-2 shadow-[0_10px_30px_rgba(0,0,0,.04)] focus-within:border-[#df1f2d]/30">
          <Search size={19} className="ms-3 shrink-0 text-black/35" />
          <input name="q" defaultValue={filters.q || ""} aria-label={t.search} placeholder={t.searchPlaceholder} className="h-11 min-w-0 flex-1 bg-transparent px-1 text-[14px] font-bold outline-none placeholder:text-black/28" />
          <button type="submit" className="h-11 shrink-0 rounded-xl bg-[#191919] px-5 text-[12px] font-extrabold text-white transition hover:bg-[#df1f2d]">{t.search}</button>
        </form>
        <div className="flex items-center gap-2 text-[12px] font-extrabold text-black/45"><SlidersHorizontal size={15} />{t.filter}</div>
        <nav className="mt-4 flex flex-wrap gap-2" aria-label={t.filter}>
          <a href="/news" className={`rounded-full border px-4 py-2.5 text-[12px] font-extrabold transition ${!filters.channel && !tagFilter ? "border-[#191919] bg-[#191919] text-white" : "border-black/[.08] bg-white text-black/50 hover:border-[#df1f2d]/30 hover:text-[#df1f2d]"}`}>{t.all}</a>
          {ARTICLE_CHANNELS.map((channel) => (
            <a key={channel} href={articleChannelHref(channel)} className={`rounded-full border px-4 py-2.5 text-[12px] font-extrabold transition ${filters.channel === channel ? "border-[#df1f2d] bg-[#df1f2d] text-white" : "border-black/[.08] bg-white text-black/50 hover:border-[#df1f2d]/30 hover:text-[#df1f2d]"}`}>{articleChannelText(channel, language)}</a>
          ))}
        </nav>

        {tagFilter && (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[20px] border border-[#df1f2d]/15 bg-red-50 px-5 py-4 text-[13px]">
            <span className="text-black/48">{t.showing} <strong className="text-[#191919]">{tagFilter.label}: {tagFilter.value}</strong></span>
            <a href="/news" className="ms-auto inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[11px] font-extrabold text-[#df1f2d] shadow-sm"><X size={13} />{t.clear}</a>
          </div>
        )}
        {filters.q && (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[20px] border border-[#df1f2d]/15 bg-red-50 px-5 py-4 text-[13px]">
            <span className="text-black/48">{t.showing} <strong className="text-[#191919]">“{filters.q}”</strong></span>
            <a href="/news" className="ms-auto inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[11px] font-extrabold text-[#df1f2d] shadow-sm"><X size={13} />{t.clear}</a>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1380px] px-5 py-12 lg:px-8 lg:py-16">
        {!visibleArticles.length ? (
          <div className="rounded-[28px] border border-black/[.07] bg-white p-12 text-center text-black/45">{t.empty}</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleArticles.map((article, index) => {
              const featured = index === 0;
              const href = articleHref(article);
              return (
                <article key={article.id} className={`group overflow-hidden rounded-[28px] border border-black/[.07] bg-white shadow-[0_12px_40px_rgba(0,0,0,.045)] transition duration-300 hover:-translate-y-1 hover:border-[#df1f2d]/25 hover:shadow-[0_24px_65px_rgba(0,0,0,.1)] ${featured ? "md:col-span-2 xl:col-span-2 xl:grid xl:grid-cols-[1.08fr_.92fr]" : ""}`}>
                  <a href={href} className={`relative block overflow-hidden bg-[#191919] ${featured ? "min-h-[330px]" : "aspect-[16/10]"}`}>
                    <img src={article.imageUrl} alt={articleText(article.imageAlt, language)} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
                    {article.pinned && <span className="absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#df1f2d] px-3 py-1.5 text-[10px] font-extrabold text-white shadow-lg"><Pin size={11} fill="currentColor" />{language === "ar" ? "مثبّت" : language === "fr" ? "Épinglé" : "Pinned"}</span>}
                  </a>
                  <div className={`flex flex-col ${featured ? "p-7 sm:p-9 lg:p-11" : "p-6"}`}>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#df1f2d]"><CalendarDays size={14} /><a href={articleChannelHref(getArticleChannel(article))} className="hover:underline">{articleChannelText(getArticleChannel(article), language)}</a><span className="text-black/15">·</span>{formatArticleDate(article.publishedAt, language)}</div>
                    <h2 className={`section-title mt-4 font-extrabold leading-[1.45] ${featured ? "text-[clamp(1.65rem,3vw,2.65rem)]" : "text-[18px]"}`}><a href={href}>{articleText(article.title, language)}</a></h2>
                    <p className={`mt-3 line-clamp-3 text-black/48 ${featured ? "text-[15px] leading-8" : "text-[13px] leading-7"}`}>{articleText(article.body, language)}</p>
                    <div className="mt-5"><ArticleTagLinks article={article} language={language} compact={!featured} /></div>
                    <a href={href} className="mt-auto flex items-center gap-2 pt-7 text-[13px] font-extrabold text-black/55 transition group-hover:text-[#df1f2d]">{t.read}<ArrowUpLeft size={16} /></a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
