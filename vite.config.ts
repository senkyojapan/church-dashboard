import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages ではリポジトリ名がサブパスになるため、
// 実際のリポジトリ名に合わせて base を変更してください。
// 例: https://<user>.github.io/church-dashboard/ で公開する場合 => '/church-dashboard/'
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/church-dashboard/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
