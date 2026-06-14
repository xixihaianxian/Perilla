import { ref, onMounted, onUnmounted } from 'vue'

export function useWaterfall(containerRef: { value: HTMLElement | null }, columnWidth = 280, gap = 16) {
  const columnCount = ref(4)
  const columns = ref<unknown[][]>([])

  function calculateColumns() {
    if (!containerRef.value) return
    const containerWidth = containerRef.value.clientWidth
    const count = Math.max(1, Math.floor((containerWidth + gap) / (columnWidth + gap)))
    columnCount.value = count
  }

  function distribute<T>(items: T[]): T[][] {
    const cols: T[][] = Array.from({ length: columnCount.value }, () => [])
    items.forEach((item) => {
      // Find shortest column by estimated height (simple count-based)
      const shortest = cols.reduce((prev, curr) =>
        curr.length < prev.length ? curr : prev,
      )
      shortest.push(item)
    })
    columns.value = cols
    return cols
  }

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    calculateColumns()
    if (containerRef.value) {
      resizeObserver = new ResizeObserver(() => calculateColumns())
      resizeObserver.observe(containerRef.value)
    }
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
  })

  return {
    columnCount,
    columns,
    calculateColumns,
    distribute,
  }
}
