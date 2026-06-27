'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function toLocalDatetimeString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}

export default function NewNewsPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [publishedAt, setPublishedAt] = useState(toLocalDatetimeString(new Date()))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('news_items').insert({
      title,
      content: content || null,
      source_url: sourceUrl || null,
      published_at: new Date(publishedAt).toISOString(),
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <>
      <header>
        <h1>FX ポンド円 ニュースリスト</h1>
        <Link href="/" className="btn btn-secondary">
          ← 一覧に戻る
        </Link>
      </header>

      <div className="container">
        <p className="page-title">ニュースを追加</p>
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-banner">{error}</div>}

            <div className="form-group">
              <label htmlFor="published_at">日時 *</label>
              <input
                id="published_at"
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="title">タイトル *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ニュースのタイトルを入力"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">内容</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="ニュースの内容を入力（任意）"
              />
            </div>

            <div className="form-group">
              <label htmlFor="source_url">ソース URL</label>
              <input
                id="source_url"
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '保存中...' : '保存する'}
              </button>
              <Link href="/" className="btn btn-secondary">
                キャンセル
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
