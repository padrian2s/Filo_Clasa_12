/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Midnight theme
        midnight: {
          bg: '#1a1a2e',
          text: '#eaeaea',
          accent: '#6c63ff',
          secondary: '#16213e',
        },
        // Sepia theme
        sepia: {
          bg: '#f4ecd8',
          text: '#5c4033',
          accent: '#8b4513',
          secondary: '#e8dcc8',
        },
        // Ocean theme
        ocean: {
          bg: '#e8f4f8',
          text: '#2c3e50',
          accent: '#3498db',
          secondary: '#d4e8ed',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
