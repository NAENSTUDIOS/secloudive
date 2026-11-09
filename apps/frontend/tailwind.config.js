/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b1324',
        muted: '#64748b',
        brand: '#2dd4bf',
        accent: '#a78bfa',
      },
    },
  },
  plugins: [],
};
