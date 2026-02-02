import { useState, useEffect } from 'react'
import api from '../services/api'
import './Feed.css'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts/')
      setPosts(response.data.results || response.data)
    } catch (error) {
      console.error('Posts fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePost = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setPosting(true)
    try {
      const response = await api.post('/posts/', { content })
      setPosts([response.data, ...posts])
      setContent('')
    } catch (error) {
      console.error('Post create error:', error)
      alert('Gönderi oluşturulamadı')
    } finally {
      setPosting(false)
    }
  }

  const handleLike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like/`)
      fetchPosts() // Refresh posts
    } catch (error) {
      console.error('Like error:', error)
    }
  }

  const handleDelete = async (postId) => {
    if (!window.confirm('Bu gönderiyi silmek istediğinize emin misiniz?')) return

    try {
      await api.delete(`/posts/${postId}/`)
      setPosts(posts.filter((p) => p.id !== postId))
    } catch (error) {
      console.error('Delete error:', error)
      alert('Gönderi silinemedi')
    }
  }

  if (loading) {
    return <div className="loading">Yükleniyor...</div>
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h2>Akış</h2>
      </div>

      <form onSubmit={handlePost} className="post-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ne düşünüyorsunuz?"
          rows={4}
          maxLength={1500}
        />
        <div className="post-form-footer">
          <span>{content.length}/1500</span>
          <button type="submit" disabled={posting || !content.trim()}>
            {posting ? 'Paylaşılıyor...' : 'Paylaş'}
          </button>
        </div>
      </form>

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="empty-state">Henüz gönderi yok</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-author">
                  <strong>@{post.author_username}</strong>
                  <span className="post-date">
                    {new Date(post.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(post.id)}
                  title="Sil"
                >
                  ×
                </button>
              </div>
              <div className="post-content">{post.content}</div>
              <div className="post-actions">
                <button
                  className={`btn-like ${post.is_liked ? 'liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  ❤️ {post.likes_count}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Feed

