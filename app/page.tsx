"use client";

import {
  ArrowLeft,
  ArrowUpLeft,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  ImageIcon,
  Landmark,
  MapPin,
  Menu,
  Music2,
  Play,
  Quote,
  Users,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import type { Article } from "@/lib/article-types";
import { articleHref, articleText, formatArticleDate } from "@/lib/article-types";
import type { HomepageContent } from "@/lib/homepage-types";
import { homepageText } from "@/lib/homepage-types";

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
      ["publications", "المنشورات"],
      ["media", "الميديا"],
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
      ["16", "نائباً في البرلمان"],
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
    tabs: ["الهيئة التنفيذية", "الكتلة النيابية", "الكتلة الوزارية"],
    committeeMember: "عضو منتخب في الهيئة التنفيذية",
    vicePresident: "نائب رئيس الحزب",
    mp: "نائب في المجلس النيابي",
    minister: "وزير في الحكومة اللبنانية",
    listed: "أعضاء الهيئة التنفيذية بحسب نتائج الانتخابات المباشرة، والكتلتان النيابية والوزارية بحسب القوائم الحالية.",
    newsKicker: "متابعة",
    newsTitle: "أخبار ومواقف",
    newsText: "أحدث النشاطات والمواقف والملفات من الموقع الرسمي للقوات اللبنانية.",
    read: "اقرأ الخبر",
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
      ["publications", "Publications"],
      ["media", "Media"],
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
      ["16", "Members of Parliament"],
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
    tabs: ["Executive Committee", "Parliamentary bloc", "Ministerial bloc"],
    committeeMember: "Elected Executive Committee member",
    vicePresident: "Party vice president",
    mp: "Member of Parliament",
    minister: "Minister in the Lebanese government",
    listed: "Executive Committee members follow the direct-election results; parliamentary and ministerial blocs follow the current lists.",
    newsKicker: "Follow",
    newsTitle: "News and positions",
    newsText: "The latest party activity, positions and public affairs from the official news platform.",
    read: "Read article",
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
      ["publications", "Publications"],
      ["media", "Médias"],
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
      ["16", "Députés au Parlement"],
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
    tabs: ["Comité exécutif", "Bloc parlementaire", "Bloc ministériel"],
    committeeMember: "Membre élu du Comité exécutif",
    vicePresident: "Vice-président du parti",
    mp: "Député au Parlement",
    minister: "Ministre du gouvernement libanais",
    listed: "Les membres du Comité exécutif suivent les résultats du vote direct; les blocs parlementaire et ministériel suivent les listes actuelles.",
    newsKicker: "Suivre",
    newsTitle: "Actualités et positions",
    newsText: "Les dernières activités, positions et affaires publiques depuis la plateforme officielle.",
    read: "Lire l’article",
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

const timeline: { year: string; title: Localized; body: Localized }[] = [
  {
    year: "1976",
    title: { ar: "التأسيس", en: "Founding", fr: "Fondation" },
    body: {
      ar: "إنشاء صيغة توحيدية لأحزاب الجبهة اللبنانية حملت اسم «القوات اللبنانية» بقيادة الشيخ بشير الجميّل.",
      en: "A unified structure bringing together parties of the Lebanese Front was formed under the name “Lebanese Forces,” led by Bachir Gemayel.",
      fr: "Une structure unifiée regroupant les partis du Front libanais est créée sous le nom de « Forces Libanaises », dirigée par Bachir Gemayel.",
    },
  },
  {
    year: "1978",
    title: { ar: "حرب المئة يوم", en: "Hundred Days’ War", fr: "Guerre des Cent Jours" },
    body: {
      ar: "اندلاع حرب المئة يوم في الأشرفية بعد توقيف بشير الجميّل على حاجز للجيش السوري.",
      en: "The Hundred Days’ War erupted in Achrafieh following Bachir Gemayel’s detention at a Syrian army checkpoint.",
      fr: "La Guerre des Cent Jours éclate à Achrafieh après l’arrestation de Bachir Gemayel à un barrage de l’armée syrienne.",
    },
  },
  {
    year: "1981",
    title: { ar: "معركة زحلة", en: "Battle of Zahle", fr: "Bataille de Zahlé" },
    body: {
      ar: "واجهت زحلة حصاراً وقصفاً قاسياً، وشكّلت المعركة محطة أساسية في مقاومة الوجود السوري.",
      en: "Zahle endured a severe siege and bombardment, marking a defining moment in resistance to the Syrian presence.",
      fr: "Zahlé subit un siège et des bombardements intenses, une étape majeure de la résistance à la présence syrienne.",
    },
  },
  {
    year: "1982",
    title: { ar: "بشير رئيساً", en: "Bachir elected president", fr: "Bachir élu président" },
    body: {
      ar: "انتُخب بشير الجميّل رئيساً للجمهورية في 23 آب، ثم اغتيل في 14 أيلول قبل تسلّمه مهامه.",
      en: "Bachir Gemayel was elected President of the Republic on 23 August and assassinated on 14 September before taking office.",
      fr: "Bachir Gemayel est élu président de la République le 23 août, puis assassiné le 14 septembre avant son entrée en fonction.",
    },
  },
  {
    year: "1986",
    title: { ar: "قيادة سمير جعجع", en: "Geagea’s leadership", fr: "Direction de Samir Geagea" },
    body: {
      ar: "تسلّم سمير جعجع قيادة القوات اللبنانية بعد إسقاط الاتفاق الثلاثي، وأطلق ورشة تنظيمية وسياسية وإعلامية واسعة.",
      en: "Samir Geagea assumed leadership after the Tripartite Accord was overturned and launched broad organizational, political and media development.",
      fr: "Samir Geagea prend la direction après l’abandon de l’Accord tripartite et lance une vaste réorganisation politique et médiatique.",
    },
  },
  {
    year: "1989",
    title: { ar: "اتفاق الطائف", en: "Taif Agreement", fr: "Accord de Taëf" },
    body: {
      ar: "وافقت القوات على اتفاق الطائف، ثم حلّت جناحها العسكري طوعاً وانتقلت إلى العمل السياسي.",
      en: "The Lebanese Forces endorsed the Taif Agreement, voluntarily dissolved its military wing and moved into political action.",
      fr: "Les Forces Libanaises approuvent l’Accord de Taëf, dissolvent volontairement leur branche militaire et passent à l’action politique.",
    },
  },
  {
    year: "1994",
    title: { ar: "الحل والاعتقال", en: "Dissolution and arrest", fr: "Dissolution et arrestation" },
    body: {
      ar: "حُلّ الحزب في 23 آذار واعتُقل سمير جعجع في 21 نيسان، لتبدأ مرحلة أحد عشر عاماً من المقاومة السياسية.",
      en: "The party was dissolved on 23 March and Samir Geagea arrested on 21 April, beginning eleven years of political resistance.",
      fr: "Le parti est dissous le 23 mars et Samir Geagea arrêté le 21 avril, ouvrant onze années de résistance politique.",
    },
  },
  {
    year: "2005",
    title: { ar: "ثورة الأرز والحرية", en: "Cedar Revolution and freedom", fr: "Révolution du Cèdre et liberté" },
    body: {
      ar: "شارك الحزب في ثورة الأرز، انسحب الجيش السوري من لبنان، وأقرّ مجلس النواب قانون العفو الذي أعاد جعجع إلى الحرية.",
      en: "The party took part in the Cedar Revolution, the Syrian army withdrew, and Parliament adopted the amnesty law that freed Geagea.",
      fr: "Le parti participe à la Révolution du Cèdre, l’armée syrienne se retire et le Parlement adopte la loi d’amnistie libérant Geagea.",
    },
  },
  {
    year: "2012",
    title: { ar: "الشرعة والنظام", en: "Charter and internal system", fr: "Charte et règlement" },
    body: {
      ar: "إعلان شرعة الحزب واعتماد نظام داخلي متطوّر، مع فتح باب الانتساب وتكريس المسار المؤسساتي.",
      en: "The party charter and a modern internal system were adopted, opening membership and consolidating institutional development.",
      fr: "La charte et un règlement intérieur moderne sont adoptés, ouvrant l’adhésion et renforçant l’institutionnalisation.",
    },
  },
  {
    year: "2023",
    title: { ar: "انتخابات حزبية مباشرة", en: "Direct party elections", fr: "Élections internes directes" },
    body: {
      ar: "أُجريت أول انتخابات حزبية مباشرة لاختيار رئيس الحزب ونائبه وأعضاء الهيئة التنفيذية.",
      en: "The first direct internal elections were held to choose the party president, vice president and Executive Committee.",
      fr: "Les premières élections internes directes sont organisées pour choisir le président, le vice-président et le Comité exécutif.",
    },
  },
  {
    year: "2025",
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

const mps: { name: Localized; district: Localized }[] = [
  { name: { ar: "ستريدا جعجع", en: "Sethrida Geagea", fr: "Sethrida Geagea" }, district: { ar: "بشري", en: "Bsharri", fr: "Bécharré" } },
  { name: { ar: "جورج عدوان", en: "Georges Adwan", fr: "Georges Adwan" }, district: { ar: "الشوف", en: "Chouf", fr: "Chouf" } },
  { name: { ar: "أنطوان حبشي", en: "Antoine Habchi", fr: "Antoine Habchi" }, district: { ar: "بعلبك الهرمل", en: "Baalbek–Hermel", fr: "Baalbek–Hermel" } },
  { name: { ar: "ملحم الرياشي", en: "Melhem Riachy", fr: "Melhem Riachy" }, district: { ar: "المتن", en: "Metn", fr: "Metn" } },
  { name: { ar: "رازي الحاج", en: "Razi El Hage", fr: "Razi El Hage" }, district: { ar: "المتن", en: "Metn", fr: "Metn" } },
  { name: { ar: "نزيه متّى", en: "Nazih Matta", fr: "Nazih Matta" }, district: { ar: "عاليه", en: "Aley", fr: "Aley" } },
  { name: { ar: "بيار بو عاصي", en: "Pierre Bou Assi", fr: "Pierre Bou Assi" }, district: { ar: "بعبدا", en: "Baabda", fr: "Baabda" } },
  { name: { ar: "غادة أيوب", en: "Ghada Ayoub", fr: "Ghada Ayoub" }, district: { ar: "جزين", en: "Jezzine", fr: "Jezzine" } },
  { name: { ar: "جورج عقيص", en: "Georges Okais", fr: "Georges Okais" }, district: { ar: "زحلة", en: "Zahle", fr: "Zahlé" } },
  { name: { ar: "إلياس اسطفان", en: "Elias Stephan", fr: "Elias Stephan" }, district: { ar: "زحلة", en: "Zahle", fr: "Zahlé" } },
  { name: { ar: "إلياس الخوري", en: "Elias Khoury", fr: "Elias Khoury" }, district: { ar: "طرابلس", en: "Tripoli", fr: "Tripoli" } },
  { name: { ar: "غياث يزبك", en: "Ghayath Yazbeck", fr: "Ghayath Yazbeck" }, district: { ar: "البترون", en: "Batroun", fr: "Batroun" } },
  { name: { ar: "فادي كرم", en: "Fadi Karam", fr: "Fadi Karam" }, district: { ar: "الكورة", en: "Koura", fr: "Koura" } },
  { name: { ar: "غسان حاصباني", en: "Ghassan Hasbani", fr: "Ghassan Hasbani" }, district: { ar: "بيروت الأولى", en: "Beirut I", fr: "Beyrouth I" } },
  { name: { ar: "زياد الحواط", en: "Ziad Hawat", fr: "Ziad Hawat" }, district: { ar: "جبيل", en: "Byblos", fr: "Jbeil" } },
  { name: { ar: "شوقي الدكاش", en: "Chawki Daccache", fr: "Chawki Daccache" }, district: { ar: "كسروان", en: "Keserwan", fr: "Kesrouan" } },
];

const ministers: { name: Localized; portfolio: Localized }[] = [
  {
    name: { ar: "يوسف رجّي", en: "Youssef Raji", fr: "Youssef Raji" },
    portfolio: { ar: "الخارجية والمغتربين", en: "Foreign Affairs and Emigrants", fr: "Affaires étrangères et Émigrés" },
  },
  {
    name: { ar: "جو صدّي", en: "Joe Saddi", fr: "Joe Saddi" },
    portfolio: { ar: "الطاقة والمياه", en: "Energy and Water", fr: "Énergie et Eau" },
  },
  {
    name: { ar: "جو عيسى الخوري", en: "Joe Issa El Khoury", fr: "Joe Issa El Khoury" },
    portfolio: { ar: "الصناعة", en: "Industry", fr: "Industrie" },
  },
  {
    name: { ar: "كمال شحادة", en: "Kamal Shehadeh", fr: "Kamal Shehadeh" },
    portfolio: {
      ar: "المهجّرين ووزير دولة لشؤون التكنولوجيا والذكاء الاصطناعي",
      en: "Displaced Affairs and Minister of State for Technology and AI",
      fr: "Déplacés et ministre d’État chargé de la Technologie et de l’IA",
    },
  },
];

const publications = [
  {
    icon: FileText,
    title: { ar: "النظام الداخلي", en: "Internal Regulations", fr: "Règlement intérieur" },
    detail: { ar: "36 صفحة", en: "36 pages", fr: "36 pages" },
    href: "https://www.lstatic.org/PDF/lf-internal-regulation.pdf",
    pdf: true,
  },
  {
    icon: BookOpen,
    title: { ar: "شرعة الحزب", en: "Party Charter", fr: "Charte du parti" },
    detail: { ar: "22 صفحة", en: "22 pages", fr: "22 pages" },
    href: "https://www.lstatic.org/PDF/choraa.pdf",
    pdf: true,
  },
  {
    icon: Landmark,
    title: { ar: "أوراق ووثائق", en: "Papers and Documents", fr: "Documents et archives" },
    detail: { ar: "الأرشيف السياسي", en: "Political archive", fr: "Archives politiques" },
    href: "https://www.lebanese-forces.com/category/archives/documents/",
    pdf: false,
  },
  {
    icon: Building2,
    title: { ar: "Economic Brief", en: "Economic Brief", fr: "Economic Brief" },
    detail: { ar: "تحليلات اقتصادية", en: "Economic analysis", fr: "Analyses économiques" },
    href: "https://www.lebanese-forces.com/category/economic-brief/",
    pdf: false,
  },
];

const tracks = [
  {
    title: { ar: "نشيد القوات اللبنانية", en: "Lebanese Forces Anthem", fr: "Hymne des Forces Libanaises" },
    src: "https://www.lstatic.org/music/lebanese-forces-anthem.mp3",
  },
  {
    title: { ar: "نشيد الشهداء", en: "Martyrs’ Anthem", fr: "Hymne des martyrs" },
    src: "https://www.lstatic.org/music/nashid-alshouhada.mp3",
  },
  {
    title: { ar: "مشوار الحرية", en: "Journey of Freedom", fr: "Le chemin de la liberté" },
    src: "https://www.lstatic.org/music/meshwar-alhoriyi.mp3",
  },
];

const photos = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/1/18/Samir_Geagea_-_1988.jpg",
    title: { ar: "سمير جعجع عام 1988", en: "Samir Geagea in 1988", fr: "Samir Geagea en 1988" },
    credit: "Wikimedia Commons · Public domain",
    href: "https://commons.wikimedia.org/wiki/File:Samir_Geagea_-_1988.jpg",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/09/Secretary_Pompeo_Meets_With_Samir_Geagea.jpg",
    title: { ar: "لقاء دولي في واشنطن، 2019", en: "International meeting in Washington, 2019", fr: "Rencontre internationale à Washington, 2019" },
    credit: "U.S. Department of State · Public domain",
    href: "https://commons.wikimedia.org/wiki/File:Secretary_Pompeo_Meets_With_Samir_Geagea.jpg",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Pierre_Bou_Assi%2C_Lebanese_Minister_for_Social_Affairs_-_P036791007501-878207.jpg",
    title: { ar: "بيار بو عاصي في لقاء أوروبي، 2018", en: "Pierre Bou Assi at a European meeting, 2018", fr: "Pierre Bou Assi lors d’une rencontre européenne, 2018" },
    credit: "European Commission / Lukasz Kobus · CC BY 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Pierre_Bou_Assi,_Lebanese_Minister_for_Social_Affairs_-_P036791007501-878207.jpg",
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
  name,
  role,
  detail,
  index,
}: {
  name: string;
  role: string;
  detail?: string;
  index: number;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");

  return (
    <article className="group flex min-h-[176px] flex-col rounded-[22px] border border-black/[.07] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,.035)] transition duration-300 hover:-translate-y-1 hover:border-[#df1f2d]/30 hover:shadow-[0_20px_50px_rgba(0,0,0,.09)]" data-reveal>
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f4f4f1] text-sm font-extrabold text-[#df1f2d] transition group-hover:bg-[#df1f2d] group-hover:text-white">{initials}</span>
        <span className="text-[11px] font-bold tabular-nums text-black/22">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="mt-auto pt-5">
        <h3 className="text-[17px] font-extrabold leading-7">{name}</h3>
        <p className="mt-1.5 text-[13px] font-normal leading-6 text-black/45">{detail || role}</p>
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

export default function Home() {
  const [lang, setLang] = useState<Lang>("ar");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeYear, setActiveYear] = useState("1976");
  const [activeTrack, setActiveTrack] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [articles, setArticles] = useState<Article[]>(
    () => [...(seedArticleData as Article[])].sort(
      (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
    ),
  );
  const [homepage, setHomepage] = useState<HomepageContent>(
    seedHomepageData as HomepageContent,
  );
  const t = {
    ...ui[lang],
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
  const currentTimeline = useMemo(
    () => timeline.find((item) => item.year === activeYear) || timeline[0],
    [activeYear],
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [lang, rtl]);

  useEffect(() => {
    let active = true;
    fetch("/api/articles", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load articles")))
      .then((data) => {
        const payload = data as { articles?: Article[] };
        if (active && payload.articles?.length) setArticles(payload.articles);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/homepage", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load homepage content")))
      .then((data) => {
        const payload = data as { content?: HomepageContent };
        if (active && payload.content) setHomepage(payload.content);
      })
      .catch(() => undefined);
    return () => {
      active = false;
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
    const currentIndex = timeline.findIndex((item) => item.year === activeYear);
    const nextIndex = (currentIndex + direction + timeline.length) % timeline.length;
    setActiveYear(timeline[nextIndex].year);
  };

  return (
    <main dir={rtl ? "rtl" : "ltr"} className="min-h-screen overflow-x-hidden bg-[#f7f7f5] text-[#171717]">
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
            {t.nav.map(([id, label], index) => (
              <button
                key={id}
                onClick={() => goTo(id)}
                className={"relative py-2 text-[13px] font-bold transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:mx-auto after:h-0.5 after:rounded-full after:bg-[#df1f2d] after:transition-all hover:text-[#df1f2d] " + (activeSection === id ? "text-[#df1f2d] after:w-full" : "text-black/58 after:w-0")}
              >
                {label}
              </button>
            ))}
          </nav>

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
        <div className="grid gap-5 lg:grid-cols-[1.16fr_.84fr]" data-reveal>
          <a href={articleHref(articles[0])} target={articles[0].externalUrl ? "_blank" : undefined} rel={articles[0].externalUrl ? "noreferrer" : undefined} className="group relative min-h-[500px] overflow-hidden rounded-[32px] bg-[#191919] shadow-[0_24px_70px_rgba(0,0,0,.12)]">
            <img src={articles[0].imageUrl} alt={articleText(articles[0].imageAlt, lang)} className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-[1.035]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9 lg:p-11">
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#ff6570]">
                <span className="h-2 w-2 rounded-full bg-[#ff4350]" />
                {articleText(articles[0].category, lang)} · {formatArticleDate(articles[0].publishedAt, lang)}
              </div>
              <h3 className="section-title mt-4 max-w-3xl text-[clamp(2rem,4vw,3.55rem)] font-extrabold leading-[1.25] tracking-[-.025em]">{articleText(articles[0].title, lang)}</h3>
              <div className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold">{t.read}<ArrowUpLeft size={17} /></div>
            </div>
          </a>
          <div className="grid gap-3">
            {articles.slice(1, 4).map((story) => (
              <a key={story.id} href={articleHref(story)} target={story.externalUrl ? "_blank" : undefined} rel={story.externalUrl ? "noreferrer" : undefined} className="group flex min-h-[154px] items-center justify-between gap-5 rounded-[24px] border border-black/[.07] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,.035)] transition duration-300 hover:-translate-y-0.5 hover:border-[#df1f2d]/25 hover:shadow-[0_18px_45px_rgba(0,0,0,.08)] sm:p-6">
                <div>
                  <div className="text-[11px] font-bold text-[#df1f2d]">{articleText(story.category, lang)} · {formatArticleDate(story.publishedAt, lang)}</div>
                  <h3 className="mt-3 text-[16px] font-extrabold leading-7 sm:text-[18px]">{articleText(story.title, lang)}</h3>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f4f4f1] text-black/55 transition group-hover:bg-[#df1f2d] group-hover:text-white">
                  <ArrowUpLeft size={16} className={rtl ? "" : "-rotate-90"} />
                </span>
              </a>
            ))}
            <a href="/news" className="flex items-center justify-center gap-2 rounded-full border border-black/[.08] bg-white px-5 py-3 text-[13px] font-bold sm:hidden">
              {t.allNews}
              <ArrowLeft size={16} className={rtl ? "" : "rotate-180"} />
            </a>
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
            {timeline.map((item) => (
              <button
                key={item.year}
                onClick={() => setActiveYear(item.year)}
                aria-pressed={activeYear === item.year}
                className={"relative min-w-[100px] flex-1 rounded-2xl px-4 py-3.5 text-center transition duration-300 " + (activeYear === item.year ? "bg-[#df1f2d] text-white shadow-[0_10px_25px_rgba(223,31,45,.22)]" : "text-black/38 hover:bg-[#f4f4f1] hover:text-black")}
              >
                <span className="block text-[17px] font-extrabold tabular-nums">{item.year}</span>
              </button>
            ))}
          </div>
          <div className="relative grid min-h-[400px] items-stretch lg:grid-cols-[.54fr_1.46fr]" aria-live="polite">
            <div className="relative flex flex-col justify-between overflow-hidden bg-[#191919] p-8 text-white lg:p-11">
              <div className="absolute -bottom-24 -start-24 h-72 w-72 rounded-full bg-[#df1f2d]/20 blur-3xl" />
              <span className="relative text-[clamp(4.2rem,10vw,8.5rem)] font-extrabold leading-none tracking-[-.06em] text-[#ed2a38]">{currentTimeline.year}</span>
              <span className="arabic-safe relative mt-12 text-[11px] font-bold uppercase tracking-[.12em] text-white/35">{t.historyKicker}</span>
            </div>
            <div key={currentTimeline.year} className="timeline-enter flex flex-col justify-center p-8 lg:p-14">
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
        <Tabs defaultValue="executive" dir={rtl ? "rtl" : "ltr"} className="mt-11">
          <TabsList className="scrollbar-none h-auto w-full justify-start gap-2 overflow-x-auto rounded-[22px] border border-black/[.06] bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,.035)]" variant="line">
            <TabsTrigger value="executive" className="h-11 min-w-fit rounded-2xl border-0 px-5 text-[13px] font-bold data-[state=active]:bg-[#df1f2d] data-[state=active]:text-white data-[state=active]:shadow-[0_8px_22px_rgba(223,31,45,.2)]">{t.tabs[0]}</TabsTrigger>
            <TabsTrigger value="parliament" className="h-11 min-w-fit rounded-2xl border-0 px-5 text-[13px] font-bold data-[state=active]:bg-[#df1f2d] data-[state=active]:text-white data-[state=active]:shadow-[0_8px_22px_rgba(223,31,45,.2)]">{t.tabs[1]}</TabsTrigger>
            <TabsTrigger value="cabinet" className="h-11 min-w-fit rounded-2xl border-0 px-5 text-[13px] font-bold data-[state=active]:bg-[#df1f2d] data-[state=active]:text-white data-[state=active]:shadow-[0_8px_22px_rgba(223,31,45,.2)]">{t.tabs[2]}</TabsTrigger>
          </TabsList>
          <TabsContent value="executive" className="mt-7">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {executiveRegions.map((group, index) => (
                <ExecutiveRegionCard
                  key={text(group.region, lang)}
                  region={text(group.region, lang)}
                  members={group.members.map((member) => text(member, lang))}
                  label={t.committeeMember}
                  index={index}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="parliament" className="mt-7">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {mps.map((person, index) => (
                <PersonCard key={text(person.name, lang)} name={text(person.name, lang)} role={t.mp} detail={text(person.district, lang)} index={index} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="cabinet" className="mt-7">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ministers.map((person, index) => (
                <PersonCard key={text(person.name, lang)} name={text(person.name, lang)} role={t.minister} detail={text(person.portfolio, lang)} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        <p className="mt-6 text-[12px] font-normal leading-6 text-black/38">{t.listed}</p>
      </section>

      <section id="publications" className="mx-auto max-w-[1380px] px-5 py-24 lg:px-8 lg:py-30">
        <SectionHeading kicker={t.publicationsKicker} title={t.publicationsTitle} description={t.publicationsText} />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {publications.map((item, index) => {
            const Icon = item.icon;
            return (
              <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="group flex min-h-[310px] flex-col rounded-[26px] border border-black/[.07] bg-white p-7 shadow-[0_8px_30px_rgba(0,0,0,.035)] transition duration-300 hover:-translate-y-1 hover:border-[#191919] hover:bg-[#191919] hover:text-white hover:shadow-[0_22px_55px_rgba(0,0,0,.13)] lg:p-8">
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-[#f3f3f0] text-[#df1f2d] transition group-hover:bg-[#df1f2d] group-hover:text-white"><Icon size={20} /></span>
                  <span className="text-xs font-bold text-black/22 group-hover:text-white/25">0{index + 1}</span>
                </div>
                <div className="mt-auto">
                  <h3 className="text-[21px] font-extrabold leading-8">{text(item.title, lang)}</h3>
                  <div className="mt-2 text-[13px] font-normal text-black/42 group-hover:text-white/42">{text(item.detail, lang)}</div>
                  <div className="mt-6 flex items-center justify-between border-t border-black/[.07] pt-5 text-[13px] font-bold group-hover:border-white/12">
                    <span>{item.pdf ? t.download : t.open}</span>
                    {item.pdf ? <Download size={17} /> : <ExternalLink size={17} />}
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
                  <button key={track.src} onClick={() => setActiveTrack(index)} className={"flex w-full items-center justify-between rounded-2xl p-4 text-start transition duration-300 " + (activeTrack === index ? "bg-white text-[#171717] shadow-lg" : "bg-black/12 text-white hover:bg-black/20")}>
                    <span className="flex items-center gap-3">
                      <span className={"grid h-9 w-9 place-items-center rounded-full " + (activeTrack === index ? "bg-[#171717] text-white" : "bg-white/13")}><Play size={13} fill="currentColor" /></span>
                      <span className="text-[13px] font-bold">{text(track.title, lang)}</span>
                    </span>
                    <span className="text-[11px] font-bold opacity-40">0{index + 1}</span>
                  </button>
                ))}
              </div>
              <audio key={tracks[activeTrack].src} controls preload="none" className="mt-7 w-full">
                <source src={tracks[activeTrack].src} type="audio/mpeg" />
              </audio>
              <a href="https://www.lebanese-forces.com/media/" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-[12px] font-bold text-white/70 hover:text-white">
                {t.open}
                <ExternalLink size={14} />
              </a>
            </div>

            <a href="https://www.lebanese-forces.com/category/videos/" target="_blank" rel="noreferrer" className="group relative min-h-[430px] overflow-hidden rounded-[30px] border border-white/[.07] bg-white/[.045] p-7 transition duration-300 hover:border-white/15 hover:bg-white/[.065] lg:p-9">
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
            <a href="https://www.lebanese-forces.com/lebanese-forces-photo-gallery/" target="_blank" rel="noreferrer" className="hidden items-center gap-2 text-[13px] font-bold text-white/60 hover:text-white sm:flex">{t.photoArchive}<ExternalLink size={15} /></a>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3" data-reveal>
            {photos.map((photo, index) => (
              <button key={photo.src} onClick={() => setSelectedPhoto(index)} className="group relative aspect-[4/3] overflow-hidden rounded-[24px] bg-white/5 text-start shadow-[0_16px_45px_rgba(0,0,0,.18)] ring-1 ring-white/[.06]">
                <img src={photo.src} alt={text(photo.title, lang)} className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-bold text-[#ff6570]"><ImageIcon size={13} />0{index + 1}</div>
                  <div className="text-[15px] font-bold leading-6">{text(photo.title, lang)}</div>
                </div>
              </button>
            ))}
          </div>
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
                  { mark: "f", label: "Facebook", href: "https://www.facebook.com/LFPartyOfficial/" },
                  { mark: "◎", label: "Instagram", href: "https://www.instagram.com/lfpartyofficial/" },
                  { mark: "𝕏", label: "X", href: "https://x.com/LFPartyOfficial" },
                  { mark: "▶", label: "YouTube", href: "https://www.youtube.com/@lebaneseforcesmedia" },
                ].map(({ mark, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-12 w-12 place-items-center rounded-full border border-white/14 text-white/70 transition hover:-translate-y-0.5 hover:border-[#df1f2d] hover:bg-[#df1f2d] hover:text-white">
                    <span className="text-[16px] font-extrabold">{mark}</span>
                  </a>
                ))}
              </div>
              <a href="https://www.lebanese-forces.com/" target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-[13px] font-bold text-white/60 hover:text-white">{t.official}<ExternalLink size={15} /></a>
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
                <img src={photos[selectedPhoto].src} alt={text(photos[selectedPhoto].title, lang)} className="max-h-[70vh] w-full object-contain" />
              </div>
              <DialogHeader className="p-6 text-start">
                <DialogTitle className="text-xl font-extrabold">{text(photos[selectedPhoto].title, lang)}</DialogTitle>
                <DialogDescription className="text-white/45">{photos[selectedPhoto].credit}</DialogDescription>
                <a href={photos[selectedPhoto].href} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-[13px] font-bold text-[#ff6570]">{t.source}<ExternalLink size={14} /></a>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
