import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue(), UnoCSS()],
    server: {
      port: 5173,
      host: true
    },
    define: {
      __DEV__: JSON.stringify(mode === 'development' || env.VITE_APP_DEV === 'true')
    }
  }
})
