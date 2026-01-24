<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Fuse from 'fuse.js'
import structure from '../content/structure.json'
import concepts from '../content/concepts.json'
import philosophers from '../content/philosophers.json'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const searchQuery = ref('')
const activeTab = ref('all')
const searchInput = ref(null)

// Prepare search data
const allSections = computed(() => {
  const sections = []
  structure.chapters.forEach(chapter => {
    chapter.sections.forEach(section => {
      sections.push({
        type: 'section',
        title: section.title,
        chapter: chapter.title,
        chapterId: chapter.id,
        page: section.page,
        optional: section.optional
      })
    })
  })
  return sections
})

const allConcepts = computed(() => {
  return concepts.concepts.map(c => ({
    type: 'concept',
    term: c.term,
    definition: c.definition,
    chapters: c.chapters
  }))
})

const allPhilosophers = computed(() => {
  return philosophers.philosophers.map(p => ({
    type: 'philosopher',
    id: p.id,
    name: p.name,
    dates: p.dates,
    shortBio: p.shortBio,
    chapters: p.chapters
  }))
})

// Fuse instances
const fuseSections = computed(() => new Fuse(allSections.value, {
  keys: ['title', 'chapter'],
  threshold: 0.3,
  includeScore: true
}))

const fuseConcepts = computed(() => new Fuse(allConcepts.value, {
  keys: ['term', 'definition'],
  threshold: 0.3,
  includeScore: true
}))

const fusePhilosophers = computed(() => new Fuse(allPhilosophers.value, {
  keys: ['name', 'shortBio'],
  threshold: 0.3,
  includeScore: true
}))

// Search results
const results = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    return { sections: [], concepts: [], philosophers: [] }
  }

  return {
    sections: fuseSections.value.search(searchQuery.value).slice(0, 10).map(r => r.item),
    concepts: fuseConcepts.value.search(searchQuery.value).slice(0, 10).map(r => r.item),
    philosophers: fusePhilosophers.value.search(searchQuery.value).slice(0, 10).map(r => r.item)
  }
})

const filteredResults = computed(() => {
  if (activeTab.value === 'all') {
    return [
      ...results.value.sections.slice(0, 5),
      ...results.value.concepts.slice(0, 5),
      ...results.value.philosophers.slice(0, 5)
    ]
  }
  return results.value[activeTab.value] || []
})

const totalResults = computed(() => {
  return results.value.sections.length +
         results.value.concepts.length +
         results.value.philosophers.length
})

// Keyboard handling
const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown)
    setTimeout(() => searchInput.value?.focus(), 100)
  } else {
    document.removeEventListener('keydown', handleKeydown)
    searchQuery.value = ''
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4"
      @click="emit('close')"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50"></div>

      <!-- Modal -->
      <div
        class="relative w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden fade-in"
        style="background-color: var(--color-bg)"
        @click.stop
      >
        <!-- Search input -->
        <div class="p-4 border-b" style="border-color: var(--color-secondary)">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Caută secțiuni, concepte, filozofi..."
              class="flex-1 bg-transparent outline-none text-lg"
            />
            <button
              @click="emit('close')"
              class="p-1 rounded hover:opacity-70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 p-2 border-b" style="border-color: var(--color-secondary)">
          <button
            v-for="tab in [
              { id: 'all', label: 'Toate' },
              { id: 'sections', label: 'Secțiuni' },
              { id: 'concepts', label: 'Concepte' },
              { id: 'philosophers', label: 'Filozofi' }
            ]"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-3 py-1 rounded text-sm transition-colors"
            :style="activeTab === tab.id
              ? 'background-color: var(--color-accent); color: var(--color-bg)'
              : 'background-color: var(--color-secondary)'"
          >
            {{ tab.label }}
            <span v-if="tab.id !== 'all' && results[tab.id]?.length" class="ml-1 opacity-70">
              ({{ results[tab.id].length }})
            </span>
          </button>
        </div>

        <!-- Results -->
        <div class="max-h-96 overflow-y-auto p-2">
          <!-- No query -->
          <div v-if="!searchQuery || searchQuery.length < 2" class="p-4 text-center opacity-70">
            Introdu cel puțin 2 caractere pentru a căuta...
          </div>

          <!-- No results -->
          <div v-else-if="totalResults === 0" class="p-4 text-center opacity-70">
            Niciun rezultat pentru "{{ searchQuery }}"
          </div>

          <!-- Results list -->
          <div v-else class="space-y-1">
            <router-link
              v-for="(item, index) in filteredResults"
              :key="`${item.type}-${index}`"
              :to="item.type === 'section' ? `/pagina/${item.page}` : item.type === 'philosopher' ? `/capitol/${item.chapters?.[0] || 1}` : `/capitol/${item.chapters?.[0] || 1}`"
              class="block p-3 rounded hover:opacity-90 transition-opacity"
              style="background-color: var(--color-secondary)"
              @click="emit('close')"
            >
              <!-- Section result -->
              <div v-if="item.type === 'section'" class="flex items-center gap-3">
                <span class="text-xs px-2 py-1 rounded" style="background-color: var(--color-accent); color: var(--color-bg)">
                  Pag. {{ item.page }}
                </span>
                <div>
                  <div class="font-medium">{{ item.title }}</div>
                  <div class="text-xs opacity-70">{{ item.chapter }}</div>
                </div>
              </div>

              <!-- Concept result -->
              <div v-else-if="item.type === 'concept'" class="flex items-start gap-3">
                <span class="text-xs px-2 py-1 rounded shrink-0" style="background-color: var(--color-accent); color: var(--color-bg)">
                  Concept
                </span>
                <div>
                  <div class="font-medium">{{ item.term }}</div>
                  <div class="text-xs opacity-70 line-clamp-2">{{ item.definition }}</div>
                </div>
              </div>

              <!-- Philosopher result -->
              <div v-else-if="item.type === 'philosopher'" class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style="background-color: var(--color-accent); color: var(--color-bg)"
                >
                  {{ item.name.charAt(0) }}
                </div>
                <div>
                  <div class="font-medium">{{ item.name }}</div>
                  <div class="text-xs opacity-70">{{ item.dates }}</div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-2 border-t text-xs opacity-50 text-center" style="border-color: var(--color-secondary)">
          Apasă ESC pentru a închide
        </div>
      </div>
    </div>
  </Teleport>
</template>
