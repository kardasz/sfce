import { normalize } from 'normalizr';
import {topic} from './schema'
import json from './topics.json'

export const data = normalize(json, [topic])
