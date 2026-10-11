import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { EDITOR_COOKIE, verifyEditorSession } from "@/lib/admin-auth";
import { getActionSubmissions, type ActionSubmission } from "@/lib/action-store";

export const dynamic = "force-dynamic";

function safeCsvCell(value: string): string {
  const protectedValue = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${protectedValue.replace(/"/g, '""')}"`;
}

function csv(submissions: ActionSubmission[]): string {
  const rows = [
    ["Date", "Action", "Name", "Email", "Phone", "Region", "Topic", "Date of birth", "Availability", "Message", "Language"],
    ...submissions.map((item) => [item.createdAt, item.kind, item.name, item.email, item.phone, item.region, item.topic, item.dateOfBirth, item.availability, item.message, item.language]),
  ];
  return `\uFEFF${rows.map((row) => row.map(safeCsvCell).join(",")).join("\r\n")}`;
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  if (!verifyEditorSession(cookieStore.get(EDITOR_COOKIE)?.value)) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }
  try {
    const submissions = await getActionSubmissions();
    if (new URL(request.url).searchParams.get("format") === "csv") {
      return new NextResponse(csv(submissions), {
        headers: {
          "Cache-Control": "no-store",
          "Content-Disposition": `attachment; filename="lf-action-submissions-${new Date().toISOString().slice(0, 10)}.csv"`,
          "Content-Type": "text/csv; charset=utf-8",
        },
      });
    }
    return NextResponse.json({ submissions }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Action archive read failed", error);
    return NextResponse.json({ error: "The action archive could not be opened." }, { status: 503 });
  }
}
