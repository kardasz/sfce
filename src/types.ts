export interface Reference {
  id: string;
  title: string;
  url: string;
}

export interface Chapter {
  id: string;
  title: string;
  references: Reference[];
}

export interface Topic {
  id: string;
  title: string;
  slug: string;
  chapters: Chapter[];
}

export type SymfonyVersion = '6.0' | '7.0' | '8.0';

export const VERSIONS: SymfonyVersion[] = ['8.0', '7.0', '6.0'];
export const DEFAULT_VERSION: SymfonyVersion = '8.0';
