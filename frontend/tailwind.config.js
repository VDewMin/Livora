/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // ✅ scans all React files
  ],
  theme:{
    extend: {
      colors: {
        'gold-500': '#FFD700',
        'gray-850': '#2D3748',
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], // 👈 add Poppins

      },
    },
  },
  plugins: [],
 
};


 