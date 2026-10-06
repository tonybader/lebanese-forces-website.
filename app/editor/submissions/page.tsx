import { cookies } from "next/headers";
import { ArrowLeft, Download, Inbox, RefreshCw, ShieldCheck } from "lucide-react";
import {
  EDITOR_COOKIE,
  configuredUsername,
  isEditorConfigured,
  verifyEditorSession,
} from "@/lib/admin-auth";
import { getContactSubmissions } from "@/lib/contact-store";
import { EditorLogin } from "../editor-client";

export const dynamic = "force-dynamic";

export default async function ContactSubmissionsPage() {
  const cookieStore = await cookies();
  const authenticated = verifyEditorSession(cookieStore.get(EDITOR_COOKIE)?.value);
  if (!authenticated) {
    return <EditorLogin configured={isEditorConfigured()} defaultUsername={configuredUsername("editor")} />;
  }

  let error = "";
  const submissions = await getContactSubmissions().catch((caught) => {
    console.error("Unable to show contact submissions", caught);
    error = "The private submissions store is unavailable. Check the Vercel Blob connection.";
    return [];
  });

  return (
    <main className="min-h-screen bg-[#f4f4f1] px-4 py-5 text-[#191919] sm:px-7" dir="ltr">
      <div className="mx-auto max-w-[1180px]">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-black/[.06] bg-white px-5 py-4 shadow-sm">
          <a href="/editor" className="flex items-center gap-3 font-extrabold"><ArrowLeft size={17} /><img src="/lf-logo.png" alt="" className="h-10 w-10 rounded-full object-contain" /><span>Articles editor</span></a>
          <div className="flex flex-wrap gap-2">
            <a href="/editor/submissions" className="inline-flex h-10 items-center gap-2 rounded-full border border-black/10 px-4 text-[13px] font-extrabold"><RefreshCw size={15} />Refresh</a>
            <a href="/api/contact/submissions?format=csv" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#df1f2d] px-5 text-[13px] font-extrabold text-white shadow-sm hover:bg-[#c51825]"><Download size={16} />Export for Excel</a>
          </div>
        </header>

        <section className="mb-7 overflow-hidden rounded-[30px] bg-[#191919] p-7 text-white shadow-[0_20px_60px_rgba(0,0,0,.12)] sm:p-9">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div><div className="flex items-center gap-2 text-[11px] font-extrabold tracking-[.12em] text-[#ff6570]"><Inbox size={15} />CONTACT INBOX</div><h1 className="mt-3 text-[clamp(2rem,5vw,4rem)] font-extrabold tracking-[-.04em]">Website submissions</h1><p className="mt-3 max-w-2xl text-[13px] leading-7 text-white/55">Messages are stored in private application storage. They are not emailed and can only be read after signing into the editor.</p></div>
            <div className="rounded-2xl bg-white/[.07] px-5 py-4"><span className="block text-3xl font-extrabold">{submissions.length}</span><span className="text-[11px] text-white/45">submissions</span></div>
          </div>
        </section>

        {error ? (
          <div role="alert" className="rounded-[24px] border border-red-200 bg-red-50 p-5 text-[13px] font-bold text-red-800">{error}</div>
        ) : submissions.length === 0 ? (
          <div className="grid min-h-72 place-items-center rounded-[28px] border border-dashed border-black/15 bg-white text-center"><div><Inbox className="mx-auto text-black/20" size={34} /><h2 className="mt-4 text-lg font-extrabold">No messages yet</h2><p className="mt-2 text-[13px] text-black/40">New contact form submissions will appear here.</p></div></div>
        ) : (
          <div className="space-y-4">
            {submissions.map((item) => (
              <article key={item.id} className="rounded-[24px] border border-black/[.07] bg-white p-5 shadow-[0_12px_38px_rgba(0,0,0,.04)] sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/[.06] pb-4">
                  <div><h2 className="text-lg font-extrabold">{item.name}</h2><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-black/48"><a className="hover:text-[#df1f2d]" href={`mailto:${item.email}`}>{item.email}</a>{item.phone && <a className="hover:text-[#df1f2d]" href={`tel:${item.phone}`}>{item.phone}</a>}<span>{item.region}</span></div></div>
                  <time className="rounded-full bg-[#f3f3f0] px-3 py-1.5 text-[11px] font-bold text-black/45" dateTime={item.createdAt}>{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Beirut" }).format(new Date(item.createdAt))}</time>
                </div>
                <p dir="auto" className="mt-4 whitespace-pre-wrap text-[14px] leading-8 text-black/70">{item.message}</p>
              </article>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 text-[11px] text-black/40"><ShieldCheck size={15} className="text-emerald-600" />Stored in a private Vercel Blob store; exported files contain personal data and should be handled securely.</div>
      </div>
    </main>
  );
}
