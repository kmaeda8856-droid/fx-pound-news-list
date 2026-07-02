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
}

/**
 * Google ニュース RSS のリンクは Base64 エンコードされた実際の記事 URL を含む。
 * デコードして直接の記事 URL を取り出す。
 */
function extractActualUrl(rssLink: string): string {
  try {
    const parsed = new URL(rssLink)
    if (!parsed.hostname.includes('news.google.com')) return rssLink

    const encoded = parsed.pathname.split('/').pop() ?? ''
    if (!encoded) return rssLink

    // Base64url → Buffer → latin1 文字列
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const buf = Buffer.from(base64, 'base64')
    const text = buf.toString('latin1')

    // デコードされたバイト列の中から https:// を探す
    const idx = text.indexOf('https://')
    if (idx === -1) return rssLink

    const match = text.slice(idx).match(/^https?:\/\/[^\x00-\x1f\x7f\s]+/)
    return match?.[0] ?? rssLink
  } catch {
    return rssLink
  }
}

async function fetchOgDescription(rssLink: string): Promise<string> {
  const articleUrl = extractActualUrl(rssLink)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 4000)
  try {
    const res = await fetch(articleUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })
    if (!res.ok) return ''
    const html = await res.text()
    const m =
      html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*?)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']*?)["'][^>]+property=["']og:description["']/i)
    return m?.[1]?.trim() ?? ''
  } catch {
    return ''
  } finally {
    clearTimeout(timer)
  }
}

export async function fetchNews(): Promise<NewsItem[]> {
  const res = await fetch(RSS_URL)
  if (!res.ok) return []

  const xml = await res.text()
  const data = parser.parse(xml)
  const items: RawItem[] = data?.rss?.channel?.item ?? []

  // パース → 降順ソート → 上位20件
  const parsed = items
    .map((item) => {
      const raw = item.title ?? ''
      const sepIdx = raw.lastIndexOf(' - ')
      const title = sepIdx !== -1 ? raw.slice(0, sepIdx) : raw
      const source = sepIdx !== -1 ? raw.slice(sepIdx + 3) : ''
      const link =
        item.link ??
        (typeof item.guid === 'string' ? item.guid : (item.guid?.['#text'] ?? ''))
      return { title, source, link, pubDate: item.pubDate ?? '', snippet: '' }
    })
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 20)

  // 各記事の og:description を並列取得
  const results = await Promise.allSettled(parsed.map((item) => fetchOgDescription(item.link)))

  return parsed.map((item, i) => ({
    ...item,
    snippet: results[i].status === 'fulfilled' ? results[i].value : '',
  }))
}
