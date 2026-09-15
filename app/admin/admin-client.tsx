"use client";

import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  ImagePlus,
  Loader2,
  LockKeyhole,
  LogOut,
  Newspaper,
  UploadCloud,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Article, ArticleLanguage } from "@/lib/article-types";
import { articleHref, formatArticleDate } from "@/lib/article-types";

type TranslationState = Record<ArticleLanguage, string>;

const emptyTranslations = (): TranslationState => ({ ar: "", en: "", fr: "" });

async function optimizeImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) throw new Error("يرجى اختيار صورة صالحة.");
  if (file.size <= 1_500_000) return file;

  const bitmap = await createImageBitmap(file);
  const maximum = 1800;
  const scale = Math.min(1, maximum / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("تعذّر تجهيز الصورة.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.84),
  );
  if (!blob) throw new Error("تعذّر ضغط الصورة.");
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "article"}.jpg`, {
    type: "image/jpeg",
  });
}

function AdminFrame({ children }: { children: React.ReactNode }) {
  return (
    <main dir="rtl" className="admin-surface min-h-screen bg-[#f5f5f2] px-4 py-5 text-[#171717] sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-[1180px]">{children}</div>
    </main>
  );
}

export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [username, setUsername] = useState("LFadmin");
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
      if (!response.ok) throw new Error(data.error || "تعذّر تسجيل الدخول.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "تعذّر تسجيل الدخول.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminFrame>
      <div className="grid min-h-[calc(100vh-4rem)] items-center gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <section className="relative overflow-hidden rounded-[34px] bg-[#191919] p-8 text-white shadow-[0_28px_80px_rgba(0,0,0,.16)] sm:p-11 lg:min-h-[610px]">
          <div className="absolute -end-28 -top-28 h-80 w-80 rounded-full bg-[#df1f2d]/30 blur-3xl" />
          <div className="relative flex h-full flex-col">
            <a href="/" className="flex w-fit items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-white shadow-lg">
                <img src="/lf-logo.png" alt="القوات اللبنانية" className="h-11 w-11 rounded-full object-contain" />
              </span>
              <span>
                <span className="block text-lg font-extrabold">القوات اللبنانية</span>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-[.12em] text-white/40">Lebanese Forces</span>
              </span>
            </a>
            <div className="relative mt-24 max-w-lg lg:mt-auto lg:pb-8">
              <div className="mb-5 flex items-center gap-2 text-[12px] font-bold text-[#ff6570]"><LockKeyhole size={16} /> مساحة خاصة</div>
              <h1 className="section-title text-[clamp(2.4rem,5vw,4.6rem)] font-extrabold leading-[1.2]">إدارة الأخبار</h1>
              <p className="mt-5 max-w-md text-[16px] leading-8 text-white/58">إضافة الخبر والصورة، ثم نشرهما مباشرة ضمن آخر الأخبار.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-black/[.07] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,.07)] sm:p-10 lg:p-12">
          <div className="mb-9">
            <div className="text-[12px] font-extrabold text-[#df1f2d]">تسجيل الدخول</div>
            <h2 className="mt-2 text-3xl font-extrabold">أهلاً بك</h2>
            <p className="mt-2 text-[14px] text-black/45">استخدم بيانات مدير الموقع للمتابعة.</p>
          </div>

          {!configured && (
            <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-950">
              <LockKeyhole />
              <AlertTitle>يلزم إكمال الإعداد على Vercel</AlertTitle>
              <AlertDescription>أضف كلمة المرور ضمن Environment Variables، ثم أعد النشر.</AlertDescription>
            </Alert>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="username" className="font-bold">اسم المستخدم</Label>
              <Input id="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="h-13 rounded-2xl px-4 text-[16px]" required />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="password" className="font-bold">كلمة المرور</Label>
              <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-13 rounded-2xl px-4 text-[16px]" required />
            </div>
            {error && <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-[13px] font-bold text-red-700">{error}</p>}
            <Button type="submit" disabled={loading || !configured} className="h-13 w-full rounded-2xl bg-[#df1f2d] text-[15px] font-extrabold hover:bg-[#c51825]">
              {loading ? <Loader2 className="animate-spin" /> : <LockKeyhole />}
              دخول إلى الإدارة
            </Button>
          </form>
          <a href="/" className="mt-7 flex items-center justify-center gap-2 text-[13px] font-bold text-black/45 transition hover:text-[#df1f2d]"><ArrowLeft size={15} /> العودة إلى الموقع</a>
        </section>
      </div>
    </AdminFrame>
  );
}

export function AdminDashboard({ publishingConfigured }: { publishingConfigured: boolean }) {
  const router = useRouter();
  const [title, setTitle] = useState<TranslationState>(emptyTranslations);
  const [body, setBody] = useState<TranslationState>(emptyTranslations);
  const [image, setImage] = useState<File | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const previewUrl = useMemo(() => (image ? URL.createObjectURL(image) : ""), [image]);
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const loadArticles = async () => {
    setLoadingArticles(true);
    try {
      const response = await fetch("/api/articles", { cache: "no-store" });
      const data = (await response.json()) as { articles?: Article[] };
      setArticles(data.articles || []);
    } finally {
      setLoadingArticles(false);
    }
  };

  useEffect(() => {
    void loadArticles();
  }, []);

  const selectImage = async (file: File | undefined) => {
    if (!file) return;
    setMessage(null);
    try {
      setImage(await optimizeImage(file));
    } catch (caught) {
      setMessage({ kind: "error", text: caught instanceof Error ? caught.message : "تعذّر تجهيز الصورة." });
    }
  };

  const publish = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!image) {
      setMessage({ kind: "error", text: "اختر صورة للخبر." });
      return;
    }
    setSubmitting(true);
    try {
      const form = new FormData();
      form.set("image", image);
      form.set("titleAr", title.ar);
      form.set("titleEn", title.en);
      form.set("titleFr", title.fr);
      form.set("bodyAr", body.ar);
      form.set("bodyEn", body.en);
      form.set("bodyFr", body.fr);

      const response = await fetch("/api/articles", { method: "POST", body: form });
      const data = (await response.json()) as { error?: string; article?: Article };
      if (!response.ok) throw new Error(data.error || "تعذّر نشر الخبر.");

      setTitle(emptyTranslations());
      setBody(emptyTranslations());
      setImage(null);
      setMessage({ kind: "success", text: "تم نشر الخبر بنجاح، وأصبح في أعلى قائمة الأخبار." });
      await loadArticles();
    } catch (caught) {
      setMessage({ kind: "error", text: caught instanceof Error ? caught.message : "تعذّر نشر الخبر." });
    } finally {
      setSubmitting(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  const updateTranslation = (
    setter: React.Dispatch<React.SetStateAction<TranslationState>>,
    language: ArticleLanguage,
    value: string,
  ) => setter((current) => ({ ...current, [language]: value }));

  return (
    <AdminFrame>
      <header className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-black/[.06] bg-white px-5 py-4 shadow-[0_10px_35px_rgba(0,0,0,.045)] sm:px-6">
        <a href="/" className="flex items-center gap-3">
          <img src="/lf-logo.png" alt="القوات اللبنانية" className="h-11 w-11 rounded-full object-contain" />
          <span>
            <span className="block text-[15px] font-extrabold">إدارة الأخبار</span>
            <span className="block text-[10px] font-bold text-black/35">القوات اللبنانية</span>
          </span>
        </a>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="h-10 rounded-full border-black/10 px-4 font-bold"><a href="/" target="_blank">عرض الموقع <ExternalLink /></a></Button>
          <Button type="button" variant="ghost" onClick={logout} className="h-10 rounded-full px-4 font-bold text-black/50 hover:bg-red-50 hover:text-[#df1f2d]"><LogOut /> خروج</Button>
        </div>
      </header>

      {!publishingConfigured && (
        <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-950">
          <UploadCloud />
          <AlertTitle>النشر غير متصل بعد</AlertTitle>
          <AlertDescription>أضف GITHUB_CONTENT_TOKEN في Vercel بصلاحية Contents: Read and write.</AlertDescription>
        </Alert>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_.65fr]">
        <section className="rounded-[30px] border border-black/[.07] bg-white p-5 shadow-[0_18px_55px_rgba(0,0,0,.055)] sm:p-8">
          <div className="mb-7 flex items-start justify-between gap-5">
            <div>
              <div className="text-[12px] font-extrabold text-[#df1f2d]">خبر جديد</div>
              <h1 className="mt-2 text-[clamp(1.7rem,3vw,2.6rem)] font-extrabold">أضف الصورة، العنوان والمقال</h1>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#f5f5f2] text-[#df1f2d]"><Newspaper size={21} /></span>
          </div>

          <form onSubmit={publish} className="space-y-7">
            <div>
              <Label htmlFor="article-image" className="mb-3 font-extrabold">صورة الخبر</Label>
              <label htmlFor="article-image" className="group relative flex min-h-[250px] cursor-pointer items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-black/15 bg-[#f7f7f5] transition hover:border-[#df1f2d]/45 hover:bg-red-50/40">
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="معاينة صورة الخبر" className="absolute inset-0 h-full w-full object-cover" />
                    <span className="absolute inset-0 bg-black/20 transition group-hover:bg-black/32" />
                    <span className="relative rounded-full bg-white/92 px-5 py-3 text-[13px] font-extrabold shadow-lg"><ImagePlus className="me-2 inline" size={17} /> تغيير الصورة</span>
                  </>
                ) : (
                  <span className="text-center">
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-[#df1f2d] shadow-md"><ImagePlus size={22} /></span>
                    <span className="mt-4 block text-[15px] font-extrabold">اختر صورة للخبر</span>
                    <span className="mt-1 block text-[12px] text-black/40">JPG، PNG أو WebP</span>
                  </span>
                )}
              </label>
              <Input id="article-image" className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void selectImage(event.target.files?.[0])} />
            </div>

            <Tabs defaultValue="ar" dir="rtl">
              <TabsList className="h-auto w-full justify-start gap-1 rounded-2xl bg-[#f3f3f0] p-1.5">
                <TabsTrigger value="ar" className="h-10 flex-1 rounded-xl font-extrabold data-[state=active]:bg-white data-[state=active]:text-[#df1f2d]">العربية *</TabsTrigger>
                <TabsTrigger value="en" className="h-10 flex-1 rounded-xl font-extrabold data-[state=active]:bg-white data-[state=active]:text-[#df1f2d]">English</TabsTrigger>
                <TabsTrigger value="fr" className="h-10 flex-1 rounded-xl font-extrabold data-[state=active]:bg-white data-[state=active]:text-[#df1f2d]">Français</TabsTrigger>
              </TabsList>
              {(["ar", "en", "fr"] as ArticleLanguage[]).map((language) => (
                <TabsContent key={language} value={language} className="mt-5 space-y-5" dir={language === "ar" ? "rtl" : "ltr"}>
                  <div className="space-y-2.5">
                    <Label htmlFor={`title-${language}`} className="font-extrabold">{language === "ar" ? "العنوان" : language === "en" ? "Title" : "Titre"}</Label>
                    <Input id={`title-${language}`} value={title[language]} onChange={(event) => updateTranslation(setTitle, language, event.target.value)} maxLength={240} required={language === "ar"} className="h-13 rounded-2xl px-4 text-[16px]" placeholder={language === "ar" ? "عنوان واضح ومختصر" : "Optional translation"} />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor={`body-${language}`} className="font-extrabold">{language === "ar" ? "نص المقال" : language === "en" ? "Article" : "Article"}</Label>
                    <Textarea id={`body-${language}`} value={body[language]} onChange={(event) => updateTranslation(setBody, language, event.target.value)} maxLength={40000} required={language === "ar"} className="min-h-[280px] resize-y rounded-2xl px-4 py-4 text-[16px] leading-8" placeholder={language === "ar" ? "اكتب نص المقال هنا…" : "Optional translation"} />
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {message && (
              <Alert variant={message.kind === "error" ? "destructive" : "default"} className={message.kind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : ""}>
                {message.kind === "success" ? <CheckCircle2 /> : <LockKeyhole />}
                <AlertTitle>{message.kind === "success" ? "تم النشر" : "تعذّر النشر"}</AlertTitle>
                <AlertDescription className="text-current/70">{message.text}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={submitting || !publishingConfigured} className="h-14 w-full rounded-2xl bg-[#df1f2d] text-[15px] font-extrabold shadow-[0_12px_30px_rgba(223,31,45,.2)] hover:bg-[#c51825] sm:w-auto sm:px-9">
              {submitting ? <Loader2 className="animate-spin" /> : <UploadCloud />}
              نشر الخبر الآن
            </Button>
          </form>
        </section>

        <aside className="rounded-[30px] bg-[#191919] p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,.12)] sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-[#ff6570]">الأحدث أولاً</div>
              <h2 className="mt-1 text-2xl font-extrabold">آخر الأخبار</h2>
            </div>
            <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-bold text-white/55">{articles.length}</span>
          </div>
          <div className="mt-6 space-y-2.5">
            {loadingArticles ? (
              <div className="grid min-h-36 place-items-center"><Loader2 className="animate-spin text-white/40" /></div>
            ) : (
              articles.slice(0, 8).map((article, index) => (
                <a key={article.id} href={articleHref(article)} target={article.externalUrl ? "_blank" : undefined} rel={article.externalUrl ? "noreferrer" : undefined} className="group flex gap-3 rounded-[18px] border border-white/[.07] bg-white/[.045] p-3.5 transition hover:border-[#df1f2d]/55 hover:bg-white/[.08]">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/8 text-[10px] font-extrabold text-[#ff6570]">{index + 1}</span>
                  <span className="min-w-0">
                    <span className="line-clamp-2 block text-[13px] font-extrabold leading-6">{article.title.ar}</span>
                    <span className="mt-1 block text-[10px] text-white/35">{formatArticleDate(article.publishedAt, "ar")}</span>
                  </span>
                </a>
              ))
            )}
          </div>
        </aside>
      </div>
    </AdminFrame>
  );
}
