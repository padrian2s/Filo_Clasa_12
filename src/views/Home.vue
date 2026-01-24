<script setup>
import { inject, computed } from 'vue'
import structure from '../content/structure.json'
import philosophers from '../content/philosophers.json'
import concepts from '../content/concepts.json'
import PhilosopherCard from '../components/PhilosopherCard.vue'

const chapters = structure.chapters
const progress = inject('progress')

const progressPercentage = computed(() => progress?.progressPercentage || 0)
const pagesReadCount = computed(() => progress?.pagesReadCount || 0)

// Featured philosophers
const featuredPhilosophers = computed(() =>
  philosophers.philosophers.slice(0, 6)
)
</script>

<template>
  <div id="top" class="content-area">
    <!-- Hero -->
    <div class="text-center py-12">
      <h1 class="text-4xl md:text-5xl font-serif mb-4">{{ structure.title }}</h1>
      <p class="text-lg opacity-80 mb-2">{{ structure.subtitle }}</p>
      <p class="opacity-60">
        {{ structure.authors.map(a => a.name).join(' | ') }}
      </p>
      <p class="text-sm opacity-50 mt-2">Editura {{ structure.publisher }}, {{ structure.year }}</p>
    </div>

    <!-- Progress overview -->
    <div class="mb-8 p-6 rounded-lg" style="background-color: var(--color-secondary)">
      <h3 class="text-lg font-semibold mb-3" style="color: var(--color-accent)">Progresul tău</h3>
      <div class="flex items-center gap-4 mb-3">
        <div class="flex-1">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
        </div>
        <span class="text-2xl font-bold" style="color: var(--color-accent)">{{ progressPercentage }}%</span>
      </div>
      <p class="text-sm opacity-70">
        {{ pagesReadCount }} din 163 pagini citite
      </p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mb-12 text-center">
      <div class="p-4 rounded-lg" style="background-color: var(--color-secondary)">
        <div class="text-3xl font-bold" style="color: var(--color-accent)">6</div>
        <div class="text-sm opacity-70">Capitole</div>
      </div>
      <div class="p-4 rounded-lg" style="background-color: var(--color-secondary)">
        <div class="text-3xl font-bold" style="color: var(--color-accent)">{{ concepts.concepts.length }}</div>
        <div class="text-sm opacity-70">Concepte</div>
      </div>
      <div class="p-4 rounded-lg" style="background-color: var(--color-secondary)">
        <div class="text-3xl font-bold" style="color: var(--color-accent)">{{ philosophers.philosophers.length }}</div>
        <div class="text-sm opacity-70">Filozofi</div>
      </div>
    </div>

    <!-- Chapter cards -->
    <h2 class="text-2xl font-serif font-bold mb-6" style="color: var(--color-accent)">Capitole</h2>
    <div class="grid md:grid-cols-2 gap-6 mb-12">
      <router-link
        v-for="chapter in chapters"
        :key="chapter.id"
        :to="`/capitol/${chapter.id}`"
        class="philosopher-card group"
      >
        <div class="flex items-start gap-4">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shrink-0"
            style="background-color: var(--color-accent); color: var(--color-bg)"
          >
            {{ chapter.id }}
          </div>
          <div>
            <h2 class="text-xl font-serif font-bold mb-2 group-hover:underline" style="color: var(--color-accent)">
              {{ chapter.title }}
            </h2>
            <p class="text-sm opacity-70">
              {{ chapter.sections.length }} secțiuni | Pag. {{ chapter.startPage }}
            </p>
            <div class="mt-2 flex flex-wrap gap-1">
              <span
                v-for="section in chapter.sections.slice(0, 3)"
                :key="section.page"
                class="text-xs px-2 py-1 rounded"
                style="background-color: var(--color-bg)"
              >
                {{ section.title.substring(0, 20) }}{{ section.title.length > 20 ? '...' : '' }}
              </span>
            </div>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Featured Philosophers -->
    <h2 class="text-2xl font-serif font-bold mb-6" style="color: var(--color-accent)">Filozofi reprezentativi</h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
      <PhilosopherCard
        v-for="philosopher in featuredPhilosophers"
        :key="philosopher.id"
        :philosopher-id="philosopher.id"
      />
    </div>

    <!-- Quick Info -->
    <div class="p-6 rounded-lg" style="background-color: var(--color-secondary)">
      <h2 class="text-xl font-serif font-bold mb-4" style="color: var(--color-accent)">
        Despre acest manual
      </h2>
      <p class="mb-4 leading-relaxed">
        Acest manual de filosofie se adresează elevilor din clasele a XII-a, filiera teoretică, profilul
        umanist, specializarea filosofie și științe sociale. Manualul a fost elaborat în conformitate cu
        programa de tip B pentru disciplina filosofie, dar poate fi utilizat și pentru clase cârceva unde
        alocă doar o oră pe săptămână, programa de tip A fiind de asemenea acoperită integral.
      </p>
      <p class="leading-relaxed">
        Fiecare capitol are o <strong>lecție introductivă</strong>, în care este prezentată sintetic tema respectivă.
        Urmează lecții care structurate astfel: o <strong>parte în care este analizată tema</strong> și sunt prezentate
        ideile principale și cele mai importante conținuturi; urmează <strong>aplicații</strong> și <strong>Dicționar</strong>
        cu termenii cheie.
      </p>
    </div>

    <!-- Keyboard shortcuts -->
    <div class="mt-12 p-4 rounded-lg text-center" style="background-color: var(--color-secondary)">
      <h3 class="font-semibold mb-2">Comenzi rapide</h3>
      <p class="text-sm opacity-70">
        <kbd class="px-2 py-1 rounded text-xs" style="background-color: var(--color-bg)">Ctrl</kbd>
        +
        <kbd class="px-2 py-1 rounded text-xs" style="background-color: var(--color-bg)">K</kbd>
        pentru căutare rapidă
      </p>
    </div>
  </div>
</template>
