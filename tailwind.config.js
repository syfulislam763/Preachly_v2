/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx,jsx}', './src/**/*.{js,ts,tsx,jsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
