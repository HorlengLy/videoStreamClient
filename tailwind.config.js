/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        lora:['Lora'],
        roboto:['Roboto'],
        SG:['Schibsted Grotesk']
      }
    },
  },
  plugins: [],
}