import type { Favorite, FavoriteFolder } from '@/types'
import { generateId, randomDate, randomItem, randomInt } from '../utils'
import { mockUsers } from './users'
import { mockNotes } from './notes'

export function createMockFavorites(): { favorites: Favorite[]; folders: FavoriteFolder[] } {
  const folders: FavoriteFolder[] = []
  const favorites: Favorite[] = []

  const folderNames = ['默认收藏夹', '穿搭灵感', '美食收藏', '旅行攻略', '摄影参考', '好物推荐', '家居灵感', '学习资料']

  mockUsers.forEach((user) => {
    // Create folders for each user
    const userFolders = folderNames.slice(0, randomInt(2, 5))
    userFolders.forEach((name) => {
      const folder: FavoriteFolder = {
        id: generateId('folder'),
        user_id: user.id,
        name,
        description: `${name}相关的内容合集`,
        cover_image: randomItem(mockNotes).cover_image,
        note_count: 0,
        is_public: randomItem([true, false]),
        created_at: randomDate(200),
      }
      folders.push(folder)
    })
  })

  // Create favorite items
  mockUsers.forEach((user) => {
    const userFolders = folders.filter((f) => f.user_id === user.id)
    const noteCount = randomInt(3, 20)
    const userNotes = randomItem(
      [...mockNotes].sort(() => Math.random() - 0.5).slice(0, noteCount),
    )

    // Make sure userNotes is treated as array
    const selectedNotes = mockNotes
      .sort(() => Math.random() - 0.5)
      .slice(0, noteCount)

    selectedNotes.forEach((note) => {
      favorites.push({
        id: generateId('fav'),
        user_id: user.id,
        note_id: note.id,
        folder_id: userFolders.length > 0 ? randomItem(userFolders).id : null,
        note,
        created_at: randomDate(100),
      })
    })
  })

  // Update folder note counts
  folders.forEach((folder) => {
    folder.note_count = favorites.filter((f) => f.folder_id === folder.id).length
  })

  return { favorites, folders }
}

export const { favorites: mockFavorites, folders: mockFavoriteFolders } =
  createMockFavorites()
