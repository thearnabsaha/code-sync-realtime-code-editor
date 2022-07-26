// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()]
// })


import { resolve } from "path";

export default {
    sourcemap: true,
    build: {
        rollupOptions: {
            input: {
                primary: resolve(__dirname, "index.html"),
                secondary: resolve(__dirname, "secondary.html"),
            },
            output: {
                assetFileNames: "assets/[name][extname]",
            },
        },
    },
};
