import { listArticles } from "@/lib/article-store";
import { NewsList } from "./news-list";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const articles = await listArticles();
  return <NewsList initialArticles={articles} />;
}
