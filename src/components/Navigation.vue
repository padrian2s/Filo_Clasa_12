<script setup>
import { ref, inject, computed } from 'vue'
import structure from '../content/structure.json'

const progress = inject('progress')
const expanded = ref([1])

const toggle = (id) => {
  const i = expanded.value.indexOf(id)
  if (i === -1) expanded.value.push(id)
  else expanded.value.splice(i, 1)
}

// Generate URL-friendly slug from section title
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

// Generate link with hash anchor for section
const getSectionLink = (section) => {
  const slug = slugify(section.title)
  return `/pagina/${section.page}#${slug}`
}
</script>

<template>
  <nav class="nav">
    <div class="nav-title">Cuprins</div>

    <div class="nav-list">
      <div v-for="ch in structure.chapters" :key="ch.id">
        <div class="chapter" @click="toggle(ch.id)">
          <span class="ch-num">{{ ch.id }}</span>
          <span class="ch-title">{{ ch.title }}</span>
          <span>{{ expanded.includes(ch.id) ? '▼' : '▶' }}</span>
        </div>

        <div v-if="expanded.includes(ch.id)" class="sections">
          <router-link
            v-for="(s, idx) in ch.sections"
            :key="`${s.page}-${idx}`"
            :to="getSectionLink(s)"
            class="section"
          >
            {{ s.title }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.nav-title {
  padding: 1rem;
  font-weight: 600;
  color: var(--color-accent);
  border-bottom: 1px solid var(--color-bg);
}

.nav-list {
  flex: 1;
  overflow-y: auto;
}

.chapter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.chapter:hover {
  background: var(--color-bg);
}

.ch-num {
  width: 1.5rem;
  height: 1.5rem;
  background: var(--color-accent);
  color: var(--color-bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.ch-title {
  flex: 1;
  font-size: 0.875rem;
}

.sections {
  background: var(--color-bg);
}

.section {
  display: block;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  font-size: 0.8rem;
  color: var(--color-text);
  text-decoration: none;
}

.section:hover {
  background: var(--color-secondary);
}
</style>
