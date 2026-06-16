import { fetchRssFeed } from '~~/server/utils/rss'

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)

  if (!url || typeof url !== 'string') {
    throw createError({ statusCode: 400, message: 'Le paramètre "url" est requis.' })
  }

  try {
    return await fetchRssFeed(url)
  }
  catch {
    throw createError({ statusCode: 502, message: `Impossible de lire le flux RSS : ${url}` })
  }
})
