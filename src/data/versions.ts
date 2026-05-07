import type { Topic as OutputTopic, SymfonyVersion } from '../types';
import ds from './datasource.json';

interface Reference {
  id: string;
  url: string;
  title: string;
  summary: string;
}

interface Concept {
  concept: string;
  concept_slug: string;
  references: Reference[];
}

interface Topic {
  topic: string;
  topic_slug: string;
  concepts: Concept[];
}

interface Version {
  sfce: string;
  version: SymfonyVersion;
  topics: Topic[];
}

interface DataSource {
  versions: Version[];
}

const data = ds as DataSource;

const topicsByVersion: Record<SymfonyVersion, OutputTopic[]> = data.versions.reduce(
  (acc, v) => {
    acc[v.version] = v.topics.map(t => ({
      id: t.topic_slug,
      title: t.topic,
      slug: t.topic_slug,
      chapters: t.concepts.map(c => ({
        id: `${t.topic_slug}/${c.concept_slug}`,
        title: c.concept,
        references: c.references.map(r => ({
          id: r.id,
          title: r.title,
          url: r.url,
          summary: r.summary,
        })),
      })),
    }));
    return acc;
  },
  {} as Record<SymfonyVersion, OutputTopic[]>
);

export function getTopics(version: SymfonyVersion): OutputTopic[] {
  return topicsByVersion[version];
}
