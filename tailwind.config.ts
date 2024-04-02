import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
