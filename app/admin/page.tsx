import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAdminConfigured, isPublishingConfigured, verifyAdminSession } from "@/lib/admin-auth";
import { AdminDashboard, AdminLogin } from "./admin-client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authenticated = verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
  const configured = isAdminConfigured();

  return authenticated ? (
    <AdminDashboard publishingConfigured={isPublishingConfigured()} />
  ) : (
    <AdminLogin configured={configured} />
  );
}
