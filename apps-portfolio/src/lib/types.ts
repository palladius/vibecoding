export interface Talk {
  id: number;
  title: string;
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
  created_at: string;
  updated_at: string;
  type: 'talk';
}

export interface Article {
  id: number;
  title: string;
  url?: string;
  publish_date?: string;
  tags?: string;
  image?: string;
  created_at: string;
  updated_at: string;
  type: 'article';
}
