import { fetchNews, type NewsItem } from '@/lib/rss'

// 30分ごとにRSSを再取得
export const revalidate = 1800

function formatDateTime(dateStr: string): string {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo',
  }).format(new Date(dateStr))
}

export default async function Home() {
  const news = await fetchNews()

  return (
    <>
      <header>
        <h1>FX ポンド円 ニュースリスト</h1>
        <span className="update-label">30分ごとに自動更新</span>
      </header>

      <div className="container">
        <div className="news-list">
          {news.length === 0 ? (
            <div className="news-empty">
              ニュースを取得できませんでした。
              <br />
              しばらく待ってから再読み込みしてください。
            </div>
          ) : (
            news.map((item: NewsItem, i) => (
              <div key={i} className="news-item">
                <div className="news-meta">
                  <span className="news-time">{formatDateTime(item.pubDate)}</span>
                  {item.source && <span className="news-source-tag">{item.source}</span>}
                </div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-title-link"
                >
                  {item.title}
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
