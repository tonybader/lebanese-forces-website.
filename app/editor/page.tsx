import { cookies } from "next/headers";
import {
  EDITOR_COOKIE,
  configuredUsername,
  isEditorConfigured,
  isPublishingConfigured,
  verifyEditorSession,
} from "@/lib/admin-auth";
import { EditorDashboard, EditorLogin } from "./editor-client";

export const dynamic = "force-dynamic";

export default async function EditorPage() {
  const cookieStore = await cookies();
  const authenticated = verifyEditorSession(cookieStore.get(EDITOR_COOKIE)?.value);

  return authenticated ? (
    <EditorDashboard publishingConfigured={isPublishingConfigured()} />
  ) : (
    <EditorLogin
      configured={isEditorConfigured()}
      defaultUsername={configuredUsername("editor")}
    />
  );
}
