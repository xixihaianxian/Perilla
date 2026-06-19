import instance from './index'
import { getToken, removeToken } from '@/utils/token'

export const authApi = {
  async login(data: { name_or_email: string; password: string }) {
    return instance.post('/user/login', data)
  },

  async register(data: { name: string; nickname: string; phone: string; email: string; password: string; gender: number }) {
    return instance.post('/user/register', data, { timeout: 40000 })
  },

  async getCurrentUser() {
    return instance.post('/user/me')
  },

  async refreshToken() {
    const token = getToken()
    return { code: 200, message: 'success', data: { token } }
  },

  async logout() {
    removeToken()
    return { code: 200, message: 'success', data: null }
  },
}
