/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        faint: 'rgb(var(--color-faint) / <alpha-value>)',
        highlight: 'rgb(var(--color-highlight) / <alpha-value>)',
        highlightextra: 'rgb(var(--color-highlightextra) / <alpha-value>)',
        ui: 'rgb(var(--color-ui) / <alpha-value>)',
        // like: 'rgb(var(--color-like) / <alpha-value>)',
        // repost: 'rgb(var(--color-repost) / <alpha-value>)',
        // comment: 'rgb(var(--color-comment) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
