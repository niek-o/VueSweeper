module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    darkMode: 'class',
    theme: {
        colors: {
            "cell": "var(--cell)",
            "borderDark": "var(--borderDark)",
            "borderLight": "var(--borderLight)",
            "bg": "var(--bg)",
        },
        extend: {
            borderWidth: {
                "cellBorder": "5px",
            }
        },
    },
    plugins: [],
};
