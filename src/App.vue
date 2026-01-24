<script setup>
import { ref, onMounted, provide } from 'vue'
import Navigation from './components/Navigation.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import SearchModal from './components/SearchModal.vue'
import { useProgressStore } from './stores/progress'

const currentTheme = ref('sepia')
const sidebarOpen = ref(false)
const searchOpen = ref(false)

const progressStore = useProgressStore()

const setTheme = (theme) => {
  currentTheme.value = theme
  localStorage.setItem('filosofie-theme', theme)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('filosofie-theme')
  if (savedTheme) {
    currentTheme.value = savedTheme
  }
  progressStore.loadProgress()
})

provide('theme', { currentTheme, setTheme })
provide('sidebar', { sidebarOpen })
provide('progress', progressStore)
</script>

<template>
  <div :class="`theme-${currentTheme}`" class="app-container">
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <Navigation />
    </aside>

    <div class="main-wrapper">
      <header class="header">
        <div class="header-left">
          <button @click="sidebarOpen = !sidebarOpen" class="menu-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <router-link to="/" class="logo">Filosofie XII</router-link>
        </div>
        <div class="header-right">
          <button @click="searchOpen = true" class="search-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span class="search-text">Caută...</span>
          </button>
          <ThemeSwitcher :current-theme="currentTheme" @change="setTheme" />
        </div>
      </header>

      <main class="main-content">
        <router-view />
      </main>
    </div>

    <SearchModal :is-open="searchOpen" @close="searchOpen = false" />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  background-color: var(--color-secondary);
  border-right: 1px solid var(--color-bg);
  width: 280px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-secondary);
  border-bottom: 1px solid var(--color-bg);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-btn {
  padding: 0.5rem;
  border-radius: 4px;
  display: none;
}

.menu-btn:hover {
  opacity: 0.7;
}

.logo {
  font-family: Georgia, serif;
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-accent);
  text-decoration: none;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--color-bg);
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.7;
}

.search-btn:hover {
  opacity: 1;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    left: -300px;
    z-index: 200;
    transition: left 0.3s ease;
  }

  .sidebar.open {
    left: 0;
  }

  .menu-btn {
    display: block;
  }

  .main-content {
    padding: 1rem;
  }

  .search-text {
    display: none;
  }
}
</style>
