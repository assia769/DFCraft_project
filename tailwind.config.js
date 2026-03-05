/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        "concert": ["Concert One", "cursive"],
      },
      
      colors: {
        // Light mode colors
        light: "#F2F2F2",
        lightElements: "#7C3AED",
        lightPoints: "#C282FF",
        lightList: "#5B1FC0",
        lightBar: "#5B1FC0",
        lightProgressBar: "#6D00D8",
        lightSelectedBar: "#B46CFA",
        lightPlaceHolder: "#9D72C7",
        lightFontText: '#000000' , 

        // Dark mode colors
        dark: "#161616",
        darkElements: "#A855F7",
        darkPoints: "#5A00B0",
        darkList: "#C8A0EF",
        darkBar: "#C8A0EF",
        darkProgressBar: "#B46CFA",
        darkSelectedBar: "#5A00B0",
        darkPlaceHolder: "#9D72C7",
        darkFontText: '#FFFFFF', 

        // AccentColor 
        
        
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '50%': { transform: 'translateX(4px)' },
          '75%': { transform: 'translateX(-4px)' },
        }
      },
      animation: {
        shake: 'shake 0.2s ease-in-out 0s 2',
      }
    },
  },
  plugins: [],
};
