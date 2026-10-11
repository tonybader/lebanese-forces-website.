import "server-only";

import { randomUUID } from "node:crypto";
import { get, list, put } from "@vercel/blob";

const ACTIONS_PREFIX = "action-submissions/";

export type ActionKind = "enroll" | "idea" | "volunteer" | "newsletter";

export type ActionSubmission = {
  id: string;
  createdAt: string;
  kind: ActionKind;
  language: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  topic: string;
  dateOfBirth: string;
  availability: string;
  message: string;
};

type NewActionSubmission = Omit<ActionSubmission, "id" | "createdAt">;

function ensureStorage(): void {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    throw new Error("Private action storage is not connected to this deployment.");
  }
}

async function readSubmission(pathname: string): Promise<ActionSubmission | null> {
  const result = await get(pathname, { access: "private", useCache: false });
  if (!result || result.statusCode === 304 || !result.stream) return null;
  try {
    return JSON.parse(await new Response(result.stream).text()) as ActionSubmission;
  } catch {
    console.error("Ignoring an invalid action submission blob", pathname);
    return null;
  }
}

export async function addActionSubmission(input: NewActionSubmission): Promise<ActionSubmission> {
  ensureStorage();
  const submission: ActionSubmission = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const sortableDate = submission.createdAt.replace(/[:.]/g, "-");
  await put(
    `${ACTIONS_PREFIX}${sortableDate}-${submission.id}.json`,
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

export async function getActionSubmissions(): Promise<ActionSubmission[]> {
  ensureStorage();
  const pathnames: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: ACTIONS_PREFIX, limit: 1000, cursor });
    pathnames.push(...page.blobs.map((blob) => blob.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor && pathnames.length < 10_000);

  pathnames.sort((a, b) => b.localeCompare(a));
  const submissions: ActionSubmission[] = [];
  for (let index = 0; index < pathnames.length; index += 25) {
    const batch = await Promise.all(pathnames.slice(index, index + 25).map(readSubmission));
    submissions.push(...batch.filter((item): item is ActionSubmission => Boolean(item)));
  }
  return submissions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
