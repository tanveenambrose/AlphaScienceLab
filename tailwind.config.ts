import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#962E9B",
                secondary: "#3D1022",
                accent: "#3D7FFF",
                background: "#000000",
                foreground: "#ffffff",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                display: ["var(--font-bakbak)", "sans-serif"],
                accent: ["var(--font-anton)", "sans-serif"],
                tech: ["var(--font-aldrich)", "sans-serif"],
            },
            animation: {
                "rgb-move": "rgb-move 18s infinite alternate ease-in-out",
                "shimmer": "shimmer 2.5s infinite",
            },
            keyframes: {
                "rgb-move": {
                    "0%": { transform: "translate(-50%, -50%) rotate(0deg) scale(1)" },
                    "33%": { transform: "translate(-47%, -53%) rotate(3deg) scale(1.05)" },
                    "66%": { transform: "translate(-53%, -47%) rotate(-3deg) scale(1.08)" },
                    "100%": { transform: "translate(-50%, -50%) rotate(6deg) scale(1.02)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
            },
            backgroundImage: {
                "glow-primary":
                    "radial-gradient(circle at 80% 10%, rgba(150,46,155,0.45) 0%, transparent 65%)",
                "glow-secondary":
                    "radial-gradient(circle at 20% 90%, rgba(61,16,34,0.6) 0%, transparent 65%)",
                "subtitle-strip":
                    "linear-gradient(270deg, #000000 0%, #3D1022 100%)",
            },
            blur: {
                "4xl": "80px",
                "5xl": "120px",
            },
        },
    },
    plugins: [],
};

export default config;
