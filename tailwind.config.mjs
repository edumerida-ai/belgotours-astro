/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Inter', 'system-ui', 'sans-serif'],
  },

  colors: {
    brand: {
      yellow: '#F5C542',
      'yellow-dark': '#D9AC2C',
      black: '#0D0D0D',
      'black-soft': '#1A1A1A',
      white: '#FFFFFF',
      blue: '#4F46E5',
      purple: '#6D28D9',
    },
  },

  borderRadius: {
    xl: '1rem',
    '2xl': '1.4rem',
    '3xl': '1.9rem',
  },

  boxShadow: {
    soft: '0 18px 45px rgba(15, 23, 42, 0.15)',
    card: '0 10px 25px rgba(0,0,0,0.12)',
    header: '0 6px 20px rgba(0,0,0,0.08)',
  },

  container: {
    center: true,
    padding: '1.25rem',
  },
}
},
  
  plugins: [],
}
