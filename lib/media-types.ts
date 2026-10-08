export type MediaLanguage = "ar" | "en" | "fr";

export type MediaLocalizedText = Record<MediaLanguage, string>;

export type MediaSong = {
  id: string;
  title: MediaLocalizedText;
  audioUrl: string;
};

export type MediaPhoto = {
  id: string;
  title: MediaLocalizedText;
  imageUrl: string;
  credit: string;
  sourceUrl: string;
  fit: "cover" | "contain";
};

export type MediaDocument = {
  id: string;
  section: "legislative" | "political" | "charter";
  title: MediaLocalizedText;
  description: MediaLocalizedText;
  fileUrl: string;
  coverUrl: string;
};

export type MediaInstagramPost = {
  id: string;
  caption: MediaLocalizedText;
  imageUrl: string;
  permalink: string;
  publishedAt: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
};

export type MediaPartner = {
  id: string;
  name: MediaLocalizedText;
  description: MediaLocalizedText;
  url: string;
  logoUrl: string;
};

export type MediaContent = {
  updatedAt: string;
  officialYouTubeUrl: string;
  instagramProfileUrl: string;
  instagramPosts: MediaInstagramPost[];
  mediaPartners: MediaPartner[];
  songs: MediaSong[];
  photos: MediaPhoto[];
  documents: MediaDocument[];
};

export function mediaText(value: MediaLocalizedText, language: MediaLanguage): string {
  return value[language]?.trim() || value.ar?.trim() || value.en?.trim() || value.fr?.trim() || "";
}
