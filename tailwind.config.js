/** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'zoom-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-in-from-bottom-2': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scan': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(192px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
        'zoom-in': 'zoom-in 0.5s ease-in-out',
        'slide-in-from-bottom-2': 'slide-in-from-bottom-2 0.5s ease-in-out',
        'scan': 'scan 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
