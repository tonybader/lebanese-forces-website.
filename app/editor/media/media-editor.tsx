"use client";

import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  ImageIcon,
  Inbox,
  Library,
  Loader2,
  Music2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Video,
} from "lucide-react";
import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

type ItemEditor =
  | { kind: "song"; index: number | null; value: MediaSong }
  | { kind: "photo"; index: number | null; value: MediaPhoto }
  | { kind: "document"; index: number | null; value: MediaDocument };

const documentSectionLabel: Record<MediaDocument["section"], string> = {
  legislative: "Legislative corner",
  political: "Political publications",
  charter: "Regulations & charter",
};

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

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-[20px] border border-dashed border-black/10 bg-[#fafaf8] px-5 py-10 text-center text-[13px] text-black/40">
      No {label.toLowerCase()} have been added yet.
    </div>
  );
}

function DeleteButton({ label, onDelete }: { label: string; onDelete: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" size="sm" variant="ghost" className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"><Trash2 /> Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[24px]" dir="ltr">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {label}?</AlertDialogTitle>
          <AlertDialogDescription>This removes the item from the library after you publish the changes.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700"><Trash2 /> Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function MediaEditor({ initialContent, publishingConfigured }: { initialContent: MediaContent; publishingConfigured: boolean }) {
  const [content, setContent] = useState<MediaContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [newMediaOpen, setNewMediaOpen] = useState(false);
  const [editor, setEditor] = useState<ItemEditor | null>(null);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const openNewSong = () => {
    setNewMediaOpen(false);
    setEditor({ kind: "song", index: null, value: { id: uid("song"), title: blankTitle(), audioUrl: "" } });
  };
  const openNewPhoto = () => {
    setNewMediaOpen(false);
    setEditor({ kind: "photo", index: null, value: { id: uid("photo"), title: blankTitle(), imageUrl: "", credit: "", sourceUrl: "/", fit: "cover" } });
  };
  const openNewDocument = () => setEditor({
    kind: "document",
    index: null,
    value: { id: uid("document"), section: "political", title: blankTitle(), description: blankTitle(), fileUrl: "", coverUrl: "" },
  });

  const saveItem = () => {
    if (!editor) return;
    setContent((current) => {
      if (editor.kind === "song") {
        const songs = [...current.songs];
        if (editor.index === null) songs.push(editor.value); else songs[editor.index] = editor.value;
        return { ...current, songs };
      }
      if (editor.kind === "photo") {
        const photos = [...current.photos];
        if (editor.index === null) photos.push(editor.value); else photos[editor.index] = editor.value;
        return { ...current, photos };
      }
      const documents = [...current.documents];
      if (editor.index === null) documents.push(editor.value); else documents[editor.index] = editor.value;
      return { ...current, documents };
    });
    setEditor(null);
  };

  const itemIsValid = Boolean(editor && editor.value.title.ar.trim() && (
    editor.kind === "song" ? editor.value.audioUrl.trim()
      : editor.kind === "photo" ? editor.value.imageUrl.trim()
        : editor.value.fileUrl.trim() && editor.value.coverUrl.trim()
  ));

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
      setNotice({ kind: "success", text: "Media and documents were published. The website refreshes them automatically." });
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

        <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="text-[12px] font-extrabold uppercase tracking-[.12em] text-[#df1f2d]">MEDIA & PUBLICATIONS</div>
            <h1 className="mt-2 text-[clamp(2rem,5vw,4rem)] font-extrabold tracking-[-.04em]">Website library</h1>
            <p className="mt-3 max-w-3xl text-[14px] leading-7 text-black/50">Browse the existing library first. Open only the item you want to edit, or create a new media item or document.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => setNewMediaOpen(true)} className="h-12 rounded-full bg-[#191919] px-6 font-extrabold hover:bg-[#333]"><Plus /> Add new media</Button>
            <Button type="button" onClick={openNewDocument} className="h-12 rounded-full bg-[#df1f2d] px-6 font-extrabold hover:bg-[#c51825]"><Plus /> Add new document</Button>
          </div>
        </div>

        {!publishingConfigured && <Alert className="mb-6 border-amber-200 bg-amber-50"><AlertTitle>Publishing is not connected</AlertTitle><AlertDescription>Add GITHUB_CONTENT_TOKEN in Vercel.</AlertDescription></Alert>}
        {notice && <Alert variant={notice.kind === "error" ? "destructive" : "default"} className={`mb-6 ${notice.kind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : ""}`}><CheckCircle2 /><AlertTitle>{notice.kind === "success" ? "Published" : "Could not publish"}</AlertTitle><AlertDescription>{notice.text}</AlertDescription></Alert>}

        <section className="mb-6 rounded-[26px] border border-black/[.07] bg-[#191919] p-5 text-white sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1"><Label htmlFor="youtube-url" className="flex items-center gap-2 text-sm font-extrabold"><Video size={17} className="text-[#ff6570]" /> Official YouTube channel</Label><Input id="youtube-url" value={content.officialYouTubeUrl} onChange={(event) => setContent((current) => ({ ...current, officialYouTubeUrl: event.target.value }))} className="mt-3 h-11 rounded-xl border-white/10 bg-white/8 text-white" /></div>
            <span className="text-[11px] text-white/40">Used by the public video section</span>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-black/[.07] bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,.045)] sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-4"><div><h2 className="flex items-center gap-2 text-xl font-extrabold"><Library size={20} className="text-[#df1f2d]" /> Existing media</h2><p className="mt-1 text-[12px] text-black/42">{content.songs.length} songs · {content.photos.length} photos</p></div><Button type="button" variant="outline" onClick={() => setNewMediaOpen(true)} className="rounded-full font-extrabold"><Plus /> Add</Button></div>
            <div className="space-y-3">
              {!content.songs.length && !content.photos.length && <EmptyState label="Media items" />}
              {content.songs.map((song, index) => (
                <article key={song.id} className="flex flex-wrap items-center gap-4 rounded-[18px] border border-black/[.07] bg-[#fafaf8] p-3.5">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#191919] text-white"><Music2 size={19} /></span>
                  <div className="min-w-0 flex-1"><div className="text-[10px] font-extrabold uppercase tracking-[.11em] text-[#df1f2d]">Song</div><h3 dir="rtl" className="mt-1 truncate text-right text-[14px] font-extrabold">{song.title.ar}</h3><p className="mt-1 truncate text-[10px] text-black/35">{song.audioUrl}</p></div>
                  <Button type="button" size="sm" variant="outline" onClick={() => setEditor({ kind: "song", index, value: structuredClone(song) })} className="rounded-full"><Pencil /> Edit</Button>
                  <DeleteButton label="song" onDelete={() => setContent((current) => ({ ...current, songs: current.songs.filter((_, itemIndex) => itemIndex !== index) }))} />
                </article>
              ))}
              {content.photos.map((photo, index) => (
                <article key={photo.id} className="flex flex-wrap items-center gap-4 rounded-[18px] border border-black/[.07] bg-[#fafaf8] p-3.5">
                  <img src={photo.imageUrl || "/lf-logo.png"} alt="" className={`h-14 w-16 rounded-xl bg-white ${photo.fit === "contain" ? "object-contain p-2" : "object-cover"}`} />
                  <div className="min-w-0 flex-1"><div className="text-[10px] font-extrabold uppercase tracking-[.11em] text-[#df1f2d]">Photo</div><h3 dir="rtl" className="mt-1 truncate text-right text-[14px] font-extrabold">{photo.title.ar}</h3><p className="mt-1 truncate text-[10px] text-black/35">{photo.credit || photo.imageUrl}</p></div>
                  <Button type="button" size="sm" variant="outline" onClick={() => setEditor({ kind: "photo", index, value: structuredClone(photo) })} className="rounded-full"><Pencil /> Edit</Button>
                  <DeleteButton label="photo" onDelete={() => setContent((current) => ({ ...current, photos: current.photos.filter((_, itemIndex) => itemIndex !== index) }))} />
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-black/[.07] bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,.045)] sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-4"><div><h2 className="flex items-center gap-2 text-xl font-extrabold"><FileText size={20} className="text-[#df1f2d]" /> Existing documents</h2><p className="mt-1 text-[12px] text-black/42">{content.documents.length} documents across three publication libraries</p></div><Button type="button" variant="outline" onClick={openNewDocument} className="rounded-full font-extrabold"><Plus /> Add</Button></div>
            <div className="space-y-3">
              {!content.documents.length && <EmptyState label="Documents" />}
              {content.documents.map((document, index) => (
                <article key={document.id} className="flex flex-wrap items-center gap-4 rounded-[18px] border border-black/[.07] bg-[#fafaf8] p-3.5">
                  <img src={document.coverUrl || "/lf-logo.png"} alt="" className="h-16 w-12 rounded-lg bg-white object-cover ring-1 ring-black/5" />
                  <div className="min-w-0 flex-1"><div className="text-[10px] font-extrabold uppercase tracking-[.11em] text-[#df1f2d]">{documentSectionLabel[document.section]}</div><h3 dir="rtl" className="mt-1 truncate text-right text-[14px] font-extrabold">{document.title.ar}</h3><p dir="rtl" className="mt-1 truncate text-right text-[10px] text-black/35">{document.description.ar}</p></div>
                  <Button type="button" size="sm" variant="outline" onClick={() => setEditor({ kind: "document", index, value: structuredClone(document) })} className="rounded-full"><Pencil /> Edit</Button>
                  <DeleteButton label="document" onDelete={() => setContent((current) => ({ ...current, documents: current.documents.filter((_, itemIndex) => itemIndex !== index) }))} />
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="sticky bottom-4 mt-7 flex justify-end"><Button type="button" onClick={() => void save()} disabled={saving || !publishingConfigured} className="h-13 rounded-full bg-[#df1f2d] px-7 font-extrabold shadow-xl hover:bg-[#c51825]">{saving ? <Loader2 className="animate-spin" /> : <Save />} Publish library</Button></div>
      </div>

      <Dialog open={newMediaOpen} onOpenChange={setNewMediaOpen}>
        <DialogContent className="rounded-[26px] sm:max-w-xl" dir="ltr">
          <DialogHeader><DialogTitle className="text-2xl font-extrabold">Add new media</DialogTitle><DialogDescription>Choose the type of media you want to add.</DialogDescription></DialogHeader>
          <div className="grid gap-3 py-3 sm:grid-cols-2">
            <button type="button" onClick={openNewSong} className="rounded-[22px] border border-black/[.08] bg-[#fafaf8] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#df1f2d]/35 hover:bg-red-50"><Music2 className="text-[#df1f2d]" /><span className="mt-5 block text-lg font-extrabold">Song / audio</span><span className="mt-1 block text-xs leading-5 text-black/45">Add a title and audio file URL.</span></button>
            <button type="button" onClick={openNewPhoto} className="rounded-[22px] border border-black/[.08] bg-[#fafaf8] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#df1f2d]/35 hover:bg-red-50"><ImageIcon className="text-[#df1f2d]" /><span className="mt-5 block text-lg font-extrabold">Homepage photo</span><span className="mt-1 block text-xs leading-5 text-black/45">Add an image, credit and source.</span></button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editor)} onOpenChange={(open) => !open && setEditor(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[26px] sm:max-w-4xl" dir="ltr">
          {editor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-extrabold">{editor.index === null ? "Add" : "Edit"} {editor.kind}</DialogTitle>
                <DialogDescription>Update every field for this item. Arabic title and the main file URL are required.</DialogDescription>
              </DialogHeader>
              <div className="space-y-5 py-3">
                <LocalizedFields id={`${editor.kind}-title`} label="Title" value={editor.value.title} onChange={(title) => setEditor({ ...editor, value: { ...editor.value, title } } as ItemEditor)} />
                {editor.kind === "song" && <div className="space-y-2"><Label htmlFor="song-audio">Audio URL</Label><Input id="song-audio" value={editor.value.audioUrl} onChange={(event) => setEditor({ ...editor, value: { ...editor.value, audioUrl: event.target.value } })} placeholder="https://…/song.mp3" className="h-11 rounded-xl" /></div>}
                {editor.kind === "photo" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2"><Label htmlFor="photo-image">Image URL</Label><Input id="photo-image" value={editor.value.imageUrl} onChange={(event) => setEditor({ ...editor, value: { ...editor.value, imageUrl: event.target.value } })} placeholder="https://…" className="h-11 rounded-xl" /></div>
                    <div className="space-y-2"><Label htmlFor="photo-source">Source URL</Label><Input id="photo-source" value={editor.value.sourceUrl} onChange={(event) => setEditor({ ...editor, value: { ...editor.value, sourceUrl: event.target.value } })} placeholder="https://…" className="h-11 rounded-xl" /></div>
                    <div className="space-y-2"><Label htmlFor="photo-credit">Photo credit</Label><Input id="photo-credit" value={editor.value.credit} onChange={(event) => setEditor({ ...editor, value: { ...editor.value, credit: event.target.value } })} className="h-11 rounded-xl" /></div>
                    <div className="space-y-2"><Label htmlFor="photo-fit">Image fit</Label><select id="photo-fit" value={editor.value.fit} onChange={(event) => setEditor({ ...editor, value: { ...editor.value, fit: event.target.value as MediaPhoto["fit"] } })} className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm"><option value="cover">Crop to fill</option><option value="contain">Show full image</option></select></div>
                  </div>
                )}
                {editor.kind === "document" && (
                  <>
                    <LocalizedFields id="document-description" label="Description" value={editor.value.description} onChange={(description) => setEditor({ ...editor, value: { ...editor.value, description } })} />
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2"><Label htmlFor="document-section">Publication library</Label><select id="document-section" value={editor.value.section} onChange={(event) => setEditor({ ...editor, value: { ...editor.value, section: event.target.value as MediaDocument["section"] } })} className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm"><option value="legislative">Legislative corner</option><option value="political">Political publications</option><option value="charter">Regulations & charter</option></select></div>
                      <div className="space-y-2"><Label htmlFor="document-file">PDF URL</Label><Input id="document-file" value={editor.value.fileUrl} onChange={(event) => setEditor({ ...editor, value: { ...editor.value, fileUrl: event.target.value } })} placeholder="https://… or /documents/…" className="h-11 rounded-xl" /></div>
                      <div className="space-y-2"><Label htmlFor="document-cover">Cover image URL</Label><Input id="document-cover" value={editor.value.coverUrl} onChange={(event) => setEditor({ ...editor, value: { ...editor.value, coverUrl: event.target.value } })} placeholder="https://… or /documents/…" className="h-11 rounded-xl" /></div>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditor(null)} className="rounded-full">Cancel</Button>
                <Button type="button" disabled={!itemIsValid} onClick={saveItem} className="rounded-full bg-[#df1f2d] font-extrabold hover:bg-[#c51825]"><Save /> Save item</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
