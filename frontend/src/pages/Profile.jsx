import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './Profile.css'

const Profile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    headline: '',
    bio: '',
    location: '',
    website: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profiles/me/')
      setProfile(response.data)
      setFormData({
        headline: response.data.headline || '',
        bio: response.data.bio || '',
        location: response.data.location || '',
        website: response.data.website || '',
      })
    } catch (error) {
      console.error('Profile fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key])
        }
      })

      const response = await api.patch('/profiles/me/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setProfile(response.data)
      setEditing(false)
      alert('Profil güncellendi')
    } catch (error) {
      console.error('Profile update error:', error)
      alert('Profil güncellenemedi')
    }
  }

  if (loading) {
    return <div className="loading">Yükleniyor...</div>
  }

  if (!profile) {
    return <div className="error">Profil bulunamadı</div>
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Profil</h2>
          <button
            className="btn-edit"
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'İptal' : 'Düzenle'}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Başlık</label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="Örn: Yazılım Geliştirici"
              />
            </div>
            <div className="form-group">
              <label>Hakkımda</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Kendiniz hakkında bilgi verin..."
              />
            </div>
            <div className="form-group">
              <label>Konum</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Örn: İstanbul, Türkiye"
              />
            </div>
            <div className="form-group">
              <label>Web Sitesi</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
            <button type="submit" className="btn-save">
              Kaydet
            </button>
          </form>
        ) : (
          <div className="profile-info">
            <div className="profile-avatar">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {profile.user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="profile-details">
              <h3>@{profile.user?.username}</h3>
              {profile.headline && <p className="headline">{profile.headline}</p>}
              {profile.bio && <p className="bio">{profile.bio}</p>}
              {profile.location && (
                <p className="location">📍 {profile.location}</p>
              )}
              {profile.website && (
                <p className="website">
                  <a href={profile.website} target="_blank" rel="noopener noreferrer">
                    {profile.website}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

