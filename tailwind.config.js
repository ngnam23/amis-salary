import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/views/**/*.{vue,js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{vue,js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{vue,js,ts,jsx,tsx,mdx}',
    './src/App.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0e9a62',
        eff: '#eff1f654',
        '001a': '#0000001a',
        e9e: '#E9EAEB',
        f12: '#f1f2f1',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
