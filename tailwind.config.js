/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-dark": "rgb(var(--color-primary-dark) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        page: "rgb(var(--color-page) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-muted": "rgb(var(--color-surface-muted) / <alpha-value>)",
        "border-strong": "rgb(var(--color-border-strong) / <alpha-value>)",
        "text-muted": "rgb(var(--color-text-muted) / <alpha-value>)",
        accent: {
          blue: "rgb(var(--color-accent-blue) / <alpha-value>)",
          red: "rgb(var(--color-accent-red) / <alpha-value>)",
        },
        charcoal: {
          950: "rgb(var(--color-charcoal-950) / <alpha-value>)",
          900: "rgb(var(--color-charcoal-900) / <alpha-value>)",
          800: "rgb(var(--color-charcoal-800) / <alpha-value>)",
          700: "rgb(var(--color-charcoal-700) / <alpha-value>)",
          600: "rgb(var(--color-charcoal-600) / <alpha-value>)",
        },
      },
      borderRadius: {
        card: "var(--radius-card)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "glow-blue": "var(--shadow-glow-blue)",
      },
      transitionDuration: {
        fast: "160ms",
      },
    },
  },
  plugins: [],
};
