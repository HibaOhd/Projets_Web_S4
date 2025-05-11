export default defineNuxtConfig({
  devServer: {
    host: '127.0.0.1', 
    port: 3000 
  },
  modules: ['@nuxtjs/tailwindcss'],
  ssr:true,
  runtimeConfig: {
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    public: {
      spotifyClientId: process.env.NUXT_PUBLIC_SPOTIFY_CLIENT_ID,
      spotifyRedirectUri: process.env.NUXT_PUBLIC_SPOTIFY_REDIRECT_URI,
      SPOTIFY_SCOPES: process.env.SPOTIFY_SCOPES,
    },
  },
})
