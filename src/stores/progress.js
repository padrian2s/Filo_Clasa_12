import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProgressStore = defineStore('progress', () => {
  const readPages = ref(new Set())
  const bookmarks = ref([])
  const totalPages = 163

  // Load from localStorage
  const loadProgress = () => {
    const saved = localStorage.getItem('filosofie-progress')
    if (saved) {
      const data = JSON.parse(saved)
      readPages.value = new Set(data.readPages || [])
      bookmarks.value = data.bookmarks || []
    }
  }

  // Save to localStorage
  const saveProgress = () => {
    localStorage.setItem('filosofie-progress', JSON.stringify({
      readPages: Array.from(readPages.value),
      bookmarks: bookmarks.value,
    }))
  }

  // Mark page as read
  const markPageRead = (page) => {
    readPages.value.add(page)
    saveProgress()
  }

  // Toggle bookmark
  const toggleBookmark = (page) => {
    const index = bookmarks.value.indexOf(page)
    if (index > -1) {
      bookmarks.value.splice(index, 1)
    } else {
      bookmarks.value.push(page)
    }
    saveProgress()
  }

  // Check if page is bookmarked
  const isBookmarked = (page) => bookmarks.value.includes(page)

  // Computed progress percentage
  const progressPercentage = computed(() => {
    return Math.round((readPages.value.size / totalPages) * 100)
  })

  // Computed pages read count
  const pagesReadCount = computed(() => readPages.value.size)

  return {
    readPages,
    bookmarks,
    totalPages,
    loadProgress,
    markPageRead,
    toggleBookmark,
    isBookmarked,
    progressPercentage,
    pagesReadCount,
  }
})
