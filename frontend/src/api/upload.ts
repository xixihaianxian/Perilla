import { simulateDelay, simulateError, randomImage } from '@/mock/utils'

export const uploadApi = {
  async uploadImage(_file: File): Promise<{ code: number; message: string; data: { url: string } }> {
    await simulateDelay()
    simulateError()
    return {
      code: 200,
      message: 'success',
      data: { url: randomImage(1200, 1200) },
    }
  },

  async uploadImages(files: File[]): Promise<{ code: number; message: string; data: { urls: string[] } }> {
    await simulateDelay()
    simulateError()
    return {
      code: 200,
      message: 'success',
      data: { urls: files.map(() => randomImage(1200, 1200)) },
    }
  },
}
