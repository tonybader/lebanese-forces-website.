export type PositionLanguage = "ar" | "en" | "fr";
export type PositionCategory = "state" | "economy" | "society" | "future";

export type PositionLocalized = {
  ar: string;
  en: string;
  fr: string;
};

export type PositionPillar = {
  id: string;
  number: string;
  category: PositionCategory;
  title: PositionLocalized;
  short: PositionLocalized;
  statement: PositionLocalized;
  priorities: PositionLocalized[];
};

export const positionText = (value: PositionLocalized, language: PositionLanguage) => value[language];

export const positionPillars: PositionPillar[] = [
  {
    id: "sovereignty",
    number: "01",
    category: "state",
    title: {
      ar: "السيادة والدولة الواحدة",
      en: "Sovereignty and one state",
      fr: "Souveraineté et État unique",
    },
    short: {
      ar: "قرارٌ وطني حر، وسلطة شرعية واحدة على كامل الأراضي اللبنانية.",
      en: "An independent national decision and one legitimate authority across all Lebanese territory.",
      fr: "Une décision nationale indépendante et une seule autorité légitime sur tout le territoire libanais.",
    },
    statement: {
      ar: "نؤمن بدولة تحتكر وحدها السلاح وقرار الحرب والسلم، تحمي حدودها وثرواتها وتستعيد حضور لبنان العربي والدولي من خلال حياد إيجابي يحفظ المصلحة الوطنية.",
      en: "We believe in a state that alone holds arms and the decision of war and peace, protects its borders and resources, and restores Lebanon’s Arab and international role through positive neutrality.",
      fr: "Nous croyons en un État seul détenteur des armes et de la décision de guerre et de paix, protégeant ses frontières et ses ressources, et restaurant le rôle arabe et international du Liban par une neutralité positive.",
    },
    priorities: [
      { ar: "حصر السلاح وقرار الحرب والسلم بالمؤسسات الدستورية.", en: "Keep arms and the decision of war and peace within constitutional institutions.", fr: "Réserver les armes et la décision de guerre et de paix aux institutions constitutionnelles." },
      { ar: "ضبط الحدود والمعابر وترسيم الحدود البرية والبحرية.", en: "Control crossings and complete land and maritime border demarcation.", fr: "Contrôler les passages et achever la délimitation des frontières terrestres et maritimes." },
      { ar: "اعتماد حياد إيجابي يعيد الثقة بعلاقات لبنان العربية والدولية.", en: "Adopt positive neutrality that rebuilds trust in Lebanon’s Arab and international relations.", fr: "Adopter une neutralité positive qui rétablit la confiance dans les relations arabes et internationales du Liban." },
    ],
  },
  {
    id: "institutions",
    number: "02",
    category: "state",
    title: {
      ar: "دولة القانون والمؤسسات",
      en: "A state of law and institutions",
      fr: "Un État de droit et d’institutions",
    },
    short: {
      ar: "مؤسسات حديثة، قضاء مستقل، وانتخابات شفافة تعيد ثقة المواطن.",
      en: "Modern institutions, an independent judiciary and transparent elections that restore public trust.",
      fr: "Des institutions modernes, une justice indépendante et des élections transparentes qui restaurent la confiance.",
    },
    statement: {
      ar: "الدولة ليست غاية بحد ذاتها بل أداة لخدمة الإنسان. لذلك نريد مؤسسات فعّالة وخاضعة للمحاسبة، وقضاءً مستقلاً، وبرلماناً شفافاً، وإدارة رقمية تسهّل حياة المواطن.",
      en: "The state is a means to serve people. We therefore seek effective, accountable institutions, an independent judiciary, a transparent Parliament and digital public services.",
      fr: "L’État est un moyen au service de la personne. Nous voulons donc des institutions efficaces et responsables, une justice indépendante, un Parlement transparent et des services publics numériques.",
    },
    priorities: [
      { ar: "استقلال القضاء وتحديث آليات عمله وتنفيذ أحكامه.", en: "Secure judicial independence, modern procedures and enforcement of rulings.", fr: "Garantir l’indépendance de la justice, moderniser ses procédures et exécuter ses décisions." },
      { ar: "شفافية العمل النيابي والحكومي وحق الوصول إلى المعلومات.", en: "Make parliamentary and government work transparent and guarantee access to information.", fr: "Rendre transparents les travaux parlementaires et gouvernementaux et garantir l’accès à l’information." },
      { ar: "حكومة إلكترونية وإدارة عامة قائمة على الكفاءة.", en: "Build digital government and a merit-based public administration.", fr: "Développer un gouvernement numérique et une administration fondée sur la compétence." },
    ],
  },
  {
    id: "accountability",
    number: "03",
    category: "state",
    title: {
      ar: "المحاسبة واللامركزية",
      en: "Accountability and decentralization",
      fr: "Redevabilité et décentralisation",
    },
    short: {
      ar: "رقابة مستقلة وقرار محلي أقرب إلى الناس وحاجاتهم.",
      en: "Independent oversight and local decisions closer to people and their needs.",
      fr: "Un contrôle indépendant et des décisions locales au plus près des citoyens et de leurs besoins.",
    },
    statement: {
      ar: "مكافحة الفساد تبدأ باختيار الأشخاص النزيهين وتطبيق القوانين وتفعيل أجهزة الرقابة. وتكتمل بلامركزية إدارية ومالية موسّعة تمنح المناطق قدرة فعلية على التنمية والخدمة.",
      en: "Fighting corruption starts with integrity in public office, enforcement of laws and empowered oversight. Expanded administrative and financial decentralization then gives regions real capacity to develop and serve.",
      fr: "La lutte contre la corruption commence par l’intégrité dans la fonction publique, l’application des lois et des organes de contrôle renforcés. Une décentralisation administrative et financière élargie donne ensuite aux régions une véritable capacité d’action.",
    },
    priorities: [
      { ar: "تفعيل الهيئات الرقابية واستقلال إجراءاتها ونشر تقاريرها.", en: "Empower oversight bodies, protect their independence and publish their reports.", fr: "Renforcer les organes de contrôle, protéger leur indépendance et publier leurs rapports." },
      { ar: "تطبيق قوانين الإثراء غير المشروع واستعادة الأموال المتأتية من الفساد.", en: "Enforce illicit-enrichment laws and recover proceeds of corruption.", fr: "Appliquer les lois sur l’enrichissement illicite et récupérer les fonds issus de la corruption." },
      { ar: "انتخاب إدارات محلية ومنحها موارد وصلاحيات واضحة.", en: "Elect local administrations and give them clear powers and resources.", fr: "Élire les administrations locales et leur donner des compétences et des ressources claires." },
    ],
  },
  {
    id: "recovery",
    number: "04",
    category: "economy",
    title: {
      ar: "تعافٍ مالي عادل",
      en: "A fair financial recovery",
      fr: "Un redressement financier équitable",
    },
    short: {
      ar: "خطة موثوقة توزّع الخسائر بعدالة وتحمي صغار المودعين.",
      en: "A credible plan that distributes losses fairly and protects small depositors.",
      fr: "Un plan crédible qui répartit équitablement les pertes et protège les petits déposants.",
    },
    statement: {
      ar: "لا تعافٍ من دون خطة متوسطة الأمد، اتفاق إصلاحي موثوق مع صندوق النقد، وإعادة هيكلة عادلة للقطاع المصرفي تبدأ بالمساهمين وتحمي صغار المودعين، بالتوازي مع إصلاح المالية العامة.",
      en: "Recovery requires a credible medium-term plan, a reform agreement with the IMF, fair banking restructuring that begins with shareholders and protects small depositors, and a parallel reform of public finances.",
      fr: "Le redressement exige un plan crédible à moyen terme, un accord de réforme avec le FMI, une restructuration bancaire équitable commençant par les actionnaires et protégeant les petits déposants, ainsi qu’une réforme des finances publiques.",
    },
    priorities: [
      { ar: "حماية صغار المودعين واحترام التراتبية القانونية في توزيع الخسائر.", en: "Protect small depositors and respect the legal hierarchy when distributing losses.", fr: "Protéger les petits déposants et respecter la hiérarchie juridique dans la répartition des pertes." },
      { ar: "إنجاز التدقيق الجنائي ورفع السرية المصرفية حيث تعيق المحاسبة.", en: "Complete the forensic audit and remove banking secrecy where it blocks accountability.", fr: "Achever l’audit juricomptable et lever le secret bancaire lorsqu’il empêche la reddition de comptes." },
      { ar: "إصلاح المالية العامة والجباية وإدارة أصول الدولة بشفافية.", en: "Reform public finances and revenue collection, and manage state assets transparently.", fr: "Réformer les finances publiques et la collecte, et gérer les actifs de l’État en toute transparence." },
    ],
  },
  {
    id: "productive-economy",
    number: "05",
    category: "economy",
    title: {
      ar: "اقتصاد منتج وفرص عمل",
      en: "A productive economy and jobs",
      fr: "Une économie productive et des emplois",
    },
    short: {
      ar: "اقتصاد حر ومسؤول اجتماعياً، يراهن على المعرفة والمبادرة والإنتاج.",
      en: "A free, socially responsible economy powered by knowledge, enterprise and production.",
      fr: "Une économie libre et socialement responsable, portée par le savoir, l’initiative et la production.",
    },
    statement: {
      ar: "نريد اقتصاداً تنافسياً يقوده القطاع الخاص ضمن قواعد عادلة، ويدعم الصناعة والزراعة والمؤسسات الصغيرة والابتكار، ويستفيد من خبرات الانتشار لفتح الأسواق وخلق فرص العمل.",
      en: "We want a competitive economy led by private initiative within fair rules—supporting industry, agriculture, small businesses and innovation, while using diaspora expertise to open markets and create jobs.",
      fr: "Nous voulons une économie compétitive portée par l’initiative privée dans un cadre équitable, soutenant l’industrie, l’agriculture, les PME et l’innovation, tout en mobilisant l’expertise de la diaspora pour ouvrir des marchés et créer des emplois.",
    },
    priorities: [
      { ar: "تحفيز الصناعات ذات القيمة المضافة والاقتصاد الرقمي والإبداعي.", en: "Incentivize high-value industry and the digital and creative economy.", fr: "Stimuler les industries à forte valeur ajoutée ainsi que l’économie numérique et créative." },
      { ar: "تعزيز الأمن الغذائي ودعم المزارعين والجودة والأسواق التصديرية.", en: "Strengthen food security, farmer support, quality and export markets.", fr: "Renforcer la sécurité alimentaire, le soutien aux agriculteurs, la qualité et les marchés d’exportation." },
      { ar: "ربط التعليم والتدريب بحاجات سوق العمل ودعم المؤسسات الصغيرة.", en: "Connect education and training to labor-market needs and support small enterprises.", fr: "Relier l’éducation et la formation aux besoins du marché du travail et soutenir les petites entreprises." },
    ],
  },
  {
    id: "infrastructure",
    number: "06",
    category: "future",
    title: {
      ar: "بنى تحتية تليق بالمواطن",
      en: "Infrastructure worthy of citizens",
      fr: "Des infrastructures dignes des citoyens",
    },
    short: {
      ar: "كهرباء واتصالات ونقل ومرافئ تُدار بالقانون والكفاءة.",
      en: "Electricity, telecoms, transport and ports governed by law and efficiency.",
      fr: "Électricité, télécommunications, transports et ports gérés par la loi et l’efficacité.",
    },
    statement: {
      ar: "الخدمات الأساسية حق وشرط للنمو. الأولوية هي لهيئات ناظمة مستقلة، استثمار شفاف، طاقة أنظف، شبكة رقمية حديثة، ونقل عام يربط المناطق ويخفّف الكلفة والتلوث.",
      en: "Basic services are a right and a condition for growth. The priority is independent regulators, transparent investment, cleaner energy, modern digital networks and public transport connecting regions.",
      fr: "Les services essentiels sont un droit et une condition de la croissance. La priorité va à des régulateurs indépendants, des investissements transparents, une énergie plus propre, des réseaux numériques modernes et des transports publics reliant les régions.",
    },
    priorities: [
      { ar: "تطبيق قانون تنظيم الكهرباء وتعيين الهيئة الناظمة وإصلاح الشبكات.", en: "Implement the electricity law, appoint the regulator and rehabilitate the grid.", fr: "Appliquer la loi sur l’électricité, nommer le régulateur et réhabiliter le réseau." },
      { ar: "تحويل الاتصالات إلى محرّك للاقتصاد الرقمي لا إلى ضريبة على المواطن.", en: "Make telecoms a driver of the digital economy rather than a tax on citizens.", fr: "Faire des télécommunications un moteur de l’économie numérique plutôt qu’une taxe sur les citoyens." },
      { ar: "تنفيذ خطة نقل عام وطنية وتحديث إدارة المرافئ والمطارات.", en: "Deliver a national public-transport plan and modernize port and airport management.", fr: "Mettre en œuvre un plan national de transport public et moderniser la gestion des ports et aéroports." },
    ],
  },
  {
    id: "social-protection",
    number: "07",
    category: "society",
    title: {
      ar: "حماية اجتماعية شاملة",
      en: "Universal social protection",
      fr: "Une protection sociale universelle",
    },
    short: {
      ar: "صحة وتعليم وضمان وشيخوخة كريمة، لا امتيازات ظرفية.",
      en: "Health, education, social security and dignified aging—not temporary privileges.",
      fr: "Santé, éducation, sécurité sociale et vieillesse digne — pas des privilèges temporaires.",
    },
    statement: {
      ar: "نضع الإنسان في قلب السياسة العامة عبر تغطية صحية شاملة، ضمان اجتماعي مستدام، حماية للشيخوخة، تعليم نوعي متاح للجميع، وشبكة أمان تساعد العائلات على مواجهة الأزمات.",
      en: "We place people at the center of public policy through universal health coverage, sustainable social security, old-age protection, quality education for all and a safety net for families facing crisis.",
      fr: "Nous plaçons la personne au cœur de la politique publique grâce à une couverture santé universelle, une sécurité sociale durable, la protection de la vieillesse, une éducation de qualité pour tous et un filet de sécurité pour les familles.",
    },
    priorities: [
      { ar: "توحيد أنظمة الضمان وإقرار تغطية صحية شاملة وضمان الشيخوخة.", en: "Unify social insurance and establish universal health and old-age coverage.", fr: "Unifier les régimes d’assurance et instaurer une couverture universelle de santé et de vieillesse." },
      { ar: "تعزيز الرعاية الصحية الأولية وتنظيم الدواء والاستشفاء بشفافية.", en: "Strengthen primary care and regulate medicines and hospitalization transparently.", fr: "Renforcer les soins primaires et réglementer les médicaments et l’hospitalisation avec transparence." },
      { ar: "تحديث المناهج وضمان تعليم نوعي وتكافؤ الفرص.", en: "Modernize curricula and guarantee quality education and equal opportunity.", fr: "Moderniser les programmes et garantir une éducation de qualité et l’égalité des chances." },
    ],
  },
  {
    id: "rights",
    number: "08",
    category: "society",
    title: {
      ar: "حقوق وحريات ومساواة",
      en: "Rights, freedoms and equality",
      fr: "Droits, libertés et égalité",
    },
    short: {
      ar: "كرامة الإنسان مصونة، والفرص متكافئة، والشباب شركاء في القرار.",
      en: "Human dignity is protected, opportunity is equal and young people share in decisions.",
      fr: "La dignité humaine est protégée, les chances sont égales et les jeunes participent aux décisions.",
    },
    statement: {
      ar: "الديمقراطية لا تكتمل من دون حقوق الإنسان والحريات. نلتزم مكافحة التمييز والعنف، حماية النساء، إصلاح السجون ومنع التعذيب، وإتاحة المجال أمام الشباب للمشاركة والابتكار.",
      en: "Democracy is incomplete without human rights and freedoms. We are committed to fighting discrimination and violence, protecting women, reforming prisons, preventing torture and enabling youth participation and innovation.",
      fr: "La démocratie est incomplète sans droits humains et libertés. Nous nous engageons à combattre la discrimination et la violence, protéger les femmes, réformer les prisons, prévenir la torture et favoriser la participation et l’innovation des jeunes.",
    },
    priorities: [
      { ar: "إزالة التمييز القانوني ضد المرأة وحمايتها من العنف وزواج القاصرات.", en: "Remove legal discrimination against women and protect them from violence and child marriage.", fr: "Supprimer les discriminations juridiques envers les femmes et les protéger contre la violence et le mariage des mineures." },
      { ar: "تفعيل الهيئة الوطنية لحقوق الإنسان وضمانات الموقوفين ومنع التعذيب.", en: "Activate the national human-rights body, detainee safeguards and torture prevention.", fr: "Activer l’institution nationale des droits de l’homme, les garanties des détenus et la prévention de la torture." },
      { ar: "دعم مبادرات الشباب والرياضة والبحث والابتكار والمشاركة العامة.", en: "Support youth initiatives, sport, research, innovation and public participation.", fr: "Soutenir les initiatives des jeunes, le sport, la recherche, l’innovation et la participation publique." },
    ],
  },
  {
    id: "environment",
    number: "09",
    category: "future",
    title: {
      ar: "بيئة ومياه للأجيال المقبلة",
      en: "Environment and water for generations",
      fr: "Environnement et eau pour les générations",
    },
    short: {
      ar: "موارد طبيعية محمية، مياه نظيفة وحلول مستدامة للنفايات.",
      en: "Protected natural resources, clean water and sustainable waste solutions.",
      fr: "Des ressources naturelles protégées, une eau propre et des solutions durables pour les déchets.",
    },
    statement: {
      ar: "البيئة ثروة وطنية. نريد إدارة علمية للمياه، حماية الشاطئ والغابات والتنوع الحيوي، شرطة بيئية فاعلة، وحلولاً لامركزية حديثة للفرز والمعالجة بعيداً عن المحاصصة.",
      en: "The environment is a national asset. We seek science-based water management, protection of coasts, forests and biodiversity, effective environmental enforcement and modern decentralized waste treatment.",
      fr: "L’environnement est un patrimoine national. Nous voulons une gestion scientifique de l’eau, la protection du littoral, des forêts et de la biodiversité, une police environnementale efficace et un traitement moderne et décentralisé des déchets.",
    },
    priorities: [
      { ar: "حماية الموارد الطبيعية والشاطئ وضبط المقالع والكسارات.", en: "Protect natural resources and the coast, and regulate quarries and crushers.", fr: "Protéger les ressources naturelles et le littoral, et réglementer les carrières." },
      { ar: "اعتماد فرز ومعالجة لامركزية ومستدامة للنفايات.", en: "Adopt decentralized, sustainable waste sorting and treatment.", fr: "Adopter un tri et un traitement décentralisés et durables des déchets." },
      { ar: "تطوير شبكات المياه والصرف الصحي والقياس الذكي وترشيد الاستهلاك.", en: "Modernize water and sanitation networks, smart metering and responsible use.", fr: "Moderniser les réseaux d’eau et d’assainissement, le comptage intelligent et la consommation responsable." },
    ],
  },
];
