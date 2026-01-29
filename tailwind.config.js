/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        main:'#451d94',
        second:'#fc82a4'
      }
    },
  },
  plugins: [
    
  ],
};
