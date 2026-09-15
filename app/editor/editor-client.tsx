"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Edit3,
  ExternalLink,
  ImagePlus,
  Loader2,
  LockKeyhole,
  LogOut,
  Newspaper,
  Plus,
  Save,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Article, ArticleLanguage } from "@/lib/article-types";
import { articleHref, formatArticleDate } from "@/lib/article-types";

type TranslationState = Record<ArticleLanguage, string>;
type Notice = { kind: "success" | "error"; text: string } | null;

const emptyTranslations = (): TranslationState => ({ ar: "", en: "", fr: "" });

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
    canvas.toBlob(resolve, "image/jpeg", 0.84),
  );
  if (!blob) throw new Error("The image could not be compressed.");
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "article"}.jpg`, {
    type: "image/jpeg",
  });
}

function ManagementFrame({ children }: { children: React.ReactNode }) {
  return (
    <main dir="ltr" className="admin-surface min-h-screen bg-[#f5f5f2] px-4 py-5 text-[#171717] sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-[1320px]">{children}</div>
    </main>
  );
}

export function EditorLogin({
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
      const response = await fetch("/api/editor/login", {
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
    <ManagementFrame>
      <div className="grid min-h-[calc(100vh-4rem)] items-center gap-8 lg:grid-cols-[.92fr_1.08fr]">
        <section className="relative overflow-hidden rounded-[34px] bg-[#191919] p-8 text-white shadow-[0_28px_80px_rgba(0,0,0,.16)] sm:p-11 lg:min-h-[610px]">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#df1f2d]/30 blur-3xl" />
          <div className="relative flex h-full flex-col">
            <a href="/" className="flex w-fit items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-white shadow-lg">
                <img src="/lf-logo.png" alt="Lebanese Forces" className="h-11 w-11 rounded-full object-contain" />
              </span>
              <span>
                <span className="block text-lg font-extrabold">Lebanese Forces</span>
                <span className="mt-1 block text-[11px] font-bold text-white/40">NEWSROOM</span>
              </span>
            </a>
            <div className="relative mt-24 max-w-lg lg:mt-auto lg:pb-8">
              <div className="mb-5 flex items-center gap-2 text-[12px] font-bold text-[#ff6570]"><Newspaper size={16} /> Editor access</div>
              <h1 className="section-title text-[clamp(2.4rem,5vw,4.6rem)] font-extrabold leading-[1.2]">News editor</h1>
              <p className="mt-5 max-w-md text-[16px] leading-8 text-white/58">Create, update and remove articles from one dedicated workspace.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-black/[.07] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,.07)] sm:p-10 lg:p-12">
          <div className="mb-9">
            <div className="text-[12px] font-extrabold text-[#df1f2d]">EDITOR SIGN IN</div>
            <h2 className="mt-2 text-3xl font-extrabold">Welcome back</h2>
            <p className="mt-2 text-[14px] text-black/45">Use the editor credentials to continue.</p>
          </div>
          {!configured && (
            <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-950">
              <LockKeyhole />
              <AlertTitle>Editor access needs configuration</AlertTitle>
              <AlertDescription>Add the editor credentials in Vercel, then redeploy.</AlertDescription>
            </Alert>
          )}
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="editor-username" className="font-bold">Username</Label>
              <Input id="editor-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="h-13 rounded-2xl px-4 text-[16px]" required />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="editor-password" className="font-bold">Password</Label>
              <Input id="editor-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-13 rounded-2xl px-4 text-[16px]" required />
            </div>
            {error && <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-[13px] font-bold text-red-700">{error}</p>}
            <Button type="submit" disabled={loading || !configured} className="h-13 w-full rounded-2xl bg-[#df1f2d] text-[15px] font-extrabold hover:bg-[#c51825]">
              {loading ? <Loader2 className="animate-spin" /> : <LockKeyhole />} Sign in
            </Button>
          </form>
          <a href="/" className="mt-7 flex items-center justify-center gap-2 text-[13px] font-bold text-black/45 transition hover:text-[#df1f2d]"><ArrowLeft size={15} /> Back to website</a>
        </section>
      </div>
    </ManagementFrame>
  );
}

export function EditorDashboard({ publishingConfigured }: { publishingConfigured: boolean }) {
  const router = useRouter();
  const formRef = useRef<HTMLElement>(null);
  const [title, setTitle] = useState<TranslationState>(emptyTranslations);
  const [body, setBody] = useState<TranslationState>(emptyTranslations);
  const [image, setImage] = useState<File | null>(null);
  const [editing, setEditing] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [fileKey, setFileKey] = useState(0);

  const objectUrl = useMemo(() => (image ? URL.createObjectURL(image) : ""), [image]);
  const previewUrl = objectUrl || editing?.imageUrl || "";
  useEffect(() => () => { if (objectUrl) URL.revokeObjectURL(objectUrl); }, [objectUrl]);

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

  useEffect(() => { void loadArticles(); }, []);

  const clearForm = () => {
    setEditing(null);
    setTitle(emptyTranslations());
    setBody(emptyTranslations());
    setImage(null);
    setFileKey((value) => value + 1);
  };

  const startEdit = (article: Article) => {
    setEditing(article);
    setTitle({ ...article.title });
    setBody({ ...article.body });
    setImage(null);
    setFileKey((value) => value + 1);
    setNotice(null);
    window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  const selectImage = async (file: File | undefined) => {
    if (!file) return;
    setNotice(null);
    try {
      setImage(await optimizeImage(file));
    } catch (caught) {
      setNotice({ kind: "error", text: caught instanceof Error ? caught.message : "The image could not be prepared." });
    }
  };

  const saveArticle = async (event: FormEvent) => {
    event.preventDefault();
    setNotice(null);
    if (!editing && !image) {
      setNotice({ kind: "error", text: "Choose a photograph for the new article." });
      return;
    }
    setSubmitting(true);
    try {
      const form = new FormData();
      if (image) form.set("image", image);
      form.set("titleAr", title.ar);
      form.set("titleEn", title.en);
      form.set("titleFr", title.fr);
      form.set("bodyAr", body.ar);
      form.set("bodyEn", body.en);
      form.set("bodyFr", body.fr);
      const response = await fetch(
        editing ? `/api/articles/${encodeURIComponent(editing.id)}` : "/api/articles",
        { method: editing ? "PUT" : "POST", body: form },
      );
      const data = (await response.json()) as { error?: string; article?: Article };
      if (!response.ok) throw new Error(data.error || "The article could not be saved.");
      const wasEditing = Boolean(editing);
      clearForm();
      setNotice({ kind: "success", text: wasEditing ? "The article was updated." : "The article was published and is now the newest story." });
      await loadArticles();
    } catch (caught) {
      setNotice({ kind: "error", text: caught instanceof Error ? caught.message : "The article could not be saved." });
    } finally {
      setSubmitting(false);
    }
  };

  const removeArticle = async (article: Article) => {
    setDeletingId(article.id);
    setNotice(null);
    try {
      const response = await fetch(`/api/articles/${encodeURIComponent(article.id)}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "The article could not be deleted.");
      if (editing?.id === article.id) clearForm();
      setNotice({ kind: "success", text: "The article was removed from the website." });
      await loadArticles();
    } catch (caught) {
      setNotice({ kind: "error", text: caught instanceof Error ? caught.message : "The article could not be deleted." });
    } finally {
      setDeletingId(null);
    }
  };

  const logout = async () => {
    await fetch("/api/editor/logout", { method: "POST" });
    router.refresh();
  };

  const updateTranslation = (
    setter: React.Dispatch<React.SetStateAction<TranslationState>>,
    language: ArticleLanguage,
    value: string,
  ) => setter((current) => ({ ...current, [language]: value }));

  return (
    <ManagementFrame>
      <header className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-black/[.06] bg-white px-5 py-4 shadow-[0_10px_35px_rgba(0,0,0,.045)] sm:px-6">
        <a href="/" className="flex items-center gap-3">
          <img src="/lf-logo.png" alt="Lebanese Forces" className="h-11 w-11 rounded-full object-contain" />
          <span><span className="block text-[15px] font-extrabold">News editor</span><span className="block text-[10px] font-bold text-black/35">Lebanese Forces</span></span>
        </a>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" className="h-10 rounded-full border-black/10 px-4 font-bold"><a href="/news" target="_blank">View news <ExternalLink /></a></Button>
          <Button type="button" variant="ghost" onClick={logout} className="h-10 rounded-full px-4 font-bold text-black/50 hover:bg-red-50 hover:text-[#df1f2d]"><LogOut /> Sign out</Button>
        </div>
      </header>

      {!publishingConfigured && (
        <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-950"><UploadCloud /><AlertTitle>Publishing is not connected</AlertTitle><AlertDescription>Add GITHUB_CONTENT_TOKEN in Vercel with Contents: Read and write.</AlertDescription></Alert>
      )}
      {notice && (
        <Alert variant={notice.kind === "error" ? "destructive" : "default"} className={`mb-6 ${notice.kind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : ""}`}>
          {notice.kind === "success" ? <CheckCircle2 /> : <LockKeyhole />}<AlertTitle>{notice.kind === "success" ? "Done" : "Something went wrong"}</AlertTitle><AlertDescription>{notice.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[.95fr_1.05fr]">
        <section ref={formRef} className="scroll-mt-5 rounded-[30px] border border-black/[.07] bg-white p-5 shadow-[0_18px_55px_rgba(0,0,0,.055)] sm:p-8">
          <div className="mb-7 flex items-start justify-between gap-5">
            <div><div className="text-[12px] font-extrabold text-[#df1f2d]">{editing ? "EDIT ARTICLE" : "NEW ARTICLE"}</div><h1 className="mt-2 text-[clamp(1.7rem,3vw,2.55rem)] font-extrabold">{editing ? "Update the selected story" : "Create a story"}</h1></div>
            {editing && <Button type="button" variant="outline" onClick={clearForm} className="rounded-full"><X /> Cancel</Button>}
          </div>

          <form onSubmit={saveArticle} className="space-y-7">
            <div>
              <Label htmlFor="article-image" className="mb-3 block font-extrabold">Cover photograph {editing ? "(optional)" : "*"}</Label>
              <label htmlFor="article-image" className="group relative grid aspect-[16/7.5] cursor-pointer place-items-center overflow-hidden rounded-[24px] border border-dashed border-black/15 bg-[#f5f5f2] transition hover:border-[#df1f2d]/50">
                {previewUrl ? <><img src={previewUrl} alt="Article preview" className="absolute inset-0 h-full w-full object-cover" /><span className="absolute inset-0 bg-black/24 transition group-hover:bg-black/34" /><span className="relative rounded-full bg-white/92 px-5 py-3 text-[13px] font-extrabold shadow-lg"><ImagePlus className="mr-2 inline" size={17} /> Change photo</span></> : <span className="text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-[#df1f2d] shadow-md"><ImagePlus size={22} /></span><span className="mt-4 block text-[15px] font-extrabold">Choose a photo</span><span className="mt-1 block text-[12px] text-black/40">JPG, PNG or WebP</span></span>}
              </label>
              <Input key={fileKey} id="article-image" className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void selectImage(event.target.files?.[0])} />
            </div>

            <Tabs defaultValue="ar" dir="ltr">
              <TabsList className="h-auto w-full justify-start gap-1 rounded-2xl bg-[#f3f3f0] p-1.5">
                <TabsTrigger value="ar" className="h-10 flex-1 rounded-xl font-extrabold data-[state=active]:bg-white data-[state=active]:text-[#df1f2d]">العربية *</TabsTrigger>
                <TabsTrigger value="en" className="h-10 flex-1 rounded-xl font-extrabold data-[state=active]:bg-white data-[state=active]:text-[#df1f2d]">English</TabsTrigger>
                <TabsTrigger value="fr" className="h-10 flex-1 rounded-xl font-extrabold data-[state=active]:bg-white data-[state=active]:text-[#df1f2d]">Français</TabsTrigger>
              </TabsList>
              {(["ar", "en", "fr"] as ArticleLanguage[]).map((language) => (
                <TabsContent key={language} value={language} className="mt-5 space-y-5" dir={language === "ar" ? "rtl" : "ltr"}>
                  <div className="space-y-2.5"><Label htmlFor={`title-${language}`} className="font-extrabold">{language === "ar" ? "العنوان" : language === "en" ? "Title" : "Titre"}</Label><Input id={`title-${language}`} value={title[language]} onChange={(event) => updateTranslation(setTitle, language, event.target.value)} maxLength={240} required={language === "ar"} className="h-13 rounded-2xl px-4 text-[16px]" placeholder={language === "ar" ? "عنوان واضح ومختصر" : "Optional translation"} /></div>
                  <div className="space-y-2.5"><Label htmlFor={`body-${language}`} className="font-extrabold">{language === "ar" ? "نص المقال" : "Article"}</Label><Textarea id={`body-${language}`} value={body[language]} onChange={(event) => updateTranslation(setBody, language, event.target.value)} maxLength={40000} required={language === "ar"} className="min-h-[280px] resize-y rounded-2xl px-4 py-4 text-[16px] leading-8" placeholder={language === "ar" ? "اكتب نص المقال هنا…" : "Optional translation"} /></div>
                </TabsContent>
              ))}
            </Tabs>
            <Button type="submit" disabled={submitting || !publishingConfigured} className="h-14 w-full rounded-2xl bg-[#df1f2d] text-[15px] font-extrabold shadow-[0_12px_30px_rgba(223,31,45,.2)] hover:bg-[#c51825] sm:w-auto sm:px-9">
              {submitting ? <Loader2 className="animate-spin" /> : editing ? <Save /> : <UploadCloud />} {editing ? "Save changes" : "Publish article"}
            </Button>
          </form>
        </section>

        <section className="rounded-[30px] bg-[#191919] p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,.12)] sm:p-7">
          <div className="flex items-center justify-between gap-4"><div><div className="text-[11px] font-bold text-[#ff6570]">NEWEST FIRST</div><h2 className="mt-1 text-2xl font-extrabold">Published articles</h2></div><Button type="button" onClick={clearForm} className="rounded-full bg-white text-[#191919] hover:bg-[#df1f2d] hover:text-white"><Plus /> New</Button></div>
          <div className="mt-6 max-h-[900px] space-y-3 overflow-y-auto pr-1">
            {loadingArticles ? <div className="grid min-h-40 place-items-center"><Loader2 className="animate-spin text-white/40" /></div> : articles.map((article, index) => (
              <article key={article.id} className={`rounded-[20px] border p-3.5 transition ${editing?.id === article.id ? "border-[#df1f2d] bg-white/10" : "border-white/[.07] bg-white/[.045]"}`}>
                <div className="flex gap-3"><img src={article.imageUrl} alt="" className="h-20 w-24 shrink-0 rounded-[14px] object-cover" /><div className="min-w-0 flex-1"><div className="flex items-center gap-2 text-[10px] text-white/35"><span className="text-[#ff6570]">#{index + 1}</span>{formatArticleDate(article.publishedAt, "ar")}{article.externalUrl && <span className="rounded-full bg-white/8 px-2 py-0.5">External</span>}</div><h3 dir="rtl" className="mt-2 line-clamp-2 text-right text-[13px] font-extrabold leading-6">{article.title.ar}</h3></div></div>
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/[.07] pt-3">
                  <Button type="button" size="sm" onClick={() => startEdit(article)} className="rounded-full bg-white/8 text-white hover:bg-white hover:text-[#191919]"><Edit3 /> Edit</Button>
                  <Button asChild type="button" size="sm" variant="ghost" className="rounded-full text-white/55 hover:bg-white/8 hover:text-white"><a href={articleHref(article)} target="_blank"><ExternalLink /> View</a></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button type="button" size="sm" variant="ghost" className="ml-auto rounded-full text-[#ff7a84] hover:bg-red-500/15 hover:text-[#ff9aa2]"><Trash2 /> Delete</Button></AlertDialogTrigger>
                    <AlertDialogContent dir="ltr" className="rounded-[24px]">
                      <AlertDialogHeader><AlertDialogTitle>Delete this article?</AlertDialogTitle><AlertDialogDescription>This permanently removes the article from the news archive. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction disabled={deletingId === article.id} onClick={() => void removeArticle(article)} className="bg-red-600 hover:bg-red-700">{deletingId === article.id ? <Loader2 className="animate-spin" /> : <Trash2 />} Delete article</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </ManagementFrame>
  );
}
