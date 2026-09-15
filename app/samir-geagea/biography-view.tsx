"use client";

import { ArrowLeft, CalendarDays, ExternalLink, Globe2, Quote } from "lucide-react";
import { useEffect, useState } from "react";

type Language = "ar" | "en" | "fr";
type Localized = Record<Language, string>;

const copy: Record<Language, {
  back: string;
  kicker: string;
  title: string;
  role: string;
  intro: string;
  storyTitle: string;
  paragraphs: string[];
  timelineTitle: string;
  source: string;
}> = {
  ar: {
    back: "العودة إلى الرئيسية",
    kicker: "رئيس حزب القوات اللبنانية",
    title: "الدكتور سمير جعجع",
    role: "مسيرة سياسية من زمن الحرب إلى العمل المؤسساتي",
    intro: "من عين الرمانة إلى قيادة القوات اللبنانية، ومن أحد عشر عاماً وثلاثة أشهر في الاعتقال إلى العودة للحياة السياسية، تختصر مسيرته محطات أساسية من تاريخ لبنان الحديث.",
    storyTitle: "السيرة والمسيرة",
    paragraphs: [
      "وُلد سمير جعجع في 25 تشرين الأول 1952 في عين الرمانة، ونشأ في عائلة متوسطة الحال. تابع دراسته في المدارس الرسمية، ثم التحق بكلية الطب في الجامعة الأميركية في بيروت بمنحة جامعية، قبل أن ينتقل إلى جامعة القديس يوسف مع اندلاع الحرب اللبنانية.",
      "تدرّج في المسؤوليات الحزبية والميدانية، فتولّى مسؤوليات في منطقة بشري والشمال، ثم أصبح رئيساً لأركان القوات اللبنانية عام 1985. وفي كانون الثاني 1986 تسلّم قيادة القوات اللبنانية وأطلق مساراً تنظيمياً وسياسياً وإعلامياً واسعاً.",
      "تبنّى خيار إنهاء الحرب وبناء الدولة، فوافق على اتفاق الطائف عام 1989، وقاد حلّ الجناح العسكري للقوات وانتقالها إلى العمل السياسي. ومع اشتداد الضغوط في مرحلة الوصاية السورية، حُلّ الحزب واعتُقل جعجع في نيسان 1994.",
      "استمر اعتقاله أحد عشر عاماً وثلاثة أشهر. وبعد انسحاب الجيش السوري عام 2005، أقرّ مجلس النواب قانون العفو، فخرج إلى الحرية في 26 تموز 2005 وعاد إلى قيادة الحزب والمشاركة في الحياة السياسية والحوار الوطني.",
    ],
    timelineTitle: "محطات رئيسية",
    source: "المرجع الرسمي للسيرة",
  },
  en: {
    back: "Back to homepage",
    kicker: "President of the Lebanese Forces",
    title: "Dr Samir Geagea",
    role: "A political journey from wartime to institutional action",
    intro: "From Ain el-Remmaneh to the leadership of the Lebanese Forces, and from eleven years and three months in detention to a return to political life, his path intersects with defining chapters of modern Lebanon.",
    storyTitle: "Life and political journey",
    paragraphs: [
      "Samir Geagea was born on 25 October 1952 in Ain el-Remmaneh and grew up in a middle-income family. He attended public schools before studying medicine at the American University of Beirut on a scholarship, later continuing at Saint Joseph University as the Lebanese war unfolded.",
      "He advanced through party and field responsibilities in Bsharri and northern Lebanon, becoming chief of staff of the Lebanese Forces in 1985. In January 1986 he assumed the organization’s leadership and began a broad institutional, political and media development effort.",
      "Geagea backed the effort to end the war and rebuild the state. He endorsed the Taif Agreement in 1989 and oversaw the dissolution of the Lebanese Forces’ military wing and its transition to political work. During the period of Syrian tutelage, the party was dissolved and Geagea was arrested in April 1994.",
      "His detention lasted eleven years and three months. After the Syrian army withdrew in 2005, Parliament adopted an amnesty law. He was released on 26 July 2005 and returned to party leadership, national dialogue and political life.",
    ],
    timelineTitle: "Defining milestones",
    source: "Official biography reference",
  },
  fr: {
    back: "Retour à l’accueil",
    kicker: "Président des Forces Libanaises",
    title: "Dr Samir Geagea",
    role: "Un parcours politique de la guerre à l’action institutionnelle",
    intro: "De Aïn el-Remmaneh à la direction des Forces Libanaises, puis de onze ans et trois mois de détention au retour à la vie politique, son parcours traverse des chapitres majeurs du Liban contemporain.",
    storyTitle: "Vie et parcours politique",
    paragraphs: [
      "Samir Geagea est né le 25 octobre 1952 à Aïn el-Remmaneh dans une famille de condition moyenne. Après les écoles publiques, il étudie la médecine à l’Université américaine de Beyrouth grâce à une bourse, puis poursuit son cursus à l’Université Saint-Joseph lorsque la guerre libanaise éclate.",
      "Il gravit les échelons des responsabilités dans le parti et sur le terrain à Bécharré et dans le nord du Liban, avant de devenir chef d’état-major des Forces Libanaises en 1985. En janvier 1986, il en prend la direction et lance un vaste chantier institutionnel, politique et médiatique.",
      "Il soutient la fin de la guerre et la reconstruction de l’État, approuve l’Accord de Taëf en 1989 et supervise la dissolution de la branche militaire ainsi que le passage à l’action politique. Durant la tutelle syrienne, le parti est dissous et Geagea est arrêté en avril 1994.",
      "Sa détention dure onze ans et trois mois. Après le retrait de l’armée syrienne en 2005, le Parlement vote une loi d’amnistie. Libéré le 26 juillet 2005, il reprend la direction du parti et participe à nouveau au dialogue national et à la vie politique.",
    ],
    timelineTitle: "Étapes marquantes",
    source: "Référence biographique officielle",
  },
};

const milestones: { year: string; title: Localized; text: Localized }[] = [
  {
    year: "1952",
    title: { ar: "الولادة", en: "Birth", fr: "Naissance" },
    text: { ar: "وُلد في عين الرمانة في 25 تشرين الأول.", en: "Born in Ain el-Remmaneh on 25 October.", fr: "Né à Aïn el-Remmaneh le 25 octobre." },
  },
  {
    year: "1975–78",
    title: { ar: "الطب والمسؤولية", en: "Medicine and responsibility", fr: "Médecine et responsabilités" },
    text: { ar: "انتقل من دراسة الطب إلى تحمّل مسؤوليات متصاعدة مع توسّع الحرب.", en: "Moved from medical studies into growing responsibilities as the war expanded.", fr: "Passe des études de médecine à des responsabilités croissantes avec l’extension de la guerre." },
  },
  {
    year: "1985",
    title: { ar: "رئاسة الأركان", en: "Chief of staff", fr: "Chef d’état-major" },
    text: { ar: "تولّى رئاسة أركان القوات اللبنانية.", en: "Became chief of staff of the Lebanese Forces.", fr: "Devient chef d’état-major des Forces Libanaises." },
  },
  {
    year: "1986",
    title: { ar: "قيادة القوات", en: "Party leadership", fr: "Direction des Forces" },
    text: { ar: "تسلّم قيادة القوات اللبنانية في كانون الثاني.", en: "Assumed leadership of the Lebanese Forces in January.", fr: "Prend la direction des Forces Libanaises en janvier." },
  },
  {
    year: "1989",
    title: { ar: "اتفاق الطائف", en: "Taif Agreement", fr: "Accord de Taëf" },
    text: { ar: "وافق على الاتفاق وقاد الانتقال نحو العمل السياسي.", en: "Endorsed the agreement and led the transition to political action.", fr: "Approuve l’accord et conduit le passage à l’action politique." },
  },
  {
    year: "1994",
    title: { ar: "الاعتقال", en: "Arrest", fr: "Arrestation" },
    text: { ar: "اعتُقل في 21 نيسان بعد حلّ الحزب.", en: "Arrested on 21 April after the party was dissolved.", fr: "Arrêté le 21 avril après la dissolution du parti." },
  },
  {
    year: "2005",
    title: { ar: "الحرية والعودة", en: "Freedom and return", fr: "Liberté et retour" },
    text: { ar: "خرج من الاعتقال في 26 تموز وعاد إلى الحياة السياسية.", en: "Released on 26 July and returned to political life.", fr: "Libéré le 26 juillet, il revient à la vie politique." },
  },
];

export function BiographyView({ imageUrl }: { imageUrl: string }) {
  const [language, setLanguage] = useState<Language>("ar");
  const rtl = language === "ar";
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [language, rtl]);

  return (
    <main dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-[#f7f7f5] text-[#171717]">
      <header className="sticky top-0 z-30 border-b border-black/[.06] bg-[#f7f7f5]/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-[74px] max-w-[1320px] items-center gap-4 px-5 lg:px-8">
          <a href="/" className="flex items-center gap-3"><img src="/lf-logo.png" alt="Lebanese Forces" className="h-11 w-11 rounded-full bg-white object-contain shadow-sm" /><span className="hidden text-[15px] font-extrabold sm:block">القوات اللبنانية</span></a>
          <div className="ms-auto flex items-center gap-1 rounded-full border border-black/[.08] bg-white p-1 shadow-sm"><Globe2 className="ms-2 text-black/35" size={14} />{(["ar", "en", "fr"] as Language[]).map((code) => <button key={code} onClick={() => setLanguage(code)} className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold transition ${language === code ? "bg-[#191919] text-white" : "text-black/40"}`}>{code.toUpperCase()}</button>)}</div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#191919] text-white">
        <div className="absolute -end-32 -top-40 h-[520px] w-[520px] rounded-full bg-[#df1f2d]/25 blur-3xl" />
        <div className="relative mx-auto grid min-h-[690px] max-w-[1320px] items-stretch lg:grid-cols-[.88fr_1.12fr]">
          <div className="relative min-h-[480px] overflow-hidden bg-black lg:min-h-[690px]"><img src={imageUrl} alt={t.title} className="absolute inset-0 h-full w-full object-cover object-top grayscale" /><div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/5 to-transparent" /></div>
          <div className="flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-16">
            <a href="/" className="mb-14 inline-flex w-fit items-center gap-2 text-[13px] font-bold text-white/48 transition hover:text-white"><ArrowLeft size={16} className={rtl ? "" : "rotate-180"} />{t.back}</a>
            <div className="flex items-center gap-2 text-[12px] font-extrabold text-[#ff6570]"><span className="h-2 w-2 rounded-full bg-[#ff6570]" />{t.kicker}</div>
            <h1 className="section-title mt-5 text-[clamp(3rem,7vw,7rem)] font-extrabold leading-[1.1]">{t.title}</h1>
            <p className="mt-4 text-[17px] font-bold text-white/62">{t.role}</p>
            <p className="mt-8 max-w-3xl text-[16px] leading-9 text-white/68 sm:text-[18px]">{t.intro}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1180px] gap-12 px-5 py-16 lg:grid-cols-[.65fr_1.35fr] lg:px-8 lg:py-24">
        <div><div className="grid h-14 w-14 place-items-center rounded-full bg-[#df1f2d] text-white"><Quote size={22} /></div><h2 className="section-title mt-6 text-[clamp(2.2rem,5vw,4.6rem)] font-extrabold leading-[1.2]">{t.storyTitle}</h2></div>
        <div className="space-y-7 text-[17px] leading-[2.05] text-black/68 sm:text-[19px]">{t.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>

      <section className="border-y border-black/[.06] bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-16 lg:px-8 lg:py-24">
          <div className="flex items-center gap-3 text-[#df1f2d]"><CalendarDays size={20} /><span className="text-[12px] font-extrabold">{t.kicker}</span></div>
          <h2 className="section-title mt-4 text-[clamp(2.2rem,5vw,4.8rem)] font-extrabold">{t.timelineTitle}</h2>
          <div className="mt-11 grid gap-3 md:grid-cols-2">{milestones.map((item) => <article key={item.year} className="group grid grid-cols-[100px_1fr] overflow-hidden rounded-[24px] border border-black/[.07] bg-[#f7f7f5] transition hover:-translate-y-0.5 hover:border-[#df1f2d]/30 hover:shadow-lg"><div className="grid place-items-center bg-[#191919] p-4 text-center text-[20px] font-extrabold text-[#ff6570]">{item.year}</div><div className="p-5 sm:p-6"><h3 className="text-[17px] font-extrabold">{item.title[language]}</h3><p className="mt-2 text-[14px] leading-7 text-black/50">{item.text[language]}</p></div></article>)}</div>
          <a href="https://www.lebanese-forces.com/person/politicians-samir-geagea/" target="_blank" rel="noreferrer" className="mt-10 inline-flex items-center gap-2 text-[12px] font-bold text-black/40 transition hover:text-[#df1f2d]">{t.source}<ExternalLink size={14} /></a>
        </div>
      </section>
    </main>
  );
}
