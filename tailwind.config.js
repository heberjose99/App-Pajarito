/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './script.js'],
    theme: {
        screens: {
            sm: '576px',
            md: '768px',
            lg: '992px'
        },
        extend: {
            colors: {
                gold: '#d4af37'
            },
            fontFamily: {
                display: ['Cormorant Garamond', 'serif'],
                body: ['Lato', 'sans-serif']
            }
        }
    },
    plugins: []
};
