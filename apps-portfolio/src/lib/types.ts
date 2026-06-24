export interface Talk {
  id?: number;
  title: string;
  slug: string;
  event?: string;
  date?: string;
  location?: string;
  country_code?: string;
  session_url?: string;
  video_url?: string;
  slides_url?: string;
  status?: string;
  tags?: string;
  image?: string;
  event_description?: string;
  talk_description?: string;
  created_at: string;
  updated_at: string;
  type: 'talk';
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  url?: string;
  publish_date?: string;
  tags?: string;
  image?: string;
  resource_type?: string;
  description?: string;
  video_url?: string;
  slides_url?: string;
  bug_id?: number;
  cta_text?: string;
  cta_url?: string;
  links?: string;
  relevance?: number;
  created_at: string;
  updated_at: string;
  type: 'article';
}
