<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import concepts from '../content/concepts.json'

const props = defineProps({
  term: String,
  x: Number,
  y: Number
})

const emit = defineEmits(['close'])

const concept = computed(() => {
  return concepts.concepts.find(
    c => c.term.toLowerCase() === props.term?.toLowerCase()
  )
})

const popupStyle = computed(() => {
  // Position popup near click, but keep it on screen
  const left = Math.min(props.x, window.innerWidth - 350)
  const top = Math.min(props.y + 10, window.innerHeight - 300)
  return {
    left: `${left}px`,
    top: `${top}px`
  }
})

const handleClickOutside = (e) => {
  if (!e.target.closest('.concept-popup')) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    v-if="concept"
    class="concept-popup fixed z-50 max-w-sm rounded-lg shadow-2xl p-4 fade-in"
    :style="popupStyle"
    style="background-color: var(--color-bg); border: 2px solid var(--color-accent)"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <h3 class="text-lg font-bold font-serif" style="color: var(--color-accent)">
        {{ concept.term }}
      </h3>
      <button
        @click="emit('close')"
        class="p-1 rounded hover:opacity-70"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Definition -->
    <p class="text-sm mb-3 leading-relaxed">
      {{ concept.definition }}
    </p>

    <!-- Etymology -->
    <p v-if="concept.etymology" class="text-xs opacity-70 mb-3 italic">
      {{ concept.etymology }}
    </p>

    <!-- Related Terms -->
    <div v-if="concept.relatedTerms?.length" class="mb-3">
      <span class="text-xs font-semibold opacity-70">Termeni asociați:</span>
      <div class="flex flex-wrap gap-1 mt-1">
        <span
          v-for="term in concept.relatedTerms"
          :key="term"
          class="text-xs px-2 py-1 rounded"
          style="background-color: var(--color-secondary)"
        >
          {{ term }}
        </span>
      </div>
    </div>

    <!-- Philosophers -->
    <div v-if="concept.philosophers?.length" class="mb-2">
      <span class="text-xs font-semibold opacity-70">Filozofi:</span>
      <span class="text-xs ml-1">{{ concept.philosophers.join(', ') }}</span>
    </div>

    <!-- Chapters -->
    <div v-if="concept.chapters?.length" class="text-xs opacity-60">
      Capitolele: {{ concept.chapters.join(', ') }}
    </div>
  </div>

  <!-- Fallback if concept not found -->
  <div
    v-else-if="term"
    class="concept-popup fixed z-50 max-w-xs rounded-lg shadow-2xl p-4 fade-in"
    :style="popupStyle"
    style="background-color: var(--color-bg); border: 2px solid var(--color-accent)"
  >
    <div class="flex items-start justify-between mb-2">
      <h3 class="text-lg font-bold font-serif" style="color: var(--color-accent)">
        {{ term }}
      </h3>
      <button @click="emit('close')" class="p-1 rounded hover:opacity-70">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <p class="text-sm opacity-70 italic">
      Definiția pentru acest termen nu este disponibilă.
    </p>
  </div>
</template>
