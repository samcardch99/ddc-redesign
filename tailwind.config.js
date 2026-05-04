/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'md-custom': '637px',
        'md-860px': '860px',
        '2xl-prev': '1440px', // Define un nuevo breakpoint para un ancho mínimo de 2000px

        '2xl-custom': '2000px', // Define un nuevo breakpoint para un ancho mínimo de 2000px
        '3xl-custom': '3200px', // Define un nuevo breakpoint para un ancho mínimo de 3200px
      },
      colors: {
        primary: '#c2c7cf',
        secondary: '#0f1931',
        tertiary: '#162d57',
        grey: '#bac0c6',
        green: '#37361C',
      },
      fontFamily: {
        sans: [
          'Noirden',
          'sans-serif'
        ]
      },
    }
  },

  plugins: [],
}

