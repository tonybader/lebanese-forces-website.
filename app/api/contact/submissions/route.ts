import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { EDITOR_COOKIE, verifyEditorSession } from "@/lib/admin-auth";
import { getContactSubmissions, type ContactSubmission } from "@/lib/contact-store";

export const dynamic = "force-dynamic";

function safeCsvCell(value: string): string {
  const protectedValue = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${protectedValue.replace(/"/g, '""')}"`;
}

function csv(submissions: ContactSubmission[]): string {
  const rows = [
    ["Date", "Name", "Email", "Phone", "Region", "Message"],
    ...submissions.map((item) => [item.createdAt, item.name, item.email, item.phone, item.region, item.message]),
  ];
  return `\uFEFF${rows.map((row) => row.map(safeCsvCell).join(",")).join("\r\n")}`;
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  if (!verifyEditorSession(cookieStore.get(EDITOR_COOKIE)?.value)) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }
  try {
    const submissions = await getContactSubmissions();
    if (new URL(request.url).searchParams.get("format") === "csv") {
      return new NextResponse(csv(submissions), {
        headers: {
          "Cache-Control": "no-store",
          "Content-Disposition": `attachment; filename="lf-contact-submissions-${new Date().toISOString().slice(0, 10)}.csv"`,
          "Content-Type": "text/csv; charset=utf-8",
        },
      });
    }
    return NextResponse.json({ submissions }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Contact archive read failed", error);
    return NextResponse.json({ error: "The submissions archive could not be opened." }, { status: 503 });
  }
}
