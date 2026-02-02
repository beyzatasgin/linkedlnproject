import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Register.css'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (!formData.username || !formData.email || !formData.password || !formData.password2) {
      setError('Lütfen tüm zorunlu alanları doldurun')
      return
    }

    if (formData.password !== formData.password2) {
      setError('Şifreler eşleşmiyor')
      return
    }

    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır')
      return
    }

    setLoading(true)
    try {
      const result = await register(formData)
      if (result.success) {
        navigate('/feed')
      } else {
        const errorMsg = result.error || 'Kayıt başarısız. Lütfen tekrar deneyin.'
        setError(errorMsg)
      }
    } catch (err) {
      const errorMsg = 'Bir hata oluştu. Lütfen tekrar deneyin.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Kayıt Ol</h1>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">Ad</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Soyad</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-posta *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Şifre *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password2">Şifre Tekrar *</label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>
        <p className="login-link">
          Zaten hesabınız var mı? <a href="/login">Giriş yapın</a>
        </p>
      </div>
    </div>
  )
}

export default Register

