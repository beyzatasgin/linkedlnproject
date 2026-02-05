import { useState, useEffect } from 'react'
import api from '../services/api'
import './Connections.css'

const Connections = () => {
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, accepted
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    fetchConnections()
  }, [filter])

  const fetchConnections = async () => {
    try {
      const params = filter !== 'all' ? { status: filter.toUpperCase() } : {}
      const response = await api.get('/connections/', { params })
      setConnections(response.data.results || response.data)
    } catch (error) {
      console.error('Connections fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (connectionId) => {
    try {
      await api.post(`/connections/${connectionId}/accept/`)
      fetchConnections()
    } catch (error) {
      console.error('Accept error:', error)
      alert('Bağlantı kabul edilemedi')
    }
  }

  const handleReject = async (connectionId) => {
    try {
      await api.post(`/connections/${connectionId}/reject/`)
      fetchConnections()
    } catch (error) {
      console.error('Reject error:', error)
      alert('Bağlantı reddedilemedi')
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) {
      setResults([])
      return
    }
    try {
      const response = await api.get('/users/search/', { params: { q } })
      setResults(response.data)
    } catch (error) {
      console.error('Search error:', error)
      alert('Arama sırasında bir hata oluştu')
    }
  }

  const sendConnectionRequest = async (userId) => {
    try {
      await api.post('/connections/send_request/', { to_user_id: userId })
      alert('Bağlantı isteği gönderildi')
    } catch (error) {
      console.error('Send request error:', error)
      alert(
        error.response?.data?.error || 'Bağlantı isteği gönderilemedi'
      )
    }
  }

  if (loading) {
    return <div className="loading">Yükleniyor...</div>
  }

  return (
    <div className="connections-container">
      <div className="connections-header">
        <h2>Bağlantılar</h2>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Ara</button>
        </form>
        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            Tümü
          </button>
          <button
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Bekleyen
          </button>
          <button
            className={filter === 'accepted' ? 'active' : ''}
            onClick={() => setFilter('accepted')}
          >
            Kabul Edilen
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="search-results">
          <h3>Kullanıcı Arama Sonuçları</h3>
          {results.map((user) => (
            <div key={user.id} className="search-result-card">
              <div className="search-result-info">
                <strong>@{user.username}</strong>
                {(user.first_name || user.last_name) && (
                  <span>
                    {user.first_name} {user.last_name}
                  </span>
                )}
              </div>
              <button
                className="btn-accept"
                type="button"
                onClick={() => sendConnectionRequest(user.id)}
              >
                Bağlantı isteği gönder
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="connections-list">
        {connections.length === 0 ? (
          <div className="empty-state">Henüz bağlantı yok</div>
        ) : (
          connections.map((connection) => {
            const otherUser =
              connection.from_user_username ===
              JSON.parse(localStorage.getItem('user') || '{}')?.username
                ? connection.to_user_username
                : connection.from_user_username

            return (
              <div key={connection.id} className="connection-card">
                <div className="connection-info">
                  <strong>@{otherUser}</strong>
                  <span className={`status status-${connection.status.toLowerCase()}`}>
                    {connection.status === 'PENDING' ? 'Beklemede' : 'Kabul Edildi'}
                  </span>
                </div>
                {connection.status === 'PENDING' &&
                  connection.to_user_username ===
                    JSON.parse(localStorage.getItem('user') || '{}')?.username && (
                    <div className="connection-actions">
                      <button
                        className="btn-accept"
                        onClick={() => handleAccept(connection.id)}
                      >
                        Kabul Et
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleReject(connection.id)}
                      >
                        Reddet
                      </button>
                    </div>
                  )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Connections

