import dotenv from 'dotenv'
import path from 'path'
import { defineConfig, ServerOptions } from 'vite'

dotenv.config()

const assets = {
    base: 'resources',
    scripts: 'resources/scripts',
    styles: 'resources/styles'
}

const server: ServerOptions = {
    fs: {
        strict: true,
        allow: ['node_modules', assets.base]
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
            '@': path.resolve(__dirname, assets.base),
            '@scripts': path.resolve(__dirname, assets.scripts),
            '@styles': path.resolve(__dirname, assets.styles)
        }
    },
    build: {
        sourcemap: true,
        manifest: true,
        rollupOptions: {
            input: [`${assets.scripts}/main.ts`, `${assets.styles}/main.scss`],
            output: {
                dir: 'dist'
            }
        }
    },
    server
})
