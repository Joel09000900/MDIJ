import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Ports de developpement : 5174 pour le site, 4001 pour l'API.
 *
 * Les valeurs d'origine (5173 et 4000) sont celles du projet OliKrys, qui tourne
 * sur la meme machine. Les deux projets se disputaient les deux ports : Vite
 * basculait alors silencieusement sur un port voisin tandis que le proxy
 * continuait de viser le 4000 deja occupe, et chaque appel d'API partait vers
 * l'API de l'autre projet, qui repondait 404.
 *
 * strictPort fait echouer franchement le demarrage si le 5174 est pris, au lieu
 * de glisser sur un autre port sans rapport avec CLIENT_ORIGIN cote API.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
    // En developpement, /api est redirige vers le serveur Express
    proxy: { '/api': 'http://localhost:4001' },
  },
})
