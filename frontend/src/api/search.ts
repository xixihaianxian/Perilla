import mockDB from '@/mock'
import { PAGE_SIZE } from '@/utils/constants'

export const searchApi = {
  async search(query: string, page = 1, pageSize = PAGE_SIZE) {
    return mockDB.search(query, page, pageSize)
  },

  async getSearchHistory(userId: string) {
    return mockDB.getSearchHistory(userId)
  },

  async clearHistory(userId: string) {
    return mockDB.clearSearchHistory(userId)
  },
}
