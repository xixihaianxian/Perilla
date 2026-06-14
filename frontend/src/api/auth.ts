import mockDB from '@/mock'

export const authApi = {
  async login(data: { username: string; password: string }) {
    return mockDB.login(data.username, data.password)
  },

  async register(data: { username: string; email: string; password: string }) {
    return mockDB.register(data)
  },

  async getCurrentUser() {
    // Parse user ID from stored token
    const token = localStorage.getItem('perilla_token')
    if (!token) throw new Error('未登录')
    // For mock, use the first user as the current user
    const userId = [...mockDB.users.values()][0]?.id
    if (!userId) throw new Error('用户不存在')
    return mockDB.getCurrentUser(userId)
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
