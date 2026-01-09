/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#000000",
                panel: "#000000",
                control: {
                    DEFAULT: "#111111",
                    hover: "#222222",
                },
                border: "#333333",
                text: {
                    primary: "#ffffff",
                    muted: "rgba(255, 255, 255, 0.6)",
                    faint: "rgba(255, 255, 255, 0.3)",
                },
                grid: "rgba(255, 255, 255, 0.12)",
            },
            fontFamily: {
                sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
                mono: ['Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
            },
            borderRadius: {
                'sm': '4px',
            }
        },
    },
    plugins: [],
}
