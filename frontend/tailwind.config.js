export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        venbar: {
          red: '#8B1A1A',
          'red-dark': '#6B1212',
          'red-hover': '#A82020',
          cream: '#F2E0C5',
          'cream-dark': '#E5CFA8',
          beige: '#F8F0E3',
          'beige-dark': '#EDE0CC',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
