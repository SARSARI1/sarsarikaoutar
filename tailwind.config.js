/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        stone: {
          50: '#F7F5F1',
          100: '#EFEBE3',
          900: '#211F1C',
        },
        ink: '#211F1C',
      },
    },
  },
  plugins: [],
}
