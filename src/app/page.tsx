import { newsList, type NewsItem } from '@/data/news'

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo',
  }).format(new Date(iso))
}

const sorted = [...newsList].sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
)

export default function Home() {
  return (
    <>
      <header>
        <h1>FX ポンド円 ニュースリスト</h1>
      </header>

      <div className="container">
        <div className="news-list">
          {sorted.length === 0 ? (
            <div className="news-empty">
              ニュースがまだありません。
              <br />
              src/data/news.ts にニュースを追加してください。
            </div>
          ) : (
            sorted.map((item: NewsItem) => (
              <div key={item.id} className="news-item">
                <span className="news-time">{formatDateTime(item.publishedAt)}</span>
                <span className="news-title">{item.title}</span>
                {item.content && <p className="news-content">{item.content}</p>}
                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-source"
                  >
                    {item.sourceUrl}
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
