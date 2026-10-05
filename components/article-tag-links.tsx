import { MapPin, Tags, UserRound } from "lucide-react";
import type { Article, ArticleLanguage, ArticleTagKind } from "@/lib/article-types";
import { articleTagHref, articleTagKindText } from "@/lib/article-types";

const tagGroups: Array<{
  kind: ArticleTagKind;
  field: "regions" | "activityTypes" | "people";
  icon: typeof MapPin;
}> = [
  { kind: "region", field: "regions", icon: MapPin },
  { kind: "activity", field: "activityTypes", icon: Tags },
  { kind: "person", field: "people", icon: UserRound },
];

export function ArticleTagLinks({
  article,
  language,
  dark = false,
  compact = false,
}: {
  article: Article;
  language: ArticleLanguage;
  dark?: boolean;
  compact?: boolean;
}) {
  const availableGroups = tagGroups.filter(({ field }) => (article[field] || []).length > 0);
  if (!availableGroups.length) return null;

  return (
    <div className={`flex flex-wrap ${compact ? "gap-1.5" : "gap-2"}`}>
      {availableGroups.flatMap(({ kind, field, icon: Icon }) =>
        (article[field] || []).map((tag) => (
          <a
            key={`${kind}-${tag}`}
            href={articleTagHref(kind, tag)}
            aria-label={`${articleTagKindText(kind, language)}: ${tag}`}
            className={`inline-flex items-center gap-1.5 rounded-full border font-bold transition hover:-translate-y-0.5 ${compact ? "px-2.5 py-1 text-[10px]" : "px-3.5 py-2 text-[11px]"} ${dark ? "border-white/10 bg-white/[.06] text-white/62 hover:border-white/20 hover:bg-white/12 hover:text-white" : "border-black/[.07] bg-white text-black/52 hover:border-[#df1f2d]/30 hover:text-[#df1f2d]"}`}
          >
            <Icon size={compact ? 11 : 13} />
            {tag}
          </a>
        )),
      )}
    </div>
  );
}
