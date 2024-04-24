import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        dropIn: {
          "0%": {
            transform: "translateY(-100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        dropInLite: {
          "0%": {
            transform: "translateY(-25%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        }
      },
      animation: {
        dropIn: "dropIn 0.3s ease-in-out",
        dropInLite: "dropInLite 1s ease-in-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        maroon: "#3F0D12",
        deepPink: "#FF5D73",
        darkGrey: "#515751",
        cactus: "#CDC6A5",
        cream: "#F0DCCA",
        altDeepPink: "#e54666"
      }
    },
  },
  plugins: [],
};
export default config;
