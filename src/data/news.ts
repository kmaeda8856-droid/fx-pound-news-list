export type NewsItem = {
  id: number
  publishedAt: string // ISO 8601形式: "2026-06-28T09:30:00+09:00"
  title: string
  content?: string
  sourceUrl?: string
}

// ↓ ここにニュースを追加してください（新しい順に並べると見やすいです）
export const newsList: NewsItem[] = [
  {
    id: 3,
    publishedAt: '2026-06-28T10:15:00+09:00',
    title: 'ポンド円、英国雇用統計を受けて198円台に上昇',
    content:
      '英国の雇用統計が予想を上回る結果となり、ポンドが対円で買われた。ポンド円は一時198.50円まで上昇し、直近高値を更新した。',
    sourceUrl: 'https://finance.yahoo.co.jp/quote/GBPJPY=X/news',
  },
  {
    id: 2,
    publishedAt: '2026-06-27T15:30:00+09:00',
    title: 'BOE、金利据え置きを決定――ポンドは小幅下落',
    content:
      'イングランド銀行（BOE）は政策金利を5.25%に据え置くことを決定した。声明文ではインフレの根強さに言及しつつも、経済の先行き不透明感も強調。ポンド円は発表直後に一時197.20円まで下落した。',
    sourceUrl: 'https://finance.yahoo.co.jp/quote/GBPJPY=X/news',
  },
  {
    id: 1,
    publishedAt: '2026-06-27T09:00:00+09:00',
    title: 'ポンド円、週明けは197円台後半でスタート',
    content: '東京市場オープン時のポンド円は197.80円付近。先週末の米雇用統計を受けたドル買いが一服し、クロス円は総じて底堅い動きとなっている。',
  },
]
