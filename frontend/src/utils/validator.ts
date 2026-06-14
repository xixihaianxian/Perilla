/**
 * Form validation rules (compatible with Element Plus)
 */

export const required = (message = '此项为必填项') => ({
  required: true,
  message,
  trigger: 'blur',
})

export const email = {
  type: 'email' as const,
  message: '请输入正确的邮箱地址',
  trigger: ['blur', 'change'],
}

export function minLength(min: number, message?: string) {
  return {
    min,
    message: message || `长度不能少于${min}个字符`,
    trigger: 'blur',
  }
}

export function maxLength(max: number, message?: string) {
  return {
    max,
    message: message || `长度不能超过${max}个字符`,
    trigger: 'blur',
  }
}

export const passwordStrength = {
  pattern: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
  message: '密码至少6位，包含字母和数字',
  trigger: 'blur',
}

export const username = {
  pattern: /^[a-zA-Z0-9_一-龥]{2,20}$/,
  message: '用户名2-20位，支持中英文、数字、下划线',
  trigger: 'blur',
}

export const url = {
  type: 'url' as const,
  message: '请输入正确的网址',
  trigger: 'blur',
}
