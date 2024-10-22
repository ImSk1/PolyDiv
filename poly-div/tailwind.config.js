/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors:{
       creambg: "#F0EBD8",
       lakeblue: "#748CAB",
       paynegray: "#3E5C76",
       prussianblue: "#1D2D44",
       richblack: "#0D1321",
       ...colors
    },
    extend: {},
  },
  plugins: [],
}