import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findPublicProfile, publicProfiles } from "@/lib/people";
import { ProfileView } from "./profile-view";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return publicProfiles.map((profile) => ({ slug: profile.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = findPublicProfile(decodeURIComponent(slug));
  if (!profile) return { title: "الصفحة غير موجودة | القوات اللبنانية" };
  return {
    title: `${profile.name.ar} | القوات اللبنانية`,
    description: profile.summary.ar,
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const profile = findPublicProfile(decodeURIComponent(slug));
  if (!profile) notFound();
  return <ProfileView profile={profile} />;
}
