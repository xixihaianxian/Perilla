import { ref, onMounted, onUnmounted } from 'vue'

export function usePolling(fn: () => Promise<void>, intervalMs = 5000) {
  const isPolling = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  function start() {
    if (timer) return
    isPolling.value = true
    fn() // Immediately call first time
    timer = setInterval(fn, intervalMs)

    // Pause when tab is not visible
    document.addEventListener('visibilitychange', handleVisibility)
  }

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    isPolling.value = false
    document.removeEventListener('visibilitychange', handleVisibility)
  }

  function handleVisibility() {
    if (document.hidden) {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    } else {
      if (!timer) {
        fn() // Refresh immediately when tab becomes visible
        timer = setInterval(fn, intervalMs)
      }
    }
  }

  onMounted(() => start())
  onUnmounted(() => stop())

  return { isPolling, start, stop }
}
