import { ref, onMounted, onUnmounted } from 'vue'

export function useInfiniteScroll(
  loadMore: () => Promise<void>,
  options?: { threshold?: number },
) {
  const isLoading = ref(false)
  const hasMore = ref(true)
  const sentinelRef = ref<HTMLDivElement>()

  let observer: IntersectionObserver | null = null
  let loading = false

  async function triggerLoad() {
    if (loading || !hasMore.value) return
    loading = true
    isLoading.value = true
    try {
      await loadMore()
    } finally {
      loading = false
      isLoading.value = false
    }
  }

  function reset() {
    hasMore.value = true
    loading = false
    isLoading.value = false
  }

  function setHasMore(value: boolean) {
    hasMore.value = value
  }

  onMounted(() => {
    if (!sentinelRef.value) return
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerLoad()
          }
        })
      },
      { rootMargin: `${options?.threshold || 200}px` },
    )
    observer.observe(sentinelRef.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return {
    isLoading,
    hasMore,
    sentinelRef,
    reset,
    setHasMore,
    triggerLoad,
  }
}
