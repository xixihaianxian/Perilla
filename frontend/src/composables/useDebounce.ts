import { ref } from 'vue'

export function useDebounce<T extends (...args: unknown[]) => void>(fn: T, delay = 300) {
  const timer = ref<ReturnType<typeof setTimeout>>()

  const debouncedFn = (...args: Parameters<T>) => {
    if (timer.value) clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      fn(...args)
    }, delay)
  }

  return debouncedFn
}
