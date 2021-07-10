module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateRows: {
        layout: '96px 1fr 40px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
