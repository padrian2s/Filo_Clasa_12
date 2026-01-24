<script setup>
import { computed, inject } from 'vue'
import { useRoute } from 'vue-router'
import structure from '../content/structure.json'

const route = useRoute()
const progress = inject('progress')

const chapter = computed(() => {
  const id = parseInt(route.params.id)
  return structure.chapters.find(c => c.id === id)
})

const isPageRead = (page) => {
  return progress?.readPages?.has(page) || false
}

// Calculate chapter progress
const chapterProgress = computed(() => {
  if (!chapter.value || !progress?.readPages) return 0
  const sectionPages = chapter.value.sections.map(s => s.page)
  const readCount = sectionPages.filter(p => progress.readPages.has(p)).length
  return Math.round((readCount / sectionPages.length) * 100)
})
</script>

<template>
  <div id="top" class="content-area" v-if="chapter">
    <!-- Chapter header -->
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-4">
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold"
          style="background-color: var(--color-accent); color: var(--color-bg)"
        >
          {{ chapter.id }}
        </div>
        <div>
          <h1 class="text-3xl md:text-4xl font-serif font-bold" style="color: var(--color-accent)">
            {{ chapter.title }}
          </h1>
          <p class="opacity-70">Capitol {{ chapter.id }} | Pagina {{ chapter.startPage }}</p>
        </div>
      </div>

      <!-- Chapter progress bar -->
      <div class="mt-4">
        <div class="flex items-center justify-between text-sm mb-2">
          <span class="opacity-70">Progres capitol</span>
          <span class="opacity-70">{{ chapterProgress }}%</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${chapterProgress}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Sections list -->
    <div class="space-y-4">
      <router-link
        v-for="(section, index) in chapter.sections"
        :key="section.page"
        :to="`/pagina/${section.page}`"
        class="block p-4 rounded-lg transition-all hover:shadow-md"
        style="background-color: var(--color-secondary)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <!-- Read indicator -->
            <span
              v-if="isPageRead(section.page)"
              class="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
              style="background-color: #22c55e"
            >
              &#10003;
            </span>
            <span
              v-else
              class="w-6 h-6 rounded-full flex items-center justify-center text-sm font-mono"
              style="background-color: var(--color-bg)"
            >
              {{ index + 1 }}
            </span>
            <div>
              <h3 class="font-semibold">
                {{ section.title }}
                <span v-if="section.optional" class="text-xs opacity-60 ml-2">(opțional)</span>
              </h3>
              <span class="text-xs opacity-60">Pagina {{ section.page }}</span>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </router-link>
    </div>

    <!-- Navigation -->
    <div class="mt-12 flex justify-between">
      <router-link
        v-if="chapter.id > 1"
        :to="`/capitol/${chapter.id - 1}`"
        class="px-4 py-2 rounded"
        style="background-color: var(--color-accent); color: var(--color-bg)"
      >
        &larr; Capitol {{ chapter.id - 1 }}
      </router-link>
      <div v-else></div>

      <router-link
        v-if="chapter.id < 6"
        :to="`/capitol/${chapter.id + 1}`"
        class="px-4 py-2 rounded"
        style="background-color: var(--color-accent); color: var(--color-bg)"
      >
        Capitol {{ chapter.id + 1 }} &rarr;
      </router-link>
    </div>
  </div>
</template>
