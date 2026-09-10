import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { TOPICS } from './lib/topics';

export { TOPICS, TOPIC_META, type TopicSlug } from './lib/topics';

const materials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/materials' }),
  schema: z.object({
    topic: z.enum(TOPICS),
    title: z.string(),
    examWeight: z.string(),
    order: z.number().int().optional(),
  }),
});

const questions = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/questions' }),
  schema: z.object({
    topic: z.enum(TOPICS),
    prompt: z.string(),
    options: z.object({
      A: z.string(),
      B: z.string(),
      C: z.string(),
    }),
    correctAnswer: z.enum(['A', 'B', 'C']),
    explanation: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
  }),
});

export const collections = { materials, questions };
