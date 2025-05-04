/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        default: 'Open Sans, sans-serif'
      },
      screens: {
        xxl: {max: '1279px'},
        lgg: {max: '1024px'},
        mdd: {max: '820px'},
        ssm: {max: '639px'},
        sssm: {max: '390px'}
      },
    },
  },
  plugins: [],
}