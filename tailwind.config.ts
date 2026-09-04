import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffbf0',
          100: '#fef3e0',
          200: '#fce3c1',
          300: '#f9d09a',
          400: '#f5b873',
          500: '#d4af37',
          600: '#b8941d',
          700: '#9c7a15',
          800: '#7a5f0f',
          900: '#5a4608',
        },
      },
    },
  },
  plugins: [],
}
export default config
