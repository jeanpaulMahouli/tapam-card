import type { Config } from 'tailwindcss';

// Palette TAPAM CARD inspirée du logo : Gold premium sur fond Noir/Blanc/Gris.
const config: Config = {
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        tapam: {
          gold: '#D4AF37',
          goldLight: '#F1D97A',
          goldDark: '#9C7A1E',
          black: '#0B0B0C',
          charcoal: '#1A1A1D',
          silver: '#C7C9CC',
          silverLight: '#EDEDEF',
          white: '#FFFFFF'
        }
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F1D97A 0%, #D4AF37 50%, #9C7A1E 100%)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
};

export default config;
