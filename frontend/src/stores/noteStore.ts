import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { Note } from '@/types'
import type { FeedType } from '@/types/common'

interface FeedState {
  notes: Note[]
  page: number
  hasMore: boolean
  loading: boolean
}

export const useNoteStore = defineStore('note', () => {
  const feeds = reactive<Record<FeedType, FeedState>>({
    recommended: { notes: [], page: 1, hasMore: true, loading: false },
    hot: { notes: [], page: 1, hasMore: true, loading: false },
    following: { notes: [], page: 1, hasMore: true, loading: false },
  })
  const currentNote = ref<Note | null>(null)

  async function fetchFeed(type: FeedType, reset = false) {
    // Will be implemented in Phase 6
    const feed = feeds[type]
    if (reset) {
      feed.notes = []
      feed.page = 1
      feed.hasMore = true
    }
  }

  async function fetchNoteDetail(id: string) {
    // Will be implemented in Phase 6
    return null
  }

  return {
    feeds,
    currentNote,
    fetchFeed,
    fetchNoteDetail,
  }
})
