const { theme } = require('./src/styles/theme.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: theme.colors,
      spacing: theme.spacing,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      fontWeight: theme.typography.fontWeight,
      screens: {
        'xs': theme.breakpoints.xs,
        'sm': theme.breakpoints.sm,
        'md': theme.breakpoints.md,
        'lg': theme.breakpoints.lg,
        'xl': theme.breakpoints.xl,
        '2xl': theme.breakpoints['2xl'],
      },
      borderRadius: theme.borderRadius,
      boxShadow: theme.boxShadow,
      transitionDuration: theme.transition.duration,
      transitionTimingFunction: theme.transition.timing,
      zIndex: theme.zIndex,
    },
  },
  plugins: [],
}
