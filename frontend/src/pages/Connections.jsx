import { useState, useEffect } from 'react'
import api from '../services/api'
import './Connections.css'

const Connections = () => {
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, accepted

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

  if (loading) {
    return <div className="loading">Yükleniyor...</div>
  }

  return (
    <div className="connections-container">
      <div className="connections-header">
        <h2>Bağlantılar</h2>
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

