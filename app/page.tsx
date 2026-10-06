"use client";

import {
  ArrowLeft,
  ArrowUpLeft,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Globe2,
  ImageIcon,
  Library,
  MapPin,
  Megaphone,
  Menu,
  MessageSquareQuote,
  Music2,
  PartyPopper,
  Play,
  Plane,
  Quote,
  Search,
  Users,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ArticleTagLinks } from "@/components/article-tag-links";
import { ContactForm } from "@/components/contact-form";
import { HeroV2 } from "@/components/hero-v2";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import seedArticleData from "@/data/articles.json";
import seedHomepageData from "@/data/homepage.json";
import seedMediaData from "@/data/media.json";
import type { Article, ArticleChannel } from "@/lib/article-types";
import {
  articleChannelHref,
  articleChannelText,
  articleHref,
  articleText,
  formatArticleDate,
  getArticleChannel,
} from "@/lib/article-types";
import type { HomepageContent } from "@/lib/homepage-types";
import { homepageText } from "@/lib/homepage-types";
import type { MediaContent } from "@/lib/media-types";
import { mediaText } from "@/lib/media-types";
import { ministers, mps, profileText, type PublicProfile } from "@/lib/people";

type Lang = "ar" | "en" | "fr";
type Localized = { ar: string; en: string; fr: string };

const text = (value: Localized, lang: Lang) => value[lang];

const ui = {
  ar: {
    nav: [
      ["home", "الرئيسية"],
      ["history", "تاريخنا"],
      ["president", "رئيس الحزب"],
      ["leadership", "القيادة والكتل"],
      ["news", "الأخبار"],
      ["diaspora", "الانتشار"],
      ["publications", "المنشورات"],
      ["media", "الميديا"],
      ["contact", "تواصل معنا"],
    ],
    eyebrow: "القوات اللبنانية",
    title: "تاريخٌ من المقاومة.\nمشروعٌ من أجل الدولة.",
    intro:
      "حزب سياسي لبناني يعمل من أجل جمهورية سيّدة، حرّة وديمقراطية، يكون فيها الإنسان وكرامته في صلب العمل العام.",
    historyCta: "اكتشف تاريخ الحزب",
    mediaCta: "استكشف المكتبة الإعلامية",
    since: "منذ التأسيس",
    stats: [
      ["1976", "سنة التأسيس"],
      ["11", "عضواً منتخباً في الهيئة"],
      ["19", "نائباً في البرلمان"],
      ["4", "وزراء حاليون"],
    ],
    latestKicker: "المشهد الآن",
    latest: "آخر الأخبار",
    allNews: "كل الأخبار",
    visionKicker: "الحزب",
    visionTitle: "الإنسان. الحرية. الدولة.",
    visionText:
      "تضع القوات اللبنانية العمل السياسي في خدمة الخير العام، وتلتزم بقيام دولة دستورية سيدة، مرجعيتها القانون ومؤسساتها الشرعية.",
    values: [
      ["الإنسان", "كرامة الإنسان وحريته هما نقطة الانطلاق والغاية."],
      ["السيادة", "قرار وطني حر ودولة تمارس سلطتها على كامل أراضيها."],
      ["الديمقراطية", "مؤسسات دستورية، محاسبة وتداول سلمي للسلطة."],
    ],
    historyKicker: "ذاكرة حيّة",
    historyTitle: "محطات صنعت المسيرة",
    historyText:
      "انتقل بين السنوات لاكتشاف المحطات الأساسية من التأسيس إلى العمل السياسي والمؤسساتي اليوم.",
    presidentKicker: "رئيس الحزب",
    presidentTitle: "الدكتور سمير جعجع",
    presidentRole: "رئيس حزب القوات اللبنانية",
    presidentBio:
      "وُلد في عين الرمانة عام 1952، ودرس الطب في الجامعة الأميركية في بيروت ثم في جامعة القديس يوسف. تدرّج في المسؤوليات الحزبية، وتسلّم قيادة القوات اللبنانية عام 1986.",
    presidentBio2:
      "وافق على اتفاق الطائف عام 1989 وقاد انتقال القوات إلى العمل السياسي. اعتُقل عام 1994 وبقي في السجن أحد عشر عاماً وثلاثة أشهر، قبل إقرار قانون العفو وعودته إلى الحرية والحياة السياسية عام 2005.",
    bioLink: "السيرة الكاملة",
    presidentFacts: [
      ["1952", "ولد في عين الرمانة"],
      ["1986", "تسلّم قيادة القوات"],
      ["2005", "العودة إلى الحياة السياسية"],
    ],
    leadershipKicker: "المؤسسات والتمثيل",
    leadershipTitle: "القيادة والكتل",
    leadershipText:
      "تعرّف إلى أعضاء الهيئة التنفيذية، نواب القوات اللبنانية في المجلس النيابي والوزراء الحاليين.",
    tabs: ["الكتلة الوزارية", "الكتلة النيابية", "الهيئة التنفيذية"],
    committeeMember: "عضو منتخب في الهيئة التنفيذية",
    vicePresident: "نائب رئيس الحزب",
    mp: "نائب في المجلس النيابي",
    minister: "وزير في الحكومة اللبنانية",
    listed: "أعضاء الهيئة التنفيذية بحسب نتائج الانتخابات المباشرة، والكتلتان النيابية والوزارية بحسب القوائم الحالية.",
    expandLeadership: "عرض القيادة والكتل",
    collapseLeadership: "إخفاء القيادة والكتل",
    newsKicker: "متابعة",
    newsTitle: "أخبار ومواقف",
    newsText: "أحدث النشاطات والمواقف والملفات من الموقع الرسمي للقوات اللبنانية.",
    read: "اقرأ الخبر",
    browseSection: "عرض كل المواد",
    noStories: "لا توجد مواد منشورة في هذا القسم بعد.",
    publicationsKicker: "مكتبة الحزب",
    publicationsTitle: "المنشورات والوثائق",
    publicationsText:
      "الوصول المباشر إلى المرجعيات التنظيمية والفكرية، الأرشيف والأوراق الاقتصادية.",
    open: "فتح",
    download: "PDF",
    mediaKicker: "صوت وصورة",
    mediaTitle: "المكتبة الإعلامية",
    mediaText: "أناشيد، فيديوهات وصور توثّق الذاكرة والنشاط العام.",
    songs: "أناشيد وأغاني",
    songHint: "اختر مقطعاً للاستماع",
    videos: "فيديو",
    videoTitle: "كلمات، وثائقيات وتغطيات",
    videoText: "شاهد أحدث المواد من قناة القوات اللبنانية وأرشيف الفيديو.",
    viewVideos: "مشاهدة الفيديوهات",
    photos: "صور",
    photoArchive: "فتح ألبوم الصور",
    close: "إغلاق",
    source: "المصدر",
    footerLine: "جمهورية قوية. دولة واحدة. مستقبل يليق باللبنانيين.",
    rights: "نموذج موقع تفاعلي للقوات اللبنانية",
    official: "الموقع الإخباري الرسمي",
  },
  en: {
    nav: [
      ["home", "Home"],
      ["history", "Our history"],
      ["president", "Party president"],
      ["leadership", "Leadership & blocs"],
      ["news", "News"],
      ["diaspora", "Diaspora"],
      ["publications", "Publications"],
      ["media", "Media"],
      ["contact", "Contact"],
    ],
    eyebrow: "Lebanese Forces",
    title: "A history of resistance.\nA project for the state.",
    intro:
      "A Lebanese political party working for a sovereign, free and democratic republic where people and their dignity stand at the heart of public life.",
    historyCta: "Explore our history",
    mediaCta: "Explore the media library",
    since: "Since our founding",
    stats: [
      ["1976", "Founded"],
      ["11", "Elected committee members"],
      ["19", "Members of Parliament"],
      ["4", "Current ministers"],
    ],
    latestKicker: "Now",
    latest: "Latest news",
    allNews: "All news",
    visionKicker: "The party",
    visionTitle: "People. Freedom. The state.",
    visionText:
      "The Lebanese Forces places political action at the service of the common good and is committed to a sovereign constitutional state governed by law and legitimate institutions.",
    values: [
      ["People", "Human dignity and freedom are both the starting point and the goal."],
      ["Sovereignty", "An independent national decision and a state present across its territory."],
      ["Democracy", "Constitutional institutions, accountability and peaceful transfer of power."],
    ],
    historyKicker: "Living memory",
    historyTitle: "Milestones that shaped the journey",
    historyText:
      "Move through the years to explore defining moments from the party’s founding to its political and institutional role today.",
    presidentKicker: "Party president",
    presidentTitle: "Dr Samir Geagea",
    presidentRole: "President of the Lebanese Forces",
    presidentBio:
      "Born in Ain el-Remmaneh in 1952, Samir Geagea studied medicine at the American University of Beirut and Saint Joseph University. He rose through party responsibilities and assumed leadership of the Lebanese Forces in 1986.",
    presidentBio2:
      "He endorsed the Taif Agreement in 1989 and led the transition to political action. Arrested in 1994, he spent eleven years and three months in prison before an amnesty law enabled his return to freedom and political life in 2005.",
    bioLink: "Full biography",
    presidentFacts: [
      ["1952", "Born in Ain el-Remmaneh"],
      ["1986", "Assumed party leadership"],
      ["2005", "Returned to political life"],
    ],
    leadershipKicker: "Institutions & representation",
    leadershipTitle: "Leadership and blocs",
    leadershipText:
      "Meet the Executive Committee, the Lebanese Forces MPs in Parliament and the current ministers.",
    tabs: ["Ministerial bloc", "Parliamentary bloc", "Executive Committee"],
    committeeMember: "Elected Executive Committee member",
    vicePresident: "Party vice president",
    mp: "Member of Parliament",
    minister: "Minister in the Lebanese government",
    listed: "Executive Committee members follow the direct-election results; parliamentary and ministerial blocs follow the current lists.",
    expandLeadership: "View leadership and blocs",
    collapseLeadership: "Hide leadership and blocs",
    newsKicker: "Follow",
    newsTitle: "News and positions",
    newsText: "The latest party activity, positions and public affairs from the official news platform.",
    read: "Read article",
    browseSection: "View all coverage",
    noStories: "No stories have been published in this section yet.",
    publicationsKicker: "Party library",
    publicationsTitle: "Publications and documents",
    publicationsText:
      "Direct access to the party’s organizational and intellectual references, archive and economic papers.",
    open: "Open",
    download: "PDF",
    mediaKicker: "Sound & image",
    mediaTitle: "Media library",
    mediaText: "Songs, videos and photographs documenting memory and public activity.",
    songs: "Songs and anthems",
    songHint: "Select a track to listen",
    videos: "Video",
    videoTitle: "Addresses, documentaries and coverage",
    videoText: "Watch recent material from the Lebanese Forces channel and video archive.",
    viewVideos: "View videos",
    photos: "Photos",
    photoArchive: "Open photo archive",
    close: "Close",
    source: "Source",
    footerLine: "A strong republic. One state. A future worthy of the Lebanese.",
    rights: "Interactive Lebanese Forces website concept",
    official: "Official news website",
  },
  fr: {
    nav: [
      ["home", "Accueil"],
      ["history", "Notre histoire"],
      ["president", "Président du parti"],
      ["leadership", "Direction & blocs"],
      ["news", "Actualités"],
      ["diaspora", "Diaspora"],
      ["publications", "Publications"],
      ["media", "Médias"],
      ["contact", "Contact"],
    ],
    eyebrow: "Forces Libanaises",
    title: "Une histoire de résistance.\nUn projet pour l’État.",
    intro:
      "Un parti politique libanais engagé pour une république souveraine, libre et démocratique, plaçant l’être humain et sa dignité au cœur de la vie publique.",
    historyCta: "Explorer notre histoire",
    mediaCta: "Explorer la médiathèque",
    since: "Depuis la fondation",
    stats: [
      ["1976", "Année de fondation"],
      ["11", "Membres élus du comité"],
      ["19", "Députés au Parlement"],
      ["4", "Ministres actuels"],
    ],
    latestKicker: "Maintenant",
    latest: "Dernières actualités",
    allNews: "Toutes les actualités",
    visionKicker: "Le parti",
    visionTitle: "L’humain. La liberté. L’État.",
    visionText:
      "Les Forces Libanaises mettent l’action politique au service du bien commun et s’engagent pour un État constitutionnel souverain, régi par le droit et les institutions légitimes.",
    values: [
      ["L’humain", "La dignité et la liberté humaines sont le point de départ et la finalité."],
      ["Souveraineté", "Une décision nationale indépendante et un État présent sur tout le territoire."],
      ["Démocratie", "Institutions constitutionnelles, redevabilité et alternance pacifique."],
    ],
    historyKicker: "Mémoire vivante",
    historyTitle: "Les étapes d’un parcours",
    historyText:
      "Parcourez les années et découvrez les moments clés, de la fondation au rôle politique et institutionnel d’aujourd’hui.",
    presidentKicker: "Président du parti",
    presidentTitle: "Dr Samir Geagea",
    presidentRole: "Président des Forces Libanaises",
    presidentBio:
      "Né à Aïn el-Remmaneh en 1952, Samir Geagea a étudié la médecine à l’Université américaine de Beyrouth puis à l’Université Saint-Joseph. Il a gravi les échelons du parti et pris la direction des Forces Libanaises en 1986.",
    presidentBio2:
      "Il a approuvé l’Accord de Taëf en 1989 et conduit la transition vers l’action politique. Arrêté en 1994, il a passé onze ans et trois mois en prison avant qu’une loi d’amnistie permette son retour à la liberté et à la vie politique en 2005.",
    bioLink: "Biographie complète",
    presidentFacts: [
      ["1952", "Né à Aïn el-Remmaneh"],
      ["1986", "Prend la direction du parti"],
      ["2005", "Retour à la vie politique"],
    ],
    leadershipKicker: "Institutions & représentation",
    leadershipTitle: "Direction et blocs",
    leadershipText:
      "Découvrez le Comité exécutif, les députés des Forces Libanaises et les ministres actuels.",
    tabs: ["Bloc ministériel", "Bloc parlementaire", "Comité exécutif"],
    committeeMember: "Membre élu du Comité exécutif",
    vicePresident: "Vice-président du parti",
    mp: "Député au Parlement",
    minister: "Ministre du gouvernement libanais",
    listed: "Les membres du Comité exécutif suivent les résultats du vote direct; les blocs parlementaire et ministériel suivent les listes actuelles.",
    expandLeadership: "Voir la direction et les blocs",
    collapseLeadership: "Masquer la direction et les blocs",
    newsKicker: "Suivre",
    newsTitle: "Actualités et positions",
    newsText: "Les dernières activités, positions et affaires publiques depuis la plateforme officielle.",
    read: "Lire l’article",
    browseSection: "Voir toute l’actualité",
    noStories: "Aucun contenu n’a encore été publié dans cette rubrique.",
    publicationsKicker: "Bibliothèque du parti",
    publicationsTitle: "Publications et documents",
    publicationsText:
      "Accès direct aux références organisationnelles et intellectuelles, aux archives et aux analyses économiques.",
    open: "Ouvrir",
    download: "PDF",
    mediaKicker: "Son & image",
    mediaTitle: "Médiathèque",
    mediaText: "Chants, vidéos et photographies documentant la mémoire et l’action publique.",
    songs: "Chants et hymnes",
    songHint: "Choisissez un titre",
    videos: "Vidéo",
    videoTitle: "Discours, documentaires et reportages",
    videoText: "Découvrez les contenus récents de la chaîne et des archives vidéo des Forces Libanaises.",
    viewVideos: "Voir les vidéos",
    photos: "Photos",
    photoArchive: "Ouvrir les albums",
    close: "Fermer",
    source: "Source",
    footerLine: "Une république forte. Un seul État. Un avenir digne des Libanais.",
    rights: "Concept de site interactif des Forces Libanaises",
    official: "Site officiel d’actualités",
  },
} as const;

const newsChannelPresentation: Record<ArticleChannel, {
  title: Localized;
  description: Localized;
  moreTitle: Localized;
  icon: typeof Megaphone;
}> = {
  statements: {
    title: { ar: "آخر البيانات", en: "Latest statements", fr: "Derniers communiqués" },
    moreTitle: { ar: "بيانات أُخرى", en: "More statements", fr: "Autres communiqués" },
    description: {
      ar: "أحدث بيانات القوات اللبنانية أو رئيس الحزب.",
      en: "The latest statement from the Lebanese Forces or the party president.",
      fr: "Le dernier communiqué des Forces Libanaises ou du président du parti.",
    },
    icon: Megaphone,
  },
  positions: {
    title: { ar: "آخر مواقف النواب والوزراء", en: "Latest MPs & ministers’ positions", fr: "Dernières positions des députés et ministres" },
    moreTitle: { ar: "مواقف أُخرى", en: "More positions", fr: "Autres prises de position" },
    description: {
      ar: "أحدث المواقف والتصريحات الصادرة عن نواب ووزراء القوات.",
      en: "The latest positions and remarks from Lebanese Forces MPs and ministers.",
      fr: "Les dernières prises de position des députés et ministres des Forces Libanaises.",
    },
    icon: MessageSquareQuote,
  },
  party: {
    title: { ar: "آخر أخبار ونشاطات الحزب", en: "Latest party news & activities", fr: "Dernières actualités et activités du parti" },
    moreTitle: { ar: "أخبار ونشاطات أُخرى", en: "More party news & activities", fr: "Autres actualités et activités" },
    description: {
      ar: "اجتماعات، جولات ونشاطات حزبية من مختلف المناطق.",
      en: "Meetings, visits and party activities from across Lebanon.",
      fr: "Réunions, visites et activités du parti dans tout le Liban.",
    },
    icon: PartyPopper,
  },
  diaspora: {
    title: { ar: "نشاطات الانتشار", en: "Diaspora activities", fr: "Activités de la diaspora" },
    moreTitle: { ar: "نشاطات اغترابية أُخرى", en: "More diaspora activities", fr: "Autres activités de la diaspora" },
    description: {
      ar: "أخبار ونشاطات مراكز القوات اللبنانية حول العالم.",
      en: "News and activities from Lebanese Forces chapters around the world.",
      fr: "Actualités et activités des sections des Forces Libanaises dans le monde.",
    },
    icon: Plane,
  },
};

const defaultTimeline: { id: string; year: string; title: Localized; body: Localized; imageUrl: string }[] = [
  {
    id: "history-1976",
    year: "1976",
    imageUrl: "https://www.lstatic.org/UserFiles/images/LF-Party-Timeline/4-1976-LF.jpg",
    title: { ar: "التأسيس", en: "Founding", fr: "Fondation" },
    body: {
      ar: "إنشاء صيغة توحيدية لأحزاب الجبهة اللبنانية حملت اسم «القوات اللبنانية» بقيادة الشيخ بشير الجميّل.",
      en: "A unified structure bringing together parties of the Lebanese Front was formed under the name “Lebanese Forces,” led by Bachir Gemayel.",
      fr: "Une structure unifiée regroupant les partis du Front libanais est créée sous le nom de « Forces Libanaises », dirigée par Bachir Gemayel.",
    },
  },
  {
    id: "history-1978",
    year: "1978",
    imageUrl: "https://www.lstatic.org/UserFiles/images/LF-Party-Timeline/6-1978-Achrafieh.jpg",
    title: { ar: "حرب المئة يوم", en: "Hundred Days’ War", fr: "Guerre des Cent Jours" },
    body: {
      ar: "اندلاع حرب المئة يوم في الأشرفية بعد توقيف بشير الجميّل على حاجز للجيش السوري.",
      en: "The Hundred Days’ War erupted in Achrafieh following Bachir Gemayel’s detention at a Syrian army checkpoint.",
      fr: "La Guerre des Cent Jours éclate à Achrafieh après l’arrestation de Bachir Gemayel à un barrage de l’armée syrienne.",
    },
  },
  {
    id: "history-1981",
    year: "1981",
    imageUrl: "https://www.lstatic.org/UserFiles/images/LF-Party-Timeline/8-1981-Zahleh.jpg",
    title: { ar: "معركة زحلة", en: "Battle of Zahle", fr: "Bataille de Zahlé" },
    body: {
      ar: "واجهت زحلة حصاراً وقصفاً قاسياً، وشكّلت المعركة محطة أساسية في مقاومة الوجود السوري.",
      en: "Zahle endured a severe siege and bombardment, marking a defining moment in resistance to the Syrian presence.",
      fr: "Zahlé subit un siège et des bombardements intenses, une étape majeure de la résistance à la présence syrienne.",
    },
  },
  {
    id: "history-1982",
    year: "1982",
    imageUrl: "https://www.lstatic.org/UserFiles/images/LF-Party-Timeline/9-1982-elections.jpg",
    title: { ar: "بشير رئيساً", en: "Bachir elected president", fr: "Bachir élu président" },
    body: {
      ar: "انتُخب بشير الجميّل رئيساً للجمهورية في 23 آب، ثم اغتيل في 14 أيلول قبل تسلّمه مهامه.",
      en: "Bachir Gemayel was elected President of the Republic on 23 August and assassinated on 14 September before taking office.",
      fr: "Bachir Gemayel est élu président de la République le 23 août, puis assassiné le 14 septembre avant son entrée en fonction.",
    },
  },
  {
    id: "history-1986",
    year: "1986",
    imageUrl: "https://www.lstatic.org/UserFiles/images/LF-Party-Timeline/14-1985-tripartite.jpg",
    title: { ar: "قيادة سمير جعجع", en: "Geagea’s leadership", fr: "Direction de Samir Geagea" },
    body: {
      ar: "تسلّم سمير جعجع قيادة القوات اللبنانية بعد إسقاط الاتفاق الثلاثي، وأطلق ورشة تنظيمية وسياسية وإعلامية واسعة.",
      en: "Samir Geagea assumed leadership after the Tripartite Accord was overturned and launched broad organizational, political and media development.",
      fr: "Samir Geagea prend la direction après l’abandon de l’Accord tripartite et lance une vaste réorganisation politique et médiatique.",
    },
  },
  {
    id: "history-1989",
    year: "1989",
    imageUrl: "https://www.lstatic.org/UserFiles/images/LF-Party-Timeline/16-1989-taef.jpg",
    title: { ar: "اتفاق الطائف", en: "Taif Agreement", fr: "Accord de Taëf" },
    body: {
      ar: "وافقت القوات على اتفاق الطائف، ثم حلّت جناحها العسكري طوعاً وانتقلت إلى العمل السياسي.",
      en: "The Lebanese Forces endorsed the Taif Agreement, voluntarily dissolved its military wing and moved into political action.",
      fr: "Les Forces Libanaises approuvent l’Accord de Taëf, dissolvent volontairement leur branche militaire et passent à l’action politique.",
    },
  },
  {
    id: "history-1994",
    year: "1994",
    imageUrl: "https://www.lstatic.org/UserFiles/images/LF-Party-Timeline/20and21-1994-arrest.jpg",
    title: { ar: "الحل والاعتقال", en: "Dissolution and arrest", fr: "Dissolution et arrestation" },
    body: {
      ar: "حُلّ الحزب في 23 آذار واعتُقل سمير جعجع في 21 نيسان، لتبدأ مرحلة أحد عشر عاماً من المقاومة السياسية.",
      en: "The party was dissolved on 23 March and Samir Geagea arrested on 21 April, beginning eleven years of political resistance.",
      fr: "Le parti est dissous le 23 mars et Samir Geagea arrêté le 21 avril, ouvrant onze années de résistance politique.",
    },
  },
  {
    id: "history-2005",
    year: "2005",
    imageUrl: "https://www.lstatic.org/UserFiles/images/LF-Party-Timeline/26-2005-14-march.jpg",
    title: { ar: "ثورة الأرز والحرية", en: "Cedar Revolution and freedom", fr: "Révolution du Cèdre et liberté" },
    body: {
      ar: "شارك الحزب في ثورة الأرز، انسحب الجيش السوري من لبنان، وأقرّ مجلس النواب قانون العفو الذي أعاد جعجع إلى الحرية.",
      en: "The party took part in the Cedar Revolution, the Syrian army withdrew, and Parliament adopted the amnesty law that freed Geagea.",
      fr: "Le parti participe à la Révolution du Cèdre, l’armée syrienne se retire et le Parlement adopte la loi d’amnistie libérant Geagea.",
    },
  },
  {
    id: "history-2012",
    year: "2012",
    imageUrl: "https://www.lstatic.org/UserFiles/images/LF-Party-Timeline/29--2012-manifesto.jpg",
    title: { ar: "الشرعة والنظام", en: "Charter and internal system", fr: "Charte et règlement" },
    body: {
      ar: "إعلان شرعة الحزب واعتماد نظام داخلي متطوّر، مع فتح باب الانتساب وتكريس المسار المؤسساتي.",
      en: "The party charter and a modern internal system were adopted, opening membership and consolidating institutional development.",
      fr: "La charte et un règlement intérieur moderne sont adoptés, ouvrant l’adhésion et renforçant l’institutionnalisation.",
    },
  },
  {
    id: "history-2023",
    year: "2023",
    imageUrl: "https://www.lstatic.org/UserFiles/images/2017/default/elections%2814%29.jpg",
    title: { ar: "انتخابات حزبية مباشرة", en: "Direct party elections", fr: "Élections internes directes" },
    body: {
      ar: "أُجريت أول انتخابات حزبية مباشرة لاختيار رئيس الحزب ونائبه وأعضاء الهيئة التنفيذية.",
      en: "The first direct internal elections were held to choose the party president, vice president and Executive Committee.",
      fr: "Les premières élections internes directes sont organisées pour choisir le président, le vice-président et le Comité exécutif.",
    },
  },
  {
    id: "history-2025",
    year: "2025",
    imageUrl: "https://d39raawggeifpx.cloudfront.net/styles/16_9_desktop/s3/articleimages/16011c51-d85f-40e6-a5f8-a7cee0d5994d.JPG",
    title: { ar: "عودة إلى الحكومة", en: "Return to government", fr: "Retour au gouvernement" },
    body: {
      ar: "تمثّلت القوات اللبنانية بأربعة وزراء في حكومة الرئيس نواف سلام ضمن حقائب سيادية وخدماتية واقتصادية.",
      en: "The Lebanese Forces entered Prime Minister Nawaf Salam’s cabinet with four ministers holding sovereign, service and economic portfolios.",
      fr: "Les Forces Libanaises rejoignent le gouvernement de Nawaf Salam avec quatre ministres aux portefeuilles souverains, économiques et de services.",
    },
  },
];

const executiveRegions: { region: Localized; members: Localized[] }[] = [
  {
    region: { ar: "الانتشار", en: "Diaspora", fr: "Diaspora" },
    members: [{ ar: "جوزيف جبيلي", en: "Joseph Jbeily", fr: "Joseph Jbeily" }],
  },
  {
    region: { ar: "بيروت", en: "Beirut", fr: "Beyrouth" },
    members: [{ ar: "دانيال سبيرو", en: "Daniel Spiro", fr: "Daniel Spiro" }],
  },
  {
    region: { ar: "جبل لبنان", en: "Mount Lebanon", fr: "Mont-Liban" },
    members: [
      { ar: "إدي أبي اللمع", en: "Eddy Abi Lamaa", fr: "Eddy Abi Lamaa" },
      { ar: "مايا زغريني", en: "Maya Zoghrini", fr: "Maya Zoghrini" },
      { ar: "طوني كرم", en: "Tony Karam", fr: "Tony Karam" },
    ],
  },
  {
    region: { ar: "الشمال", en: "North", fr: "Nord" },
    members: [
      { ar: "أنطوان زهرا", en: "Antoine Zahra", fr: "Antoine Zahra" },
      { ar: "وهبي قاطيشا", en: "Wehbe Katicha", fr: "Wehbe Katicha" },
      { ar: "إيلي كيروز", en: "Elie Keyrouz", fr: "Elie Keyrouz" },
    ],
  },
  {
    region: { ar: "البقاع", en: "Bekaa", fr: "Békaa" },
    members: [
      { ar: "بشير مطر", en: "Bachir Matar", fr: "Bachir Matar" },
      { ar: "ميشال تنوري", en: "Michel Tannoury", fr: "Michel Tannoury" },
    ],
  },
  {
    region: { ar: "الجنوب", en: "South", fr: "Sud" },
    members: [{ ar: "أسعد سعيد", en: "Assaad Said", fr: "Assaad Said" }],
  },
];

const publicationLibraries = [
  {
    section: "legislative" as const,
    icon: FileText,
    title: { ar: "الزاوية التشريعية", en: "Legislative corner", fr: "Coin législatif" },
    description: { ar: "أسئلة واقتراحات قوانين مقدّمة ضمن العمل النيابي.", en: "Parliamentary questions and proposed laws.", fr: "Questions parlementaires et propositions de loi." },
  },
  {
    section: "political" as const,
    icon: BookOpen,
    title: { ar: "المنشورات السياسية", en: "Political publications", fr: "Publications politiques" },
    description: { ar: "دراسات وأوراق سياسية وفكرية متاحة للقراءة.", en: "Political studies and policy papers.", fr: "Études politiques et documents de réflexion." },
  },
  {
    section: "charter" as const,
    icon: Library,
    title: { ar: "النظام والشرعة", en: "Regulations & charter", fr: "Règlement et charte" },
    description: { ar: "النظام الداخلي وشرعة حزب القوات اللبنانية.", en: "The party's internal regulations and charter.", fr: "Le règlement intérieur et la charte du parti." },
  },
];

function SectionHeading({
  kicker,
  title,
  description,
  light = false,
}: {
  kicker: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-3xl" data-reveal>
      <div className={"arabic-safe mb-4 flex items-center gap-3 text-[13px] font-extrabold uppercase tracking-[.12em] " + (light ? "text-[#ff6470]" : "text-[#df1f2d]")}>
        <span className={"h-2 w-2 rounded-full " + (light ? "bg-[#ff6470]" : "bg-[#df1f2d]")} />
        {kicker}
      </div>
      <h2 className={"section-title text-[clamp(2.15rem,4.5vw,4.5rem)] font-extrabold leading-[1.08] tracking-[-.035em] " + (light ? "text-white" : "text-[#171717]")}>{title}</h2>
      {description && <p className={"mt-5 max-w-2xl text-[16px] font-normal leading-8 sm:text-[17px] " + (light ? "text-white/62" : "text-black/58")}>{description}</p>}
    </div>
  );
}

function PersonCard({
  person,
  lang,
  role,
  index,
}: {
  person: PublicProfile;
  lang: Lang;
  role: string;
  index: number;
}) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-black/[.07] bg-white shadow-[0_8px_30px_rgba(0,0,0,.035)] transition duration-300 hover:-translate-y-1 hover:border-[#df1f2d]/30 hover:shadow-[0_22px_55px_rgba(0,0,0,.11)]" data-reveal>
      <a href={`/people/${person.slug}`} className="block">
        <div className="relative aspect-[4/4.5] overflow-hidden bg-[#ecece8]">
          <img src={person.imageUrl} alt={profileText(person.name, lang)} className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.035]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute end-4 top-4 rounded-full bg-black/42 px-2.5 py-1 text-[10px] font-bold tabular-nums text-white/75 backdrop-blur">{String(index + 1).padStart(2, "0")}</span>
        </div>
      </a>
      <div className="p-5">
        <div className="text-[10px] font-extrabold text-[#df1f2d]">{role}</div>
        <h3 className="mt-2 text-[17px] font-extrabold leading-7 transition group-hover:text-[#df1f2d]"><a href={`/people/${person.slug}`}>{profileText(person.name, lang)}</a></h3>
        <p className="mt-1.5 text-[12px] font-normal leading-6 text-black/45">{profileText(person.office, lang)}</p>
        {person.socials && (
          <div className="mt-4 flex gap-1.5 border-t border-black/[.06] pt-3">
            {person.socials.x && <a href={person.socials.x} target="_blank" rel="noreferrer" aria-label={`${profileText(person.name, lang)} on X`} className="grid h-8 w-8 place-items-center rounded-full bg-[#f3f3f0] text-[11px] font-extrabold text-black/48 transition hover:bg-[#191919] hover:text-white">𝕏</a>}
            {person.socials.instagram && <a href={person.socials.instagram} target="_blank" rel="noreferrer" aria-label={`${profileText(person.name, lang)} on Instagram`} className="grid h-8 w-8 place-items-center rounded-full bg-[#f3f3f0] text-[13px] font-extrabold text-black/48 transition hover:bg-[#df1f2d] hover:text-white">◎</a>}
            {person.socials.facebook && <a href={person.socials.facebook} target="_blank" rel="noreferrer" aria-label={`${profileText(person.name, lang)} on Facebook`} className="grid h-8 w-8 place-items-center rounded-full bg-[#f3f3f0] text-[12px] font-extrabold text-black/48 transition hover:bg-[#1877f2] hover:text-white">f</a>}
          </div>
        )}
      </div>
    </article>
  );
}

function ExecutiveRegionCard({
  region,
  members,
  label,
  index,
}: {
  region: string;
  members: string[];
  label: string;
  index: number;
}) {
  return (
    <article className="group relative overflow-hidden rounded-[26px] border border-black/[.07] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.035)] transition duration-300 hover:-translate-y-1 hover:border-[#df1f2d]/25 hover:shadow-[0_22px_55px_rgba(0,0,0,.09)]" data-reveal>
      <div className="absolute inset-x-0 top-0 h-1 origin-right scale-x-0 bg-[#df1f2d] transition-transform duration-500 group-hover:scale-x-100" />
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-[13px] font-extrabold text-[#df1f2d]"><MapPin size={16} />{region}</span>
        <span className="text-[11px] font-bold tabular-nums text-black/22">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="mt-6 space-y-3">
        {members.map((member) => (
          <div key={member} className="flex items-center gap-3 rounded-2xl bg-[#f7f7f5] px-4 py-3.5 transition group-hover:bg-[#f3f3f0]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#0b7740]" />
            <div>
              <h3 className="text-[16px] font-extrabold leading-7">{member}</h3>
              <p className="mt-0.5 text-[12px] font-normal text-black/40">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function NewsChannelPanel({
  channel,
  stories,
  lang,
  readLabel,
  browseLabel,
  emptyLabel,
}: {
  channel: Exclude<ArticleChannel, "diaspora">;
  stories: Article[];
  lang: Lang;
  readLabel: string;
  browseLabel: string;
  emptyLabel: string;
}) {
  const presentation = newsChannelPresentation[channel];
  const Icon = presentation.icon;
  const lead = stories[0];

  return (
    <section className="flex min-h-[620px] flex-col overflow-hidden rounded-[30px] border border-black/[.07] bg-white shadow-[0_15px_50px_rgba(0,0,0,.055)]" data-reveal>
      <div className="border-b border-black/[.06] p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f4f4f1] text-[#df1f2d]"><Icon size={20} /></span>
          <span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-black/25">{articleChannelText(channel, lang)}</span>
        </div>
        <h3 className="section-title mt-5 text-[clamp(1.45rem,2.6vw,2rem)] font-extrabold leading-[1.35]">{text(presentation.title, lang)}</h3>
        <p className="mt-3 min-h-[52px] text-[13px] leading-6 text-black/45">{text(presentation.description, lang)}</p>
      </div>

      {lead ? (
        <div className="flex flex-1 flex-col">
          <a href={articleHref(lead)} className="group relative block aspect-[16/9] overflow-hidden bg-[#191919]">
            <img src={lead.imageUrl} alt={articleText(lead.imageAlt, lang)} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
          </a>
          <div className="flex flex-1 flex-col p-6 sm:p-7">
            <div className="text-[11px] font-bold text-[#df1f2d]">{formatArticleDate(lead.publishedAt, lang)}</div>
            <h4 className="mt-3 text-[18px] font-extrabold leading-8"><a href={articleHref(lead)} className="transition hover:text-[#df1f2d]">{articleText(lead.title, lang)}</a></h4>
            <div className="mt-4"><ArticleTagLinks article={lead} language={lang} compact /></div>
            {stories.slice(1, 3).length > 0 && (
              <div className="mt-6 space-y-3 border-t border-black/[.07] pt-5">
                <div className="mb-4 flex items-center gap-2 text-[11px] font-extrabold text-black/38">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#df1f2d]" />
                  {text(presentation.moreTitle, lang)}
                </div>
                {stories.slice(1, 3).map((story) => (
                  <a key={story.id} href={articleHref(story)} className="group flex items-start justify-between gap-3 text-[13px] font-bold leading-6 text-black/58 transition hover:text-[#df1f2d]">
                    <span>{articleText(story.title, lang)}</span><ArrowUpLeft size={14} className="mt-1 shrink-0 transition group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ))}
              </div>
            )}
            <a href={articleHref(lead)} className="mt-auto inline-flex items-center gap-2 pt-7 text-[12px] font-extrabold text-black/45 transition hover:text-[#df1f2d]">{readLabel}<ArrowUpLeft size={15} /></a>
          </div>
        </div>
      ) : (
        <div className="grid flex-1 place-items-center p-8 text-center text-[13px] leading-7 text-black/38">{emptyLabel}</div>
      )}

      <a href={articleChannelHref(channel)} className="flex items-center justify-between border-t border-black/[.06] px-6 py-4 text-[12px] font-extrabold text-black/48 transition hover:bg-[#191919] hover:text-white sm:px-7">
        {browseLabel}<ArrowLeft size={15} />
      </a>
    </section>
  );
}

function DiasporaStoryCard({
  article,
  lang,
  readLabel,
}: {
  article: Article;
  lang: Lang;
  readLabel: string;
}) {
  return (
    <article className="group overflow-hidden rounded-[26px] border border-white/[.08] bg-white/[.055] transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[.075]">
      <a href={articleHref(article)} className="relative block aspect-[16/9] overflow-hidden bg-black/20">
        <img src={article.imageUrl} alt={articleText(article.imageAlt, lang)} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
      </a>
      <div className="p-6">
        <div className="text-[11px] font-bold text-[#ff7780]">{formatArticleDate(article.publishedAt, lang)}</div>
        <h3 className="mt-3 text-[18px] font-extrabold leading-8"><a href={articleHref(article)}>{articleText(article.title, lang)}</a></h3>
        <div className="mt-4"><ArticleTagLinks article={article} language={lang} dark compact /></div>
        <a href={articleHref(article)} className="mt-6 inline-flex items-center gap-2 text-[12px] font-extrabold text-white/55 transition group-hover:text-white">{readLabel}<ArrowUpLeft size={15} /></a>
      </div>
    </article>
  );
}

export function HomePage({ heroVariant = "current" }: { heroVariant?: "current" | "v2" }) {
  const [lang, setLang] = useState<Lang>("ar");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeYear, setActiveYear] = useState("history-1976");
  const [activeTrack, setActiveTrack] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [leadershipOpen, setLeadershipOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [articles, setArticles] = useState<Article[]>(
    () => [...(seedArticleData as Article[])].sort(
      (left, right) => Number(right.pinned === true) - Number(left.pinned === true) || new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
    ),
  );
  const [homepage, setHomepage] = useState<HomepageContent>(
    seedHomepageData as HomepageContent,
  );
  const [media, setMedia] = useState<MediaContent>(seedMediaData as MediaContent);
  const t = {
    ...ui[lang],
    nav: homepage.navigation.map((item) => [item.id, homepageText(item.label, lang)] as [string, string]),
    stats: homepage.stats.map((item) => [item.value, homepageText(item.label, lang)] as [string, string]),
    values: homepage.values.map((item) => [homepageText(item.title, lang), homepageText(item.text, lang)] as [string, string]),
    historyCta: homepageText(homepage.interfaceText.historyCta, lang),
    mediaCta: homepageText(homepage.interfaceText.mediaCta, lang),
    allNews: homepageText(homepage.interfaceText.allNews, lang),
    bioLink: homepageText(homepage.interfaceText.bioLink, lang),
    expandLeadership: homepageText(homepage.interfaceText.leadershipCta, lang),
    songs: homepageText(homepage.interfaceText.songsTitle, lang),
    videos: homepageText(homepage.interfaceText.videosTitle, lang),
    photos: homepageText(homepage.interfaceText.photosTitle, lang),
    eyebrow: homepageText(homepage.hero.eyebrow, lang),
    title: homepageText(homepage.hero.title, lang),
    intro: homepageText(homepage.hero.intro, lang),
    latestKicker: homepageText(homepage.news.kicker, lang),
    latest: homepageText(homepage.news.title, lang),
    newsText: homepageText(homepage.news.text, lang),
    visionKicker: homepageText(homepage.vision.kicker, lang),
    visionTitle: homepageText(homepage.vision.title, lang),
    visionText: homepageText(homepage.vision.text, lang),
    historyKicker: homepageText(homepage.history.kicker, lang),
    historyTitle: homepageText(homepage.history.title, lang),
    historyText: homepageText(homepage.history.text, lang),
    presidentKicker: homepageText(homepage.president.kicker, lang),
    presidentTitle: homepageText(homepage.president.title, lang),
    presidentRole: homepageText(homepage.president.role, lang),
    presidentBio: homepageText(homepage.president.bio, lang),
    presidentBio2: homepageText(homepage.president.bio2, lang),
    leadershipKicker: homepageText(homepage.leadership.kicker, lang),
    leadershipTitle: homepageText(homepage.leadership.title, lang),
    leadershipText: homepageText(homepage.leadership.text, lang),
    publicationsKicker: homepageText(homepage.publications.kicker, lang),
    publicationsTitle: homepageText(homepage.publications.title, lang),
    publicationsText: homepageText(homepage.publications.text, lang),
    mediaKicker: homepageText(homepage.media.kicker, lang),
    mediaTitle: homepageText(homepage.media.title, lang),
    mediaText: homepageText(homepage.media.text, lang),
    footerLine: homepageText(homepage.footer.line, lang),
  };
  const rtl = lang === "ar";
  const peopleOverrides = new Map((homepage.people || []).map((person) => [person.slug, person]));
  const applyPersonOverride = (person: PublicProfile): PublicProfile => {
    const override = peopleOverrides.get(person.slug);
    return override ? {
      ...person,
      name: override.name,
      office: override.office,
      imageUrl: override.imageUrl,
      summary: override.summary,
      bio: override.bio,
      socials: override.socials,
    } : person;
  };
  const siteMps = mps.map(applyPersonOverride);
  const siteMinisters = ministers.map(applyPersonOverride);
  const tracks = media.songs;
  const photos = media.photos;
  const siteTimeline = homepage.historyTimeline?.length ? homepage.historyTimeline : defaultTimeline;
  const currentTimeline = useMemo(
    () => siteTimeline.find((item) => item.id === activeYear) || siteTimeline[0],
    [activeYear, siteTimeline],
  );
  const articlesByChannel = useMemo<Record<ArticleChannel, Article[]>>(() => {
    const grouped: Record<ArticleChannel, Article[]> = {
      statements: [],
      positions: [],
      party: [],
      diaspora: [],
    };
    articles.forEach((article) => grouped[getArticleChannel(article)].push(article));
    (["statements", "positions", "party", "diaspora"] as ArticleChannel[]).forEach((channel) => grouped[channel].sort(
      (left, right) => Number(right.pinned === true) - Number(left.pinned === true) || new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
    ));
    return grouped;
  }, [articles]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [lang, rtl]);

  useEffect(() => {
    if (siteTimeline.length && !siteTimeline.some((item) => item.id === activeYear)) {
      setActiveYear(siteTimeline[0].id);
    }
  }, [activeYear, siteTimeline]);

  useEffect(() => {
    let active = true;
    const refreshContent = async () => {
      try {
        const requestOptions = {
          cache: "no-store" as const,
          headers: { "Cache-Control": "no-cache" },
        };
        const fresh = Date.now();
        const [articlesResponse, homepageResponse, mediaResponse] = await Promise.all([
          fetch(`/api/articles?fresh=${fresh}`, requestOptions),
          fetch(`/api/homepage?fresh=${fresh}`, requestOptions),
          fetch(`/api/media?fresh=${fresh}`, requestOptions),
        ]);
        if (!articlesResponse.ok || !homepageResponse.ok || !mediaResponse.ok) return;
        const [articleData, homepageData, mediaData] = await Promise.all([
          articlesResponse.json() as Promise<{ articles?: Article[] }>,
          homepageResponse.json() as Promise<{ content?: HomepageContent }>,
          mediaResponse.json() as Promise<{ content?: MediaContent }>,
        ]);
        if (!active) return;
        if (articleData.articles) setArticles(articleData.articles);
        if (homepageData.content) setHomepage(homepageData.content);
        if (mediaData.content) setMedia(mediaData.content);
      } catch {
        // Keep the last known content if the network is temporarily unavailable.
      }
    };
    void refreshContent();
    window.addEventListener("focus", refreshContent);
    return () => {
      active = false;
      window.removeEventListener("focus", refreshContent);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    const observeReveals = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.reveal-bound)").forEach((element) => {
        element.classList.add("reveal-bound");
        revealObserver.observe(element);
      });
    };

    observeReveals();
    const mutationObserver = new MutationObserver(observeReveals);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -58% 0px" },
    );
    document.querySelectorAll<HTMLElement>("section[id]").forEach((section) => sectionObserver.observe(section));

    const updateProgress = () => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maximum > 0 ? (window.scrollY / maximum) * 100 : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      revealObserver.disconnect();
      mutationObserver.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const changeTimeline = (direction: number) => {
    const currentIndex = siteTimeline.findIndex((item) => item.id === activeYear);
    const nextIndex = (currentIndex + direction + siteTimeline.length) % siteTimeline.length;
    setActiveYear(siteTimeline[nextIndex].id);
  };

  return (
    <main dir={rtl ? "rtl" : "ltr"} className="min-h-screen overflow-x-hidden bg-[#f7f7f5] text-[#171717]">
      {heroVariant === "v2" ? (
        <HeroV2
          activeSection={activeSection}
          lang={lang}
          nav={t.nav}
          onLanguageChange={setLang}
          onNavigate={goTo}
        />
      ) : (
        <>
          <header className="sticky top-0 z-40 border-b border-black/[.06] bg-[#f7f7f5]/88 shadow-[0_8px_30px_rgba(0,0,0,.03)] backdrop-blur-2xl">
        <div className="mx-auto flex h-[76px] max-w-[1380px] items-center gap-7 px-5 lg:px-8">
          <button onClick={() => goTo("home")} className="flex shrink-0 items-center gap-3 text-start" aria-label={t.eyebrow}>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-[0_5px_20px_rgba(0,0,0,.07)] ring-1 ring-black/[.05]">
              <img src="/lf-logo.png" alt="" className="h-9 w-9 rounded-full object-cover mix-blend-multiply" />
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block text-[16px] font-extrabold">القوات اللبنانية</span>
              <span className="mt-1.5 block text-[9px] font-bold uppercase tracking-[0.15em] text-black/40">Lebanese Forces</span>
            </span>
          </button>

          <nav className="mx-auto hidden items-center gap-5 xl:flex" aria-label="Main navigation">
            {t.nav.map(([id, label]) => (
              <button
                key={id}
                onClick={() => goTo(id)}
                className={"relative py-2 text-[13px] font-bold transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:mx-auto after:h-0.5 after:rounded-full after:bg-[#df1f2d] after:transition-all hover:text-[#df1f2d] " + (activeSection === id ? "text-[#df1f2d] after:w-full" : "text-black/58 after:w-0")}
              >
                {label}
              </button>
            ))}
          </nav>

          <form action="/news" className="hidden h-10 w-[190px] shrink-0 items-center gap-2 rounded-full border border-black/[.08] bg-white/80 px-3 shadow-sm transition focus-within:w-[240px] focus-within:border-[#df1f2d]/35 2xl:flex">
            <Search size={15} className="shrink-0 text-black/35" />
            <input name="q" aria-label={lang === "ar" ? "البحث في الموقع" : lang === "fr" ? "Rechercher sur le site" : "Search the website"} placeholder={lang === "ar" ? "ابحث في الأخبار…" : lang === "fr" ? "Rechercher…" : "Search news…"} className="min-w-0 flex-1 bg-transparent text-[12px] font-bold outline-none placeholder:text-black/28" />
          </form>

          <div className="ms-auto flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setLanguageOpen((open) => !open)}
                className="flex h-10 items-center gap-2 rounded-full border border-black/[.08] bg-white/70 px-3 text-[13px] font-bold shadow-sm transition hover:border-black/20 hover:bg-white"
                aria-expanded={languageOpen}
                aria-label="Language"
              >
                <Globe2 size={16} />
                {lang.toUpperCase()}
                <ChevronDown size={14} />
              </button>
              {languageOpen && (
                <div className="absolute end-0 top-12 z-50 w-36 rounded-2xl border border-black/10 bg-white p-1.5 shadow-xl">
                  {(["ar", "en", "fr"] as Lang[]).map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLang(code);
                        setLanguageOpen(false);
                      }}
                      className={"w-full rounded-xl px-3 py-2 text-start text-sm font-bold hover:bg-black/5 " + (code === lang ? "text-[#df1f2d]" : "")}
                    >
                      {code === "ar" ? "العربية" : code === "en" ? "English" : "Français"}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#191919] text-white shadow-md transition hover:bg-[#df1f2d] xl:hidden"
            >
              <Menu size={19} />
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-black/[.025]">
          <div className="h-full bg-[#df1f2d] transition-[width] duration-150" style={{ width: `${scrollProgress}%` }} />
        </div>
          </header>

          {menuOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden bg-[#191919] text-white xl:hidden">
          <div className="absolute -end-32 top-20 h-96 w-96 rounded-full bg-[#df1f2d]/20 blur-3xl" />
          <div className="relative mx-auto flex h-full max-w-2xl flex-col px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-xl"><img src="/lf-logo.png" alt="" className="h-10 w-10 rounded-full object-cover" /></span>
                <span className="font-extrabold">{t.eyebrow}</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/[.04] transition hover:bg-white/10" aria-label={t.close}>
                <X size={20} />
              </button>
            </div>
            <form action="/news" className="mt-8 flex h-13 items-center gap-3 rounded-2xl border border-white/12 bg-white/[.06] px-4 focus-within:border-[#ff6570]/50">
              <Search size={18} className="shrink-0 text-white/45" />
              <input name="q" aria-label={lang === "ar" ? "البحث في الموقع" : lang === "fr" ? "Rechercher sur le site" : "Search the website"} placeholder={lang === "ar" ? "ابحث في الأخبار والبيانات…" : lang === "fr" ? "Rechercher dans les actualités…" : "Search news and statements…"} className="min-w-0 flex-1 bg-transparent text-[14px] font-bold text-white outline-none placeholder:text-white/32" />
            </form>
            <nav className="my-auto grid gap-2">
              {t.nav.map(([id, label], index) => (
                <button key={id} onClick={() => goTo(id)} className={"flex items-center justify-between rounded-2xl px-4 py-3 text-start text-[clamp(1.55rem,6vw,2.25rem)] font-extrabold transition " + (activeSection === id ? "bg-white text-[#191919]" : "hover:bg-white/[.06]")}>
                  <span>{label}</span>
                  <span className="text-[11px] font-bold text-[#ff6570]">{String(index + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </nav>
            <div className="text-[12px] font-normal text-white/35">Lebanese Forces · القوات اللبنانية</div>
          </div>
            </div>
          )}

          <section id="home" className="soft-grid relative isolate overflow-hidden pb-20 pt-4 sm:pb-28">
        <div className="absolute -start-56 top-8 -z-10 h-[560px] w-[560px] rounded-full bg-[#df1f2d]/10 blur-3xl" />
        <div className="absolute -end-64 bottom-0 -z-10 h-[520px] w-[520px] rounded-full bg-[#0b7740]/[.06] blur-3xl" />
        <div className="mx-auto grid min-h-[650px] max-w-[1380px] items-center gap-12 px-5 py-14 lg:grid-cols-[1.06fr_.94fr] lg:px-8 lg:py-20">
          <div className="max-w-[760px]" data-reveal>
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#df1f2d]/15 bg-white/75 px-4 py-2 text-[13px] font-extrabold text-[#df1f2d] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#df1f2d] shadow-[0_0_0_5px_rgba(223,31,45,.1)]" />
              {t.eyebrow}
            </div>
            <h1 className="display-title whitespace-pre-line text-[clamp(2.8rem,6vw,5.9rem)] font-extrabold leading-[1.06] tracking-[-0.045em] text-[#161616]">
              {t.title}
            </h1>
            <p className="mt-7 max-w-[680px] text-[17px] font-normal leading-8 text-black/58 sm:text-[19px] sm:leading-9">{t.intro}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button onClick={() => goTo("history")} className="group inline-flex min-h-13 items-center gap-4 rounded-full bg-[#191919] px-6 py-3 text-[14px] font-bold text-white shadow-[0_12px_32px_rgba(0,0,0,.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#df1f2d]">
                {t.historyCta}
                <ArrowLeft size={18} className={"transition-transform group-hover:-translate-x-1 " + (rtl ? "" : "rotate-180")} />
              </button>
              <button onClick={() => goTo("media")} className="inline-flex min-h-13 items-center gap-3 rounded-full border border-black/[.08] bg-white/80 px-6 py-3 text-[14px] font-bold shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#df1f2d] text-white">
                  <Play size={12} fill="currentColor" />
                </span>
                {t.mediaCta}
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[510px] lg:justify-self-end" data-reveal>
            <div className="absolute inset-8 rounded-[42%] bg-[#df1f2d] opacity-90 blur-[1px]" />
            <div className="absolute -inset-5 rounded-full border border-[#df1f2d]/10" />
            <div className="cedar-float glass relative aspect-square overflow-hidden rounded-[42px] p-7 sm:p-10">
              <img src={homepage.hero.imageUrl} alt={homepageText(homepage.hero.imageAlt, lang)} className="h-full w-full rounded-[30px] object-contain mix-blend-multiply" />
            </div>
            <div className="absolute -bottom-5 start-4 rounded-[20px] bg-[#191919] px-5 py-4 text-white shadow-2xl sm:start-0 sm:px-6 sm:py-5">
              <div className="text-2xl font-extrabold tabular-nums sm:text-3xl">1976</div>
              <div className="mt-1 text-[11px] font-normal text-white/55">{t.since}</div>
            </div>
            <div className="absolute -end-3 top-8 hidden h-16 w-16 place-items-center rounded-full bg-white shadow-xl sm:grid">
              <span className="h-3 w-3 rounded-full bg-[#0b7740] shadow-[0_0_0_8px_rgba(11,119,64,.09)]" />
            </div>
          </div>
        </div>
          </section>
        </>
      )}

      <section aria-label="Party facts" className="relative z-10 -mt-12 px-5 lg:px-8">
        <div className="glass mx-auto grid max-w-[1320px] grid-cols-2 gap-px overflow-hidden rounded-[26px] bg-black/[.06] p-px lg:grid-cols-4" data-reveal>
          {t.stats.map(([number, label]) => (
            <div key={label} className="bg-white/95 px-5 py-6 sm:px-7 sm:py-7">
              <div className="text-[28px] font-extrabold tabular-nums text-[#171717] sm:text-[32px]">{number}</div>
              <div className="mt-1 text-[12px] font-normal leading-5 text-black/45 sm:text-[13px]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="news" className="mx-auto max-w-[1380px] px-5 py-24 lg:px-8 lg:py-30">
        <div className="mb-10 flex items-end justify-between gap-5">
          <SectionHeading kicker={t.latestKicker} title={t.latest} description={t.newsText} />
          <a href="/news" className="hidden items-center gap-2 rounded-full border border-black/[.08] bg-white px-5 py-3 text-[13px] font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex">
            {t.allNews}
            <ArrowLeft size={16} className={rtl ? "" : "rotate-180"} />
          </a>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {(["statements", "positions", "party"] as const).map((channel) => (
            <NewsChannelPanel
              key={channel}
              channel={channel}
              stories={articlesByChannel[channel].slice(0, 3)}
              lang={lang}
              readLabel={t.read}
              browseLabel={t.browseSection}
              emptyLabel={t.noStories}
            />
          ))}
        </div>
      </section>

      <section id="diaspora" className="px-5 pb-12 lg:px-8 lg:pb-20">
        <div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[36px] bg-[#191919] px-6 py-14 text-white shadow-[0_30px_80px_rgba(0,0,0,.14)] sm:px-9 lg:px-14 lg:py-18">
          <div className="absolute -end-32 -top-36 h-96 w-96 rounded-full bg-[#df1f2d]/24 blur-3xl" />
          <div className="absolute -bottom-40 -start-28 h-80 w-80 rounded-full bg-[#0b7740]/16 blur-3xl" />
          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              kicker={articleChannelText("diaspora", lang)}
              title={text(newsChannelPresentation.diaspora.title, lang)}
              description={text(newsChannelPresentation.diaspora.description, lang)}
              light
            />
            <a href={articleChannelHref("diaspora")} className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[.06] px-5 py-3 text-[12px] font-extrabold text-white/70 transition hover:bg-white hover:text-[#191919]">{t.browseSection}<ArrowLeft size={15} className={rtl ? "" : "rotate-180"} /></a>
          </div>
          <div className="relative mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-reveal>
            {articlesByChannel.diaspora.length > 0 ? articlesByChannel.diaspora.slice(0, 3).map((article) => (
              <DiasporaStoryCard key={article.id} article={article} lang={lang} readLabel={t.read} />
            )) : (
              <div className="rounded-[24px] border border-white/[.08] bg-white/[.045] p-8 text-[13px] leading-7 text-white/45 md:col-span-2 lg:col-span-3">{t.noStories}</div>
            )}
          </div>
        </div>
      </section>

      <section className="px-5 pb-10 lg:px-8 lg:pb-16">
        <div className="relative mx-auto grid max-w-[1320px] gap-14 overflow-hidden rounded-[36px] bg-[#191919] px-6 py-16 text-white shadow-[0_30px_80px_rgba(0,0,0,.12)] sm:px-9 lg:grid-cols-[.82fr_1.18fr] lg:px-14 lg:py-20" data-reveal>
          <div className="absolute -end-32 -top-32 h-96 w-96 rounded-full bg-[#df1f2d]/20 blur-3xl" />
          <div className="absolute -bottom-40 -start-32 h-80 w-80 rounded-full bg-[#0b7740]/10 blur-3xl" />
          <SectionHeading kicker={t.visionKicker} title={t.visionTitle} description={t.visionText} light />
          <div className="relative grid gap-3 sm:grid-cols-3">
            {t.values.map(([title, body], index) => (
              <article key={title} className="group flex min-h-[245px] flex-col rounded-[24px] border border-white/[.07] bg-white/[.045] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#df1f2d]/45 hover:bg-white/[.075] lg:p-7">
                <div className="text-xs font-bold text-[#ff6570]">0{index + 1}</div>
                <h3 className="mt-auto text-[22px] font-extrabold">{title}</h3>
                <p className="mt-3 text-[14px] font-normal leading-7 text-white/52">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="history" className="mx-auto max-w-[1380px] px-5 py-24 lg:px-8 lg:py-30">
        <SectionHeading kicker={t.historyKicker} title={t.historyTitle} description={t.historyText} />
        <div className="soft-shadow mt-12 overflow-hidden rounded-[32px] border border-black/[.06] bg-white" data-reveal>
          <div className="scrollbar-none flex overflow-x-auto border-b border-black/[.06] p-3.5">
            {siteTimeline.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveYear(item.id)}
                aria-pressed={activeYear === item.id}
                className={"relative min-w-[100px] flex-1 rounded-2xl px-4 py-3.5 text-center transition duration-300 " + (activeYear === item.id ? "bg-[#df1f2d] text-white shadow-[0_10px_25px_rgba(223,31,45,.22)]" : "text-black/38 hover:bg-[#f4f4f1] hover:text-black")}
              >
                <span className="block text-[17px] font-extrabold tabular-nums">{item.year}</span>
              </button>
            ))}
          </div>
          <div className="relative grid min-h-[400px] items-stretch lg:grid-cols-[.54fr_1.46fr]" aria-live="polite">
            <div className="relative flex flex-col justify-between overflow-hidden bg-[#191919] p-8 text-white lg:p-11">
              <img key={currentTimeline.imageUrl} src={currentTimeline.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/48 to-black/18" />
              <span className="relative text-[clamp(4.2rem,10vw,8.5rem)] font-extrabold leading-none tracking-[-.06em] text-white drop-shadow-2xl">{currentTimeline.year}</span>
              <span className="arabic-safe relative mt-12 text-[11px] font-bold uppercase tracking-[.12em] text-white/35">{t.historyKicker}</span>
            </div>
            <div key={currentTimeline.id} className="timeline-enter flex flex-col justify-center p-8 lg:p-14">
              <div className="mb-7 grid h-12 w-12 place-items-center rounded-full bg-[#f3f3f0] text-[#df1f2d]">
                <Quote size={20} />
              </div>
              <h3 className="timeline-title text-[clamp(2rem,3.8vw,3.7rem)] font-extrabold leading-tight tracking-[-.035em]">{text(currentTimeline.title, lang)}</h3>
              <p className="mt-5 max-w-3xl text-[16px] font-normal leading-8 text-black/56 sm:text-[18px] sm:leading-9">{text(currentTimeline.body, lang)}</p>
              <div className="mt-9 flex gap-2">
                <button onClick={() => changeTimeline(rtl ? 1 : -1)} aria-label={rtl ? "المحطة السابقة" : lang === "fr" ? "Étape précédente" : "Previous milestone"} className="grid h-11 w-11 place-items-center rounded-full border border-black/[.08] bg-white text-black/60 transition hover:border-[#df1f2d] hover:bg-[#df1f2d] hover:text-white">
                  {rtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
                <button onClick={() => changeTimeline(rtl ? -1 : 1)} aria-label={rtl ? "المحطة التالية" : lang === "fr" ? "Étape suivante" : "Next milestone"} className="grid h-11 w-11 place-items-center rounded-full border border-black/[.08] bg-white text-black/60 transition hover:border-[#df1f2d] hover:bg-[#df1f2d] hover:text-white">
                  {rtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="president" className="px-5 py-10 lg:px-8 lg:py-16">
        <div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[36px] bg-[#191919] text-white shadow-[0_30px_85px_rgba(0,0,0,.15)]" data-reveal>
          <div className="absolute -end-32 -top-40 h-[520px] w-[520px] rounded-full bg-[#df1f2d]/30 blur-3xl" />
          <div className="relative grid items-stretch lg:grid-cols-[.92fr_1.08fr]">
          <div className="relative min-h-[500px] overflow-hidden bg-[#111] lg:min-h-[650px]">
            <img
              src={homepage.president.imageUrl}
              alt={homepageText(homepage.president.imageAlt, lang)}
              className="absolute inset-0 h-full w-full object-cover object-top grayscale transition duration-700 hover:scale-[1.025] hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 lg:p-10">
              <div className="text-[11px] font-normal text-white/48">{homepageText(homepage.president.imageCredit, lang)}</div>
            </div>
          </div>
          <div className="relative flex flex-col justify-center px-6 py-16 sm:px-9 lg:px-14 lg:py-20">
            <div className="arabic-safe mb-5 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[.12em] text-[#ff6570]"><span className="h-2 w-2 rounded-full bg-[#ff6570]" />{t.presidentKicker}</div>
            <h2 className="section-title text-[clamp(2.7rem,5.5vw,5.5rem)] font-extrabold leading-[1.08] tracking-[-.045em]">{t.presidentTitle}</h2>
            <p className="mt-4 text-[16px] font-bold text-white/66 sm:text-lg">{t.presidentRole}</p>
            <div className="mt-7 max-w-2xl space-y-4 text-[15px] font-normal leading-8 text-white/68 sm:text-[16px]">
              <p>{t.presidentBio}</p>
              <p>{t.presidentBio2}</p>
            </div>
            <a href="/samir-geagea" className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3 text-[13px] font-bold text-[#161616] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#df1f2d] hover:text-white">
              {t.bioLink}
              <ArrowLeft size={15} className={rtl ? "" : "rotate-180"} />
            </a>
            <div className="mt-5 flex gap-2">
              {[
                { mark: "𝕏", label: "X", href: homepage.president.socials.x },
                { mark: "◎", label: "Instagram", href: homepage.president.socials.instagram },
                { mark: "f", label: "Facebook", href: homepage.president.socials.facebook },
              ].filter((social) => social.href).map((social) => <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={`${t.presidentTitle} ${social.label}`} className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[.05] text-[12px] font-extrabold text-white/65 transition hover:border-white hover:bg-white hover:text-[#191919]">{social.mark}</a>)}
            </div>
            <div className="mt-10 grid gap-2 sm:grid-cols-3">
              {t.presidentFacts.map(([year, fact]) => (
                <div key={year} className="rounded-[18px] border border-white/[.07] bg-white/[.05] p-4">
                  <div className="text-xl font-extrabold tabular-nums text-[#ff6570]">{year}</div>
                  <div className="mt-1 text-[11px] font-normal leading-5 text-white/50">{fact}</div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </section>

      <section id="leadership" className="mx-auto max-w-[1380px] px-5 py-24 lg:px-8 lg:py-30">
        <SectionHeading kicker={t.leadershipKicker} title={t.leadershipTitle} description={t.leadershipText} />
        <div className="mt-10 grid gap-3 sm:grid-cols-3" data-reveal>
          {[
            { label: t.tabs[0], count: siteMinisters.length, people: siteMinisters },
            { label: t.tabs[1], count: siteMps.length, people: siteMps },
            { label: t.tabs[2], count: 11, people: [] },
          ].map((preview, previewIndex) => (
            <button key={preview.label} type="button" onClick={() => setLeadershipOpen(true)} className="group flex min-h-[128px] items-center justify-between gap-4 rounded-[24px] border border-black/[.07] bg-white p-5 text-start shadow-[0_8px_30px_rgba(0,0,0,.035)] transition hover:-translate-y-0.5 hover:border-[#df1f2d]/30 hover:shadow-lg">
              <span><span className="block text-[28px] font-extrabold tabular-nums text-[#df1f2d]">{preview.count}</span><span className="mt-1 block text-[13px] font-extrabold">{preview.label}</span></span>
              {preview.people.length ? (
                <span className="flex -space-x-3 rtl:space-x-reverse">{preview.people.slice(0, 3).map((person) => <img key={person.slug} src={person.imageUrl} alt="" className="h-12 w-12 rounded-full border-2 border-white object-cover object-top shadow-sm" />)}</span>
              ) : (
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[#f3f3f0] text-[#df1f2d]"><Users size={21} /></span>
              )}
              <span className="sr-only">{previewIndex + 1}</span>
            </button>
          ))}
        </div>
        <Collapsible open={leadershipOpen} onOpenChange={setLeadershipOpen} className="mt-4">
          <CollapsibleTrigger className="group flex w-full items-center justify-between gap-5 rounded-[24px] border border-black/[.07] bg-white px-5 py-5 text-start shadow-[0_10px_35px_rgba(0,0,0,.045)] transition hover:border-[#df1f2d]/25 hover:shadow-[0_18px_45px_rgba(0,0,0,.08)] sm:px-7">
            <span className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#191919] text-white transition group-hover:bg-[#df1f2d]"><Users size={20} /></span>
              <span>
                <span className="block text-[16px] font-extrabold">{leadershipOpen ? t.collapseLeadership : t.expandLeadership}</span>
                <span className="mt-1 block text-[12px] font-normal text-black/40">{t.tabs.join(" · ")}</span>
              </span>
            </span>
            <ChevronDown size={20} className={`shrink-0 text-black/38 transition-transform duration-300 ${leadershipOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Tabs defaultValue="cabinet" dir={rtl ? "rtl" : "ltr"} className="mt-7">
              <TabsList className="scrollbar-none h-auto w-full justify-start gap-2 overflow-x-auto rounded-[22px] border border-black/[.06] bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,.035)]">
                <TabsTrigger value="cabinet" className="h-11 min-w-fit rounded-2xl border-0 px-5 text-[13px] font-bold data-[state=active]:bg-[#df1f2d] data-[state=active]:text-white data-[state=active]:shadow-[0_8px_22px_rgba(223,31,45,.2)]">{t.tabs[0]}</TabsTrigger>
                <TabsTrigger value="parliament" className="h-11 min-w-fit rounded-2xl border-0 px-5 text-[13px] font-bold data-[state=active]:bg-[#df1f2d] data-[state=active]:text-white data-[state=active]:shadow-[0_8px_22px_rgba(223,31,45,.2)]">{t.tabs[1]}</TabsTrigger>
                <TabsTrigger value="executive" className="h-11 min-w-fit rounded-2xl border-0 px-5 text-[13px] font-bold data-[state=active]:bg-[#df1f2d] data-[state=active]:text-white data-[state=active]:shadow-[0_8px_22px_rgba(223,31,45,.2)]">{t.tabs[2]}</TabsTrigger>
              </TabsList>
              <TabsContent value="cabinet" className="mt-7">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {siteMinisters.map((person, index) => (
                    <PersonCard key={person.slug} person={person} lang={lang} role={t.minister} index={index} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="parliament" className="mt-7">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {siteMps.map((person, index) => (
                    <PersonCard key={person.slug} person={person} lang={lang} role={t.mp} index={index} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="executive" className="mt-7">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {executiveRegions.map((group, index) => (
                    <ExecutiveRegionCard key={text(group.region, lang)} region={text(group.region, lang)} members={group.members.map((member) => text(member, lang))} label={t.committeeMember} index={index} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            <p className="mt-6 text-[12px] font-normal leading-6 text-black/38">{t.listed}</p>
          </CollapsibleContent>
        </Collapsible>
      </section>

      <section id="publications" className="mx-auto max-w-[1380px] px-5 py-24 lg:px-8 lg:py-30">
        <SectionHeading kicker={t.publicationsKicker} title={t.publicationsTitle} description={t.publicationsText} />
        <div className="mt-12 grid gap-4 lg:grid-cols-3" data-reveal>
          {publicationLibraries.map((library, index) => {
            const Icon = library.icon;
            const count = media.documents.filter((document) => document.section === library.section).length;
            return (
              <a key={library.section} href={`/publications/${library.section}`} target="_blank" rel="noreferrer" className="group flex min-h-[310px] flex-col overflow-hidden rounded-[30px] border border-black/[.07] bg-white p-7 shadow-[0_12px_38px_rgba(0,0,0,.045)] transition duration-300 hover:-translate-y-1 hover:border-[#191919] hover:bg-[#191919] hover:text-white hover:shadow-[0_25px_65px_rgba(0,0,0,.15)] lg:p-8">
                <div className="flex items-start justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f3f3f0] text-[#df1f2d] transition group-hover:bg-[#df1f2d] group-hover:text-white"><Icon size={22} /></span>
                  <span className="text-xs font-extrabold text-black/22 group-hover:text-white/28">0{index + 1}</span>
                </div>
                <div className="mt-auto pt-14">
                  <h3 className="section-title text-[clamp(1.7rem,2.8vw,2.55rem)] font-extrabold leading-[1.25]">{text(library.title, lang)}</h3>
                  <p className="mt-3 text-[13px] leading-7 text-black/45 group-hover:text-white/48">{text(library.description, lang)}</p>
                  <div className="mt-7 flex items-center justify-between border-t border-black/[.07] pt-5 text-[12px] font-extrabold group-hover:border-white/12">
                    <span>{lang === "ar" ? `عرض ${count} مستندات` : lang === "fr" ? `Voir ${count} documents` : `View ${count} documents`}</span>
                    <ArrowUpLeft size={16} />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section id="media" className="relative overflow-hidden bg-[#191919] text-white">
        <div className="absolute -end-56 top-28 h-[520px] w-[520px] rounded-full bg-[#df1f2d]/12 blur-3xl" />
        <div className="relative mx-auto max-w-[1380px] px-5 py-24 lg:px-8 lg:py-30">
          <SectionHeading kicker={t.mediaKicker} title={t.mediaTitle} description={t.mediaText} light />
          <div className="mt-12 grid gap-5 lg:grid-cols-[.92fr_1.08fr]" data-reveal>
            <div className="rounded-[30px] bg-gradient-to-br from-[#e52b39] to-[#b91320] p-7 shadow-[0_24px_60px_rgba(0,0,0,.22)] lg:p-9">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Music2 size={22} /><h3 className="text-[22px] font-extrabold">{t.songs}</h3></div>
                <span className="text-[10px] font-bold tracking-[.14em] text-white/45">AUDIO</span>
              </div>
              <p className="mt-2 text-[13px] font-normal text-white/58">{t.songHint}</p>
              <div className="mt-8 space-y-2">
                {tracks.map((track, index) => (
                  <button key={track.id} onClick={() => setActiveTrack(index)} className={"flex w-full items-center justify-between rounded-2xl p-4 text-start transition duration-300 " + (activeTrack === index ? "bg-white text-[#171717] shadow-lg" : "bg-black/12 text-white hover:bg-black/20")}>
                    <span className="flex items-center gap-3">
                      <span className={"grid h-9 w-9 place-items-center rounded-full " + (activeTrack === index ? "bg-[#171717] text-white" : "bg-white/13")}><Play size={13} fill="currentColor" /></span>
                      <span className="text-[13px] font-bold">{mediaText(track.title, lang)}</span>
                    </span>
                    <span className="text-[11px] font-bold opacity-40">0{index + 1}</span>
                  </button>
                ))}
              </div>
              {tracks[activeTrack] && <audio key={tracks[activeTrack].audioUrl} controls preload="none" className="mt-7 w-full"><source src={tracks[activeTrack].audioUrl} type="audio/mpeg" /></audio>}
            </div>

            <a href={media.officialYouTubeUrl} target="_blank" rel="noreferrer" className="group relative min-h-[430px] overflow-hidden rounded-[30px] border border-white/[.07] bg-white/[.045] p-7 transition duration-300 hover:border-white/15 hover:bg-white/[.065] lg:p-9">
              <div className="absolute -end-24 -top-24 h-80 w-80 rounded-full bg-[#df1f2d]/35 blur-2xl transition duration-700 group-hover:scale-110" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><Video size={22} /><span className="text-[13px] font-bold">{t.videos}</span></div>
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#171717] shadow-xl transition group-hover:bg-[#df1f2d] group-hover:text-white"><Play size={17} fill="currentColor" /></span>
                </div>
                <div className="mt-auto max-w-xl pt-24">
                  <h3 className="section-title text-[clamp(2.1rem,4.2vw,4.2rem)] font-extrabold leading-[1.12] tracking-[-.035em]">{t.videoTitle}</h3>
                  <p className="mt-5 max-w-lg text-[14px] font-normal leading-7 text-white/50">{t.videoText}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold">{t.viewVideos}<ArrowUpLeft size={16} /></div>
                </div>
              </div>
            </a>
          </div>

          <div className="mt-16 flex items-end justify-between gap-5">
            <h3 className="text-3xl font-extrabold">{t.photos}</h3>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3" data-reveal>
            {photos.map((photo, index) => (
              <button key={photo.id} onClick={() => setSelectedPhoto(index)} className="group relative aspect-[4/3] overflow-hidden rounded-[24px] bg-white/5 text-start shadow-[0_16px_45px_rgba(0,0,0,.18)] ring-1 ring-white/[.06]">
                <img src={photo.imageUrl} alt={mediaText(photo.title, lang)} className={`h-full w-full transition duration-700 group-hover:scale-105 ${photo.fit === "contain" ? "bg-white p-8 object-contain" : "object-cover grayscale group-hover:grayscale-0"}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-bold text-[#ff6570]"><ImageIcon size={13} />0{index + 1}</div>
                  <div className="text-[15px] font-bold leading-6">{mediaText(photo.title, lang)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="soft-grid px-5 py-24 lg:px-8 lg:py-30">
        <div className="mx-auto grid max-w-[1180px] items-start gap-10 lg:grid-cols-[.68fr_1.32fr]">
          <SectionHeading kicker={homepageText(homepage.interfaceText.contactKicker, lang)} title={homepageText(homepage.interfaceText.contactTitle, lang)} description={homepageText(homepage.interfaceText.contactText, lang)} />
          <ContactForm lang={lang} />
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#101010] text-white">
        <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <div className="flex items-center gap-4">
                <img src="/lf-logo.png" alt="" className="h-16 w-16 rounded-full bg-white object-cover" />
                <div>
                  <div className="text-xl font-extrabold">القوات اللبنانية</div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-[.14em] text-white/35">Lebanese Forces</div>
                </div>
              </div>
              <p className="section-title mt-7 max-w-xl text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold leading-tight text-white/90">{t.footerLine}</p>
            </div>
            <div className="lg:justify-self-end">
              <div className="text-[11px] font-bold uppercase tracking-[.14em] text-white/35">Social media</div>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  { mark: "f", label: "Facebook", href: homepage.socials.facebook },
                  { mark: "◎", label: "Instagram", href: homepage.socials.instagram },
                  { mark: "𝕏", label: "X", href: homepage.socials.x },
                  { mark: "▶", label: "YouTube", href: homepage.socials.youtube || media.officialYouTubeUrl },
                ].map(({ mark, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-12 w-12 place-items-center rounded-full border border-white/14 text-white/70 transition hover:-translate-y-0.5 hover:border-[#df1f2d] hover:bg-[#df1f2d] hover:text-white">
                    <span className="text-[16px] font-extrabold">{mark}</span>
                  </a>
                ))}
              </div>
              <a href={homepage.socials.newsWebsite} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-[13px] font-bold text-white/60 hover:text-white">{t.official}<ExternalLink size={15} /></a>
            </div>
          </div>
          <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs font-bold text-white/32 sm:flex-row">
            <span>© 2026 Lebanese Forces</span>
            <span>{t.rights}</span>
          </div>
        </div>
      </footer>

      <Dialog open={selectedPhoto !== null} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent dir={rtl ? "rtl" : "ltr"} className="max-w-5xl overflow-hidden border-white/10 bg-[#121212] p-0 text-white sm:max-w-5xl">
          {selectedPhoto !== null && (
            <>
              <div className="max-h-[70vh] overflow-hidden bg-black">
                <img src={photos[selectedPhoto].imageUrl} alt={mediaText(photos[selectedPhoto].title, lang)} className={`max-h-[70vh] w-full object-contain ${photos[selectedPhoto].fit === "contain" ? "bg-white p-10" : ""}`} />
              </div>
              <DialogHeader className="p-6 text-start">
                <DialogTitle className="text-xl font-extrabold">{mediaText(photos[selectedPhoto].title, lang)}</DialogTitle>
                <DialogDescription className="text-white/45">{photos[selectedPhoto].credit}</DialogDescription>
                <a href={photos[selectedPhoto].sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-[13px] font-bold text-[#ff6570]">{t.source}<ExternalLink size={14} /></a>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function Home() {
  return <HomePage />;
}
