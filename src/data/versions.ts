import type { Topic, SymfonyVersion } from '../types';
import topics6 from './topics-6.json';
import topics7 from './topics-7.json';
import topics8 from './topics-8.json';

const topicsByVersion: Record<SymfonyVersion, Topic[]> = {
  '6.0': topics6 as Topic[],
  '7.0': topics7 as Topic[],
  '8.0': topics8 as Topic[],
};

export function getTopics(version: SymfonyVersion): Topic[] {
  return topicsByVersion[version];
}
