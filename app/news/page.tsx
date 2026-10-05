import { listArticles } from "@/lib/article-store";
import { isArticleChannel } from "@/lib/article-types";
import { NewsList, type NewsFilters } from "./news-list";

export const dynamic = "force-dynamic";

type NewsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined): string | undefined {
  const selected = Array.isArray(value) ? value[0] : value;
  return selected?.normalize("NFKC").trim().slice(0, 80) || undefined;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const query = await searchParams;
  const articles = await listArticles();
  const requestedChannel = first(query.channel);
  const filters: NewsFilters = {
    ...(isArticleChannel(requestedChannel) ? { channel: requestedChannel } : {}),
    ...(first(query.region) ? { region: first(query.region) } : {}),
    ...(first(query.activity) ? { activity: first(query.activity) } : {}),
    ...(first(query.person) ? { person: first(query.person) } : {}),
  };
  return <NewsList initialArticles={articles} filters={filters} />;
}
