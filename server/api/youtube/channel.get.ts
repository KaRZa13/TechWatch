import fetchYoutubeChannelData from '~~/server/utils/youtube'

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)
  if (!url || typeof url !== 'string') {
    throw createError({ statusCode: 400, message: 'url query param is required' })
  }
  return fetchYoutubeChannelData(url)
})
