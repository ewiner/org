const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      ...defaultTheme.fontFamily,
      sans: ['Open Sans', ...defaultTheme.fontFamily.sans]
    },
    extend: {},
  },
  variants: {
    extend: {
      width: ['group-hover'],
      transitionDelay: ['group-hover'],
      visibility: ['group-hover']
    },
  },
  plugins: [],
}
