import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHomepageContent } from "@/lib/homepage-store";
import { findPublicProfile, publicProfiles } from "@/lib/people";
import { ProfileView } from "./profile-view";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

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
  const homepage = await getHomepageContent();
  const override = homepage.people?.find((person) => person.slug === profile.slug);
  return <ProfileView profile={override ? { ...profile, name: override.name, office: override.office, socials: override.socials } : profile} />;
}
