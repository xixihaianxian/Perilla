import type { Report } from '@/types'
import { ReportStatus } from '@/types'
import type { ReportType } from '@/types/report'
import { generateId, randomDate, randomItem, randomInt } from '../utils'
import { mockUsers } from './users'

const REPORT_REASONS = [
  '内容包含不当信息',
  '侵犯个人隐私',
  '抄袭/未授权转载',
  '广告/垃圾信息',
  '虚假信息/谣言',
  '色情低俗内容',
  '人身攻击/辱骂',
  '其他违规行为',
]

export function createMockReports(): Report[] {
  const reports: Report[] = []

  for (let i = 0; i < 40; i++) {
    const reporter = randomItem(mockUsers)
    const targetTypes: ReportType[] = ['note', 'comment', 'user']
    const targetType = randomItem(targetTypes)

    let targetId = ''
    switch (targetType) {
      case 'note':
        targetId = generateId('note')
        break
      case 'comment':
        targetId = generateId('comment')
        break
      case 'user':
        targetId = randomItem(mockUsers).id
        break
    }

    const status = randomItem([
      ReportStatus.PENDING,
      ReportStatus.PENDING,
      ReportStatus.RESOLVED,
      ReportStatus.DISMISSED,
    ])

    reports.push({
      id: generateId('report'),
      reporter_id: reporter.id,
      reporter,
      target_type: targetType,
      target_id: targetId,
      reason: randomItem(REPORT_REASONS),
      description: `用户举报：${randomItem(REPORT_REASONS)}，请管理员核实处理。`,
      status,
      handler_id: status !== ReportStatus.PENDING ? mockUsers[0].id : null,
      handler_note: status === ReportStatus.RESOLVED ? '已处理，内容已下架' : status === ReportStatus.DISMISSED ? '举报不成立，内容正常' : '',
      created_at: randomDate(60),
      updated_at: randomDate(30),
    })
  }

  return reports
}

export const mockReports: Report[] = createMockReports()
