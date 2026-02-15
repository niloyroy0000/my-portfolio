const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}", // If using Next.js App Router
  ],
  theme: {
    container: {
      center: true,
      padding: "15px",
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: '#1c1c22',
        secondary: {
          //  default: '#00ff99',
           default: '#00BFFF',
          //default: '#BB86FC',
          // default: '#1ABC9C',
          // default: '#f82e70',
          hover: '#00e187' 
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        primary: "var(--font-jetbrains-mono)",
      },
      zIndex: {
        '-1': '-1',
        '60': '60',
        '70': '70',
      }
    },
  },
  plugins: [],
};

export default config;
