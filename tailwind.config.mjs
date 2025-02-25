/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: '640px',  // Small screens (default in Tailwind)
        md: '768px',  // Medium screens
        lg: '1024px', // Large screens
        xl: '1280px', // Extra-large screens
        '2xl': '1536px', // 2x Extra-large screens
      },
    },
  },
  plugins: [],
};