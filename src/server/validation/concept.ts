import { z } from "zod";

export const conceptZodSchema = z.object({
  "@context": z.string().optional(),

  uri: z.string().url(),

  type: z.array(z.string()).optional(),

  inScheme: z
    .array(
      z.object({
        uri: z.string().url(),
        prefLabel: z.record(z.string()).optional(),
        type: z.array(z.string()).optional(),
      }),
    )
    .optional(),

  publisher: z
    .array(
      z.object({
        prefLabel: z.record(z.string()),
      }),
    )
    .optional(),

  notation: z.array(z.string()).optional(),

  prefLabel: z.record(z.string()),

  altLabel: z.record(z.array(z.string())).optional(),

  definition: z.record(z.array(z.string())).optional(),

  scopeNote: z.record(z.array(z.string())).optional(),

  topConceptOf: z
    .array(
      z.object({
        uri: z.string().url(),
        prefLabel: z.record(z.string()).optional(),
        type: z.array(z.string()).optional(),
      }),
    )
    .optional(),
});

export type ConceptZodType = z.infer<typeof conceptZodSchema>;
