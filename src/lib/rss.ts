import { XMLParser } from 'fast-xml-parser'

export type NewsItem = {
  title: string
  source: string
  link: string
  pubDate: string
}

const RSS_URL =
  'https://news.google.com/rss/search?q=%E3%83%9D%E3%83%B3%E3%83%89%E5%86%86&hl=ja&gl=JP&ceid=JP%3Aja'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '_',
  isArray: (_name, jpath) => jpath === 'rss.channel.item',
})

type RawItem = {
  title?: string
  link?: string
  pubDate?: string
  guid?: string | { '#text': string }
}

export async function fetchNews(): Promise<NewsItem[]> {
  const res = await fetch(RSS_URL)
  if (!res.ok) return []

  const xml = await res.text()
  const data = parser.parse(xml)
  const items: RawItem[] = data?.rss?.channel?.item ?? []

  return items.map((item) => {
    // Google ニュースのタイトルは "記事タイトル - 媒体名" 形式
    const raw = item.title ?? ''
    const sepIdx = raw.lastIndexOf(' - ')
    const title = sepIdx !== -1 ? raw.slice(0, sepIdx) : raw
    const source = sepIdx !== -1 ? raw.slice(sepIdx + 3) : ''

    // link が取れない場合は guid にフォールバック
    const link =
      item.link ??
      (typeof item.guid === 'string' ? item.guid : (item.guid?.['#text'] ?? ''))

    return { title, source, link, pubDate: item.pubDate ?? '' }
  })
}
