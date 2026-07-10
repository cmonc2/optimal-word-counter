import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '../..'), '')
  const backendPort = env.PORT || '3000'

  return {
    plugins: [
      react({
        fastRefresh: !process.env.VITEST,
      })
    ],
    server: {
      proxy: {
        '/api': {
          target: `http://localhost:${backendPort}`,
          changeOrigin: true,
        }
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
    }
  } as any
})
