// import seperatingLine from "./src/components/seperatingLine";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screen: {
        sm: "640px",
        md: "768px",
        lg: "1024 px",
        xl: "1280px",
      },

      colors: {
        textColor: "#EB5A3E",
        seperatingLine: "#141F26",
        buttonBg: "#A52E17",
        textColor: "#0866FF",


      },

      backgroundColor: {
        buttonBg: "#A52E17",
        BgColor: "#0866FF",
        lightGray1: "rgba(0, 12, 20, 0)",
      },
    },
  },
  plugins: [],
};
