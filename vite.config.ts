import dotenv from 'dotenv'
import path from 'path'
import { defineConfig, ServerOptions } from 'vite'
import outputManifest, { Bundle, KeyValueDecorator } from 'rollup-plugin-output-manifest'
import copy from 'rollup-plugin-copy'

dotenv.config({ path: '../../../../.env' })

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
    publicDir: false,
    resolve: {
        alias: {
            '@': path.resolve(__dirname, assets.base),
            '@scripts': path.resolve(__dirname, assets.scripts),
            '@styles': path.resolve(__dirname, assets.styles)
        }
    },
    build: {
        sourcemap: 'inline',
        manifest: false,
        outDir: 'public',
        assetsDir: '',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, `${assets.scripts}/main.ts`),
                editor: path.resolve(__dirname, `${assets.scripts}/editor.ts`)
            },
            output: {
                sourcemap: true
            },
            plugins: [
                outputManifest({
                    fileName: 'manifest.json',
                    map: (bundle: Bundle): Bundle => {
                        bundle.name = bundle.name.replace(/.css$/gm, '')

                        return bundle
                    }
                }),
                outputManifest({
                    fileName: 'entrypoints.json',
                    map: (bundle: Bundle): Bundle => {
                        bundle.name = bundle.name.replace(/.css$/gm, '')

                        return bundle
                    },
                    generate: (_: KeyValueDecorator, seed: object) => chunks =>
                        chunks.reduce((manifest, { name, fileName }) => {
                            const output = {}
                            const js = manifest[name] ? manifest[name].js : []
                            const css = manifest[name] ? manifest[name].css : []
                            const dependencies = manifest[name] ? manifest[name].dependencies : []

                            if (fileName.match(/.js$/gm)) {
                                js.push(fileName)
                            }

                            if (fileName.match(/.css$/gm)) {
                                css.push(fileName)
                            }

                            output[name] = { js, css, dependencies }

                            return {
                                ...manifest,
                                ...output
                            }
                        }, seed)
                }),
                copy({
                    copyOnce: true,
                    hook: 'writeBundle',
                    targets: [
                        {
                            src: path.resolve(__dirname, `${assets.base}/images/**/*`),
                            dest: 'public/images'
                        },
                        {
                            src: path.resolve(__dirname, `${assets.base}/svg/**/*`),
                            dest: 'public/svg'
                        },
                        {
                            src: path.resolve(__dirname, `${assets.base}/fonts/**/*`),
                            dest: 'public/fonts'
                        }
                    ]
                })
            ]
        }
    },
    server
})
