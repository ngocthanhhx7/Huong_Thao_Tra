/** @type {import('tailwindcss').Config} */
export default {
  presets: [require('../shared/theme/tailwind-preset.js').default],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../shared/**/*.{js,jsx}',
  ],
};
