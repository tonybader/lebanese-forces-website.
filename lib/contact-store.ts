import "server-only";

import { randomUUID } from "node:crypto";
import { get, list, put } from "@vercel/blob";

const SUBMISSIONS_PREFIX = "contact-submissions/";

export type ContactSubmission = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  region: string;
  message: string;
};

type NewContactSubmission = Omit<ContactSubmission, "id" | "createdAt">;

function ensureStorage(): void {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    throw new Error("Private contact storage is not connected to this deployment.");
  }
}

async function readSubmission(pathname: string): Promise<ContactSubmission | null> {
  const result = await get(pathname, { access: "private", useCache: false });
  if (!result || result.statusCode === 304 || !result.stream) return null;
  try {
    return JSON.parse(await new Response(result.stream).text()) as ContactSubmission;
  } catch {
    console.error("Ignoring an invalid contact submission blob", pathname);
    return null;
  }
}

export async function addContactSubmission(input: NewContactSubmission): Promise<ContactSubmission> {
  ensureStorage();
  const submission: ContactSubmission = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const sortableDate = submission.createdAt.replace(/[:.]/g, "-");
  await put(
    `${SUBMISSIONS_PREFIX}${sortableDate}-${submission.id}.json`,
    JSON.stringify(submission),
    {
      access: "private",
      addRandomSuffix: false,
      contentType: "application/json; charset=utf-8",
      cacheControlMaxAge: 60,
    },
  );
  return submission;
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  ensureStorage();
  const pathnames: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: SUBMISSIONS_PREFIX, limit: 1000, cursor });
    pathnames.push(...page.blobs.map((blob) => blob.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor && pathnames.length < 10_000);

  pathnames.sort((a, b) => b.localeCompare(a));
  const submissions: ContactSubmission[] = [];
  for (let index = 0; index < pathnames.length; index += 25) {
    const batch = await Promise.all(pathnames.slice(index, index + 25).map(readSubmission));
    submissions.push(...batch.filter((item): item is ContactSubmission => Boolean(item)));
  }
  return submissions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
