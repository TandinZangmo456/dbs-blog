import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}','./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:  ['var(--font-source-sans)', 'system-ui', 'sans-serif'],
        mono:  ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        ink:       { DEFAULT: '#1a1a2e', light: '#2d2d4a' },
        parchment: { DEFAULT: '#f5f0e8', dark: '#ece5d5' },
        gold:      { DEFAULT: '#c9a84c', light: '#e0bf7a', dark: '#a07830' },
      },
      typography: {
        DEFAULT: { css: { maxWidth: '72ch', color: '#1a1a2e', lineHeight: '1.8' } },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
