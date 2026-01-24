<script setup>
defineProps({
  currentTheme: String
})

const emit = defineEmits(['change'])

const themes = [
  { id: 'midnight', icon: '&#127769;', label: 'Midnight' },
  { id: 'sepia', icon: '&#128220;', label: 'Sepia' },
  { id: 'ocean', icon: '&#127754;', label: 'Ocean' },
]
</script>

<template>
  <div class="flex items-center gap-1 rounded-full p-1" style="background-color: var(--color-bg)">
    <button
      v-for="theme in themes"
      :key="theme.id"
      @click="emit('change', theme.id)"
      class="p-2 rounded-full transition-all"
      :class="currentTheme === theme.id ? 'scale-110 shadow' : 'opacity-60 hover:opacity-100'"
      :style="currentTheme === theme.id ? 'background-color: var(--color-accent)' : ''"
      :title="theme.label"
    >
      <span v-html="theme.icon" class="text-sm"></span>
    </button>
  </div>
</template>
