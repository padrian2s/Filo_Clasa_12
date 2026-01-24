<script setup>
import { computed, ref, onMounted, watch, inject, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import structure from '../content/structure.json'
import concepts from '../content/concepts.json'
import philosophers from '../content/philosophers.json'
import ConceptPopup from '../components/ConceptPopup.vue'
import PhilosopherCard from '../components/PhilosopherCard.vue'

const route = useRoute()
const router = useRouter()
const content = ref('')
const loading = ref(true)
const progress = inject('progress')

// Generate URL-friendly slug from text
const slugify = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Custom marked renderer to add IDs to headings
const renderer = new marked.Renderer()
renderer.heading = function(text, level) {
  // Handle marked v5+ where text might be an object
  const headingText = typeof text === 'object' ? text.text : text
  const headingLevel = typeof text === 'object' ? text.depth : level
  const slug = slugify(headingText)
  return `<h${headingLevel} id="${slug}">${headingText}</h${headingLevel}>`
}
marked.setOptions({ renderer })

// Scroll to hash anchor
const scrollToHash = async () => {
  await nextTick()
  const hash = route.hash
  if (hash) {
    const targetId = hash.slice(1) // Remove the '#'
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  } else {
    // No hash, scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Concept popup state
const showConceptPopup = ref(false)
const popupTerm = ref('')
const popupX = ref(0)
const popupY = ref(0)

// Philosopher modal state
const showPhilosopherModal = ref(false)
const activePhilosopherId = ref('')

const pageNumber = computed(() => parseInt(route.params.page))

// Bookmark state
const isBookmarked = computed(() => {
  return progress?.isBookmarked(pageNumber.value) || false
})

const toggleBookmark = () => {
  if (progress) {
    progress.toggleBookmark(pageNumber.value)
  }
}

// Chapter file mapping
const chapterFiles = {
  1: '01-omul',
  2: '02-morala',
  3: '03-politica',
  4: '04-cunoasterea',
  5: '05-existenta',
  6: '06-filosofia'
}

// Find which chapter this page belongs to
const currentChapter = computed(() => {
  for (const chapter of structure.chapters) {
    const nextChapter = structure.chapters.find(c => c.id === chapter.id + 1)
    const endPage = nextChapter ? nextChapter.startPage - 1 : 163

    if (pageNumber.value >= chapter.startPage && pageNumber.value <= endPage) {
      return chapter
    }
  }
  return null
})

// Find current section
const currentSection = computed(() => {
  if (!currentChapter.value) return null

  for (let i = currentChapter.value.sections.length - 1; i >= 0; i--) {
    if (pageNumber.value >= currentChapter.value.sections[i].page) {
      return currentChapter.value.sections[i]
    }
  }
  return null
})

// Get list of concept terms for highlighting
const conceptTerms = computed(() => concepts.concepts.map(c => c.term))

// Get list of philosopher names for highlighting
const philosopherNames = computed(() => philosophers.philosophers.map(p => ({
  name: p.name,
  id: p.id
})))

// Process content to add interactive markers
const processContent = (html) => {
  let processed = html

  // Highlight philosopher names
  philosopherNames.value.forEach(({ name, id }) => {
    const regex = new RegExp(`\\b(${name})\\b`, 'gi')
    processed = processed.replace(regex, `<span class="philosopher-link" data-philosopher-id="${id}">$1</span>`)
  })

  // Highlight concept terms (but not inside already processed spans)
  conceptTerms.value.forEach(term => {
    const regex = new RegExp(`(?<!<[^>]*)\\b(${term})\\b(?![^<]*>)`, 'gi')
    processed = processed.replace(regex, `<span class="concept-link" data-concept-term="$1">$1</span>`)
  })

  return processed
}

// Load content and scroll to section
const loadContent = async () => {
  loading.value = true
  try {
    if (currentChapter.value) {
      const chapterFile = chapterFiles[currentChapter.value.id]
      const module = await import(`../content/chapters/${chapterFile}.md?raw`)
      content.value = module.default
    } else {
      content.value = `# Pagina ${pageNumber.value}\n\nConținutul pentru această pagină nu este disponibil.`
    }
  } catch (error) {
    console.error('Error loading content:', error)
    content.value = `# Eroare\n\nNu s-a putut încărca pagina ${pageNumber.value}.`
  }
  loading.value = false
  // Scroll to hash anchor after content loads
  await scrollToHash()
}

// Mark page as read
const markPageAsRead = () => {
  if (progress && pageNumber.value) {
    progress.markPageRead(pageNumber.value)
  }
}

// Handle concept click
const handleConceptClick = (event) => {
  const term = event.target.dataset.conceptTerm
  if (term) {
    popupTerm.value = term
    popupX.value = event.clientX
    popupY.value = event.clientY
    showConceptPopup.value = true
  }
}

// Handle philosopher click
const handlePhilosopherClick = (event) => {
  const philosopherId = event.target.dataset.philosopherId
  if (philosopherId) {
    activePhilosopherId.value = philosopherId
    showPhilosopherModal.value = true
  }
}

// Close concept popup
const closeConceptPopup = () => {
  showConceptPopup.value = false
  popupTerm.value = ''
}

// Handle click on content area
const handleContentClick = (event) => {
  if (event.target.classList.contains('concept-link')) {
    handleConceptClick(event)
  } else if (event.target.classList.contains('philosopher-link')) {
    handlePhilosopherClick(event)
  }
}

const renderedContent = computed(() => {
  const html = marked(content.value)
  return processContent(html)
})

onMounted(async () => {
  await loadContent()
  setTimeout(markPageAsRead, 2000)
})

// Watch for page changes
watch(() => route.params.page, async () => {
  await loadContent()
  setTimeout(markPageAsRead, 2000)
})

// Watch for hash changes (same page, different section)
watch(() => route.hash, async (newHash, oldHash) => {
  if (newHash !== oldHash && !loading.value) {
    await scrollToHash()
  }
})
</script>

<template>
  <div class="page-container">
    <!-- Header bar -->
    <div class="page-header">
      <div class="breadcrumb">
        <router-link to="/">Acasă</router-link>
        <span>/</span>
        <router-link v-if="currentChapter" :to="`/capitol/${currentChapter.id}`">
          Capitol {{ currentChapter.id }}
        </router-link>
      </div>
      <button
        @click="toggleBookmark"
        class="bookmark-btn"
        :class="{ active: isBookmarked }"
        :title="isBookmarked ? 'Elimină marcaj' : 'Adaugă marcaj'"
      >
        📑
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Se încarcă...</p>
    </div>

    <!-- Content -->
    <div
      v-else
      class="prose-content"
      v-html="renderedContent"
      @click="handleContentClick"
    ></div>

    <!-- Page navigation -->
    <div class="page-nav">
      <router-link
        v-if="pageNumber > 5"
        :to="`/pagina/${pageNumber - 1}`"
        class="nav-btn"
      >
        ← Pagina {{ pageNumber - 1 }}
      </router-link>
      <div v-else></div>

      <span class="page-info">{{ pageNumber }} / 163</span>

      <router-link
        v-if="pageNumber < 163"
        :to="`/pagina/${pageNumber + 1}`"
        class="nav-btn"
      >
        Pagina {{ pageNumber + 1 }} →
      </router-link>
    </div>

    <!-- Concept Popup -->
    <ConceptPopup
      v-if="showConceptPopup"
      :term="popupTerm"
      :x="popupX"
      :y="popupY"
      @close="closeConceptPopup"
    />

    <!-- Philosopher Modal -->
    <Teleport to="body">
      <div
        v-if="showPhilosopherModal && activePhilosopherId"
        class="modal-overlay"
        @click="showPhilosopherModal = false"
      >
        <PhilosopherCard
          :philosopher-id="activePhilosopherId"
          @click.stop
        />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-container {
  padding: 1rem 2rem 2rem;
  max-width: 56rem;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-secondary);
}

.breadcrumb {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
  opacity: 0.7;
}

.breadcrumb a {
  color: inherit;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.bookmark-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.bookmark-btn:hover,
.bookmark-btn.active {
  opacity: 1;
}

.loading {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--color-secondary);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.prose-content {
  line-height: 1.8;
}

.prose-content :deep(h1),
.prose-content :deep(h2),
.prose-content :deep(h3) {
  scroll-margin-top: 1rem;
}

.prose-content :deep(h1) {
  font-size: 2rem;
  color: var(--color-accent);
  margin-bottom: 1.5rem;
}

.prose-content :deep(h2) {
  font-size: 1.5rem;
  color: var(--color-accent);
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-secondary);
}

.prose-content :deep(h3) {
  font-size: 1.25rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose-content :deep(p) {
  margin-bottom: 1rem;
  text-align: justify;
}

.prose-content :deep(blockquote) {
  border-left: 4px solid var(--color-accent);
  background: var(--color-secondary);
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 0 0.5rem 0.5rem 0;
  font-style: italic;
}

.prose-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.prose-content :deep(th),
.prose-content :deep(td) {
  border: 1px solid var(--color-accent);
  padding: 0.5rem 1rem;
  text-align: left;
}

.prose-content :deep(th) {
  background: var(--color-secondary);
}

.prose-content :deep(.concept-link) {
  color: var(--color-accent);
  cursor: pointer;
  text-decoration: underline dotted;
}

.prose-content :deep(.philosopher-link) {
  color: var(--color-accent);
  cursor: pointer;
  font-weight: 600;
}

.prose-content :deep(.philosopher-link:hover),
.prose-content :deep(.concept-link:hover) {
  opacity: 0.8;
}

.page-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--color-accent);
}

.nav-btn {
  padding: 0.5rem 1rem;
  background: var(--color-accent);
  color: var(--color-bg);
  text-decoration: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.nav-btn:hover {
  opacity: 0.9;
}

.page-info {
  font-size: 0.875rem;
  opacity: 0.7;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}
</style>
