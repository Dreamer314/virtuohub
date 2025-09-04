export type Platform =
  | "Roblox" | "VRChat" | "Second Life" | "IMVU" | "Horizon Worlds"
  | "Sims" | "GTA RP" | "Unity" | "Unreal" | "InZoi" | "Cross-Platform";

export type ListType = "Charting" | "Upcoming" | "Best Of" | "Entertainment";
export type VoiceTag = "VHub Picks" | "User Choice";

export interface ListItemEntry {
  id: string;
  rank?: number;
  title: string;
  imageUrl?: string;
  platforms: Platform[];
  metricLabel?: string;
  metricValue?: number;
  ctaLabel?: string;
  ctaHref?: string;
  summary?: string;
}

export interface ListMeta {
  id: string;
  slug: string;
  title: string;
  type: ListType;
  voices: VoiceTag[];
  platforms: Platform[];
  coverImageUrl?: string;
  dek?: string;
  updatedAt: string;
  views: number;
  isSponsored?: boolean;
  sponsorName?: string;
  sponsorHref?: string;
}

export interface FullList extends ListMeta {
  methodology?: string;
  items: ListItemEntry[];
}

export interface ListFilters {
  type?: ListType;
  voices?: VoiceTag[];
  platforms?: Platform[];
  sort?: "recent" | "viewed" | "rated";
  page?: number;
  limit?: number;
}

export interface BillboardTab {
  id: string;
  title: string;
  data: ListItemEntry[];
}

export interface UserVote {
  listId: string;
  itemId: string;
  userId: string;
  createdAt: string;
}