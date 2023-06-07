/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        bronze: {
          "0%": { transform: "translate(-1900px,0px)" },
          "50%": { transform: "translate(0%,0px)" },
          "100%": { transform: "translate(1900px,0px)" },
        },
        gold: {
          "0%": { transform: "translate(1900px,0px)" },
          "50%": { transform: "translate(0%,0px)" },
          "100%": { transform: "translate(-1900px,0px)" },
        },
      },
      animation: {
        bronze: "bronze 15s ease-in-out infinite",
        gold: "gold 15s ease-in-out infinite",
      },
    },
  },

  plugins: [],
};
