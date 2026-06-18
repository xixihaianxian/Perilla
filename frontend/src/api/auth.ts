import instance from './index'
import mockDB from '@/mock'

export const authApi = {
  async login(data: { name_or_email: string; password: string }) {
    return instance.post('/user/login', data)
  },

  async register(data: { name: string; nickname: string; phone: string; email: string; password: string; gender: number }) {
    return instance.post('/user/register', data, { timeout: 40000 })
  },

  async getCurrentUser() {
    return instance.get('/user/me')
  },

  async refreshToken() {
    // Mock: just return the same token
    const token = localStorage.getItem('perilla_token')
    return { code: 200, message: 'success', data: { token } }
  },

  async logout() {
    localStorage.removeItem('perilla_token')
    return { code: 200, message: 'success', data: null }
  },
}
