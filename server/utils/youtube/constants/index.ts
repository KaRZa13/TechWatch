const { youtubeApiKey } = useRuntimeConfig()

export const YOUTUBE_UPLOAD_PLAYLIST_URL = (channelId: string): string => {
  return `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${youtubeApiKey}`
}

export const YOUTUBE_CHANNEL_INFO_URL = (channelUrl: string): string => {
  return `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${channelUrl.split('@').pop()}&key=${youtubeApiKey}`
}

export const YOUTUBE_PLAYLIST_10_ITEMS_URL = (playlistId: string): string => {
  return `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=10&key=${youtubeApiKey}`
}
