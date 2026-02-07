import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
       base: "/darschin",
       plugins: [
              react(),
              tailwindcss(),
              VitePWA({
                     registerType: "autoUpdate",
                     includeAssets: ["favicon.ico"],
                     workbox: {
                            globPatterns: ["**/*.{js,css,svg,html,ico,png,gif,ttf,woff,woff2}"],
                            runtimeCaching: [
                                   {
                                          urlPattern: ({ request }) => request.destination === "font",
                                          handler: "CacheFirst",
                                          options: {
                                                 cacheName: "font-cache",
                                                 expiration: {
                                                        maxEntries: 20,
                                                        maxAgeSeconds: 60 * 60 * 24 * 365
                                                 }
                                          }
                                   }
                            ]
                     },
                     manifest: {
                            name: "darschin",
                            short_name: "darschin",
                            description: " تنظیم برنامه تحصیلی به روش دلخواه",
                            icons: [
                                   {
                                          src: "/darschin/favicon/android-chrome-192x192.png",
                                          sizes: "192x192",
                                          type: "image/png"
                                   },
                                   {
                                          src: "/darschin/favicon/android-chrome-512x512.png",
                                          sizes: "512x512",
                                          type: "image/png"
                                   }
                            ],
                            theme_color: "#f1f1f1",
                            background_color: "#f1f1f1",
                            display: "standalone",
                            start_url: "/"
                     }
              })
       ]
})
