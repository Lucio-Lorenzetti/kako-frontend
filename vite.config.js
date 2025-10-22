import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // permite acceso desde cualquier IP, necesario para ngrok
    port: 5173,
    allowedHosts: [
      'applaudable-reinaldo-unvainly.ngrok-free.dev' // 👈 tu subdominio ngrok actual
    ],
  },
})
