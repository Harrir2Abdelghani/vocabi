module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Poppins", "ui-sans-serif", "system-ui"],
        heading: ["Poppins", "Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primary: {
          light: "#e0c3fc",
          DEFAULT: "#8f5cf7",
          dark: "#5f2eea",
        },
        accent: {
          light: "#fbc2eb",
          DEFAULT: "#f857a6",
          dark: "#c837ab",
        },
        info: {
          light: "#a1c4fd",
          DEFAULT: "#2193b0",
          dark: "#0b486b",
        },
      },
    },
  },
  plugins: [],
};
