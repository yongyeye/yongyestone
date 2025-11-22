export interface Artwork {
  id: number;
  serial: string;
  title: string;
  type: string;
  desc: string;
  image: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export type SectionId = 'gallery' | 'about' | 'statement';

export interface MenuItem {
  id: SectionId;
  label: string;
  sub: string;
}