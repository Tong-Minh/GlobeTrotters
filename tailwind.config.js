/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{gjs,gts,hbs,html,js,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        index: "url('/images/top.png')",
      },
      // fontFamily: {
      //   'lilita-one': ['"Lilita One"', 'sans-serif'],
      // },
    },
  },
  plugins: [],
};
