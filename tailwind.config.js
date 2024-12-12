module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure all React files are included
  ],
  theme: {
    extend: {
      animation: {
        shuffle: "shuffle 1s linear infinite",
      },
      keyframes: {
        shuffle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
