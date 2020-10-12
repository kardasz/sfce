import { schema } from 'normalizr';

export const reference = new schema.Entity('references');
export const chapter = new schema.Entity('chapters', {
    references: [reference]
});

export const topic = new schema.Entity('topics', {
    chapters: [chapter]
}, {idAttribute: 'slug'});
