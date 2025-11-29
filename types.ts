export enum Personality {
  LAWYER = 'Lawyer',
  JUDGE = 'Judge',
  RESEARCHER = 'Legal Researcher',
  STUDENT = 'Law Student',
  PROFESSIONAL = 'Professional',
  SHORT = 'Short Answer Mode',
  DETAILED = 'Detailed Answer Mode'
}

export enum Language {
  ENGLISH = 'English',
  BANGLA = 'Bangla'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  attachments?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  updatedAt: number;
  messages: Message[];
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  name: string;
}

export interface AppSettings {
  language: Language;
  personality: Personality;
  theme: 'dark' | 'light';
}