/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      sm: "640px",

      md: "768px",

      lg: "1024px",

      xl: "1280px",

      "2xl": "1536px",

      hd: { raw: "(min-height: 720px), (min-width:768px)" },
    },
    extend: {},
  },

  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#ef6a36",
          neutral: "#f7f7f7",
          "base-100": "#24252d",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
