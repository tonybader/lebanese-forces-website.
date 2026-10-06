export type ProfileLanguage = "ar" | "en" | "fr";

export type LocalizedProfileText = {
  ar: string;
  en: string;
  fr: string;
};

export type PublicProfile = {
  slug: string;
  group: "mp" | "minister";
  name: LocalizedProfileText;
  office: LocalizedProfileText;
  imageUrl: string;
  socials?: {
    x?: string;
    instagram?: string;
    facebook?: string;
  };
  summary: LocalizedProfileText;
  bio?: LocalizedProfileText;
  highlights: LocalizedProfileText[];
  aliases: string[];
  sourceUrl: string;
};

const lpImage = (filename: string) =>
  `https://www.lp.gov.lb/backoffice/uploads/images/${encodeURIComponent(filename)}`;

const mpSource = (id: number) => `https://www.lp.gov.lb/MemberDetails.aspx?Id=${id}`;

export const mps: PublicProfile[] = [
  {
    slug: "sethrida-geagea",
    group: "mp",
    name: { ar: "ستريدا جعجع", en: "Sethrida Geagea", fr: "Sethrida Geagea" },
    office: { ar: "نائبة عن بشري", en: "MP for Bsharri", fr: "Députée de Bécharré" },
    imageUrl: "https://imagescdn.mtv.com.lb/articles/649172227072.jpg?quality=90&width=768",
    socials: {
      x: "https://x.com/SethridaGeagea",
      instagram: "https://www.instagram.com/sethridageagea_official/",
    },
    summary: {
      ar: "نائبة عن قضاء بشري وعضو في تكتل الجمهورية القوية، انتُخبت للمرة الأولى عام 2005.",
      en: "MP for Bsharri and a member of the Strong Republic bloc, first elected in 2005.",
      fr: "Députée de Bécharré et membre du bloc de la République forte, élue pour la première fois en 2005.",
    },
    highlights: [
      { ar: "حائزة إجازة في العلوم السياسية من الجامعة اللبنانية الأميركية.", en: "Holds a degree in political science from the Lebanese American University.", fr: "Titulaire d’un diplôme en sciences politiques de la Lebanese American University." },
      { ar: "ناشطة في مبادرات إنمائية وثقافية وصحية في قضاء بشري.", en: "Active in development, cultural and health initiatives across Bsharri.", fr: "Active dans des initiatives de développement, culturelles et sanitaires à Bécharré." },
    ],
    aliases: ["ستريدا طوق", "ستريدا جعجع", "Sethrida Geagea", "Strida Geagea"],
    sourceUrl: mpSource(63),
  },
  {
    slug: "georges-adwan",
    group: "mp",
    name: { ar: "جورج عدوان", en: "Georges Adwan", fr: "Georges Adwan" },
    office: { ar: "نائب عن الشوف", en: "MP for Chouf", fr: "Député du Chouf" },
    imageUrl: "https://imagescdn.mtv.com.lb/articles/549~Georges-Adwan1.jpg?quality=90&width=768",
    socials: {
      x: "https://x.com/GeorgesAdwan",
      facebook: "https://www.facebook.com/GeorgesAdwanOfficial/",
    },
    summary: { ar: "نائب عن قضاء الشوف ونائب رئيس حزب القوات اللبنانية وعضو تكتل الجمهورية القوية.", en: "MP for Chouf, vice president of the Lebanese Forces and member of the Strong Republic bloc.", fr: "Député du Chouf, vice-président des Forces Libanaises et membre du bloc de la République forte." },
    highlights: [
      { ar: "محامٍ وأحد مؤسسي القوات اللبنانية.", en: "A lawyer and one of the founders of the Lebanese Forces.", fr: "Avocat et l’un des fondateurs des Forces Libanaises." },
      { ar: "يتولى مسؤوليات نيابية وحزبية في الملفات التشريعية والدستورية.", en: "Works on legislative and constitutional files through parliamentary and party responsibilities.", fr: "Actif sur les dossiers législatifs et constitutionnels dans ses fonctions parlementaires et partisanes." },
    ],
    aliases: ["جورج عدوان", "Georges Adwan", "George Adwan"],
    sourceUrl: mpSource(104),
  },
  {
    slug: "antoine-habchi",
    group: "mp",
    name: { ar: "أنطوان حبشي", en: "Antoine Habchi", fr: "Antoine Habchi" },
    office: { ar: "نائب عن بعلبك ـ الهرمل", en: "MP for Baalbek–Hermel", fr: "Député de Baalbek–Hermel" },
    imageUrl: "https://imagescdn.mtv.com.lb/articles/098507278145.jpg?quality=90&width=768",
    socials: { x: "https://x.com/antoinebhabchi" },
    summary: { ar: "نائب عن دائرة بعلبك ـ الهرمل وعضو في تكتل الجمهورية القوية.", en: "MP for Baalbek–Hermel and a member of the Strong Republic bloc.", fr: "Député de Baalbek–Hermel et membre du bloc de la République forte." },
    highlights: [
      { ar: "يتابع ملفات المنطقة الإنمائية والخدماتية من خلال عمله النيابي.", en: "Follows the region’s development and public-service files through parliamentary work.", fr: "Suit les dossiers de développement et de services publics de la région dans son travail parlementaire." },
      { ar: "عضو في كتلة القوات اللبنانية النيابية منذ عام 2018.", en: "Member of the Lebanese Forces parliamentary bloc since 2018.", fr: "Membre du bloc parlementaire des Forces Libanaises depuis 2018." },
    ],
    aliases: ["أنطوان حبشي", "انطوان حبشي", "Antoine Habchi"],
    sourceUrl: mpSource(275),
  },
  {
    slug: "melhem-riachy",
    group: "mp",
    name: { ar: "ملحم الرياشي", en: "Melhem Riachy", fr: "Melhem Riachy" },
    office: { ar: "نائب عن المتن", en: "MP for Metn", fr: "Député du Metn" },
    imageUrl: "https://imagescdn.mtv.com.lb/articles/612968111690.jpg?quality=90&width=768",
    socials: { x: "https://x.com/MelhemRiachy" },
    summary: { ar: "نائب عن قضاء المتن، وزير إعلام سابق وعضو في تكتل الجمهورية القوية.", en: "MP for Metn, former minister of information and member of the Strong Republic bloc.", fr: "Député du Metn, ancien ministre de l’Information et membre du bloc de la République forte." },
    highlights: [
      { ar: "كاتب وصحافي وباحث في شؤون الشرق الأوسط والأديان المقارنة.", en: "Writer, journalist and researcher on the Middle East and comparative religion.", fr: "Écrivain, journaliste et chercheur sur le Moyen-Orient et les religions comparées." },
      { ar: "تولى حقيبة الإعلام بين عامي 2016 و2019.", en: "Served as minister of information from 2016 to 2019.", fr: "A exercé les fonctions de ministre de l’Information de 2016 à 2019." },
    ],
    aliases: ["ملحم الرياشي", "Melhem Riachy", "Melhem Riachi"],
    sourceUrl: mpSource(392),
  },
  {
    slug: "razi-el-hage",
    group: "mp",
    name: { ar: "رازي الحاج", en: "Razi El Hage", fr: "Razi El Hage" },
    office: { ar: "نائب عن المتن", en: "MP for Metn", fr: "Député du Metn" },
    imageUrl: "https://imagescdn.mtv.com.lb/articles/602048599682.jpg?quality=90&width=768",
    socials: { x: "https://x.com/RaziElHage" },
    summary: { ar: "نائب عن قضاء المتن وعضو في تكتل الجمهورية القوية.", en: "MP for Metn and a member of the Strong Republic bloc.", fr: "Député du Metn et membre du bloc de la République forte." },
    highlights: [
      { ar: "درس العلوم الاقتصادية والسياسية وتابع دراسات عليا في الاقتصاد.", en: "Studied economics and political science and pursued postgraduate study in economics.", fr: "A étudié les sciences économiques et politiques, puis poursuivi des études supérieures en économie." },
      { ar: "له نشاط سياسي ومدني في قضاء المتن.", en: "Active in political and civic work in the Metn district.", fr: "Actif dans la vie politique et civique du Metn." },
    ],
    aliases: ["رازي الحاج", "Razi El Hage", "Razi Hage"],
    sourceUrl: mpSource(361),
  },
  {
    slug: "nazih-matta",
    group: "mp",
    name: { ar: "نزيه متّى", en: "Nazih Matta", fr: "Nazih Matta" },
    office: { ar: "نائب عن عاليه", en: "MP for Aley", fr: "Député d’Aley" },
    imageUrl: "https://imagescdn.mtv.com.lb/articles/227125912629.jpg?quality=90&width=768",
    socials: {
      x: "https://x.com/MattaNzh",
      facebook: "https://www.facebook.com/MattaNzh/",
    },
    summary: { ar: "نائب عن قضاء عاليه وعضو في تكتل الجمهورية القوية.", en: "MP for Aley and a member of the Strong Republic bloc.", fr: "Député d’Aley et membre du bloc de la République forte." },
    highlights: [
      { ar: "مهندس معماري خرّيج الجامعة اللبنانية.", en: "Architect and graduate of the Lebanese University.", fr: "Architecte diplômé de l’Université libanaise." },
      { ar: "يتابع ملفات قضاء عاليه الإنمائية والتشريعية.", en: "Follows development and legislative files concerning the Aley district.", fr: "Suit les dossiers de développement et législatifs du district d’Aley." },
    ],
    aliases: ["نزيه متى", "نزيه متّى", "Nazih Matta"],
    sourceUrl: mpSource(395),
  },
  {
    slug: "pierre-bou-assi",
    group: "mp",
    name: { ar: "بيار بو عاصي", en: "Pierre Bou Assi", fr: "Pierre Bou Assi" },
    office: { ar: "نائب عن بعبدا", en: "MP for Baabda", fr: "Député de Baabda" },
    imageUrl: "https://imagescdn.mtv.com.lb/articles/128~Pierre-Bou-Assi2.jpg?quality=90&width=768",
    socials: { x: "https://x.com/PierreBouAssi" },
    summary: { ar: "نائب عن قضاء بعبدا، وزير شؤون اجتماعية سابق وعضو في تكتل الجمهورية القوية.", en: "MP for Baabda, former minister of social affairs and member of the Strong Republic bloc.", fr: "Député de Baabda, ancien ministre des Affaires sociales et membre du bloc de la République forte." },
    highlights: [
      { ar: "تولى وزارة الشؤون الاجتماعية بين عامي 2016 و2019.", en: "Served as minister of social affairs from 2016 to 2019.", fr: "A exercé les fonctions de ministre des Affaires sociales de 2016 à 2019." },
      { ar: "ترأس جهاز العلاقات الخارجية في القوات اللبنانية.", en: "Previously headed the Lebanese Forces foreign-relations department.", fr: "A auparavant dirigé le département des relations extérieures des Forces Libanaises." },
    ],
    aliases: ["بيار بو عاصي", "Pierre Bou Assi", "Pierre Bouassi"],
    sourceUrl: mpSource(330),
  },
  {
    slug: "ghada-ayoub",
    group: "mp",
    name: { ar: "غادة أيوب", en: "Ghada Ayoub", fr: "Ghada Ayoub" },
    office: { ar: "نائبة عن جزين", en: "MP for Jezzine", fr: "Députée de Jezzine" },
    imageUrl: "https://imagescdn.mtv.com.lb/articles/779~ghada-ayoub.jpg?quality=90&width=768",
    socials: { x: "https://x.com/DrGhadaAyoub" },
    summary: { ar: "نائبة عن قضاء جزين وعضو في تكتل الجمهورية القوية.", en: "MP for Jezzine and a member of the Strong Republic bloc.", fr: "Députée de Jezzine et membre du bloc de la République forte." },
    highlights: [
      { ar: "محامية وأستاذة جامعية متخصصة في القانون العام والمالي.", en: "Lawyer and university professor specializing in public and financial law.", fr: "Avocate et professeure universitaire spécialisée en droit public et financier." },
      { ar: "لها خبرة في التربية المدنية وبناء السلام وحقوق الإنسان.", en: "Experienced in civic education, peacebuilding and human rights.", fr: "Expérimentée en éducation civique, consolidation de la paix et droits humains." },
    ],
    aliases: ["غادة أيوب", "غاده أيوب", "Ghada Ayoub"],
    sourceUrl: mpSource(378),
  },
  {
    slug: "georges-okais",
    group: "mp",
    name: { ar: "جورج عقيص", en: "Georges Okais", fr: "Georges Okais" },
    office: { ar: "نائب عن زحلة", en: "MP for Zahle", fr: "Député de Zahlé" },
    imageUrl: "https://imagescdn.mtv.com.lb/articles/180814040810557~george.jpg?quality=90&width=768",
    socials: { x: "https://x.com/OkaisGeorge" },
    summary: { ar: "نائب عن قضاء زحلة وعضو في تكتل الجمهورية القوية.", en: "MP for Zahle and a member of the Strong Republic bloc.", fr: "Député de Zahlé et membre du bloc de la République forte." },
    highlights: [
      { ar: "قاضٍ سابق وأستاذ في القانون.", en: "Former judge and lecturer in law.", fr: "Ancien juge et enseignant en droit." },
      { ar: "له خبرة في العمل القضائي والاستشارات القانونية.", en: "Experienced in judicial work and legal advisory roles.", fr: "Expérimenté dans le travail judiciaire et le conseil juridique." },
    ],
    aliases: ["جورج عقيص", "Georges Okais", "George Okais"],
    sourceUrl: mpSource(260),
  },
  {
    slug: "elias-stephan",
    group: "mp",
    name: { ar: "إلياس اسطفان", en: "Elias Stephan", fr: "Elias Stephan" },
    office: { ar: "نائب عن زحلة", en: "MP for Zahle", fr: "Député de Zahlé" },
    imageUrl: "https://imagescdn.mtv.com.lb/articles/204969256700.jpg?quality=90&width=768",
    socials: {
      x: "https://x.com/eliasastephan",
      instagram: "https://www.instagram.com/eliedstephan/",
    },
    summary: { ar: "نائب عن قضاء زحلة وعضو في تكتل الجمهورية القوية.", en: "MP for Zahle and a member of the Strong Republic bloc.", fr: "Député de Zahlé et membre du bloc de la République forte." },
    highlights: [
      { ar: "محامٍ ومؤسس شريك لمكاتب محاماة في لبنان والإمارات.", en: "Lawyer and founding partner of legal practices in Lebanon and the UAE.", fr: "Avocat et associé fondateur de cabinets au Liban et aux Émirats arabes unis." },
      { ar: "يتابع قضايا زحلة والبقاع في المجلس النيابي.", en: "Follows Zahle and Bekaa issues in Parliament.", fr: "Suit les dossiers de Zahlé et de la Békaa au Parlement." },
    ],
    aliases: ["إلياس اسطفان", "الياس اسطفان", "Elias Stephan"],
    sourceUrl: mpSource(347),
  },
  {
    slug: "elias-khoury",
    group: "mp",
    name: { ar: "إلياس الخوري", en: "Elias Khoury", fr: "Elias Khoury" },
    office: { ar: "نائب عن طرابلس", en: "MP for Tripoli", fr: "Député de Tripoli" },
    imageUrl: "https://imagescdn.mtv.com.lb/articles/150575970053.jpg?quality=90&width=768",
    socials: { x: "https://x.com/elie_al_khoury" },
    summary: { ar: "نائب عن مدينة طرابلس وعضو في تكتل الجمهورية القوية.", en: "MP for Tripoli and a member of the Strong Republic bloc.", fr: "Député de Tripoli et membre du bloc de la République forte." },
    highlights: [
      { ar: "رجل أعمال عمل في قطاع التأمين قبل انتخابه نائباً عام 2022.", en: "Businessman with experience in insurance before his election in 2022.", fr: "Homme d’affaires actif dans l’assurance avant son élection en 2022." },
      { ar: "يتابع الملفات الإنمائية والاقتصادية لمدينة طرابلس.", en: "Follows Tripoli’s development and economic files.", fr: "Suit les dossiers de développement et économiques de Tripoli." },
    ],
    aliases: ["إلياس الخوري", "الياس الخوري", "Elias Khoury"],
    sourceUrl: mpSource(348),
  },
  {
    slug: "ghayath-yazbeck",
    group: "mp",
    name: { ar: "غياث يزبك", en: "Ghayath Yazbeck", fr: "Ghayath Yazbeck" },
    office: { ar: "نائب عن البترون", en: "MP for Batroun", fr: "Député du Batroun" },
    imageUrl: "https://imagescdn.mtv.com.lb/articles/770086194963.jpg?quality=90&width=768",
    socials: { x: "https://x.com/GhayathYazbeck" },
    summary: { ar: "نائب عن قضاء البترون وعضو في تكتل الجمهورية القوية.", en: "MP for Batroun and a member of the Strong Republic bloc.", fr: "Député du Batroun et membre du bloc de la République forte." },
    highlights: [
      { ar: "صحافي وإعلامي عمل في التحرير والإنتاج والتغطية الميدانية.", en: "Journalist and media professional with editorial, production and reporting experience.", fr: "Journaliste et professionnel des médias, expérimenté en rédaction, production et reportage." },
      { ar: "يتابع ملفات السيادة والبيئة والإنماء في عمله النيابي.", en: "Works on sovereignty, environmental and development files in Parliament.", fr: "Travaille sur les dossiers de souveraineté, d’environnement et de développement au Parlement." },
    ],
    aliases: ["غياث يزبك", "Ghayath Yazbeck", "Ghiyath Yazbeck"],
    sourceUrl: mpSource(375),
  },
  {
    slug: "fadi-karam",
    group: "mp",
    name: { ar: "فادي كرم", en: "Fadi Karam", fr: "Fadi Karam" },
    office: { ar: "نائب عن الكورة", en: "MP for Koura", fr: "Député du Koura" },
    imageUrl: "https://imagescdn.mtv.com.lb/articles/98777777.jpg?quality=90&width=768",
    socials: { x: "https://x.com/drFadiKaram" },
    summary: { ar: "نائب عن قضاء الكورة وعضو في تكتل الجمهورية القوية.", en: "MP for Koura and a member of the Strong Republic bloc.", fr: "Député du Koura et membre du bloc de la République forte." },
    highlights: [
      { ar: "طبيب أسنان وحائز اختصاصاً في جراحة الفم.", en: "Dentist with specialist training in oral surgery.", fr: "Dentiste spécialisé en chirurgie orale." },
      { ar: "له مسار طويل في العمل السياسي والحزبي والنيابي.", en: "Has a long record of political, party and parliamentary work.", fr: "Dispose d’un long parcours politique, partisan et parlementaire." },
    ],
    aliases: ["فادي كرم", "Fadi Karam"],
    sourceUrl: mpSource(257),
  },
  {
    slug: "ghassan-hasbani",
    group: "mp",
    name: { ar: "غسان حاصباني", en: "Ghassan Hasbani", fr: "Ghassan Hasbani" },
    office: { ar: "نائب عن بيروت الأولى", en: "MP for Beirut I", fr: "Député de Beyrouth I" },
    imageUrl: "https://imagescdn.mtv.com.lb/articles/239888705143.jpg?quality=90&width=768",
    socials: { x: "https://x.com/GhassanHasbani" },
    summary: { ar: "نائب عن بيروت الأولى ونائب رئيس حكومة ووزير صحة سابق وعضو تكتل الجمهورية القوية.", en: "MP for Beirut I, former deputy prime minister and health minister, and member of the Strong Republic bloc.", fr: "Député de Beyrouth I, ancien vice-premier ministre et ministre de la Santé, membre du bloc de la République forte." },
    highlights: [
      { ar: "مهندس وحائز ماجستير في إدارة الأعمال من المملكة المتحدة.", en: "Engineer with an MBA from the United Kingdom.", fr: "Ingénieur titulaire d’un MBA obtenu au Royaume-Uni." },
      { ar: "له خبرة تنفيذية دولية في الإدارة والتكنولوجيا والاتصالات.", en: "Has international executive experience in management, technology and telecommunications.", fr: "Possède une expérience internationale de direction en gestion, technologie et télécommunications." },
    ],
    aliases: ["غسان حاصباني", "Ghassan Hasbani", "Ghassan Hasbany"],
    sourceUrl: mpSource(372),
  },
  {
    slug: "ziad-hawat",
    group: "mp",
    name: { ar: "زياد الحواط", en: "Ziad Hawat", fr: "Ziad Hawat" },
    office: { ar: "نائب عن جبيل", en: "MP for Jbeil", fr: "Député de Jbeil" },
    imageUrl: "https://imagescdn.mtv.com.lb/articles/190704114243091~444.jpg?quality=90&width=768",
    socials: {
      x: "https://x.com/ziad_hawat",
      instagram: "https://www.instagram.com/ziadhawatofficial/",
    },
    summary: { ar: "نائب عن قضاء جبيل وعضو في تكتل الجمهورية القوية.", en: "MP for Jbeil and a member of the Strong Republic bloc.", fr: "Député de Jbeil et membre du bloc de la République forte." },
    highlights: [
      { ar: "تولى رئاسة بلدية جبيل قبل انتقاله إلى العمل النيابي.", en: "Served as mayor of Byblos before entering Parliament.", fr: "A été maire de Byblos avant son entrée au Parlement." },
      { ar: "يركز على الإدارة المحلية والإنماء والخدمات العامة.", en: "Focuses on local governance, development and public services.", fr: "Se concentre sur la gouvernance locale, le développement et les services publics." },
    ],
    aliases: ["زياد الحواط", "زياد حواط", "Ziad Hawat"],
    sourceUrl: mpSource(283),
  },
  {
    slug: "chawki-daccache",
    group: "mp",
    name: { ar: "شوقي الدكاش", en: "Chawki Daccache", fr: "Chawki Daccache" },
    office: { ar: "نائب عن كسروان", en: "MP for Keserwan", fr: "Député du Kesrouan" },
    imageUrl: "https://imagescdn.mtv.com.lb/articles/181203043553196~666.jpg?quality=90&width=768",
    socials: { x: "https://x.com/chaoukidaccache" },
    summary: { ar: "نائب عن قضاء كسروان وعضو في تكتل الجمهورية القوية.", en: "MP for Keserwan and a member of the Strong Republic bloc.", fr: "Député du Kesrouan et membre du bloc de la République forte." },
    highlights: [
      { ar: "انخرط في العمل العام والسياسي منذ سنوات الحرب.", en: "Has been involved in public and political work since the war years.", fr: "Engagé dans l’action publique et politique depuis les années de guerre." },
      { ar: "يتابع ملفات كسروان الإنمائية والخدماتية.", en: "Follows development and public-service files in Keserwan.", fr: "Suit les dossiers de développement et de services publics du Kesrouan." },
    ],
    aliases: ["شوقي الدكاش", "Chawki Daccache", "Shawki Daccache"],
    sourceUrl: mpSource(286),
  },
  {
    slug: "jihad-pakradouni",
    group: "mp",
    name: { ar: "جهاد بقرادوني", en: "Jihad Pakradouni", fr: "Jihad Pakradouni" },
    office: { ar: "نائب عن بيروت الأولى", en: "MP for Beirut I", fr: "Député de Beyrouth I" },
    imageUrl: "https://imagescdn.mtv.com.lb/articles/537447~Jihad-Pakradouni.jpg?quality=90&width=768",
    socials: { x: "https://x.com/JihadPakradouni" },
    summary: { ar: "نائب عن بيروت الأولى وعضو في تكتل الجمهورية القوية.", en: "MP for Beirut I and a member of the Strong Republic bloc.", fr: "Député de Beyrouth I et membre du bloc de la République forte." },
    highlights: [
      { ar: "له خبرة في الأعمال والشؤون الاقتصادية.", en: "Has a professional background in business and economic affairs.", fr: "Possède une expérience professionnelle dans les affaires et les questions économiques." },
      { ar: "ناشط في مبادرات مدنية واجتماعية في بيروت.", en: "Active in civic and social initiatives in Beirut.", fr: "Actif dans des initiatives civiques et sociales à Beyrouth." },
    ],
    aliases: ["جهاد بقرادوني", "جهاد باقرادوني", "Jihad Pakradouni", "Jihad Bakradouni"],
    sourceUrl: mpSource(354),
  },
  {
    slug: "said-al-asmar",
    group: "mp",
    name: { ar: "سعيد الأسمر", en: "Said Al Asmar", fr: "Said Al Asmar" },
    office: { ar: "نائب عن جزين", en: "MP for Jezzine", fr: "Député de Jezzine" },
    imageUrl: lpImage("سعيد الأسمر.jpg"),
    socials: {
      x: "https://x.com/said_el_asmar",
      instagram: "https://www.instagram.com/said.el.asmar/",
      facebook: "https://www.facebook.com/selasmar/",
    },
    summary: { ar: "نائب عن قضاء جزين وعضو في تكتل الجمهورية القوية.", en: "MP for Jezzine and a member of the Strong Republic bloc.", fr: "Député de Jezzine et membre du bloc de la République forte." },
    highlights: [
      { ar: "يتابع الشؤون الإنمائية والاقتصادية في جزين والجنوب.", en: "Follows development and economic affairs in Jezzine and South Lebanon.", fr: "Suit les questions de développement et économiques à Jezzine et au Liban-Sud." },
      { ar: "انتُخب عضواً في مجلس النواب عام 2022.", en: "Elected to Parliament in 2022.", fr: "Élu au Parlement en 2022." },
    ],
    aliases: ["سعيد الأسمر", "سعيد الاسمر", "Said Al Asmar", "Said Asmar"],
    sourceUrl: mpSource(368),
  },
  {
    slug: "camille-chamoun",
    group: "mp",
    name: { ar: "كميل شمعون", en: "Camille Chamoun", fr: "Camille Chamoun" },
    office: { ar: "نائب عن بعبدا", en: "MP for Baabda", fr: "Député de Baabda" },
    imageUrl: lpImage("كميل شمعون.jpg"),
    socials: { x: "https://x.com/CamilleDChamoun" },
    summary: { ar: "نائب عن قضاء بعبدا وعضو في تكتل الجمهورية القوية ورئيس حزب الوطنيين الأحرار.", en: "MP for Baabda, member of the Strong Republic bloc and president of the National Liberal Party.", fr: "Député de Baabda, membre du bloc de la République forte et président du Parti national libéral." },
    highlights: [
      { ar: "ينشط في الملفات السيادية والسياسية وفي شؤون قضاء بعبدا.", en: "Active on sovereignty, political and Baabda district issues.", fr: "Actif sur les dossiers de souveraineté, politiques et ceux du district de Baabda." },
      { ar: "انتُخب عضواً في مجلس النواب عام 2022.", en: "Elected to Parliament in 2022.", fr: "Élu au Parlement en 2022." },
    ],
    aliases: ["كميل شمعون", "Camille Chamoun", "Kamil Chamoun"],
    sourceUrl: mpSource(394),
  },
];

export const ministers: PublicProfile[] = [
  {
    slug: "youssef-rajji",
    group: "minister",
    name: { ar: "يوسف رجّي", en: "Youssef Raji", fr: "Youssef Raji" },
    office: { ar: "وزير الخارجية والمغتربين", en: "Minister of Foreign Affairs and Emigrants", fr: "Ministre des Affaires étrangères et des Émigrés" },
    imageUrl: "https://www.lstatic.org/UserFiles/images/2017/lf/lf-leaders/2018/Youssef-Rajji.jpg",
    socials: { x: "https://x.com/YoussefRaggi" },
    summary: { ar: "دبلوماسي لبناني يتولى وزارة الخارجية والمغتربين في حكومة الرئيس نواف سلام.", en: "Lebanese diplomat serving as minister of foreign affairs and emigrants in Prime Minister Nawaf Salam’s cabinet.", fr: "Diplomate libanais, ministre des Affaires étrangères et des Émigrés dans le gouvernement de Nawaf Salam." },
    highlights: [
      { ar: "حائز ماجستيراً في العلوم السياسية والإدارية من جامعة القديس يوسف.", en: "Holds a master’s degree in political and administrative sciences from Saint Joseph University.", fr: "Titulaire d’un master en sciences politiques et administratives de l’Université Saint-Joseph." },
      { ar: "شغل مواقع دبلوماسية في عمّان وجنيف والرباط وبروكسل وواشنطن.", en: "Held diplomatic posts in Amman, Geneva, Rabat, Brussels and Washington.", fr: "A occupé des postes diplomatiques à Amman, Genève, Rabat, Bruxelles et Washington." },
    ],
    aliases: ["يوسف رجي", "يوسف رجّي", "Youssef Raji", "Youssef Rajji"],
    sourceUrl: "https://www.lebanese-forces.com/person/political-youssef-rajji/",
  },
  {
    slug: "joe-saddi",
    group: "minister",
    name: { ar: "جو صدّي", en: "Joe Saddi", fr: "Joe Saddi" },
    office: { ar: "وزير الطاقة والمياه", en: "Minister of Energy and Water", fr: "Ministre de l’Énergie et de l’Eau" },
    imageUrl: "https://www.lstatic.org/UserFiles/images/2017/lf/lf-leaders/2018/Joe-Saddi.jpg",
    socials: { x: "https://x.com/Joe_Saddi" },
    summary: { ar: "خبير في الإدارة والاستراتيجية يتولى وزارة الطاقة والمياه في حكومة الرئيس نواف سلام.", en: "Management and strategy expert serving as minister of energy and water in Prime Minister Nawaf Salam’s cabinet.", fr: "Expert en gestion et stratégie, ministre de l’Énergie et de l’Eau dans le gouvernement de Nawaf Salam." },
    highlights: [
      { ar: "شغل مناصب قيادية عالمية في بوز أند كومباني وستراتيجي أند.", en: "Held global leadership roles at Booz & Company and Strategy&.", fr: "A occupé des fonctions de direction mondiale chez Booz & Company et Strategy&." },
      { ar: "حائز ماجستير إدارة أعمال من جامعة كورنيل.", en: "Holds an MBA from Cornell University.", fr: "Titulaire d’un MBA de l’Université Cornell." },
    ],
    aliases: ["جو صدي", "جو صدّي", "Joe Saddi", "Joe Saddy"],
    sourceUrl: "https://www.lebanese-forces.com/person/political-joe-saddi/",
  },
  {
    slug: "joe-issa-el-khoury",
    group: "minister",
    name: { ar: "جو عيسى الخوري", en: "Joe Issa El Khoury", fr: "Joe Issa El Khoury" },
    office: { ar: "وزير الصناعة", en: "Minister of Industry", fr: "Ministre de l’Industrie" },
    imageUrl: "https://www.lstatic.org/UserFiles/images/2017/lf/lf-leaders/2018/Joe-Issa-Khoury.jpg",
    socials: { x: "https://x.com/JoeIssaElKhoury" },
    summary: { ar: "مهندس وخبير مالي واستثماري يتولى وزارة الصناعة في حكومة الرئيس نواف سلام.", en: "Engineer and finance and investment executive serving as minister of industry in Prime Minister Nawaf Salam’s cabinet.", fr: "Ingénieur et dirigeant dans la finance et l’investissement, ministre de l’Industrie dans le gouvernement de Nawaf Salam." },
    highlights: [
      { ar: "حائز بكالوريوس في الهندسة المدنية من الجامعة الأميركية في بيروت وماجستير إدارة أعمال من INSEAD.", en: "Holds a civil-engineering degree from AUB and an MBA from INSEAD.", fr: "Diplômé en génie civil de l’AUB et titulaire d’un MBA de l’INSEAD." },
      { ar: "له خبرة في المصارف الاستثمارية وإدارة المحافظ وتمويل المشاريع.", en: "Experienced in investment banking, portfolio management and project finance.", fr: "Expérimenté en banque d’investissement, gestion de portefeuille et financement de projets." },
    ],
    aliases: ["جو عيسى الخوري", "Joe Issa El Khoury", "Joe Issa Khoury"],
    sourceUrl: "https://www.lebanese-forces.com/person/political-joe-issa-khoury/",
  },
  {
    slug: "kamal-shehadeh",
    group: "minister",
    name: { ar: "كمال شحادة", en: "Kamal Shehadeh", fr: "Kamal Shehadeh" },
    office: { ar: "وزير المهجّرين ووزير دولة لشؤون التكنولوجيا والذكاء الاصطناعي", en: "Minister of Displaced Affairs and Minister of State for Technology and AI", fr: "Ministre des Déplacés et ministre d’État chargé de la Technologie et de l’IA" },
    imageUrl: "https://www.lstatic.org/UserFiles/images/2017/lf/lf-leaders/2018/Kamal-Shrhadi.jpg",
    socials: { x: "https://x.com/ShehadiKamal" },
    summary: { ar: "خبير اتصالات وتكنولوجيا يتولى حقيبتي المهجّرين والتكنولوجيا والذكاء الاصطناعي في حكومة الرئيس نواف سلام.", en: "Telecommunications and technology expert serving as minister of displaced affairs and minister of state for technology and AI.", fr: "Expert en télécommunications et technologie, ministre des Déplacés et ministre d’État chargé de la Technologie et de l’IA." },
    highlights: [
      { ar: "خريج جامعتَي هارفرد وكولومبيا وعمل في قيادة شركات وهيئات اتصالات دولية.", en: "A Harvard and Columbia graduate who led international telecommunications companies and bodies.", fr: "Diplômé de Harvard et Columbia, il a dirigé des entreprises et organismes internationaux de télécommunications." },
      { ar: "ترأس الهيئة المنظمة للاتصالات في لبنان بين عامي 2007 و2010.", en: "Chaired Lebanon’s Telecommunications Regulatory Authority from 2007 to 2010.", fr: "A présidé l’Autorité de régulation des télécommunications du Liban de 2007 à 2010." },
    ],
    aliases: ["كمال شحادة", "Kamal Shehadeh", "Kamal Shehadi"],
    sourceUrl: "https://www.lebanese-forces.com/person/poitical-kamal-shehadi/",
  },
];

export const publicProfiles = [...mps, ...ministers];

export function findPublicProfile(slug: string): PublicProfile | undefined {
  return publicProfiles.find((profile) => profile.slug === slug);
}

export function profileText(value: LocalizedProfileText, language: ProfileLanguage): string {
  return value[language] || value.ar;
}
