import Link from 'next/link'
import { supabase, type NewsItem } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

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

export default async function Home() {
  const { data: news, error } = await supabase
    .from('news_items')
    .select('*')
    .order('published_at', { ascending: false })

  return (
    <>
      <header>
        <h1>FX ポンド円 ニュースリスト</h1>
        <Link href="/news/new" className="btn btn-primary">
          + ニュースを追加
        </Link>
      </header>

      <div className="container">
        {error && (
          <div className="error-banner" style={{ marginBottom: '16px' }}>
            データの取得に失敗しました: {error.message}
          </div>
        )}

        <div className="news-list">
          {!news || news.length === 0 ? (
            <div className="news-empty">
              ニュースがまだありません。
              <br />「+ ニュースを追加」ボタンから追加してください。
            </div>
          ) : (
            news.map((item: NewsItem) => (
              <div key={item.id} className="news-item">
                <div className="news-meta">
                  <span className="news-time">{formatDateTime(item.published_at)}</span>
                </div>
                <span className="news-title">{item.title}</span>
                {item.content && <p className="news-content">{item.content}</p>}
                {item.source_url && (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-source"
                  >
                    {item.source_url}
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
