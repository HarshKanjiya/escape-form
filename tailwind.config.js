/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          '50': 'rgb(var(--primary-50) / <alpha-value>)',
          '100': 'rgb(var(--primary-100) / <alpha-value>)',
          '200': 'rgb(var(--primary-200) / <alpha-value>)',
          '300': 'rgb(var(--primary-300) / <alpha-value>)',
          '400': 'rgb(var(--primary-400) / <alpha-value>)',
          '500': 'rgb(var(--primary-500) / <alpha-value>)',
          '600': 'rgb(var(--primary-600) / <alpha-value>)',
          '700': 'rgb(var(--primary-700) / <alpha-value>)',
          '800': 'rgb(var(--primary-800) / <alpha-value>)',
          '900': 'rgb(var(--primary-900) / <alpha-value>)',
          '950': 'rgb(var(--primary-950) / <alpha-value>)',
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        border: "rgb(var(--color-border) / <alpha-value>)",
        input: "rgb(var(--color-input) / <alpha-value>)",
        ring: "rgb(var(--color-ring) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        secondary: {
          DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
          foreground: "rgb(var(--color-secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--color-destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--color-muted) / <alpha-value>)",
          foreground: "rgb(var(--color-muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          foreground: "rgb(var(--color-accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--color-popover) / <alpha-value>)",
          foreground: "rgb(var(--color-popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--color-card) / <alpha-value>)",
          foreground: "rgb(var(--color-card-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "var(--radius-sm)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
}
