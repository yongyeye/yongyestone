export interface Artwork {
  id: number;
  serial: string;
  title: string;
  type: string;
  desc: string;
  image: string;
}

export interface ChatMessage {
  role: 'ai' | 'user';
  text: string;
}

export type SectionId = 'gallery' | 'about' | 'statement';