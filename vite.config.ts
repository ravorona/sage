/*
 * Copyright (c) 2023-2024 яαvoroηα
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { unlink } from 'fs'
import * as path from 'path'
import copy from 'rollup-plugin-copy'
import pluginManifest, { KeyValueDecorator, OutputManifestParam } from 'rollup-plugin-output-manifest'
import { ConfigEnv, defineConfig, loadEnv, UserConfigExport } from 'vite'

const { default: outputManifest } = pluginManifest as any
const publicDir = 'public'
const manifestFile = 'manifest.json'
const assets = {
    base: 'resources',
    scripts: 'resources/scripts',
    styles: 'resources/styles',
    images: 'resources/images',
    fonts: 'resources/fonts'
}

const formatName = (name: string): string => name.replace(`${assets.scripts}/`, '').replace(/.css$/gm, '')

export default defineConfig(({ mode }: ConfigEnv) => {
    const devServerConfig = loadEnv(mode, process.cwd(), 'HMR')
    const dev = mode === 'development'
    const config: UserConfigExport = {
        appType: 'custom',
        publicDir: false,
        base: './',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, assets.base),
                '@scripts': path.resolve(__dirname, assets.scripts),
                '@styles': path.resolve(__dirname, assets.styles),
                '@fonts': path.resolve(__dirname, assets.fonts),
                '@images': path.resolve(__dirname, assets.images)
            }
        },
        css: {
            devSourcemap: true
        },
        build: {
            sourcemap: true,
            manifest: false,
            outDir: publicDir,
            assetsDir: '',
            rollupOptions: {
                input: {
                    main: path.resolve(__dirname, `${assets.scripts}/main.ts`),
                    editor: path.resolve(__dirname, `${assets.scripts}/editor.ts`)
                },
                plugins: [
                    outputManifest({
                        fileName: manifestFile,
                        generate: (keyValueDecorator: KeyValueDecorator, seed: object, opt: OutputManifestParam) => chunks =>
                            chunks.reduce((manifest, { name, fileName }) => {
                                return name
                                    ? {
                                          ...manifest,
                                          ...keyValueDecorator(formatName(name), fileName, opt)
                                      }
                                    : manifest
                            }, seed)
                    }),
                    outputManifest({
                        fileName: 'entrypoints.json',
                        nameWithExt: true,
                        generate: (_: KeyValueDecorator, seed: object) => chunks =>
                            chunks.reduce((manifest, { name, fileName }) => {
                                const formatedName = name && formatName(name)
                                const output = {}
                                const js: Array<string> = formatedName && manifest[formatedName]?.js?.length ? manifest[formatedName].js : []
                                const css: Array<string> = formatedName && manifest[formatedName]?.css?.length ? manifest[formatedName].css : []
                                const dependencies: Array<string> = formatedName && manifest[formatedName] ? manifest[formatedName].dependencies : []
                                const inject = {
                                    js,
                                    css,
                                    dependencies
                                }

                                fileName.match(/.js$/gm) && js.push(fileName)
                                fileName.match(/.css$/gm) && css.push(fileName)

                                name && (output[formatedName] = inject)

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
                                dest: `${publicDir}/images`
                            },
                            {
                                src: path.resolve(__dirname, `${assets.base}/svg/**/*`),
                                dest: `${publicDir}/svg`
                            },
                            {
                                src: path.resolve(__dirname, `${assets.base}/fonts/**/*`),
                                dest: `${publicDir}/fonts`
                            }
                        ]
                    })
                ]
            }
        }
    }

    if (dev) {
        let host = 'localhost'
        let port = 5173
        const protocol = 'http'
        const https = !!(devServerConfig.HMR_HTTPS_KEY && devServerConfig.HMR_HTTPS_CERT)

        unlink(`${publicDir}/${manifestFile}`, error => console.log(`🧹 Wipe ${manifestFile} :`, error ? `No ${manifestFile} in the public directory` : '✅'))

        devServerConfig.HMR_HOST && (host = devServerConfig.HMR_HOST)
        devServerConfig.HMR_PORT && (port = parseInt(devServerConfig.HMR_PORT))

        https &&
            (config.server.https = {
                key: devServerConfig.HMR_HTTPS_KEY,
                cert: devServerConfig.HMR_HTTPS_CERT
            })

        config.server = {
            host,
            port,
            strictPort: true,
            origin: `${protocol}://${host}:${port}`,
            fs: {
                strict: true,
                allow: ['node_modules', assets.base]
            }

            /***
             * For Windows user with files system watching not working
             * https://vitejs.dev/config/server-options.html#server-watch
             */

            /*
            watch: {
                usePolling: true,
                interval: 1000
            }
            */
        }
    }

    return config
})
