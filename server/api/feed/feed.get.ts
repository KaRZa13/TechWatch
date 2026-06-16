import { serverSupabaseServiceRole } from '#supabase/server'
import { fetchRssFeed } from '~~/server/utils/rss'

interface Source {
  id: number
  name: string
  type: {
    name: string
  }
  url: string
  color: string
}

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)

  const { data, error }: { data: Source[] | null; error: any } = await supabase
    .from('source')
    .select('id, name, url, color, type(type)')

  if (error) throw createError({ statusCode: 500, message: error.message })

  const sources = data?.map((source) => ({
    id: source.id,
    name: source.name,
    url: source.url,
    color: source.color,
    type: source.type.name,
  }))

  const feedContent = await Promise.all(
    sources?.map(async (source) => {
      if (source.type === 'Flux RSS') {
        try {
          const feed = await fetchRssFeed(source.url)
          return { ...source, feed }
        } catch (error) {
          console.error(`Error fetching RSS feed for source ${source.name}:`, error)
          return { ...source, feed: null }
        }
      } else if (source.type === 'YouTube') {
        try {
          const feed = await $fetch(`/api/youtube/channel`, { query: { url: source.url } })
          return { ...source, feed }
        } catch (error) {
          console.error(`Error fetching YouTube channel for source ${source.name}:`, error)
          return { ...source, feed: null }
        }
      }
      return { ...source, feed: null }
    }) || []
  )
  
})
