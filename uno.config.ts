import { defineConfig, presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetAttributify()],
  theme: {
    colors: {
      primary: '#3b82f6',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#ef4444',
      neutral: '#6b7280'
    }
  }
})
