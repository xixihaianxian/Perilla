import instance from './index'

/** Topic model from backend */
export interface Topic {
  id: number
  title: string
  description: string | null
  cover_url: string | null
  author_id: number | null
  category_id: number | null
  created_at: string
  updated_at: string
}

/** Single item returned by /recommend/topic (flat, with user fields) */
export interface TopicItem extends Topic {
  username: string
  avatar: string
}

export interface TopicFeedParams {
  page?: number
  page_size?: number
  category_id?: number
}

export interface TopicFeedResponse {
  topics: TopicItem[]
  total: number
  hashMore: boolean
}

export interface TopicDetailResponse {
  id: number
  title: string
  content: string
  author: string
  publish_time: string
  bio: string
}

export interface TopicStatsResponse {
  start: number
  browser: number
}

export type MediaItem = string

export const topicApi = {
  /** GET /api/recommend/topic */
  async getTopicFeed(params: TopicFeedParams = {}): Promise<TopicFeedResponse> {
    const res = await instance.get<{ data: TopicFeedResponse }>('/recommend/topic', {
      params: {
        page: params.page || 1,
        page_size: params.page_size || 10,
        category_id: params.category_id ?? 0,
      },
    })
    return res.data.data
  },

  /** GET /api/recommend/topic/detail */
  async getTopicDetail(topicId: number): Promise<TopicDetailResponse> {
    const res = await instance.get<{ data: TopicDetailResponse }>('/recommend/topic/detail', {
      params: { topic_id: topicId },
    })
    return res.data.data
  },

  /** GET /api/recommend/topic/starts_views */
  async getTopicStats(topicId: number): Promise<TopicStatsResponse> {
    const res = await instance.get<{ data: TopicStatsResponse }>('/recommend/topic/starts_views', {
      params: { topic_id: topicId },
    })
    return res.data.data
  },

  /** GET /api/recommend/topic/media */
  async getTopicMedia(topicId: number): Promise<string[]> {
    const res = await instance.get<{ data: string[] }>('/recommend/topic/media', {
      params: { topic_id: topicId },
    })
    return res.data.data
  },
}
