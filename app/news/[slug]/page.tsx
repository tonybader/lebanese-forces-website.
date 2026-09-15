import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findArticle } from "@/lib/article-store";
import { ArticleView } from "./article-view";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await findArticle(decodeURIComponent(slug));
  if (!article) return { title: "الخبر غير موجود | القوات اللبنانية" };
  return {
    title: `${article.title.ar} | القوات اللبنانية`,
    description: article.body.ar.slice(0, 155),
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await findArticle(decodeURIComponent(slug));
  if (!article || article.externalUrl) notFound();
  return <ArticleView article={article} />;
}
