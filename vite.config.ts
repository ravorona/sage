import dotenv from 'dotenv'
import path from 'path'
import { defineConfig, ServerOptions } from 'vite'
import outputManifest, { Bundle } from 'rollup-plugin-output-manifest'

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
        manifest: false,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, `${assets.scripts}/main.ts`),
                editor: path.resolve(__dirname, `${assets.scripts}/editor.ts`)
            },
            output: {
                sourcemap: true,
                dir: 'public'
            },
            plugins: [
                outputManifest({
                    map: (bundle: Bundle): Bundle => {
                        bundle.name = bundle.name.replace(/.css$/gm, '')

                        return bundle
                    }
                })
            ]
        }
    },
    server
})
