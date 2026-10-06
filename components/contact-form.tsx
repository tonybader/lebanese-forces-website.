"use client";

import { CheckCircle2, Loader2, MessageSquareText, RefreshCw, Send } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";

type Lang = "ar" | "en" | "fr";

const copy = {
  ar: {
    name: "الاسم الكامل",
    phone: "رقم الهاتف (اختياري)",
    email: "البريد الإلكتروني",
    region: "المنطقة",
    choose: "اختر المنطقة",
    message: "كيف يمكننا أن نسمعك؟",
    captcha: "سؤال التحقق",
    answer: "الجواب",
    submit: "إرسال الرسالة",
    sent: "وصلت رسالتك. شكراً لتواصلك معنا.",
    retry: "تجديد السؤال",
  },
  en: {
    name: "Full name",
    phone: "Phone number (optional)",
    email: "Email address",
    region: "Region",
    choose: "Choose a region",
    message: "How can we hear from you?",
    captcha: "Security question",
    answer: "Answer",
    submit: "Send message",
    sent: "Your message was received. Thank you for contacting us.",
    retry: "New question",
  },
  fr: {
    name: "Nom complet",
    phone: "Téléphone (facultatif)",
    email: "Adresse e-mail",
    region: "Région",
    choose: "Choisir une région",
    message: "Comment pouvons-nous vous écouter ?",
    captcha: "Question de sécurité",
    answer: "Réponse",
    submit: "Envoyer le message",
    sent: "Votre message a bien été reçu. Merci de nous avoir contactés.",
    retry: "Nouvelle question",
  },
} as const;

const regions = ["بيروت", "جبل لبنان", "الشمال", "البقاع", "الجنوب", "الانتشار"];

export function ContactForm({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [captcha, setCaptcha] = useState<{ question: string; token: string } | null>(null);
  const [status, setStatus] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => { void loadCaptcha(); }, [loadCaptcha]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!captcha) return;
    const formElement = event.currentTarget;
    setSubmitting(true);
    setStatus(null);
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          email: form.get("email"),
          region: form.get("region"),
          message: form.get("message"),
          website: form.get("website"),
          captchaAnswer: form.get("captchaAnswer"),
          captchaToken: captcha.token,
        }),
      });
      const data = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || "The message could not be sent.");
      formElement.reset();
      setStatus({ kind: "success", text: t.sent });
      await loadCaptcha();
    } catch (error) {
      setStatus({ kind: "error", text: error instanceof Error ? error.message : "The message could not be sent." });
      await loadCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  const field = "h-13 w-full rounded-2xl border border-black/[.09] bg-white px-4 text-[14px] outline-none transition focus:border-[#df1f2d]/45 focus:ring-4 focus:ring-[#df1f2d]/8";
  return (
    <form onSubmit={submit} className="rounded-[30px] border border-black/[.07] bg-white p-5 shadow-[0_18px_55px_rgba(0,0,0,.055)] sm:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <label className="text-[12px] font-extrabold text-black/55">{t.name}<input name="name" required maxLength={120} className={`${field} mt-2`} /></label>
        <label className="text-[12px] font-extrabold text-black/55">{t.phone}<input name="phone" type="tel" maxLength={80} className={`${field} mt-2`} /></label>
        <label className="text-[12px] font-extrabold text-black/55">{t.email}<input name="email" type="email" required maxLength={180} className={`${field} mt-2`} /></label>
        <label className="text-[12px] font-extrabold text-black/55">{t.region}<select name="region" required defaultValue="" className={`${field} mt-2`}><option value="" disabled>{t.choose}</option>{regions.map((region) => <option key={region} value={region}>{region}</option>)}</select></label>
      </div>
      <label className="mt-4 block text-[12px] font-extrabold text-black/55">{t.message}<textarea name="message" required minLength={10} maxLength={5000} rows={6} className="mt-2 w-full resize-y rounded-2xl border border-black/[.09] bg-white px-4 py-4 text-[14px] leading-7 outline-none transition focus:border-[#df1f2d]/45 focus:ring-4 focus:ring-[#df1f2d]/8" /></label>
      <div className="mt-4 flex flex-col gap-3 rounded-[20px] bg-[#f5f5f2] p-4 sm:flex-row sm:items-end">
        <label className="flex-1 text-[12px] font-extrabold text-black/55">{t.captcha}: <span dir="ltr" className="text-[#df1f2d]">{captcha?.question || "…"}</span><input name="captchaAnswer" inputMode="numeric" required className={`${field} mt-2 bg-white`} placeholder={t.answer} /></label>
        <button type="button" onClick={() => void loadCaptcha()} className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-4 text-[11px] font-extrabold text-black/45 transition hover:bg-white hover:text-[#df1f2d]"><RefreshCw size={14} />{t.retry}</button>
      </div>
      {status && <div role="status" className={`mt-4 flex items-start gap-2 rounded-2xl px-4 py-3 text-[12px] font-bold leading-6 ${status.kind === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{status.kind === "success" ? <CheckCircle2 className="mt-0.5 shrink-0" size={16} /> : <MessageSquareText className="mt-0.5 shrink-0" size={16} />}{status.text}</div>}
      <button type="submit" disabled={submitting || !captcha} className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#191919] px-7 text-[13px] font-extrabold text-white transition hover:bg-[#df1f2d] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto">{submitting ? <Loader2 className="animate-spin" size={17} /> : <Send size={17} />}{t.submit}</button>
    </form>
  );
}
