export type IntelSource = {
  id: string;
  name: string;
  category: string;
  rssUrl: string;
  enabled: boolean;
  note?: string;
  feedGroup?: string;
  web?: string;
  twitter?: string;
  linkedin?: string;
  contentFilter?: "ai-pm";
};

export type FeedItem = {
  title: string;
  link: string;
  published: string;
  summary: string;
  sourceId: string;
  sourceName: string;
  category: string;
  feedGroup?: string;
};

export type SourceFetchResult = {
  source: IntelSource;
  ok: boolean;
  error?: string;
  items: FeedItem[];
};

export type FeedManifest = {
  date: string;
  fetched_at: string;
  sources_healthy: number;
  sources_dead: number;
  item_count: number;
  source_results: { id: string; name: string; ok: boolean; error?: string; count: number }[];
};
