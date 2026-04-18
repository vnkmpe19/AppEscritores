/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        'fondo-cuarto': '#FEFFE8',
        'menta-web': '#AFEFEF',
        'azul-personajes': '#B4DDEB',
        'rosa-proyectos': '#F1C9C6',
        'bg-ocurrencias': '#FFF5F5', 
        'celeste-sidebar': '#BFD7ED',
        'rosa-search': '#FFB7C5',
        'crema-bg': '#FDF5F5',     
        'rosa-acento': '#FFB7C5',  
        'azul-modulo': '#BFD7ED',   
        'amarillo-ideas': '#FEF9E7' 
      },
      fontFamily: {
        serif: ['var(--font-yeseva)', 'serif'],
      },
    },
  },
  plugins: [],
}

