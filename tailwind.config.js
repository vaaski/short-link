module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "dark-blue": "#0d0d10",
        "main-accent": "#0089D7",
        "off-accent": "#005A8D",
      },
    },
  },
  variants: {
    extend: {
      margin: ["last"],
      opacity: ["disabled"],
    },
  },
  plugins: [],
}
