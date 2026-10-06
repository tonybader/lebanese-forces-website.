import { cookies } from "next/headers";
import {
  EDITOR_COOKIE,
  configuredUsername,
  isEditorConfigured,
  isPublishingConfigured,
  verifyEditorSession,
} from "@/lib/admin-auth";
import { getMediaContent } from "@/lib/media-store";
import { EditorLogin } from "../editor-client";
import { MediaEditor } from "./media-editor";

export const dynamic = "force-dynamic";

export default async function MediaEditorPage() {
  const cookieStore = await cookies();
  const authenticated = verifyEditorSession(cookieStore.get(EDITOR_COOKIE)?.value);

  return authenticated ? (
    <MediaEditor
      initialContent={await getMediaContent()}
      publishingConfigured={isPublishingConfigured()}
    />
  ) : (
    <EditorLogin configured={isEditorConfigured()} defaultUsername={configuredUsername("editor")} />
  );
}
