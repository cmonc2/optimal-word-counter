import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { z } from 'zod';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const loadedEnv = loadEnv(mode, path.resolve(import.meta.dirname, '../..'), '');
  const EnvSchema = z.object({
    SERVER_PORT: z.coerce.number().default(3103),
    CLIENT_PORT: z.coerce.number().default(5103),
  });
  const env = EnvSchema.parse(loadedEnv);

  return {
    plugins: [
      react({
        fastRefresh: !process.env.VITEST,
      }),
    ],
    build: {
      outDir: path.resolve(import.meta.dirname, '../../dist'),
      emptyOutDir: true,
    },
    server: {
      host: '0.0.0.0',
      port: env.CLIENT_PORT,
      proxy: {
        '/api': {
          target: `http://localhost:${env.SERVER_PORT}`,
          changeOrigin: true,
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
  } as any;
});
