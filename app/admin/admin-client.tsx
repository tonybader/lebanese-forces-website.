"use client";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ExternalLink,
  Eye,
  ImagePlus,
  LayoutTemplate,
  Loader2,
  LockKeyhole,
  LogOut,
  Save,
  UploadCloud,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  HomepageContent,
  HomepageLanguage,
  HomepageLocalizedText,
  HomepageSectionKey,
} from "@/lib/homepage-types";

type Notice = { kind: "success" | "error"; text: string } | null;

const sections: { key: HomepageSectionKey; label: string; hint: string }[] = [
  { key: "hero", label: "Hero", hint: "Opening title, introduction and image" },
  { key: "news", label: "Latest news", hint: "News section heading" },
  { key: "vision", label: "Vision", hint: "Party vision statement" },
  { key: "history", label: "History", hint: "Interactive history introduction" },
  { key: "president", label: "Party president", hint: "Biography summary and photograph" },
  { key: "leadership", label: "Leadership", hint: "Executive and parliamentary section" },
  { key: "publications", label: "Publications", hint: "Documents and library introduction" },
  { key: "media", label: "Media", hint: "Songs, video and photo introduction" },
  { key: "footer", label: "Footer", hint: "Closing statement" },
];

async function optimizeImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose a valid image.");
  if (file.size <= 1_500_000) return file;
  const bitmap = await createImageBitmap(file);
  const maximum = 1800;
  const scale = Math.min(1, maximum / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The image could not be prepared.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.86),
  );
  if (!blob) throw new Error("The image could not be compressed.");
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "homepage"}.jpg`, {
    type: "image/jpeg",
  });
}

function AdminFrame({ children }: { children: React.ReactNode }) {
  return (
    <main dir="ltr" className="admin-surface min-h-screen bg-[#ecece8] px-3 py-4 text-[#171717] sm:px-5 lg:px-7 lg:py-6">
      <div className="mx-auto max-w-[1540px]">{children}</div>
    </main>
  );
}

export function AdminLogin({
  configured,
  defaultUsername,
}: {
  configured: boolean;
  defaultUsername: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to sign in.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminFrame>
      <div className="grid min-h-[calc(100vh-3rem)] items-center gap-8 lg:grid-cols-[.95fr_1.05fr]">
        <section className="relative overflow-hidden rounded-[34px] bg-[#191919] p-8 text-white shadow-[0_28px_80px_rgba(0,0,0,.18)] sm:p-11 lg:min-h-[630px]">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#df1f2d]/30 blur-3xl" />
          <div className="relative flex h-full flex-col">
            <a href="/" className="flex w-fit items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-white shadow-lg"><img src="/lf-logo.png" alt="Lebanese Forces" className="h-11 w-11 rounded-full object-contain" /></span>
              <span><span className="block text-lg font-extrabold">Lebanese Forces</span><span className="mt-1 block text-[11px] font-bold text-white/40">SITE ADMINISTRATION</span></span>
            </a>
            <div className="relative mt-24 max-w-lg lg:mt-auto lg:pb-8">
              <div className="mb-5 flex items-center gap-2 text-[12px] font-bold text-[#ff6570]"><LayoutTemplate size={16} /> Administrator access</div>
              <h1 className="section-title text-[clamp(2.4rem,5vw,4.6rem)] font-extrabold leading-[1.2]">Visual homepage editor</h1>
              <p className="mt-5 max-w-md text-[16px] leading-8 text-white/58">Edit text directly in a live preview and replace the homepage photographs.</p>
            </div>
          </div>
        </section>
        <section className="rounded-[30px] border border-black/[.07] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,.07)] sm:p-10 lg:p-12">
          <div className="mb-9"><div className="text-[12px] font-extrabold text-[#df1f2d]">ADMIN SIGN IN</div><h2 className="mt-2 text-3xl font-extrabold">Manage the homepage</h2><p className="mt-2 text-[14px] text-black/45">Use the administrator credentials to continue.</p></div>
          {!configured && <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-950"><LockKeyhole /><AlertTitle>Admin access needs configuration</AlertTitle><AlertDescription>Add ADMIN_PASSWORD in Vercel, then redeploy.</AlertDescription></Alert>}
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2.5"><Label htmlFor="admin-username" className="font-bold">Username</Label><Input id="admin-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="h-13 rounded-2xl px-4 text-[16px]" required /></div>
            <div className="space-y-2.5"><Label htmlFor="admin-password" className="font-bold">Password</Label><Input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-13 rounded-2xl px-4 text-[16px]" required /></div>
            {error && <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-[13px] font-bold text-red-700">{error}</p>}
            <Button type="submit" disabled={loading || !configured} className="h-13 w-full rounded-2xl bg-[#df1f2d] text-[15px] font-extrabold hover:bg-[#c51825]">{loading ? <Loader2 className="animate-spin" /> : <LockKeyhole />} Sign in</Button>
          </form>
          <a href="/" className="mt-7 flex items-center justify-center gap-2 text-[13px] font-bold text-black/45 transition hover:text-[#df1f2d]"><ArrowLeft size={15} /> Back to website</a>
        </section>
      </div>
    </AdminFrame>
  );
}

function EditableText({
  value,
  onChange,
  label,
  className,
  multiline = true,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  className: string;
  multiline?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value]);

  return (
    <div
      ref={ref}
      role="textbox"
      aria-label={label}
      aria-multiline={multiline}
      contentEditable
      suppressContentEditableWarning
      spellCheck
      onKeyDown={(event) => {
        if (!multiline && event.key === "Enter") event.preventDefault();
      }}
      onInput={(event) => onChange(event.currentTarget.innerText)}
      className={`wysiwyg-editable rounded-lg outline-none ${className}`}
    >
      {value}
    </div>
  );
}

function LanguageSwitch({ language, setLanguage }: { language: HomepageLanguage; setLanguage: (language: HomepageLanguage) => void }) {
  return (
    <div className="inline-flex rounded-full border border-black/[.08] bg-white p-1 shadow-sm">
      {(["ar", "en", "fr"] as HomepageLanguage[]).map((code) => (
        <button key={code} type="button" onClick={() => setLanguage(code)} className={`rounded-full px-3.5 py-2 text-[11px] font-extrabold transition ${language === code ? "bg-[#191919] text-white" : "text-black/40 hover:text-black"}`}>{code.toUpperCase()}</button>
      ))}
    </div>
  );
}

export function HomepageDashboard({
  initialContent,
  publishingConfigured,
}: {
  initialContent: HomepageContent;
  publishingConfigured: boolean;
}) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [language, setLanguage] = useState<HomepageLanguage>("ar");
  const [activeSection, setActiveSection] = useState<HomepageSectionKey>("hero");
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [presidentImage, setPresidentImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const heroObjectUrl = useMemo(() => heroImage ? URL.createObjectURL(heroImage) : "", [heroImage]);
  const presidentObjectUrl = useMemo(() => presidentImage ? URL.createObjectURL(presidentImage) : "", [presidentImage]);
  useEffect(() => () => { if (heroObjectUrl) URL.revokeObjectURL(heroObjectUrl); }, [heroObjectUrl]);
  useEffect(() => () => { if (presidentObjectUrl) URL.revokeObjectURL(presidentObjectUrl); }, [presidentObjectUrl]);

  const setLocalized = (section: HomepageSectionKey, field: string, value: string) => {
    setContent((current) => {
      const next = structuredClone(current);
      if (section === "footer") {
        next.footer.line[language] = value;
      } else {
        const target = next[section] as unknown as Record<string, HomepageLocalizedText | string>;
        const localized = target[field];
        if (localized && typeof localized === "object") localized[language] = value;
      }
      return next;
    });
  };

  const selectImage = async (kind: "hero" | "president", file: File | undefined) => {
    if (!file) return;
    setNotice(null);
    try {
      const optimized = await optimizeImage(file);
      if (kind === "hero") setHeroImage(optimized);
      else setPresidentImage(optimized);
    } catch (caught) {
      setNotice({ kind: "error", text: caught instanceof Error ? caught.message : "The image could not be prepared." });
    }
  };

  const save = async () => {
    setSaving(true);
    setNotice(null);
    try {
      const form = new FormData();
      form.set("content", JSON.stringify(content));
      if (heroImage) form.set("heroImage", heroImage);
      if (presidentImage) form.set("presidentImage", presidentImage);
      const response = await fetch("/api/homepage", { method: "PUT", body: form });
      const data = (await response.json()) as { content?: HomepageContent; error?: string };
      if (!response.ok || !data.content) throw new Error(data.error || "The homepage could not be saved.");
      setContent(data.content);
      setHeroImage(null);
      setPresidentImage(null);
      setNotice({ kind: "success", text: "Homepage changes were saved. Vercel will publish the new version automatically." });
    } catch (caught) {
      setNotice({ kind: "error", text: caught instanceof Error ? caught.message : "The homepage could not be saved." });
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  const section = activeSection === "footer" ? null : content[activeSection] as unknown as Record<string, HomepageLocalizedText | string>;
  const localizedValue = (field: string) => {
    if (activeSection === "footer") return content.footer.line[language];
    const value = section?.[field];
    return value && typeof value === "object" ? value[language] : "";
  };
  const rtl = language === "ar";

  const genericPreview = (tone: "light" | "dark" = "light") => (
    <section className={`relative min-h-[560px] overflow-hidden rounded-[28px] p-7 sm:p-12 lg:p-16 ${tone === "dark" ? "bg-[#191919] text-white" : "soft-grid bg-[#f7f7f5] text-[#171717]"}`}>
      {tone === "dark" && <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#df1f2d]/25 blur-3xl" />}
      <div className="relative mx-auto flex min-h-[420px] max-w-4xl flex-col justify-center">
        <EditableText value={localizedValue("kicker")} onChange={(value) => setLocalized(activeSection, "kicker", value)} label="Section label" multiline={false} className={`w-fit px-2 py-1 text-[13px] font-extrabold ${tone === "dark" ? "text-[#ff6570]" : "text-[#df1f2d]"}`} />
        <EditableText value={localizedValue("title")} onChange={(value) => setLocalized(activeSection, "title", value)} label="Section title" className="section-title mt-5 max-w-3xl px-2 py-1 text-[clamp(2.4rem,6vw,5.6rem)] font-extrabold leading-[1.2]" />
        <EditableText value={localizedValue("text")} onChange={(value) => setLocalized(activeSection, "text", value)} label="Section description" className={`mt-6 max-w-3xl px-2 py-1 text-[17px] leading-9 ${tone === "dark" ? "text-white/62" : "text-black/55"}`} />
        <div className={`mt-12 grid gap-3 sm:grid-cols-3 ${tone === "dark" ? "text-white" : "text-black"}`}>
          {[1, 2, 3].map((item) => <div key={item} className={`h-28 rounded-[20px] border ${tone === "dark" ? "border-white/10 bg-white/[.05]" : "border-black/[.07] bg-white"}`} />)}
        </div>
      </div>
    </section>
  );

  const renderPreview = () => {
    if (activeSection === "hero") {
      return (
        <section className="soft-grid grid min-h-[590px] items-center gap-9 rounded-[28px] bg-[#f7f7f5] p-7 sm:p-12 lg:grid-cols-[1.08fr_.92fr] lg:p-16">
          <div>
            <EditableText value={content.hero.eyebrow[language]} onChange={(value) => setLocalized("hero", "eyebrow", value)} label="Hero label" multiline={false} className="w-fit bg-white/80 px-4 py-2 text-[13px] font-extrabold text-[#df1f2d] shadow-sm" />
            <EditableText value={content.hero.title[language]} onChange={(value) => setLocalized("hero", "title", value)} label="Hero title" className="display-title mt-5 whitespace-pre-line px-2 py-1 text-[clamp(2.5rem,6vw,5.6rem)] font-extrabold leading-[1.14]" />
            <EditableText value={content.hero.intro[language]} onChange={(value) => setLocalized("hero", "intro", value)} label="Hero introduction" className="mt-6 max-w-3xl px-2 py-1 text-[17px] leading-9 text-black/58" />
          </div>
          <label htmlFor="hero-image" className="group relative mx-auto grid aspect-square w-full max-w-[410px] cursor-pointer place-items-center overflow-hidden rounded-[36px] border border-black/[.06] bg-white/80 p-7 shadow-[0_24px_70px_rgba(0,0,0,.09)]">
            <img src={heroObjectUrl || content.hero.imageUrl} alt="Hero preview" className="h-full w-full rounded-[26px] object-contain" />
            <span className="absolute inset-x-5 bottom-5 rounded-full bg-[#191919]/90 px-5 py-3 text-center text-[13px] font-bold text-white opacity-0 transition group-hover:opacity-100"><ImagePlus className="mr-2 inline" size={16} /> Replace image</span>
          </label>
          <Input id="hero-image" className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void selectImage("hero", event.target.files?.[0])} />
        </section>
      );
    }
    if (activeSection === "president") {
      return (
        <section className="relative grid min-h-[620px] overflow-hidden rounded-[28px] bg-[#191919] text-white lg:grid-cols-[.9fr_1.1fr]">
          <label htmlFor="president-image" className="group relative min-h-[420px] cursor-pointer overflow-hidden bg-black lg:min-h-[620px]">
            <img src={presidentObjectUrl || content.president.imageUrl} alt="President preview" className="absolute inset-0 h-full w-full object-cover object-top" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <span className="absolute inset-x-5 bottom-5 rounded-full bg-white/92 px-5 py-3 text-center text-[13px] font-bold text-[#191919] opacity-0 transition group-hover:opacity-100"><ImagePlus className="mr-2 inline" size={16} /> Replace photograph</span>
          </label>
          <Input id="president-image" className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void selectImage("president", event.target.files?.[0])} />
          <div className="relative flex flex-col justify-center p-7 sm:p-12 lg:p-14">
            <EditableText value={content.president.kicker[language]} onChange={(value) => setLocalized("president", "kicker", value)} label="President label" multiline={false} className="w-fit px-2 py-1 text-[13px] font-extrabold text-[#ff6570]" />
            <EditableText value={content.president.title[language]} onChange={(value) => setLocalized("president", "title", value)} label="President name" className="section-title mt-4 px-2 py-1 text-[clamp(2.5rem,5vw,5rem)] font-extrabold leading-[1.15]" />
            <EditableText value={content.president.role[language]} onChange={(value) => setLocalized("president", "role", value)} label="President role" className="mt-3 px-2 py-1 text-[17px] font-bold text-white/62" />
            <EditableText value={content.president.bio[language]} onChange={(value) => setLocalized("president", "bio", value)} label="First biography paragraph" className="mt-7 px-2 py-1 text-[15px] leading-8 text-white/66" />
            <EditableText value={content.president.bio2[language]} onChange={(value) => setLocalized("president", "bio2", value)} label="Second biography paragraph" className="mt-3 px-2 py-1 text-[15px] leading-8 text-white/66" />
            <EditableText value={content.president.imageCredit[language]} onChange={(value) => setLocalized("president", "imageCredit", value)} label="Photograph credit" multiline={false} className="mt-7 px-2 py-1 text-[11px] text-white/38" />
          </div>
        </section>
      );
    }
    if (activeSection === "footer") {
      return (
        <section className="relative grid min-h-[420px] place-items-center overflow-hidden rounded-[28px] bg-[#191919] p-8 text-center text-white">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#df1f2d]/25 blur-3xl" />
          <div className="relative max-w-4xl"><img src="/lf-logo.png" alt="" className="mx-auto h-24 w-24 rounded-full bg-white object-contain p-2" /><EditableText value={content.footer.line[language]} onChange={(value) => setLocalized("footer", "line", value)} label="Footer statement" className="section-title mt-8 px-2 py-1 text-[clamp(2rem,5vw,4rem)] font-extrabold leading-[1.3]" /></div>
        </section>
      );
    }
    return genericPreview(activeSection === "vision" || activeSection === "media" ? "dark" : "light");
  };

  return (
    <AdminFrame>
      <header className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-black/[.06] bg-white px-5 py-3.5 shadow-[0_10px_35px_rgba(0,0,0,.045)]">
        <a href="/" className="flex items-center gap-3"><img src="/lf-logo.png" alt="Lebanese Forces" className="h-11 w-11 rounded-full object-contain" /><span><span className="block text-[15px] font-extrabold">Homepage editor</span><span className="block text-[10px] font-bold text-black/35">Edit directly in the preview</span></span></a>
        <div className="flex flex-wrap items-center gap-2"><Button asChild variant="outline" className="h-10 rounded-full border-black/10 px-4 font-bold"><a href="/" target="_blank"><Eye /> View website <ExternalLink /></a></Button><Button type="button" variant="ghost" onClick={logout} className="h-10 rounded-full px-4 font-bold text-black/50 hover:bg-red-50 hover:text-[#df1f2d]"><LogOut /> Sign out</Button></div>
      </header>

      {!publishingConfigured && <Alert className="mb-5 border-amber-200 bg-amber-50 text-amber-950"><UploadCloud /><AlertTitle>Publishing is not connected</AlertTitle><AlertDescription>Add GITHUB_CONTENT_TOKEN in Vercel with Contents: Read and write.</AlertDescription></Alert>}
      {notice && <Alert variant={notice.kind === "error" ? "destructive" : "default"} className={`mb-5 ${notice.kind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : ""}`}>{notice.kind === "success" ? <CheckCircle2 /> : <LockKeyhole />}<AlertTitle>{notice.kind === "success" ? "Saved" : "Could not save"}</AlertTitle><AlertDescription>{notice.text}</AlertDescription></Alert>}

      <div className="grid items-start gap-5 xl:grid-cols-[290px_1fr]">
        <aside className="rounded-[24px] border border-black/[.07] bg-white p-4 shadow-[0_16px_48px_rgba(0,0,0,.05)] xl:sticky xl:top-5">
          <div className="flex items-center justify-between gap-3 px-2 pb-4"><div><div className="text-[11px] font-extrabold text-[#df1f2d]">PAGE CONTENT</div><h2 className="mt-1 text-xl font-extrabold">Choose a section</h2></div><LayoutTemplate className="text-black/25" /></div>
          <nav className="space-y-1.5">{sections.map((item) => <button key={item.key} type="button" onClick={() => setActiveSection(item.key)} className={`flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-left transition ${activeSection === item.key ? "bg-[#191919] text-white shadow-md" : "hover:bg-[#f2f2ef]"}`}><span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-extrabold ${activeSection === item.key ? "bg-[#df1f2d] text-white" : "bg-[#f1f1ee] text-black/35"}`}>{activeSection === item.key ? <Check size={14} /> : sections.indexOf(item) + 1}</span><span><span className="block text-[13px] font-extrabold">{item.label}</span><span className={`mt-0.5 block text-[10px] ${activeSection === item.key ? "text-white/42" : "text-black/38"}`}>{item.hint}</span></span></button>)}</nav>
          <div className="mt-5 border-t border-black/[.07] pt-5"><LanguageSwitch language={language} setLanguage={setLanguage} /><p className="mt-3 px-1 text-[11px] leading-5 text-black/40">Select a language, then click any text in the preview and type.</p></div>
          <Button type="button" onClick={() => void save()} disabled={saving || !publishingConfigured} className="mt-5 h-12 w-full rounded-2xl bg-[#df1f2d] font-extrabold hover:bg-[#c51825]">{saving ? <Loader2 className="animate-spin" /> : <Save />} Save homepage</Button>
        </aside>

        <section className="min-w-0 rounded-[28px] border border-black/[.07] bg-white p-3 shadow-[0_18px_55px_rgba(0,0,0,.055)] sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-2"><div><div className="text-[11px] font-extrabold text-[#df1f2d]">LIVE PREVIEW</div><div className="mt-1 text-[13px] font-bold text-black/45">Click highlighted text to edit it</div></div><div className="flex items-center gap-2 rounded-full bg-[#f1f1ee] px-3 py-2 text-[11px] font-bold text-black/45"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Desktop preview</div></div>
          <div dir={rtl ? "rtl" : "ltr"} className="overflow-hidden rounded-[28px] border border-black/[.06]">{renderPreview()}</div>
        </section>
      </div>
    </AdminFrame>
  );
}
