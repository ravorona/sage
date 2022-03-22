import 'dotenv/config'
import path from 'path'
import { defineConfig, ServerOptions } from 'vite'

const server: ServerOptions = {
    open: true,
    fs: {
        strict: true,
        allow: ['node_modules', 'resources/assets']
    }
}

process.env.DOMAIN && (server.host = process.env.DOMAIN)
process.env.DEV_PORT && (server.port = parseInt(process.env.DEV_PORT))
process.env.HTTPS_KEY &&
    process.env.HTTPS_CERT &&
    (server.https = {
        key: process.env.HTTPS_KEY,
        cert: process.env.HTTPS_CERT
    })

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/assets'),
            '@scripts': path.resolve(__dirname, 'resources/assets/scripts'),
            '@styles': path.resolve(__dirname, 'resources/assets/styles')
        }
    },
    build: {
        sourcemap: true,
        manifest: true,
        rollupOptions: {
            input: ['resources/assets/scripts/main.ts', 'resources/assets/styles/main.scss'],
            output: {
                dir: 'dist'
            }
        }
    },
    server
})
