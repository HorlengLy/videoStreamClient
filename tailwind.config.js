/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '500px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      fontFamily:{
        lora:['Lora'],
        roboto:['Roboto'],
        SG:['Schibsted Grotesk']
      },
      keyframes:{
        'text-animate':{
          '40%,60%':{
            left: '100%'
          },
          '80%,100%':{
              left: '0%'
          }
        }
      },
      animation:{
        'text-animation':'text-animate 4s steps(10) infinite;'
      }
    },
  },
  plugins: [],
}