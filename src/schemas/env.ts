import { z } from 'zod';

export const EnvSchema = z.object({
  SERVER_PORT: z.coerce.number().default(3103),
  CLIENT_PORT: z.coerce.number().default(5103),
});

export const env = EnvSchema.parse(process.env);
