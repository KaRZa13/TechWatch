import { YOUTUBE_UPLOAD_PLAYLIST_URL, YOUTUBE_CHANNEL_INFO_URL, YOUTUBE_PLAYLIST_10_ITEMS_URL } from './constants'

export default async function fetchYoutubeChannelData(url: string) {
  const channelId = await getChannelIdFromChannelUrl(url)
  const responseChannelInfo = await fetch(YOUTUBE_UPLOAD_PLAYLIST_URL(channelId))
  const dataChannelInfo = await responseChannelInfo.json()
  const uploadsPlaylistId = await getUploadPlaylistId(dataChannelInfo)
  const responseUploadsPlaylistItems = await fetch(YOUTUBE_PLAYLIST_10_ITEMS_URL(uploadsPlaylistId))
  const dataVideos = await responseUploadsPlaylistItems.json()

  return dataVideos.items.map((video: any) => ({
    id: video.snippet.resourceId.videoId,
    type: 'youtube' as const,
    title: video.snippet.title,
    url: `https://youtube.com/watch?v=${video.snippet.resourceId.videoId}`,
    thumbnail: video.snippet.thumbnails.high.url,
    publishedAt: video.snippet.publishedAt,
  }))
}

async function getChannelIdFromChannelUrl(url: string): Promise<string> {
  const response = await fetch(YOUTUBE_CHANNEL_INFO_URL(url))
  const data = await response.json()
  if (data.items && data.items.length > 0) {
    return data.items[0].id
  }
  throw new Error('Channel not found')
}

async function getUploadPlaylistId(data: any): Promise<string> {
  const uploadsPlaylistId = data.items[0].contentDetails.relatedPlaylists.uploads
  return uploadsPlaylistId
}
