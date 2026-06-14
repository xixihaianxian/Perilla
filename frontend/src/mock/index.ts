import type {
  User, Note, Comment, Notification, Conversation, Message,
  Favorite, FavoriteFolder, Follow, Topic, Tag, Report, SearchHistory,
} from '@/types'
import type { PaginatedResponse } from '@/types/api'
import { mockUsers } from './data/users'
import { mockNotes } from './data/notes'
import { mockComments } from './data/comments'
import { mockNotifications } from './data/notifications'
import { mockConversations, mockMessages } from './data/conversations'
import { mockFavorites, mockFavoriteFolders } from './data/favorites'
import { mockFollows } from './data/follows'
import { mockTopics } from './data/topics'
import { mockTags } from './data/tags'
import { mockReports } from './data/reports'
import { simulateDelay, simulateError, generateId } from './utils'

class MockDB {
  private static instance: MockDB

  users: Map<string, User>
  notes: Map<string, Note>
  comments: Map<string, Comment>
  notifications: Map<string, Notification>
  conversations: Map<string, Conversation>
  messages: Map<string, Message>
  favorites: Map<string, Favorite>
  favoriteFolders: Map<string, FavoriteFolder>
  follows: Map<string, Follow>
  topics: Map<string, Topic>
  tags: Map<string, Tag>
  reports: Map<string, Report>
  searchHistory: Map<string, SearchHistory>

  private constructor() {
    this.users = new Map(mockUsers.map((u) => [u.id, u]))
    this.notes = new Map(mockNotes.map((n) => [n.id, n]))
    this.comments = new Map(mockComments.map((c) => [c.id, c]))
    this.notifications = new Map(mockNotifications.map((n) => [n.id, n]))
    this.conversations = new Map(mockConversations.map((c) => [c.id, c]))
    this.messages = new Map(mockMessages.map((m) => [m.id, m]))
    this.favorites = new Map(mockFavorites.map((f) => [f.id, f]))
    this.favoriteFolders = new Map(mockFavoriteFolders.map((f) => [f.id, f]))
    this.follows = new Map(mockFollows.map((f) => [f.id, f]))
    this.topics = new Map(mockTopics.map((t) => [t.id, t]))
    this.tags = new Map(mockTags.map((t) => [t.id, t]))
    this.reports = new Map(mockReports.map((r) => [r.id, r]))
    this.searchHistory = new Map()
  }

  static getInstance(): MockDB {
    if (!MockDB.instance) {
      MockDB.instance = new MockDB()
    }
    return MockDB.instance
  }

  // ==================== Generic Query Helpers ====================

  async paginate<T>(
    items: T[],
    page: number,
    pageSize: number,
  ): Promise<PaginatedResponse<T>> {
    await simulateDelay()
    simulateError()

    const start = (page - 1) * pageSize
    const paged = items.slice(start, start + pageSize)

    return {
      items: paged,
      total: items.length,
      page,
      pageSize,
    }
  }

  async wrap<T>(data: T): Promise<{ code: number; message: string; data: T }> {
    await simulateDelay()
    simulateError()
    return { code: 200, message: 'success', data }
  }

  // ==================== Auth ====================

  async login(username: string, _password: string) {
    await simulateDelay()
    const user = [...this.users.values()].find(
      (u) => u.username === username || u.email === username,
    )
    if (!user) {
      throw new Error('用户名或密码错误')
    }
    // Generate a fake JWT token
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ sub: user.id, exp: Date.now() / 1000 + 86400, role: user.role }))}.fake_signature`
    return this.wrap({ token, user })
  }

  async register(data: { username: string; email: string; password: string }) {
    await simulateDelay()
    simulateError()

    const exists = [...this.users.values()].some(
      (u) => u.username === data.username || u.email === data.email,
    )
    if (exists) {
      throw new Error('用户名或邮箱已被注册')
    }

    const now = new Date().toISOString()
    const user: User = {
      id: generateId('user'),
      username: data.username,
      email: data.email,
      nickname: data.username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      bio: '',
      gender: 'other',
      birthday: null!,
      location: '',
      website: '',
      role: 'user',
      status: 'active',
      follower_count: 0,
      following_count: 0,
      note_count: 0,
      is_following: false,
      created_at: now,
      updated_at: now,
    }
    this.users.set(user.id, user)

    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ sub: user.id, exp: Date.now() / 1000 + 86400, role: 'user' }))}.fake_signature`
    return this.wrap({ token, user })
  }

  async getCurrentUser(userId: string) {
    const user = this.users.get(userId)
    if (!user) throw new Error('用户不存在')
    return this.wrap(user)
  }

  // ==================== Notes ====================

  async getFeed(
    type: 'recommended' | 'hot' | 'following',
    userId: string | null,
    page: number,
    pageSize: number,
    tagName?: string,
  ) {
    let notes = [...this.notes.values()].filter((n) => n.status === 'published')

    // Filter by tag name if specified
    if (tagName && tagName !== '全部') {
      notes = notes.filter((n) => n.tags?.some((t) => t.name === tagName))
    }

    if (type === 'following' && userId) {
      const followingIds = [...this.follows.values()]
        .filter((f) => f.follower_id === userId)
        .map((f) => f.following_id)
      notes = notes.filter((n) => followingIds.includes(n.user_id))
    } else if (type === 'hot') {
      notes.sort((a, b) => b.like_count + b.comment_count - (a.like_count + a.comment_count))
    } else {
      notes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    // Attach current user's like/favorite status
    if (userId) {
      notes = notes.map((n) => ({
        ...n,
        is_liked: false, // Simplified - would check against a likes table
        is_favorited: [...this.favorites.values()].some(
          (f) => f.user_id === userId && f.note_id === n.id,
        ),
      }))
    }

    return this.paginate(notes, page, pageSize)
  }

  async getNoteDetail(noteId: string, userId?: string) {
    const note = this.notes.get(noteId)
    if (!note) throw new Error('笔记不存在')

    // Increment view count
    note.view_count++

    if (userId) {
      note.is_liked = false
      note.is_favorited = [...this.favorites.values()].some(
        (f) => f.user_id === userId && f.note_id === noteId,
      )
    }

    return this.wrap(note)
  }

  async createNote(data: {
    user_id: string
    title: string
    content: string
    cover_image: string
    media: string[]
    tag_ids: string[]
    topic_ids: string[]
  }) {
    const now = new Date().toISOString()
    const author = this.users.get(data.user_id)!

    const note: Note = {
      id: generateId('note'),
      user_id: data.user_id,
      title: data.title,
      content: data.content,
      cover_image: data.cover_image,
      status: 'published',
      view_count: 0,
      like_count: 0,
      comment_count: 0,
      favorite_count: 0,
      share_count: 0,
      is_liked: false,
      is_favorited: false,
      author,
      media: data.media.map((url, i) => ({
        id: generateId('media'),
        note_id: '',
        url,
        thumbnail_url: url,
        width: 640,
        height: 640,
        sort_order: i,
        created_at: now,
      })),
      tags: data.tag_ids.map((id) => this.tags.get(id)!).filter(Boolean),
      topics: data.topic_ids.map((id) => this.topics.get(id)!).filter(Boolean),
      created_at: now,
      updated_at: now,
    }
    note.media = note.media.map((m) => ({ ...m, note_id: note.id }))
    this.notes.set(note.id, note)

    // Update user note count
    author.note_count++

    return this.wrap(note)
  }

  async updateNote(noteId: string, data: Record<string, unknown>) {
    const note = this.notes.get(noteId)
    if (!note) throw new Error('笔记不存在')
    Object.assign(note, data, { updated_at: new Date().toISOString() })
    return this.wrap(note)
  }

  async deleteNote(noteId: string) {
    const note = this.notes.get(noteId)
    if (!note) throw new Error('笔记不存在')
    this.notes.delete(noteId)
    // Delete related comments
    ;[...this.comments.values()]
      .filter((c) => c.note_id === noteId)
      .forEach((c) => this.comments.delete(c.id))
    // Update user note count
    if (note.author) note.author.note_count--
    return this.wrap(null)
  }

  // ==================== Comments ====================

  async getComments(noteId: string, page: number, pageSize: number) {
    const topComments = [...this.comments.values()]
      .filter((c) => c.note_id === noteId && c.parent_id === null)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return this.paginate(topComments, page, pageSize)
  }

  async createComment(data: { note_id: string; user_id: string; parent_id?: string; content: string }) {
    const now = new Date().toISOString()
    const user = this.users.get(data.user_id)!
    const comment: Comment = {
      id: generateId('comment'),
      note_id: data.note_id,
      user_id: data.user_id,
      parent_id: data.parent_id || null,
      content: data.content,
      like_count: 0,
      is_liked: false,
      user,
      replies: [],
      reply_count: 0,
      created_at: now,
    }

    // If it's a reply, add to parent's replies
    if (data.parent_id) {
      const parent = this.comments.get(data.parent_id)
      if (parent) {
        parent.replies.push(comment)
        parent.reply_count++
      }
    }

    this.comments.set(comment.id, comment)

    // Update note comment count
    const note = this.notes.get(data.note_id)
    if (note) note.comment_count++

    return this.wrap(comment)
  }

  async deleteComment(commentId: string) {
    this.comments.delete(commentId)
    return this.wrap(null)
  }

  // ==================== Favorites ====================

  async toggleFavorite(userId: string, noteId: string, folderId?: string) {
    const existing = [...this.favorites.values()].find(
      (f) => f.user_id === userId && f.note_id === noteId,
    )
    if (existing) {
      this.favorites.delete(existing.id)
      return this.wrap({ favorited: false })
    }

    const fav: Favorite = {
      id: generateId('fav'),
      user_id: userId,
      note_id: noteId,
      folder_id: folderId || null,
      created_at: new Date().toISOString(),
    }
    this.favorites.set(fav.id, fav)
    return this.wrap({ favorited: true })
  }

  async getFolders(userId: string) {
    const folders = [...this.favoriteFolders.values()].filter((f) => f.user_id === userId)
    return this.wrap(folders)
  }

  async createFolder(userId: string, name: string) {
    const folder: FavoriteFolder = {
      id: generateId('folder'),
      user_id: userId,
      name,
      description: '',
      cover_image: '',
      note_count: 0,
      is_public: true,
      created_at: new Date().toISOString(),
    }
    this.favoriteFolders.set(folder.id, folder)
    return this.wrap(folder)
  }

  // ==================== Follow ====================

  async follow(followerId: string, followingId: string) {
    const existing = [...this.follows.values()].find(
      (f) => f.follower_id === followerId && f.following_id === followingId,
    )
    if (existing) throw new Error('已关注该用户')

    const follow: Follow = {
      id: generateId('follow'),
      follower_id: followerId,
      following_id: followingId,
      created_at: new Date().toISOString(),
    }
    this.follows.set(follow.id, follow)
    return this.wrap({ following: true })
  }

  async unfollow(followerId: string, followingId: string) {
    const follow = [...this.follows.values()].find(
      (f) => f.follower_id === followerId && f.following_id === followingId,
    )
    if (follow) this.follows.delete(follow.id)
    return this.wrap({ following: false })
  }

  // ==================== Search ====================

  async search(query: string, page: number, pageSize: number) {
    const q = query.toLowerCase()

    const noteResults = [...this.notes.values()].filter(
      (n) =>
        n.status === 'published' &&
        (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)),
    )

    const userResults = [...this.users.values()].filter(
      (u) =>
        u.nickname.toLowerCase().includes(q) || u.username.toLowerCase().includes(q),
    )

    const topicResults = [...this.topics.values()].filter(
      (t) => t.name.toLowerCase().includes(q),
    )

    return this.wrap({
      notes: await this.paginate(noteResults, page, pageSize),
      users: await this.paginate(userResults, 1, 10),
      topics: await this.paginate(topicResults, 1, 10),
    })
  }

  async addSearchHistory(userId: string, query: string) {
    const item: SearchHistory = {
      id: generateId('search'),
      user_id: userId,
      query,
      created_at: new Date().toISOString(),
    }
    this.searchHistory.set(item.id, item)
    return this.wrap(item)
  }

  async getSearchHistory(userId: string) {
    const history = [...this.searchHistory.values()]
      .filter((h) => h.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 20)
    return this.wrap(history)
  }

  async clearSearchHistory(userId: string) {
    ;[...this.searchHistory.values()]
      .filter((h) => h.user_id === userId)
      .forEach((h) => this.searchHistory.delete(h.id))
    return this.wrap(null)
  }

  // ==================== Messages ====================

  async getConversations(userId: string) {
    const convs = [...this.conversations.values()]
      .filter((c) => c.participants.some((p) => p.id === userId))
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    return this.wrap(convs)
  }

  async getMessages(conversationId: string, page: number, pageSize: number) {
    const msgs = [...this.messages.values()]
      .filter((m) => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    return this.paginate(msgs, page, pageSize)
  }

  async sendMessage(data: { conversation_id: string; sender_id: string; receiver_id: string; content: string }) {
    const msg: Message = {
      id: generateId('msg'),
      conversation_id: data.conversation_id,
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      content: data.content,
      image_url: null,
      is_read: false,
      created_at: new Date().toISOString(),
    }
    this.messages.set(msg.id, msg)

    // Update conversation
    const conv = this.conversations.get(data.conversation_id)
    if (conv) {
      conv.last_message = msg
      conv.updated_at = msg.created_at
      conv.unread_count++
    }

    return this.wrap(msg)
  }

  // ==================== Notifications ====================

  async getNotifications(userId: string, page: number, pageSize: number) {
    const notifs = [...this.notifications.values()]
      .filter((n) => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return this.paginate(notifs, page, pageSize)
  }

  async getUnreadCount(userId: string) {
    const count = [...this.notifications.values()].filter(
      (n) => n.user_id === userId && !n.is_read,
    ).length
    return this.wrap({ count })
  }

  async markNotificationRead(notificationId: string) {
    const notif = this.notifications.get(notificationId)
    if (notif) notif.is_read = true
    return this.wrap(null)
  }

  async markAllNotificationsRead(userId: string) {
    ;[...this.notifications.values()]
      .filter((n) => n.user_id === userId)
      .forEach((n) => (n.is_read = true))
    return this.wrap(null)
  }

  // ==================== Admin ====================

  async getDashboardStats() {
    const users = [...this.users.values()]
    const notes = [...this.notes.values()]
    const comments = [...this.comments.values()]
    const reports = [...this.reports.values()]

    return this.wrap({
      total_users: users.length,
      total_notes: notes.length,
      total_comments: comments.length,
      new_users_today: 12,
      new_notes_today: 45,
      pending_reviews: reports.filter((r) => r.status === 'pending').length,
      active_reports: reports.filter((r) => r.status === 'pending').length,
      daily_stats: [],
      category_distribution: [],
    })
  }

  async getUsersForAdmin(page: number, pageSize: number) {
    return this.paginate([...this.users.values()], page, pageSize)
  }

  async getNotesForAdmin(page: number, pageSize: number) {
    return this.paginate([...this.notes.values()], page, pageSize)
  }

  async getReportsForAdmin(page: number, pageSize: number) {
    return this.paginate([...this.reports.values()], page, pageSize)
  }

  async getRecommendedTags(limit = 12) {
    const tags = [...this.tags.values()]
      .sort((a, b) => b.note_count - a.note_count)
      .slice(0, limit)
    return this.wrap(tags)
  }
}

export const mockDB = MockDB.getInstance()
export default mockDB
