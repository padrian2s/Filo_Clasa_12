# Execution Plan: Filosofie Clasa a XII-a - Interactive Learning Platform

## Project Overview

Create an interactive, web-based learning platform for the Romanian Philosophy textbook (12th grade), inspired by the [Deep Learning Bible](https://padrian2s.github.io/bible_deep_learning/) approach.

**Source Material:** 163 scanned pages (A386-001.png to A386-163.png)

---

## Phase 1: Content Extraction & Structuring

### 1.1 OCR Processing
- [ ] Apply OCR to all 163 PNG images
- [ ] Use Romanian-optimized OCR (Tesseract with `ron` language pack or Claude Vision API)
- [ ] Output: Raw text files per page (`page-001.txt` to `page-163.txt`)

### 1.2 Content Cleanup
- [ ] Manual/AI-assisted review of OCR output
- [ ] Fix diacritics: ă, â, î, ș, ț
- [ ] Preserve formatting: paragraphs, quotes, references
- [ ] Handle special characters, philosophical symbols

### 1.3 Structure Extraction
- [ ] Identify chapter boundaries
- [ ] Extract table of contents
- [ ] Map: `page number → chapter → section → concept`
- [ ] Tag key philosophers, concepts, terms

**Expected Structure (typical Romanian Philosophy curriculum):**
```
├── Unitatea I: Filosofia - definiție și problematică
│   ├── Ce este filosofia?
│   ├── Domeniile filosofiei
│   └── Relația filosofie-știință-religie
├── Unitatea II: Ontologie
│   ├── Problema ființei
│   ├── Substanță și accident
│   └── Categoriile ontologice
├── Unitatea III: Gnoseologie
│   ├── Problema cunoașterii
│   ├── Adevăr și eroare
│   └── Teorii ale cunoașterii
├── Unitatea IV: Axiologie
│   ├── Valori și evaluare
│   ├── Binele și răul
│   └── Frumosul
├── Unitatea V: Antropologie filosofică
│   ├── Ce este omul?
│   ├── Libertate și determinism
│   └── Sensul vieții
├── Unitatea VI: Filosofie socială și politică
│   ├── Societate și stat
│   ├── Dreptate și egalitate
│   └── Democrație și totalitarism
└── Unitatea VII: Logică
    ├── Noțiune, judecată, raționament
    ├── Argumentare și demonstrație
    └── Sofisme și erori logice
```

---

## Phase 2: Technical Architecture

### 2.1 Tech Stack Selection

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Frontend | Vue 3 + Vite | Reactive, component-based, fast dev |
| Styling | Tailwind CSS | Rapid theming, utility-first |
| Build | Static Site Generation | GitHub Pages deployment |
| Content | Markdown + MDX | Easy authoring, component embedding |
| Search | Fuse.js | Client-side full-text search |
| State | Pinia | Progress tracking, bookmarks |

### 2.2 Project Structure
```
filo_clasa_12/
├── public/
│   └── images/           # Original scans (optional reference)
├── src/
│   ├── assets/
│   │   └── themes/       # Midnight, Sepia, Ocean CSS
│   ├── components/
│   │   ├── Navigation.vue
│   │   ├── PageContent.vue
│   │   ├── ConceptCard.vue
│   │   ├── PhilosopherProfile.vue
│   │   ├── QuoteBlock.vue
│   │   ├── ThoughtExperiment.vue
│   │   ├── ArgumentDiagram.vue
│   │   └── ThemeSwitcher.vue
│   ├── content/
│   │   ├── chapters/     # Markdown files per chapter
│   │   ├── concepts/     # Individual concept explanations
│   │   └── philosophers/ # Philosopher profiles
│   ├── stores/
│   │   └── progress.js   # Reading progress, bookmarks
│   ├── views/
│   │   ├── Home.vue
│   │   ├── Chapter.vue
│   │   └── Page.vue
│   └── App.vue
├── index.html
├── vite.config.js
└── package.json
```

---

## Phase 3: Interactive Features Design

### 3.1 Core Interactive Elements

#### Concept Popups
```
Click pe "substanță" → Popup cu:
  - Definiție scurtă
  - Etimologie (lat. substantia)
  - Variante la diferiți filosofi
  - Link către Aristotel, Spinoza, Leibniz
```

#### Philosopher Profiles
```
Click pe "Kant" → Modal cu:
  - Portret
  - Date biografice (1724-1804)
  - Opere principale
  - Concepte cheie (imperativ categoric, noumen/fenomen)
  - Citate celebre
  - Relații cu alți gânditori
```

#### Argument Visualizer
```
Silogism interactiv:
  P1: Toți oamenii sunt muritori
  P2: Socrate este om
  ─────────────────────────
  C: Socrate este muritor

  [Validează] [Identifică forma] [Găsește eroarea]
```

#### Thought Experiments (Experimente mentale)
```
"Peștera lui Platon" - Simulare interactivă:
  - Vizualizare animată
  - Alegeri: "Rămâi în peșteră" / "Ieși la lumină"
  - Explicație pas cu pas
  - Conexiuni cu Matrix, realitate virtuală
```

### 3.2 Navigation System

```
┌─────────────────────────────────────────────────────┐
│  📚 Filosofie XII    [🔍 Caută] [🌙/📜/🌊] [📊]    │
├─────────────────────────────────────────────────────┤
│  ▼ I. Ce este filosofia?                            │
│     Pag. 5 - Definiții ale filosofiei               │
│     Pag. 8 - Întrebările fundamentale               │
│     Pag. 12 - Filosofie și știință                  │
│  ▼ II. Ontologie                                    │
│     Pag. 18 - Problema ființei                      │
│     ...                                             │
├─────────────────────────────────────────────────────┤
│  PROGRES: ████████░░ 67% (109/163 pagini)           │
└─────────────────────────────────────────────────────┘
```

### 3.3 Theme System

| Theme | Background | Text | Accent | Use Case |
|-------|------------|------|--------|----------|
| Midnight 🌙 | #1a1a2e | #eaeaea | #6c63ff | Night reading |
| Sepia 📜 | #f4ecd8 | #5c4033 | #8b4513 | Classic book feel |
| Ocean 🌊 | #e8f4f8 | #2c3e50 | #3498db | Calm focus |

---

## Phase 4: Content Enhancement

### 4.1 Supplementary Content Creation

#### For Each Chapter:
- [ ] Summary (rezumat)
- [ ] Key terms glossary
- [ ] Discussion questions
- [ ] BAC exam practice questions
- [ ] Further reading suggestions

#### For Each Philosopher:
- [ ] Brief biography
- [ ] Historical context
- [ ] Core ideas explained simply
- [ ] Famous quotes with analysis
- [ ] Influence on later thought

#### Interactive Exercises:
- [ ] Concept matching games
- [ ] Argument construction exercises
- [ ] Multiple choice quizzes
- [ ] Essay prompts with rubrics

### 4.2 Cross-References Map

```javascript
const conceptLinks = {
  "substanță": {
    related: ["accident", "esență", "atribut"],
    philosophers: ["Aristotel", "Spinoza", "Leibniz"],
    chapters: [2, 5],
    pages: [23, 24, 67, 89]
  },
  // ... 200+ concepts
}
```

---

## Phase 5: Implementation Roadmap

### Sprint 1: Foundation (Week 1-2)
- [ ] OCR all 163 pages
- [ ] Clean and structure text
- [ ] Set up Vue + Vite project
- [ ] Implement basic navigation
- [ ] Create page routing

### Sprint 2: Core Features (Week 3-4)
- [ ] Implement theme switcher
- [ ] Build chapter/page components
- [ ] Add search functionality
- [ ] Create progress tracking

### Sprint 3: Interactivity (Week 5-6)
- [ ] Develop concept popups
- [ ] Build philosopher profiles
- [ ] Create argument diagrams
- [ ] Add thought experiment simulations

### Sprint 4: Content & Polish (Week 7-8)
- [ ] Add all supplementary content
- [ ] Create quizzes and exercises
- [ ] Cross-reference all concepts
- [ ] Mobile responsiveness
- [ ] Performance optimization

### Sprint 5: Deployment (Week 9)
- [ ] GitHub Pages setup
- [ ] Custom domain (optional)
- [ ] Analytics integration
- [ ] Final testing

---

## Phase 6: Deployment & Maintenance

### 6.1 GitHub Pages Setup
```bash
# vite.config.js
export default {
  base: '/filo_clasa_12/',
  build: {
    outDir: 'docs'
  }
}
```

### 6.2 CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
```

### 6.3 Future Enhancements
- [ ] AI-powered Q&A assistant
- [ ] Audio narration
- [ ] Collaborative annotations
- [ ] Teacher dashboard
- [ ] Print-friendly export
- [ ] Offline PWA support

---

## Technical Requirements

### Development Environment
- Node.js 18+
- npm or pnpm
- Git

### Recommended Tools
- VS Code with Vue extension
- Tesseract OCR or Claude Vision API
- Figma for UI mockups

### Performance Targets
- First Contentful Paint: < 1.5s
- Lighthouse Score: > 90
- Mobile-first responsive design

---

## File Deliverables

| Deliverable | Format | Description |
|-------------|--------|-------------|
| OCR Text | `.txt` | Raw extracted text per page |
| Structured Content | `.md` | Markdown files per chapter |
| Concept Database | `.json` | All philosophical terms |
| Philosopher Data | `.json` | Biographical information |
| Source Code | Vue SFC | Complete application |
| Documentation | `.md` | Setup and contribution guide |

---

## Success Metrics

1. **Completeness**: All 163 pages accessible
2. **Interactivity**: 100+ clickable concepts
3. **Navigation**: < 3 clicks to any content
4. **Performance**: Works on 3G connections
5. **Accessibility**: WCAG 2.1 AA compliant
6. **BAC Alignment**: Covers full curriculum

---

## References

- [Deep Learning Bible (inspiration)](https://padrian2s.github.io/bible_deep_learning/)
- [Romanian Philosophy Curriculum](https://www.edu.ro)
- [Vue 3 Documentation](https://vuejs.org)
- [Tailwind CSS](https://tailwindcss.com)

---

*Document created: January 2026*
*Target completion: Q1 2026*
