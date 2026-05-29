export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "leitor";
  status: "active" | "blocked";
}

export interface Comment {
  id: string;
  postId: string;
  userName: string;
  commentText: string;
  date: string;
  approved: boolean;
}

export interface MatchStats {
  possessionHome: number;
  possessionAway: number;
  shotsHome: number;
  shotsAway: number;
  cornersHome: number;
  cornersAway: number;
  foulsHome: number;
  foulsAway: number;
}

export interface SportsMatch {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  stadium: string;
  stats: MatchStats;
  outstandingPlayer: string;
}

export interface Post {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  tags: string[];
  image: string;
  date: string;
  author: string;
  views: number;
  isViral: boolean;
  isBreaking: boolean;
  matchInfo?: SportsMatch;
  imageAspectRatio?: "16:9" | "4:3" | "1:1" | "9:16";
  imageAltSeo?: string;
}

export interface Ad {
  position: "topo" | "meio" | "rodape";
  code: string;
  isCode: boolean;
  bannerUrl?: string;
  linkUrl?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  type: "contacto" | "publicidade";
}

export interface AnalyticsStats {
  postsCount: number;
  totalViews: number;
  commentsCount: number;
  messagesCount: number;
  viewsByCategory: Record<string, number>;
  topPosts: Array<{ title: string; views: number; category: string }>;
}
