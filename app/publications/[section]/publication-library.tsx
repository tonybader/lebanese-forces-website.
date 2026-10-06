"use client";

import { ArrowLeft, Download, FileText, Globe2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { MediaDocument, MediaLanguage } from "@/lib/media-types";
import { mediaText } from "@/lib/media-types";

const libraryCopy: Record<MediaDocument["section"], Record<MediaLanguage, { title: string; description: string }>> = {
  legislative: {
    ar: { title: "الزاوية التشريعية", description: "أسئلة نيابية، اقتراحات قوانين وملفات من العمل التشريعي." },
    en: { title: "Legislative corner", description: "Parliamentary questions, proposed laws and legislative files." },
    fr: { title: "Coin législatif", description: "Questions parlementaires, propositions de loi et dossiers législatifs." },
  },
  political: {
    ar: { title: "المنشورات السياسية", description: "دراسات وأوراق سياسية وفكرية صادرة عن القوات اللبنانية." },
    en: { title: "Political publications", description: "Political studies and policy papers published by the Lebanese Forces." },
    fr: { title: "Publications politiques", description: "Études politiques et documents de réflexion des Forces Libanaises." },
  },
  charter: {
    ar: { title: "النظام والشرعة", description: "المراجع التنظيمية والفكرية الأساسية للحزب." },
    en: { title: "Regulations & charter", description: "The party's core organizational and foundational references." },
    fr: { title: "Règlement et charte", description: "Les références organisationnelles et fondatrices du parti." },
  },
};

export function PublicationLibrary({ section, documents }: { section: MediaDocument["section"]; documents: MediaDocument[] }) {
  const [language, setLanguage] = useState<MediaLanguage>("ar");
  const rtl = language === "ar";
  const copy = libraryCopy[section][language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [language, rtl]);

  return (
    <main dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-[#f7f7f5] text-[#171717]">
      <header className="sticky top-0 z-20 border-b border-black/[.06] bg-[#f7f7f5]/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-[74px] max-w-[1320px] items-center gap-4 px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3"><img src="/lf-logo.png" alt="Lebanese Forces" className="h-11 w-11 rounded-full bg-white object-contain shadow-sm" /><span className="hidden text-sm font-extrabold sm:block">القوات اللبنانية</span></Link>
          <div className="ms-auto flex items-center gap-1 rounded-full border border-black/[.08] bg-white p-1 shadow-sm"><Globe2 size={15} className="ms-2 text-black/35" />{(["ar", "en", "fr"] as MediaLanguage[]).map((code) => <button key={code} type="button" onClick={() => setLanguage(code)} className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold ${language === code ? "bg-[#191919] text-white" : "text-black/40"}`}>{code.toUpperCase()}</button>)}</div>
        </div>
      </header>

      <section className="soft-grid border-b border-black/[.05]">
        <div className="mx-auto max-w-[1320px] px-5 py-14 lg:px-8 lg:py-20">
          <Link href="/#publications" className="inline-flex items-center gap-2 text-[13px] font-bold text-black/45 transition hover:text-[#df1f2d]"><ArrowLeft size={16} className={rtl ? "" : "rotate-180"} />{language === "ar" ? "العودة إلى المنشورات" : language === "fr" ? "Retour aux publications" : "Back to publications"}</Link>
          <div className="mt-10 flex max-w-4xl items-start gap-5"><span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#df1f2d] text-white shadow-lg"><FileText size={25} /></span><div><div className="text-[11px] font-extrabold uppercase tracking-[.13em] text-[#df1f2d]">{language === "ar" ? "مكتبة الحزب" : language === "fr" ? "Bibliothèque du parti" : "Party library"}</div><h1 className="section-title mt-3 text-[clamp(2.6rem,6vw,5.5rem)] font-extrabold leading-[1.15]">{copy.title}</h1><p className="mt-4 text-[16px] leading-8 text-black/50">{copy.description}</p></div></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 py-12 lg:px-8 lg:py-16">
        <div className="mb-6 flex items-center justify-between"><div className="text-[12px] font-extrabold text-black/42">{language === "ar" ? `${documents.length} مستندات` : language === "fr" ? `${documents.length} documents` : `${documents.length} documents`}</div></div>
        {!documents.length ? <div className="rounded-[28px] border border-dashed border-black/10 bg-white p-12 text-center text-black/42">{language === "ar" ? "لا توجد مستندات في هذا القسم بعد." : language === "fr" ? "Aucun document dans cette section." : "No documents in this section yet."}</div> : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {documents.map((document) => (
              <a key={document.id} href={document.fileUrl} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-[26px] border border-black/[.07] bg-white shadow-[0_10px_34px_rgba(0,0,0,.045)] transition duration-300 hover:-translate-y-1 hover:border-[#df1f2d]/25 hover:shadow-[0_22px_55px_rgba(0,0,0,.1)]">
                <div className="aspect-[4/3] overflow-hidden bg-[#ecece8]"><img src={document.coverUrl} alt={mediaText(document.title, language)} className={`h-full w-full object-top transition duration-700 group-hover:scale-[1.025] ${document.coverUrl === "/lf-logo.png" ? "object-contain p-10" : "object-cover"}`} /></div>
                <div className="p-5"><h2 className="text-[16px] font-extrabold leading-7">{mediaText(document.title, language)}</h2><p className="mt-2 line-clamp-3 text-[12px] leading-6 text-black/45">{mediaText(document.description, language)}</p><div className="mt-5 flex items-center justify-between border-t border-black/[.07] pt-4 text-[12px] font-extrabold text-[#df1f2d]"><span>{language === "ar" ? "فتح المستند" : language === "fr" ? "Ouvrir le document" : "Open document"}</span><Download size={15} /></div></div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
