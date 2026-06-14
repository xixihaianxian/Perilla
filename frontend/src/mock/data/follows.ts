import type { Follow } from '@/types'
import { generateId, randomDate, randomInt } from '../utils'
import { mockUsers } from './users'

export function createMockFollows(): Follow[] {
  const follows: Follow[] = []

  mockUsers.forEach((user, i) => {
    // Each user follows some other users
    const followCount = randomInt(5, 30)
    const candidates = mockUsers.filter((_, j) => j !== i)
    const selected = candidates.sort(() => Math.random() - 0.5).slice(0, followCount)

    selected.forEach((target) => {
      follows.push({
        id: generateId('follow'),
        follower_id: user.id,
        following_id: target.id,
        created_at: randomDate(300),
      })
    })
  })

  // Update follower/following counts
  mockUsers.forEach((user) => {
    user.follower_count = follows.filter((f) => f.following_id === user.id).length
    user.following_count = follows.filter((f) => f.follower_id === user.id).length
  })

  return follows
}

export const mockFollows: Follow[] = createMockFollows()
