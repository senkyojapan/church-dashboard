/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Hiragino Sans"',
          '"Hiragino Kaku Gothic ProN"',
          '"Noto Sans JP"',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', '"SFMono-Regular"', 'Menlo', 'monospace'],
      },
      colors: {
        canvas: {
          DEFAULT: '#FAFAFA',
          dark: '#0A0A0B',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#141416',
        },
        border: {
          DEFAULT: '#E5E5E7',
          dark: '#252528',
        },
        ink: {
          DEFAULT: '#0F0F10',
          dim: '#6B6B70',
          dark: '#F2F2F3',
          dimDark: '#9A9AA0',
        },
        accent: {
          DEFAULT: '#4F5DED',
          soft: '#EEF0FE',
          softDark: '#1B1D3A',
        },
        pos: {
          strong: '#0F9D58',
          soft: '#D8F3E4',
          softDark: '#0E2A1C',
        },
        neg: {
          strong: '#D93636',
          soft: '#FBE1E1',
          softDark: '#3A1414',
        },
        flat: {
          strong: '#8A8A90',
          soft: '#EDEDEF',
          softDark: '#232326',
        },
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(0,0,0,0.04), 0 1px 8px -2px rgba(0,0,0,0.06)',
        cardDark: '0 1px 2px 0 rgba(0,0,0,0.3), 0 1px 8px -2px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
