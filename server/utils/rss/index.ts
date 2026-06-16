import Parser from 'rss-parser'

export interface RssArticle {
  id: string
  type: 'Flux RSS'
  title: string
  description?: string
  url: string
  thumbnail?: string
  publishedAt?: string
  source?: string
}

const parser = new Parser()

export async function fetchRssFeed(feedUrl: string): Promise<RssArticle[]> {
  const feed = await parser.parseURL(feedUrl)

  return feed.items.map((item) => ({
    id: item.guid ?? item.link ?? '',
    type: 'Flux RSS' as const,
    title: item.title ?? '',
    description: item.contentSnippet ?? item.content,
    url: item.link ?? '',
    thumbnail: item.enclosure?.url,
    publishedAt: item.pubDate,
    source: item.creator ?? item.author,
  }))
}
