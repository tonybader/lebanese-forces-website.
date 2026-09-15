import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  configuredUsername,
  isAdminConfigured,
  isPublishingConfigured,
  verifyAdminSession,
} from "@/lib/admin-auth";
import { getHomepageContent } from "@/lib/homepage-store";
import { AdminLogin, HomepageDashboard } from "./admin-client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authenticated = verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
  const configured = isAdminConfigured();

  return authenticated ? (
    <HomepageDashboard
      initialContent={await getHomepageContent()}
      publishingConfigured={isPublishingConfigured()}
    />
  ) : (
    <AdminLogin configured={configured} defaultUsername={configuredUsername("admin")} />
  );
}
