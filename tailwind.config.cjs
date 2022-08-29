module.exports = {
  mode: 'jit',
  content: ["./src/**/*.{html,js,jsx}", "./public/index.html"],
  theme: {
    extend: {},
  },
  plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/aspect-ratio'),
  ],
}