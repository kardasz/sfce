export interface Reference {
  id: string;
  title: string;
  url: string;
  hash: string;
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
