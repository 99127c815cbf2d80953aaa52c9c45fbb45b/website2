import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Site custom domain'de (https://aphrodot.xyz) kök dizinden yayınlanıyor —
  // public/CNAME dosyası bunu GitHub Pages'e bildiriyor.
  // Custom domain'i kaldırıp tekrar <user>.github.io/website2/ altına dönersen
  // burayı '/website2/' yap; tüm iç linkler src/lib/links.js üzerinden bu
  // değeri kullandığı için başka yeri değiştirmen gerekmez.
  base: '/',
})
