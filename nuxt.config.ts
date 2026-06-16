import tailwindcss from "@tailwindcss/vite"
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  runtimeConfig: {
    youtubeApiKey: process.env.NUXT_PUBLIC_YOUTUBE_API_KEY,
  },
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  
  modules: [
    '@nuxt/ui', 
    '@nuxt/eslint', 
    '@nuxtjs/supabase'
  ],

  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    redirect: false,
    types: './types/supabase.ts',
  },
  
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})