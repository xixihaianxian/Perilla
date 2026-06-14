import instance from './index'

export interface Category {
  id: number
  name: string
}

export const tagApi = {
  /** GET /api/recommend/categories → Category[] */
  async getRecommendedTags(): Promise<Category[]> {
    const res = await instance.get<{ categories: Category[] }>('/recommend/categories')
    return res.data.categories
  },
}
