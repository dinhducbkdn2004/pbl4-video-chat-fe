/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'sans-serif']
            },
            colors: {
                black: {
                    default: '#0D0F10',
                    light: '#131619',
                    blue: '#0C1132'
                },
                green: {
                    defaut: '#B6F09C'
                },

                white: {
                    default: '#FFFFFF',
                    dark: '#CDCECF'
                },
                gray: '#72767D'
            }
        }
    },
    plugins: []
};
