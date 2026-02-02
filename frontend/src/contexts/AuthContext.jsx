import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get('/users/me/')
      setUser(response.data)
    } catch (error) {
      console.error('User fetch error:', error)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      const response = await api.post('/token/', {
        username,
        password,
      })
      const { access, refresh } = response.data
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      await fetchUser()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Giriş başarısız',
      }
    }
  }

  const register = async (userData) => {
    try {
      await api.post('/users/register/', userData)

      // Register sonrası otomatik login
      const loginResponse = await api.post('/token/', {
        username: userData.username,
        password: userData.password,
      })
      const { access, refresh } = loginResponse.data
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      await fetchUser()
      return { success: true }
    } catch (error) {
      // Hata mesajlarını parse et
      const errorData = error.response?.data
      let errorMessage = 'Kayıt başarısız'
      
      if (errorData) {
        if (typeof errorData === 'string') {
          errorMessage = errorData
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        } else if (typeof errorData === 'object') {
          // Field-specific hataları birleştir
          const fieldErrors = Object.entries(errorData)
            .map(([field, errors]) => {
              const fieldName = field === 'username' ? 'Kullanıcı adı' :
                               field === 'email' ? 'E-posta' :
                               field === 'password' ? 'Şifre' :
                               field === 'password2' ? 'Şifre tekrar' :
                               field === 'first_name' ? 'Ad' :
                               field === 'last_name' ? 'Soyad' : field
              const errorList = Array.isArray(errors) ? errors : [errors]
              const errorText = errorList.join(', ')
              return `${fieldName}: ${errorText}`
            })
            .join('; ')
          errorMessage = fieldErrors || errorMessage
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

