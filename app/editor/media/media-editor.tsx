"use client";

import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  ImageIcon,
  Inbox,
  Loader2,
  Music2,
  Plus,
  Save,
  Trash2,
  Video,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  MediaContent,
  MediaDocument,
  MediaLocalizedText,
  MediaPhoto,
  MediaSong,
} from "@/lib/media-types";

const blankTitle = (): MediaLocalizedText => ({ ar: "", en: "", fr: "" });
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function LocalizedFields({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: MediaLocalizedText;
  onChange: (next: MediaLocalizedText) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {(["ar", "en", "fr"] as const).map((language) => (
        <div key={language} className="space-y-2">
          <Label htmlFor={`${id}-${language}`} className="text-[11px] font-extrabold uppercase text-black/45">
            {label} · {language.toUpperCase()}
          </Label>
          <Input
            id={`${id}-${language}`}
            dir={language === "ar" ? "rtl" : "ltr"}
            value={value[language]}
            onChange={(event) => onChange({ ...value, [language]: event.target.value })}
            required={language === "ar"}
            className="h-11 rounded-xl"
          />
        </div>
      ))}
    </div>
  );
}

function EditorSection({
  icon,
  title,
  description,
  onAdd,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-black/[.07] bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,.045)] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#191919] text-white">{icon}</span>
          <div>
            <h2 className="text-xl font-extrabold">{title}</h2>
            <p className="mt-1 text-[12px] leading-6 text-black/45">{description}</p>
          </div>
        </div>
        <Button type="button" onClick={onAdd} className="rounded-full bg-[#df1f2d] font-extrabold hover:bg-[#c51825]"><Plus /> Add</Button>
      </div>
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}

export function MediaEditor({
  initialContent,
  publishingConfigured,
}: {
  initialContent: MediaContent;
  publishingConfigured: boolean;
}) {
  const [content, setContent] = useState<MediaContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const patchSong = (index: number, patch: Partial<MediaSong>) => setContent((current) => ({
    ...current,
    songs: current.songs.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item),
  }));
  const patchPhoto = (index: number, patch: Partial<MediaPhoto>) => setContent((current) => ({
    ...current,
    photos: current.photos.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item),
  }));
  const patchDocument = (index: number, patch: Partial<MediaDocument>) => setContent((current) => ({
    ...current,
    documents: current.documents.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item),
  }));

  const save = async () => {
    setSaving(true);
    setNotice(null);
    try {
      const response = await fetch("/api/media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await response.json() as { content?: MediaContent; error?: string };
      if (!response.ok || !data.content) throw new Error(data.error || "The media library could not be saved.");
      setContent(data.content);
      setNotice({ kind: "success", text: "Media and documents were published. The homepage refreshes them automatically." });
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "The media library could not be saved." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f4f1] px-4 py-5 text-[#191919] sm:px-7" dir="ltr">
      <div className="mx-auto max-w-[1180px]">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-black/[.06] bg-white px-5 py-4 shadow-sm">
          <a href="/editor" className="flex items-center gap-3 font-extrabold"><ArrowLeft size={17} /><img src="/lf-logo.png" alt="" className="h-10 w-10 rounded-full object-contain" /><span>Articles editor</span></a>
          <div className="flex flex-wrap gap-2"><Button asChild type="button" variant="outline" className="h-11 rounded-full px-5 font-extrabold"><a href="/editor/submissions"><Inbox />Submissions</a></Button><Button type="button" onClick={() => void save()} disabled={saving || !publishingConfigured} className="h-11 rounded-full bg-[#df1f2d] px-6 font-extrabold hover:bg-[#c51825]">{saving ? <Loader2 className="animate-spin" /> : <Save />} Publish changes</Button></div>
        </header>

        <div className="mb-7">
          <div className="text-[12px] font-extrabold uppercase tracking-[.12em] text-[#df1f2d]">MEDIA & PUBLICATIONS</div>
          <h1 className="mt-2 text-[clamp(2rem,5vw,4rem)] font-extrabold tracking-[-.04em]">Website library editor</h1>
          <p className="mt-3 max-w-3xl text-[14px] leading-7 text-black/50">Add, edit or remove songs, homepage photographs and PDF entries. Use a direct HTTPS URL or an existing public website path.</p>
        </div>

        {!publishingConfigured && <Alert className="mb-6 border-amber-200 bg-amber-50"><AlertTitle>Publishing is not connected</AlertTitle><AlertDescription>Add GITHUB_CONTENT_TOKEN in Vercel.</AlertDescription></Alert>}
        {notice && <Alert variant={notice.kind === "error" ? "destructive" : "default"} className={`mb-6 ${notice.kind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : ""}`}><CheckCircle2 /><AlertTitle>{notice.kind === "success" ? "Published" : "Could not publish"}</AlertTitle><AlertDescription>{notice.text}</AlertDescription></Alert>}

        <div className="space-y-6">
          <section className="rounded-[28px] border border-black/[.07] bg-[#191919] p-5 text-white sm:p-7">
            <div className="flex items-center gap-3"><Video className="text-[#ff6570]" /><h2 className="text-xl font-extrabold">Official YouTube channel</h2></div>
            <Input value={content.officialYouTubeUrl} onChange={(event) => setContent((current) => ({ ...current, officialYouTubeUrl: event.target.value }))} className="mt-5 h-12 rounded-2xl border-white/10 bg-white/8 text-white" />
          </section>

          <EditorSection icon={<Music2 size={19} />} title="Songs" description="Each song appears in the homepage audio player." onAdd={() => setContent((current) => ({ ...current, songs: [...current.songs, { id: uid("song"), title: blankTitle(), audioUrl: "" }] }))}>
            {content.songs.map((song, index) => (
              <article key={song.id} className="rounded-[20px] border border-black/[.07] bg-[#fafaf8] p-4">
                <LocalizedFields id={`song-${index}`} label="Title" value={song.title} onChange={(title) => patchSong(index, { title })} />
                <div className="mt-3 flex gap-3"><Input aria-label="Audio URL" value={song.audioUrl} onChange={(event) => patchSong(index, { audioUrl: event.target.value })} placeholder="https://…/song.mp3" className="h-11 rounded-xl" /><Button type="button" variant="ghost" aria-label="Delete song" onClick={() => setContent((current) => ({ ...current, songs: current.songs.filter((_, itemIndex) => itemIndex !== index) }))} className="text-red-600"><Trash2 /></Button></div>
              </article>
            ))}
          </EditorSection>

          <EditorSection icon={<ImageIcon size={19} />} title="Homepage photos" description="Keep the curated Bachir, Samir and LF identity gallery, or replace an image here." onAdd={() => setContent((current) => ({ ...current, photos: [...current.photos, { id: uid("photo"), title: blankTitle(), imageUrl: "", credit: "", sourceUrl: "/", fit: "cover" }] }))}>
            {content.photos.map((photo, index) => (
              <article key={photo.id} className="grid gap-4 rounded-[20px] border border-black/[.07] bg-[#fafaf8] p-4 lg:grid-cols-[150px_1fr]">
                <div className="aspect-square overflow-hidden rounded-2xl bg-white ring-1 ring-black/5"><img src={photo.imageUrl || "/lf-logo.png"} alt="" className={`h-full w-full ${photo.fit === "contain" ? "object-contain p-4" : "object-cover"}`} /></div>
                <div>
                  <LocalizedFields id={`photo-${index}`} label="Title" value={photo.title} onChange={(title) => patchPhoto(index, { title })} />
                  <div className="mt-3 grid gap-3 md:grid-cols-2"><Input value={photo.imageUrl} onChange={(event) => patchPhoto(index, { imageUrl: event.target.value })} placeholder="Image URL" className="h-11 rounded-xl" /><Input value={photo.sourceUrl} onChange={(event) => patchPhoto(index, { sourceUrl: event.target.value })} placeholder="Source URL" className="h-11 rounded-xl" /><Input value={photo.credit} onChange={(event) => patchPhoto(index, { credit: event.target.value })} placeholder="Photo credit" className="h-11 rounded-xl" /><div className="flex gap-2"><select value={photo.fit} onChange={(event) => patchPhoto(index, { fit: event.target.value as "cover" | "contain" })} className="h-11 flex-1 rounded-xl border border-black/10 bg-white px-3 text-sm"><option value="cover">Crop to fill</option><option value="contain">Show full image</option></select><Button type="button" variant="ghost" aria-label="Delete photo" onClick={() => setContent((current) => ({ ...current, photos: current.photos.filter((_, itemIndex) => itemIndex !== index) }))} className="text-red-600"><Trash2 /></Button></div></div>
                </div>
              </article>
            ))}
          </EditorSection>

          <EditorSection icon={<FileText size={19} />} title="Documents & legislative corner" description="Add PDF links and cover images to either publication section." onAdd={() => setContent((current) => ({ ...current, documents: [...current.documents, { id: uid("document"), section: "papers", title: blankTitle(), description: blankTitle(), fileUrl: "", coverUrl: "" }] }))}>
            {content.documents.map((document, index) => (
              <article key={document.id} className="grid gap-4 rounded-[20px] border border-black/[.07] bg-[#fafaf8] p-4 lg:grid-cols-[120px_1fr]">
                <div className="aspect-[3/4] overflow-hidden rounded-xl bg-white ring-1 ring-black/5"><img src={document.coverUrl || "/lf-logo.png"} alt="" className="h-full w-full object-cover" /></div>
                <div>
                  <LocalizedFields id={`document-${index}`} label="Title" value={document.title} onChange={(title) => patchDocument(index, { title })} />
                  <div className="mt-3"><LocalizedFields id={`document-description-${index}`} label="Description" value={document.description} onChange={(description) => patchDocument(index, { description })} /></div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2"><select value={document.section} onChange={(event) => patchDocument(index, { section: event.target.value as MediaDocument["section"] })} className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm"><option value="legislative">Legislative corner</option><option value="papers">Papers & documents</option></select><Input value={document.fileUrl} onChange={(event) => patchDocument(index, { fileUrl: event.target.value })} placeholder="PDF URL" className="h-11 rounded-xl" /><Input value={document.coverUrl} onChange={(event) => patchDocument(index, { coverUrl: event.target.value })} placeholder="Cover image URL" className="h-11 rounded-xl" /><Button type="button" variant="outline" onClick={() => setContent((current) => ({ ...current, documents: current.documents.filter((_, itemIndex) => itemIndex !== index) }))} className="h-11 rounded-xl text-red-600"><Trash2 /> Delete document</Button></div>
                </div>
              </article>
            ))}
          </EditorSection>
        </div>

        <div className="sticky bottom-4 mt-7 flex justify-end"><Button type="button" onClick={() => void save()} disabled={saving || !publishingConfigured} className="h-13 rounded-full bg-[#df1f2d] px-7 font-extrabold shadow-xl hover:bg-[#c51825]">{saving ? <Loader2 className="animate-spin" /> : <Save />} Publish library</Button></div>
      </div>
    </main>
  );
}
