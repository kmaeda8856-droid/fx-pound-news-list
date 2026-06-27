import Parser from 'rss-parser'

export type NewsItem = {
  title: string
  source: string
  link: string
  pubDate: string
}

// Google ニュース RSS（ポンド円）
const RSS_URL =
  'https://news.google.com/rss/search?q=%E3%83%9D%E3%83%B3%E3%83%89%E5%86%86&hl=ja&gl=JP&ceid=JP%3Aja'

const parser = new Parser()

export async function fetchNews(): Promise<NewsItem[]> {
  const feed = await parser.parseURL(RSS_URL)

  return feed.items.map((item) => {
    // Google ニュースのタイトルは "記事タイトル - 媒体名" 形式
    const raw = item.title ?? ''
    const sepIdx = raw.lastIndexOf(' - ')
    const title = sepIdx !== -1 ? raw.slice(0, sepIdx) : raw
    const source = sepIdx !== -1 ? raw.slice(sepIdx + 3) : ''

    return {
      title,
      source,
      link: item.link ?? '',
      pubDate: item.pubDate ?? item.isoDate ?? '',
    }
  })
}
