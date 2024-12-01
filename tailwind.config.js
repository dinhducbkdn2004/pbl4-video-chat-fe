/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'sans-serif']
            },
            colors: {
                black: {
                    default: '#181818',
                    light: '#1F1F1F',
                    blue: '#0C1132',
                    hover: '#545454'
                },
                green: {
                    default: '#B6F09C'
                },
                white: {
                    default: '#FFFFFF',
                    dark: '#F5F5F5'
                },
                gray: '#4C4C4C',
                blue: '#0066FF',
                yellow: '#FFD700'
            }
        }
    },
    plugins: []
};
