<script setup>
import { ref, computed } from 'vue'
import philosophers from '../content/philosophers.json'

const props = defineProps({
  philosopherId: String,
  inline: {
    type: Boolean,
    default: false
  }
})

const showModal = ref(false)

const philosopher = computed(() => {
  return philosophers.philosophers.find(p => p.id === props.philosopherId)
})

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}
</script>

<template>
  <!-- Inline clickable name -->
  <span
    v-if="inline && philosopher"
    class="cursor-pointer underline decoration-dotted hover:opacity-80 transition-opacity"
    style="color: var(--color-accent)"
    @click.stop="openModal"
  >
    {{ philosopher.name }}
  </span>

  <!-- Card version -->
  <div
    v-else-if="philosopher"
    class="philosopher-card cursor-pointer"
    @click="openModal"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
        style="background-color: var(--color-accent); color: var(--color-bg)"
      >
        {{ philosopher.name.charAt(0) }}
      </div>
      <div>
        <h4 class="font-semibold">{{ philosopher.name }}</h4>
        <p class="text-sm opacity-70">{{ philosopher.dates }}</p>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <Teleport to="body">
    <div
      v-if="showModal && philosopher"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click="closeModal"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50"></div>

      <!-- Modal content -->
      <div
        class="relative max-w-lg w-full max-h-[80vh] overflow-y-auto rounded-lg shadow-2xl p-6 fade-in"
        style="background-color: var(--color-bg)"
        @click.stop
      >
        <!-- Close button -->
        <button
          @click="closeModal"
          class="absolute top-4 right-4 p-2 rounded hover:opacity-70"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Header -->
        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shrink-0"
            style="background-color: var(--color-accent); color: var(--color-bg)"
          >
            {{ philosopher.name.charAt(0) }}
          </div>
          <div>
            <h2 class="text-2xl font-serif font-bold" style="color: var(--color-accent)">
              {{ philosopher.name }}
            </h2>
            <p class="opacity-70">{{ philosopher.dates }}</p>
            <p class="text-sm opacity-60">{{ philosopher.nationality }}</p>
          </div>
        </div>

        <!-- Bio -->
        <p class="mb-4 leading-relaxed">{{ philosopher.shortBio }}</p>

        <!-- Main works -->
        <div v-if="philosopher.mainWorks?.length" class="mb-4">
          <h3 class="font-semibold mb-2" style="color: var(--color-accent)">Opere principale</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="work in philosopher.mainWorks"
              :key="work"
              class="text-sm px-3 py-1 rounded italic"
              style="background-color: var(--color-secondary)"
            >
              {{ work }}
            </span>
          </div>
        </div>

        <!-- Key concepts -->
        <div v-if="philosopher.keyConcepts?.length" class="mb-4">
          <h3 class="font-semibold mb-2" style="color: var(--color-accent)">Concepte cheie</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="concept in philosopher.keyConcepts"
              :key="concept"
              class="text-sm px-3 py-1 rounded"
              style="background-color: var(--color-secondary)"
            >
              {{ concept }}
            </span>
          </div>
        </div>

        <!-- Quotes -->
        <div v-if="philosopher.quotes?.length" class="mb-4">
          <h3 class="font-semibold mb-2" style="color: var(--color-accent)">Citate celebre</h3>
          <div class="space-y-2">
            <blockquote
              v-for="(quote, index) in philosopher.quotes"
              :key="index"
              class="text-sm italic border-l-2 pl-3 py-1"
              style="border-color: var(--color-accent); background-color: var(--color-secondary)"
            >
              "{{ quote }}"
            </blockquote>
          </div>
        </div>

        <!-- Chapters -->
        <div v-if="philosopher.chapters?.length" class="text-sm opacity-70">
          Prezent în capitolele: {{ philosopher.chapters.join(', ') }}
        </div>
      </div>
    </div>
  </Teleport>
</template>
