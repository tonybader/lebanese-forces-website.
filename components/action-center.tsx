"use client";

import {
  CheckCircle2,
  HeartHandshake,
  Lightbulb,
  Loader2,
  MailPlus,
  RefreshCw,
  Send,
  UserPlus,
  Users,
} from "lucide-react";
import { FormEvent, useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PositionLanguage } from "@/lib/positions";

type ActionKind = "enroll" | "idea" | "volunteer" | "newsletter";

const copy = {
  ar: {
    kicker: "شارك في صناعة التغيير",
    title: "خطوتك تصنع فرقاً.",
    description: "اختر المساحة التي تناسبك. كل طلب يصل مباشرة إلى صندوق خاص داخل لوحة التحرير، من دون إرسال بياناتك عبر البريد الإلكتروني.",
    cards: {
      enroll: ["انتسب الآن", "حوّل قناعتك إلى التزام وانضم إلى مسيرة القوات اللبنانية."],
      idea: ["اقترح فكرة", "شاركنا مبادرة أو حلاً يمكن أن يخدم الناس والمجتمع."],
      volunteer: ["تطوّع في اختصاصك", "قدّم وقتك وخبرتك في الملف الذي يعني لك أكثر."],
      newsletter: ["ابقَ على تواصل", "سجّل لتصلك أحدث الأخبار والمواقف والنشاطات."],
    },
    form: {
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      region: "القضاء",
      chooseRegion: "اختر القضاء",
      topic: "الموضوع",
      topicPlaceholder: "اكتب الموضوع أو المجال",
      birth: "تاريخ الميلاد (اختياري)",
      profession: "المهنة أو مجال الخبرة (اختياري)",
      idea: "اشرح فكرتك",
      skills: "خبرات أو ملاحظات إضافية (اختياري)",
      availability: "الوقت المتاح",
      chooseAvailability: "اختر الوقت المتاح",
      preferredLanguage: "لغة النشرة",
      captcha: "سؤال التحقق",
      answer: "الجواب",
      refresh: "سؤال جديد",
      submit: "إرسال الطلب",
      privacy: "تُحفظ هذه البيانات في مساحة خاصة ولا تُرسل بالبريد الإلكتروني.",
      success: "تم استلام طلبك بنجاح. شكراً لمبادرتك.",
      contactHint: "يرجى إدخال البريد الإلكتروني أو رقم الهاتف على الأقل.",
    },
  },
  en: {
    kicker: "Take part in change",
    title: "Your next step matters.",
    description: "Choose how you want to contribute. Every request goes to a private editor inbox—your information is never sent by email.",
    cards: {
      enroll: ["Get enrolled", "Turn conviction into commitment and join the Lebanese Forces journey."],
      idea: ["Suggest an idea", "Share an initiative or solution that can serve people and communities."],
      volunteer: ["Volunteer your expertise", "Contribute your time and skills to the topic you care about most."],
      newsletter: ["Stay connected", "Register to receive the latest news, positions and activities."],
    },
    form: {
      name: "Full name",
      email: "Email address",
      phone: "Phone number",
      region: "District",
      chooseRegion: "Choose a district",
      topic: "Topic",
      topicPlaceholder: "Write the topic or field",
      birth: "Date of birth (optional)",
      profession: "Profession or area of expertise (optional)",
      idea: "Describe your idea",
      skills: "Skills or additional notes (optional)",
      availability: "Availability",
      chooseAvailability: "Choose your availability",
      preferredLanguage: "Newsletter language",
      captcha: "Security question",
      answer: "Answer",
      refresh: "New question",
      submit: "Submit request",
      privacy: "This information is stored privately and is not sent by email.",
      success: "Your request was received. Thank you for taking the initiative.",
      contactHint: "Please provide at least an email address or phone number.",
    },
  },
  fr: {
    kicker: "Participez au changement",
    title: "Votre prochain geste compte.",
    description: "Choisissez votre manière de contribuer. Chaque demande arrive dans une boîte privée de l’éditeur — vos données ne sont jamais envoyées par e-mail.",
    cards: {
      enroll: ["Adhérer maintenant", "Transformez votre conviction en engagement et rejoignez le parcours des Forces Libanaises."],
      idea: ["Proposer une idée", "Partagez une initiative ou une solution au service des citoyens et des communautés."],
      volunteer: ["Offrir votre expertise", "Consacrez du temps et vos compétences au sujet qui vous tient à cœur."],
      newsletter: ["Rester en contact", "Inscrivez-vous pour recevoir les dernières nouvelles, positions et activités."],
    },
    form: {
      name: "Nom complet",
      email: "Adresse e-mail",
      phone: "Numéro de téléphone",
      region: "Caza / district",
      chooseRegion: "Choisir un district",
      topic: "Sujet",
      topicPlaceholder: "Écrivez le sujet ou le domaine",
      birth: "Date de naissance (facultatif)",
      profession: "Profession ou domaine d’expertise (facultatif)",
      idea: "Décrivez votre idée",
      skills: "Compétences ou remarques (facultatif)",
      availability: "Disponibilité",
      chooseAvailability: "Choisir votre disponibilité",
      preferredLanguage: "Langue de la lettre",
      captcha: "Question de sécurité",
      answer: "Réponse",
      refresh: "Nouvelle question",
      submit: "Envoyer la demande",
      privacy: "Ces données sont conservées dans un espace privé et ne sont pas envoyées par e-mail.",
      success: "Votre demande a bien été reçue. Merci pour votre initiative.",
      contactHint: "Veuillez indiquer au moins une adresse e-mail ou un numéro de téléphone.",
    },
  },
} as const;

const kinds: ActionKind[] = ["enroll", "idea", "volunteer", "newsletter"];
const icons = { enroll: UserPlus, idea: Lightbulb, volunteer: Users, newsletter: MailPlus } as const;
const colors = {
  enroll: "from-[#df1f2d] to-[#ad111d]",
  idea: "from-[#176f45] to-[#0c4930]",
  volunteer: "from-[#232925] to-[#111512]",
  newsletter: "from-[#f0e9dc] to-[#ddd4c5]",
} as const;

const districts = {
  ar: ["بيروت", "عكار", "طرابلس", "المنية - الضنية", "زغرتا", "بشري", "الكورة", "البترون", "كسروان", "جبيل", "المتن", "بعبدا", "عاليه", "الشوف", "زحلة", "البقاع الغربي", "راشيا", "بعلبك", "الهرمل", "صيدا", "جزين", "صور", "بنت جبيل", "النبطية", "مرجعيون", "حاصبيا", "الانتشار / خارج لبنان"],
  en: ["Beirut", "Akkar", "Tripoli", "Minieh–Danniyeh", "Zgharta", "Bsharri", "Koura", "Batroun", "Keserwan", "Jbeil", "Metn", "Baabda", "Aley", "Chouf", "Zahle", "Western Bekaa", "Rashaya", "Baalbek", "Hermel", "Sidon", "Jezzine", "Tyre", "Bint Jbeil", "Nabatieh", "Marjayoun", "Hasbaya", "Diaspora / Outside Lebanon"],
  fr: ["Beyrouth", "Akkar", "Tripoli", "Minié–Danniyeh", "Zgharta", "Bécharré", "Koura", "Batroun", "Kesrouan", "Jbeil", "Metn", "Baabda", "Aley", "Chouf", "Zahlé", "Békaa-Ouest", "Rachaya", "Baalbek", "Hermel", "Saïda", "Jezzine", "Tyr", "Bint Jbeil", "Nabatiyé", "Marjayoun", "Hasbaya", "Diaspora / Hors du Liban"],
} as const;

const availability = {
  ar: ["بضع ساعات شهرياً", "يوم أسبوعياً", "عند الحاجة", "عن بُعد"],
  en: ["A few hours per month", "One day per week", "As needed", "Remote"],
  fr: ["Quelques heures par mois", "Un jour par semaine", "Selon les besoins", "À distance"],
} as const;

export function ActionCenter({ lang }: { lang: PositionLanguage }) {
  const [selected, setSelected] = useState<ActionKind | null>(null);
  const [captcha, setCaptcha] = useState<{ question: string; token: string } | null>(null);
  const [status, setStatus] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const t = copy[lang];
  const rtl = lang === "ar";

  const loadCaptcha = useCallback(async () => {
    setCaptcha(null);
    try {
      const response = await fetch("/api/contact/captcha", { cache: "no-store" });
      const data = await response.json() as { question?: string; token?: string; error?: string };
      if (!response.ok || !data.question || !data.token) throw new Error(data.error || "Security check unavailable.");
      setCaptcha({ question: data.question, token: data.token });
    } catch (error) {
      setStatus({ kind: "error", text: error instanceof Error ? error.message : "Security check unavailable." });
    }
  }, []);

  const openAction = (kind: ActionKind) => {
    setStatus(null);
    setSelected(kind);
    void loadCaptcha();
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected || !captcha) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSubmitting(true);
    setStatus(null);
    try {
      const response = await fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: selected,
          language: form.get("preferredLanguage") || lang,
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          region: form.get("region"),
          topic: form.get("topic") || form.get("profession"),
          dateOfBirth: form.get("dateOfBirth"),
          availability: form.get("availability"),
          message: form.get("message"),
          website: form.get("website"),
          captchaAnswer: form.get("captchaAnswer"),
          captchaToken: captcha.token,
        }),
      });
      const data = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || "The request could not be submitted.");
      formElement.reset();
      setStatus({ kind: "success", text: t.form.success });
      await loadCaptcha();
    } catch (error) {
      setStatus({ kind: "error", text: error instanceof Error ? error.message : "The request could not be submitted." });
      await loadCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  const field = "mt-2 h-12 w-full rounded-2xl border border-black/[.09] bg-[var(--site-surface-soft)] px-4 text-[13px] font-bold text-[var(--site-text)] outline-none transition focus:border-[#df1f2d]/40 focus:ring-4 focus:ring-[#df1f2d]/8";
  const selectedCopy = selected ? t.cards[selected] : null;
  const SelectedActionIcon = selected ? icons[selected] : HeartHandshake;

  return (
    <section id="actions" className="relative overflow-hidden px-5 py-24 lg:px-8 lg:py-30">
      <div className="absolute inset-0 -z-20 bg-[var(--site-bg)]" />
      <div className="absolute -start-40 top-20 -z-10 h-96 w-96 rounded-full bg-[#df1f2d]/8 blur-3xl" />
      <div className="mx-auto max-w-[1380px]">
        <div className="max-w-none" data-reveal>
          <div className="arabic-safe mb-4 flex items-center gap-3 text-[12px] font-extrabold uppercase tracking-[.12em] text-[#df1f2d]"><HeartHandshake size={18} />{t.kicker}</div>
          <h2 className="section-title whitespace-nowrap text-[clamp(1.65rem,5.5vw,5.8rem)] font-extrabold leading-[1.15] tracking-[-.055em]">{t.title}</h2>
          <p className="mt-5 max-w-2xl text-[15px] font-normal leading-8 text-[var(--site-muted)] sm:text-[17px]">{t.description}</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4" data-reveal>
          {kinds.map((kind, index) => {
            const Icon = icons[kind];
            const lightCard = kind === "newsletter";
            return (
              <button key={kind} onClick={() => openAction(kind)} className={`action-card group relative min-h-[330px] overflow-hidden rounded-[30px] bg-gradient-to-br ${colors[kind]} p-6 text-start shadow-[0_18px_55px_rgba(0,0,0,.12)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_75px_rgba(0,0,0,.18)] sm:p-7 ${lightCard ? "action-card--light text-[#171717]" : "text-white"}`}>
                <span aria-hidden="true" className={`action-card__icon absolute start-6 top-6 grid h-14 w-14 place-items-center rounded-[19px] transition duration-300 group-hover:scale-105 sm:start-7 sm:top-7 ${lightCard ? "bg-white/75 text-[#df1f2d]" : "bg-white/12 text-white"}`}><Icon size={23} /></span>
                <span className={`action-card__number absolute end-6 top-7 font-mono text-[10px] font-bold ${lightCard ? "text-black/25" : "text-white/30"}`}>0{index + 1}</span>
                <span className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <span className="action-card__title section-title block text-[24px] font-extrabold leading-[1.35]">{t.cards[kind][0]}</span>
                  <span className={`action-card__description mt-3 block text-[12px] font-normal leading-7 ${lightCard ? "text-black/50" : "text-white/55"}`}>{t.cards[kind][1]}</span>
                  <span className={`action-card__cta mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full transition group-hover:translate-x-[-3px] ${lightCard ? "bg-[#191919] text-white" : "bg-white text-[#171717]"}`}><Send size={15} /></span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent dir={rtl ? "rtl" : "ltr"} className="action-dialog max-h-[90vh] max-w-[760px] overflow-y-auto p-0 sm:max-w-[760px]">
          {selected && selectedCopy && (
            <form onSubmit={submit} className="p-6 sm:p-9">
              <DialogHeader className="text-start">
                <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#df1f2d] text-white"><SelectedActionIcon size={21} /></span>
                <DialogTitle className="section-title text-[clamp(1.8rem,5vw,2.7rem)] font-extrabold leading-[1.35] text-[var(--site-text)]">{selectedCopy[0]}</DialogTitle>
                <DialogDescription className="mt-2 text-[13px] leading-7 text-[var(--site-muted)]">{selectedCopy[1]}</DialogDescription>
              </DialogHeader>

              <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <label className="text-[11px] font-extrabold text-[var(--site-muted)]">{t.form.name}<input name="name" required={selected !== "newsletter"} maxLength={120} className={field} /></label>
                <label className="text-[11px] font-extrabold text-[var(--site-muted)]">{t.form.email}<input name="email" type="email" required={selected === "newsletter"} maxLength={180} className={field} /></label>
                <label className="text-[11px] font-extrabold text-[var(--site-muted)]">{t.form.phone}<input name="phone" type="tel" required={selected === "newsletter"} maxLength={80} className={field} />{selected !== "newsletter" && <span className="mt-1 block text-[9px] font-normal opacity-65">{t.form.contactHint}</span>}</label>
                <label className="text-[11px] font-extrabold text-[var(--site-muted)]">{t.form.region}<select name="region" required={selected !== "newsletter"} defaultValue="" className={field}><option value="">{t.form.chooseRegion}</option>{districts[lang].map((district) => <option key={district} value={district}>{district}</option>)}</select></label>

                {selected === "enroll" && <><label className="text-[11px] font-extrabold text-[var(--site-muted)]">{t.form.birth}<input name="dateOfBirth" type="date" className={field} /></label><label className="text-[11px] font-extrabold text-[var(--site-muted)]">{t.form.profession}<input name="profession" maxLength={200} className={field} /></label></>}
                {(selected === "idea" || selected === "volunteer") && <label className="text-[11px] font-extrabold text-[var(--site-muted)] sm:col-span-2">{t.form.topic}<input name="topic" required maxLength={240} placeholder={t.form.topicPlaceholder} className={field} /></label>}
                {selected === "volunteer" && <label className="text-[11px] font-extrabold text-[var(--site-muted)] sm:col-span-2">{t.form.availability}<select name="availability" required defaultValue="" className={field}><option value="" disabled>{t.form.chooseAvailability}</option>{availability[lang].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>}
                {selected === "newsletter" && <label className="text-[11px] font-extrabold text-[var(--site-muted)] sm:col-span-2">{t.form.preferredLanguage}<select name="preferredLanguage" defaultValue={lang} className={field}><option value="ar">العربية</option><option value="en">English</option><option value="fr">Français</option></select></label>}
              </div>

              {(selected === "idea" || selected === "volunteer" || selected === "enroll") && <label className="mt-4 block text-[11px] font-extrabold text-[var(--site-muted)]">{selected === "idea" ? t.form.idea : t.form.skills}<textarea name="message" required={selected === "idea"} minLength={selected === "idea" ? 10 : undefined} maxLength={5000} rows={4} className="mt-2 w-full resize-y rounded-2xl border border-black/[.09] bg-[var(--site-surface-soft)] px-4 py-4 text-[13px] leading-7 text-[var(--site-text)] outline-none transition focus:border-[#df1f2d]/40 focus:ring-4 focus:ring-[#df1f2d]/8" /></label>}

              <div className="mt-5 flex flex-col gap-3 rounded-[22px] bg-[var(--site-surface-soft)] p-4 sm:flex-row sm:items-end">
                <label className="flex-1 text-[11px] font-extrabold text-[var(--site-muted)]">{t.form.captcha}: <span dir="ltr" className="text-[#df1f2d]">{captcha?.question || "…"}</span><input name="captchaAnswer" inputMode="numeric" required className={`${field} bg-[var(--site-surface)]`} placeholder={t.form.answer} /></label>
                <button type="button" onClick={() => void loadCaptcha()} className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-[10px] font-extrabold text-[var(--site-muted)] transition hover:bg-[var(--site-surface)] hover:text-[#df1f2d]"><RefreshCw size={13} />{t.form.refresh}</button>
              </div>

              {status && <div role="status" className={`mt-4 flex items-start gap-2 rounded-2xl px-4 py-3 text-[12px] font-bold leading-6 ${status.kind === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{status.kind === "success" && <CheckCircle2 className="mt-0.5 shrink-0" size={16} />}{status.text}</div>}
              <p className="mt-4 text-[9px] font-normal leading-5 text-[var(--site-muted)]">{t.form.privacy}</p>
              <button type="submit" disabled={submitting || !captcha} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#191919] px-6 text-[12px] font-extrabold text-white transition hover:bg-[#df1f2d] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto">{submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}{t.form.submit}</button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
