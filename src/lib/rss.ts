import { XMLParser } from 'fast-xml-parser'

export type NewsItem = {
  title: string
  source: string
  link: string
  pubDate: string
  snippet: string
}

const RSS_URL =
  'https://news.google.com/rss/search?q=%E3%83%9D%E3%83%B3%E3%83%89%E5%86%86&hl=ja&gl=JP&ceid=JP%3Aja'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '_',
  isArray: (_name, jpath) => jpath === 'rss.channel.item',
  htmlEntities: true,
  processEntities: true,
})

type RawItem = {
  title?: string
  link?: string
  pubDate?: string
  guid?: string | { '#text': string }
  description?: string
}

function extractSnippet(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')   // タグを除去
    .replace(/\s+/g, ' ')        // 連続スペースを正規化
    .trim()
    .slice(0, 200)               // 最大200文字
}

export async function fetchNews(): Promise<NewsItem[]> {
  const res = await fetch(RSS_URL)
  if (!res.ok) return []

  const xml = await res.text()
  const data = parser.parse(xml)
  const items: RawItem[] = data?.rss?.channel?.item ?? []

  return items
    .map((item) => {
      // Google ニュースのタイトルは "記事タイトル - 媒体名" 形式
      const raw = item.title ?? ''
      const sepIdx = raw.lastIndexOf(' - ')
      const title = sepIdx !== -1 ? raw.slice(0, sepIdx) : raw
      const source = sepIdx !== -1 ? raw.slice(sepIdx + 3) : ''

      // link が取れない場合は guid にフォールバック
      const link =
        item.link ??
        (typeof item.guid === 'string' ? item.guid : (item.guid?.['#text'] ?? ''))

      const snippet = item.description ? extractSnippet(item.description) : ''

      return { title, source, link, pubDate: item.pubDate ?? '', snippet }
    })
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()) // 降順
}
