"use client";

import { ArrowLeft, ExternalLink, Globe2, Landmark, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  profileText,
  type ProfileLanguage,
  type PublicProfile,
} from "@/lib/people";

const copy = {
  ar: {
    home: "الرئيسية",
    back: "العودة إلى القيادة والكتل",
    mp: "الكتلة النيابية",
    minister: "الكتلة الوزارية",
    bio: "نبذة وسيرة",
    source: "المرجع الرسمي",
    socials: "الحسابات الرسمية",
  },
  en: {
    home: "Home",
    back: "Back to leadership and blocs",
    mp: "Parliamentary bloc",
    minister: "Ministerial bloc",
    bio: "Profile and background",
    source: "Official reference",
    socials: "Official accounts",
  },
  fr: {
    home: "Accueil",
    back: "Retour à la direction et aux blocs",
    mp: "Bloc parlementaire",
    minister: "Bloc ministériel",
    bio: "Profil et parcours",
    source: "Référence officielle",
    socials: "Comptes officiels",
  },
};

export function ProfileView({ profile }: { profile: PublicProfile }) {
  const [language, setLanguage] = useState<ProfileLanguage>("ar");
  const rtl = language === "ar";
  const t = copy[language];
  const biography = profile.bio ? profileText(profile.bio, language) : "";
  const biographyParagraphs = biography.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [language, rtl]);

  return (
    <main dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-[#f7f7f5] text-[#171717]">
      <header className="sticky top-0 z-30 border-b border-black/[.06] bg-[#f7f7f5]/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-[74px] max-w-[1180px] items-center gap-4 px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <img src="/lf-logo.png" alt="Lebanese Forces" className="h-11 w-11 rounded-full bg-white object-contain shadow-sm" />
            <span className="hidden text-[15px] font-extrabold sm:block">القوات اللبنانية</span>
          </Link>
          <div className="ms-auto flex items-center gap-1 rounded-full border border-black/[.08] bg-white p-1 shadow-sm">
            <Globe2 className="ms-2 text-black/35" size={14} />
            {(["ar", "en", "fr"] as ProfileLanguage[]).map((code) => (
              <button key={code} type="button" onClick={() => setLanguage(code)} className={`rounded-full px-2.5 py-1.5 text-[10px] font-extrabold transition ${language === code ? "bg-[#191919] text-white" : "text-black/40 hover:text-black"}`}>{code.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </header>

      <article className="px-5 py-10 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1180px]">
          <Link href="/#leadership" className="inline-flex items-center gap-2 text-[13px] font-bold text-black/45 transition hover:text-[#df1f2d]"><ArrowLeft size={16} className={rtl ? "" : "rotate-180"} />{t.back}</Link>

          <div className="mt-8 overflow-hidden rounded-[34px] bg-[#191919] text-white shadow-[0_30px_85px_rgba(0,0,0,.16)]">
            <div className="grid lg:grid-cols-[.78fr_1.22fr]">
              <div className="relative min-h-[430px] overflow-hidden bg-[#ecece8] lg:min-h-[680px]">
                <img src={profile.imageUrl} alt={profileText(profile.name, language)} className="absolute inset-0 h-full w-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              </div>
              <div className="relative flex flex-col justify-center overflow-hidden px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
                <div className="absolute -end-32 -top-32 h-96 w-96 rounded-full bg-[#df1f2d]/24 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-[12px] font-extrabold text-[#ff6570]">
                    {profile.group === "mp" ? <Landmark size={16} /> : <UserRound size={16} />}
                    {profile.group === "mp" ? t.mp : t.minister}
                  </div>
                  <h1 className="section-title mt-5 text-[clamp(2.7rem,6vw,5.8rem)] font-extrabold leading-[1.12] tracking-[-.045em]">{profileText(profile.name, language)}</h1>
                  <p className="mt-4 text-[16px] font-bold leading-8 text-white/64">{profileText(profile.office, language)}</p>
                  {profile.socials && (
                    <div className="mt-6">
                      <div className="text-[10px] font-extrabold uppercase tracking-[.12em] text-white/38">{t.socials}</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {profile.socials.x && <a href={profile.socials.x} target="_blank" rel="noreferrer" aria-label="X" className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[.06] text-sm font-extrabold transition hover:bg-white hover:text-[#191919]">𝕏</a>}
                        {profile.socials.instagram && <a href={profile.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[.06] text-sm font-extrabold transition hover:bg-white hover:text-[#191919]">◎</a>}
                        {profile.socials.facebook && <a href={profile.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[.06] text-sm font-extrabold transition hover:bg-white hover:text-[#191919]">f</a>}
                      </div>
                    </div>
                  )}

                  <div className="mt-10 border-t border-white/[.09] pt-8">
                    <h2 className="text-[13px] font-extrabold text-white/45">{t.bio}</h2>
                    {biographyParagraphs.length ? (
                      <div className="mt-4 space-y-5 text-[16px] leading-9 text-white/72">
                        {biographyParagraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>)}
                      </div>
                    ) : (
                      <>
                        <p className="mt-4 text-[17px] leading-9 text-white/78">{profileText(profile.summary, language)}</p>
                        <ul className="mt-7 space-y-4">
                          {profile.highlights.map((highlight, index) => (
                            <li key={index} className="flex gap-3 text-[14px] leading-7 text-white/60">
                              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#df1f2d]" />
                              <span>{profileText(highlight, language)}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>

                  <a href={profile.sourceUrl} target="_blank" rel="noreferrer" className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[.06] px-5 py-3 text-[12px] font-extrabold text-white/65 transition hover:bg-white hover:text-[#191919]">{t.source}<ExternalLink size={14} /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
