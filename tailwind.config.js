/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ← make sure these are correct
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        ascblue: '#003846',
        ascred: '#E31D1A',
        ascgrey: '#d6d6d6',
      },
    },
  },
  plugins: [],
};
