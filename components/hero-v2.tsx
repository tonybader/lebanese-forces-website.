"use client";

import {
  Globe2,
  Menu,
  Pause,
  Play,
  Plus,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import styles from "@/components/hero-v2.module.css";

export type HeroV2Language = "ar" | "en" | "fr";

type DetailKey = "vision" | "cause";

type HeroV2Props = {
  activeSection: string;
  lang: HeroV2Language;
  nav: [string, string][];
  onLanguageChange: (language: HeroV2Language) => void;
  onNavigate: (id: string) => void;
};

const content = {
  ar: {
    brand: "القوات اللبنانية",
    current: "الكلاسيكية",
    v2: "V2",
    search: "البحث في الموقع",
    languages: "تغيير اللغة",
    menu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    visionAction: "اكتشف رؤيتنا",
    causeAction: "القضية التي تجمعنا",
    footerLabel: ["ثوابتنا.", "طريقنا إلى الغد."],
    caption: ["من هذه الأرض.", "لأجل هذا الوطن."],
    captionSmall: "جذورنا هنا. ومستقبلنا هنا.",
    pause: "إيقاف تبديل الرسائل تلقائياً",
    play: "تشغيل تبديل الرسائل تلقائياً",
    currentLabel: "النسخة السابقة",
    v2Label: "النسخة الرئيسية",
    slides: [
      {
        eyebrow: "جذورٌ راسخة. إيمانٌ لا يتغيّر.",
        title: "لبنان أولاً.",
        accent: "والحرية دائماً.",
        description: "إيمانٌ لا يتغيّر بوطنٍ حرّ، ودولةٍ سيّدة، ومستقبلٍ يليق بجميع اللبنانيين.",
      },
      {
        eyebrow: "وطنٌ واحد. قرارٌ واحد.",
        title: "سيادةٌ كاملة.",
        accent: "دولةٌ قوية.",
        description: "دولةٌ تحتكم إلى الدستور، وتحمي حرية مواطنيها، وتصون استقلال قرارها.",
      },
      {
        eyebrow: "إيمانٌ بالمستقبل. التزامٌ بالوطن.",
        title: "معاً نبني.",
        accent: "لبنان الغد.",
        description: "من خدمة الصالح العام إلى كرامة الإنسان: مستقبلٌ نصنعه بإرادة اللبنانيين.",
      },
    ],
    themes: [
      ["الحرية", "حقّ الإنسان. جوهر الوطن."],
      ["السيادة", "قرارٌ واحد. دولةٌ واحدة."],
      ["المستقبل", "أملٌ نؤمن به. وغدٌ نبنيه."],
    ],
    details: {
      vision: {
        tag: "رؤيتنا",
        title: "لبنان الذي نؤمن به.",
        intro: "العمل السياسي التزامٌ بخدمة الصالح العام، وبناء وطنٍ يحفظ حرية الإنسان وكرامته.",
        points: [
          "الإنسان وكرامته في قلب العمل السياسي.",
          "ممارسة سياسية مسؤولة في خدمة المجتمع.",
          "دولة دستورية تضمن الحرية والتعددية.",
        ],
      },
      cause: {
        tag: "قضيتنا",
        title: "الإنسان. الحرية. لبنان.",
        intro: "وطنٌ نهائيّ لجميع أبنائه، يجتمعون فيه على تعدّدهم وتنوّعهم، ويكون القانون مرجعية حياتهم السياسية والمجتمعية.",
        points: [
          "لبنان وطنٌ نهائيّ لجميع أبنائه.",
          "حرية الإنسان أساس الاجتماع السياسي.",
          "دولة دستورية تحتكم إلى القانون.",
        ],
      },
    },
  },
  en: {
    brand: "Lebanese Forces",
    current: "Classic",
    v2: "V2",
    search: "Search the website",
    languages: "Change language",
    menu: "Open menu",
    closeMenu: "Close menu",
    visionAction: "Discover our vision",
    causeAction: "The cause that unites us",
    footerLabel: ["Our constants.", "Our path forward."],
    caption: ["From this land.", "For this nation."],
    captionSmall: "Our roots are here. Our future is here.",
    pause: "Pause automatic messages",
    play: "Play automatic messages",
    currentLabel: "Classic version",
    v2Label: "Main version",
    slides: [
      {
        eyebrow: "Deep roots. Unwavering belief.",
        title: "Lebanon first.",
        accent: "Freedom, always.",
        description: "An unwavering belief in a free nation, a sovereign state, and a future worthy of every Lebanese citizen.",
      },
      {
        eyebrow: "One nation. One decision.",
        title: "Full sovereignty.",
        accent: "A strong state.",
        description: "A state governed by its constitution, protecting its citizens’ freedom and the independence of its decisions.",
      },
      {
        eyebrow: "Faith in the future. Commitment to Lebanon.",
        title: "Together, we build.",
        accent: "Tomorrow’s Lebanon.",
        description: "From serving the common good to protecting human dignity: a future shaped by the will of the Lebanese.",
      },
    ],
    themes: [
      ["Freedom", "A human right. The nation’s essence."],
      ["Sovereignty", "One decision. One state."],
      ["The future", "Hope we share. A tomorrow we build."],
    ],
    details: {
      vision: {
        tag: "Our vision",
        title: "The Lebanon we believe in.",
        intro: "Politics is a commitment to the common good and to building a nation that protects human freedom and dignity.",
        points: [
          "Human dignity stands at the heart of political work.",
          "Responsible public service supports the whole community.",
          "A constitutional state safeguards freedom and pluralism.",
        ],
      },
      cause: {
        tag: "Our cause",
        title: "People. Freedom. Lebanon.",
        intro: "A final homeland for all its citizens, united through diversity, with law as the reference for political and social life.",
        points: [
          "Lebanon is the final homeland of all its citizens.",
          "Human freedom is the basis of political life.",
          "A constitutional state governed by law.",
        ],
      },
    },
  },
  fr: {
    brand: "Forces Libanaises",
    current: "Classique",
    v2: "V2",
    search: "Rechercher sur le site",
    languages: "Changer de langue",
    menu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    visionAction: "Découvrir notre vision",
    causeAction: "La cause qui nous unit",
    footerLabel: ["Nos constantes.", "Notre chemin vers demain."],
    caption: ["De cette terre.", "Pour cette nation."],
    captionSmall: "Nos racines sont ici. Notre avenir aussi.",
    pause: "Suspendre le défilement automatique",
    play: "Reprendre le défilement automatique",
    currentLabel: "Version classique",
    v2Label: "Version principale",
    slides: [
      {
        eyebrow: "Des racines profondes. Une conviction intacte.",
        title: "Le Liban d’abord.",
        accent: "La liberté, toujours.",
        description: "Une foi inébranlable en un pays libre, un État souverain et un avenir digne de tous les Libanais.",
      },
      {
        eyebrow: "Une nation. Une décision.",
        title: "Pleine souveraineté.",
        accent: "Un État fort.",
        description: "Un État régi par sa Constitution, protégeant la liberté de ses citoyens et l’indépendance de sa décision.",
      },
      {
        eyebrow: "Foi en l’avenir. Engagement pour le Liban.",
        title: "Ensemble, bâtissons.",
        accent: "Le Liban de demain.",
        description: "Du service du bien commun à la dignité humaine : un avenir façonné par la volonté des Libanais.",
      },
    ],
    themes: [
      ["Liberté", "Un droit humain. L’essence de la nation."],
      ["Souveraineté", "Une décision. Un État."],
      ["Avenir", "Un espoir partagé. Un avenir à bâtir."],
    ],
    details: {
      vision: {
        tag: "Notre vision",
        title: "Le Liban auquel nous croyons.",
        intro: "La politique est un engagement au service du bien commun et d’un pays qui protège la liberté et la dignité humaines.",
        points: [
          "La personne et sa dignité sont au cœur de l’action politique.",
          "Une action publique responsable au service de la société.",
          "Un État constitutionnel garantissant liberté et pluralisme.",
        ],
      },
      cause: {
        tag: "Notre cause",
        title: "La personne. La liberté. Le Liban.",
        intro: "Une patrie définitive pour tous ses citoyens, unis dans leur diversité, où la loi guide la vie politique et sociale.",
        points: [
          "Le Liban est la patrie définitive de tous ses citoyens.",
          "La liberté humaine fonde la vie politique.",
          "Un État constitutionnel régi par la loi.",
        ],
      },
    },
  },
} as const;

const preferredDesktopSections = new Set(["home", "history", "president", "news"]);

export function HeroV2({
  activeSection,
  lang,
  nav,
  onLanguageChange,
  onNavigate,
}: HeroV2Props) {
  const copy = content[lang];
  const [activeSlide, setActiveSlide] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [detail, setDetail] = useState<DetailKey | null>(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const desktopNav = nav.filter(([id]) => preferredDesktopSections.has(id));
  const autoHold = paused || hovered || focused || reducedMotion || detail !== null;
  const slide = copy.slides[activeSlide];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (autoHold) return;
    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % copy.slides.length);
      setCycle((current) => current + 1);
    }, 9000);
    return () => window.clearTimeout(timer);
  }, [activeSlide, autoHold, copy.slides.length]);

  const chooseSlide = (index: number) => {
    setActiveSlide((index + copy.slides.length) % copy.slides.length);
    setCycle((current) => current + 1);
  };

  const navigate = (id: string) => {
    if (id === "home") chooseSlide(0);
    setMobileOpen(false);
    onNavigate(id);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty("--mx", `${x * 100}%`);
    event.currentTarget.style.setProperty("--my", `${y * 100}%`);
    if (sceneRef.current) {
      sceneRef.current.style.transform = `translate3d(${(x - 0.5) * 15}px, ${(y - 0.5) * 10}px, 0) scale(1.025)`;
    }
  };

  const resetPointer = () => {
    setHovered(false);
    if (sceneRef.current) sceneRef.current.style.transform = "translate3d(0, 0, 0) scale(1.015)";
  };

  const handleThemeKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null;
    if (event.key === "ArrowLeft") next = (index + 1) % copy.themes.length;
    if (event.key === "ArrowRight") next = (index - 1 + copy.themes.length) % copy.themes.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = copy.themes.length - 1;
    if (next === null) return;
    event.preventDefault();
    chooseSlide(next);
    document.getElementById(`v2-theme-${next}`)?.focus();
  };

  const activeDetail = detail ? copy.details[detail] : null;

  return (
    <div className={styles.shell} dir={lang === "ar" ? "rtl" : "ltr"}>
      <header className={styles.siteHeader}>
        <div className={`${styles.headerInner} ${styles.frame}`}>
          <button className={styles.brand} onClick={() => navigate("home")} aria-label={copy.brand}>
            <Image className={styles.brandMark} src="/lf-logo.png" alt="" width={49} height={49} priority />
            <span className={styles.brandName}>
              {copy.brand}
              <span className={styles.brandEn} lang="en">LEBANESE FORCES</span>
            </span>
          </button>

          <nav className={styles.desktopNav} aria-label="Main navigation">
            {desktopNav.map(([id, label]) => (
              <button
                key={id}
                className={`${styles.navItem} ${activeSection === id ? styles.navItemActive : ""}`}
                onClick={() => navigate(id)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className={styles.headerTools}>
            <Link className={`${styles.toolButton} ${styles.searchButton}`} href="/news" aria-label={copy.search}>
              <Search size={17} />
            </Link>
            <div className={styles.languageMenu}>
              <button
                className={`${styles.toolButton} ${styles.languageButton}`}
                onClick={() => setLanguageOpen((open) => !open)}
                aria-label={copy.languages}
                aria-expanded={languageOpen}
              >
                <Globe2 size={17} />
                <span>{lang.toUpperCase()}</span>
              </button>
              {languageOpen && (
                <div className={styles.languagePopover}>
                  {(["ar", "en", "fr"] as HeroV2Language[]).map((language) => (
                    <button
                      key={language}
                      className={`${styles.languageOption} ${lang === language ? styles.languageOptionActive : ""}`}
                      onClick={() => {
                        onLanguageChange(language);
                        setLanguageOpen(false);
                      }}
                    >
                      {language === "ar" ? "العربية" : language === "en" ? "English" : "Français"}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className={`${styles.toolButton} ${styles.mobileMenuButton}`}
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? copy.closeMenu : copy.menu}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className={styles.mobilePanel} aria-label="Mobile navigation">
            {nav.map(([id, label]) => (
              <button key={id} onClick={() => navigate(id)}>
                <span>{label}</span>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </nav>
        )}
      </header>

      <section
        id="home"
        ref={heroRef}
        className={styles.hero}
        aria-label="Our message"
        aria-roledescription="carousel"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={resetPointer}
        onPointerMove={handlePointerMove}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
        }}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStart.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={(event) => {
          if (!touchStart.current) return;
          const touch = event.changedTouches[0];
          const dx = touch.clientX - touchStart.current.x;
          const dy = touch.clientY - touchStart.current.y;
          touchStart.current = null;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) chooseSlide(activeSlide + (dx > 0 ? 1 : -1));
        }}
      >
        <div
          ref={sceneRef}
          className={`${styles.scene} ${activeSlide === 1 ? styles.sceneOne : activeSlide === 2 ? styles.sceneTwo : ""}`}
          aria-hidden="true"
        >
          <Image className={styles.landscape} src="/hero-v2/cedar.webp" alt="" width={1536} height={1024} priority sizes="100vw" />
        </div>
        <div className={styles.veil} />
        <div className={styles.light} />

        <div className={`${styles.heroMain} ${styles.frame}`}>
          <div className={styles.heroIndex} aria-hidden="true">
            <strong>{String(activeSlide + 1).padStart(2, "0")}</strong>
            <span className={styles.indexLine} />
            <span>03</span>
          </div>
          <div key={`${lang}-${activeSlide}-${cycle}`} className={`${styles.heroCopy} ${styles.copyEnter}`}>
            <p className={styles.eyebrow}>{slide.eyebrow}</p>
            <h1 className={styles.heroTitle}>
              <span>{slide.title}</span>
              <span className={styles.accent}>{slide.accent}</span>
            </h1>
            <p className={styles.heroDescription}>{slide.description}</p>
            <div className={styles.heroActions}>
              <button className={`${styles.cta} ${styles.ctaPrimary}`} onClick={() => setDetail("vision")}>
                {copy.visionAction}
                <Plus size={19} />
              </button>
              <button className={`${styles.cta} ${styles.ctaSecondary}`} onClick={() => setDetail("cause")}>
                {copy.causeAction}
              </button>
            </div>
          </div>
          <div className={styles.visualCaption} aria-hidden="true">
            <div className={styles.captionLine} />
            <p>{copy.caption[0]}<br />{copy.caption[1]}</p>
            <span>{copy.captionSmall}</span>
          </div>
        </div>

        <div className={`${styles.heroFooter} ${styles.frame}`}>
          <div className={styles.footerLabel}>{copy.footerLabel[0]}<br />{copy.footerLabel[1]}</div>
          <div className={styles.themes} role="group" aria-label="Choose a message">
            {copy.themes.map(([title, subtitle], index) => (
              <button
                id={`v2-theme-${index}`}
                key={title}
                className={`${styles.theme} ${activeSlide === index ? styles.themeActive : ""}`}
                onClick={() => chooseSlide(index)}
                onKeyDown={(event) => handleThemeKeyDown(event, index)}
                aria-pressed={activeSlide === index}
              >
                <span className={styles.themeNum} aria-hidden="true">0{index + 1}</span>
                <span>
                  <span className={styles.themeTitle}>{title}</span>
                  <span className={styles.themeSubtitle}>{subtitle}</span>
                </span>
                {activeSlide === index && (
                  <span className={styles.progress} aria-hidden="true">
                    <span
                      key={`${activeSlide}-${cycle}-${autoHold}`}
                      className={styles.progressFill}
                      style={{ animationPlayState: autoHold ? "paused" : "running" }}
                    />
                  </span>
                )}
              </button>
            ))}
          </div>
          <button
            className={styles.playControl}
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? copy.play : copy.pause}
            aria-pressed={paused}
          >
            {paused ? <Play size={16} fill="currentColor" /> : <Pause size={16} />}
          </button>
        </div>
        <span className="sr-only" role="status" aria-live="polite">{slide.title} {slide.accent}</span>
      </section>

      <Dialog open={detail !== null} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="max-h-[85vh] max-w-[730px] overflow-y-auto border-white/15 bg-[#101716] p-0 text-white sm:max-w-[730px]"
        >
          {activeDetail && (
            <div className="p-7 sm:p-11">
              <DialogHeader className="text-start">
                <span className={styles.detailTag}>{activeDetail.tag}</span>
                <DialogTitle className="mt-4 text-[clamp(2rem,5vw,2.8rem)] font-extrabold leading-[1.4] text-white">
                  {activeDetail.title}
                </DialogTitle>
                <DialogDescription className="mt-3 text-[1rem] leading-8 text-white/65">
                  {activeDetail.intro}
                </DialogDescription>
              </DialogHeader>
              <ol className={styles.detailPoints}>
                {activeDetail.points.map((point, index) => (
                  <li key={point} className={styles.detailPoint}>
                    <b aria-hidden="true">0{index + 1}</b>
                    <span>{point}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
