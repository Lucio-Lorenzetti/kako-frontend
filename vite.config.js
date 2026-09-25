import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'Kako Padel',
        short_name: 'Kako Padel',
        description: 'Reservá tu turno de pádel online en Kako Padel, Bahía Blanca.',
        lang: 'es',
        start_url: '/',
        display: 'standalone',
        background_color: '#7aa6c7',
        theme_color: '#7aa6c7',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // No cachear llamadas a la API del backend: la disponibilidad de
        // turnos tiene que verse siempre en tiempo real, nunca desde cache.
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
})