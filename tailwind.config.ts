import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-dm-sans)', 'sans-serif'],
                mono: ['var(--font-mono)', 'monospace'],
                playfair: ['var(--font-playfair)', 'serif'],
                serif: ['var(--font-playfair)', 'serif'],
                'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
            },
            colors: {
                glass: {
                    surface: 'rgba(255, 255, 255, 0.25)',
                    surfaceHover: 'rgba(255, 255, 255, 0.35)',
                    border: 'rgba(255, 255, 255, 0.5)',
                    text: '#09090b', // zinc-950
                    subtext: '#52525b', // zinc-600
                    muted: '#a1a1aa', // zinc-400
                    accent: '#FF4F18', // custom-orange
                    accentHover: '#E03E10', // darker-orange
                    accentLight: '#FFE5DD', // light-orange
                    success: '#10b981',
                    warning: '#f59e0b',
                    error: '#ef4444',
                },
                primary: {
                    DEFAULT: '#FF4F18',
                    foreground: '#FFFFFF',
                }
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                'glow': '0 0 20px -5px rgba(255, 79, 24, 0.3)',
                'liquid': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
            },
            animation: {
                'blob': 'blob 7s infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
