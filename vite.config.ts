/*
 * Copyright © 2022 яαvoroηα.
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

import * as path from 'path'
import copy from 'rollup-plugin-copy'
import outputManifest, { KeyValueDecorator, OutputManifestParam } from 'rollup-plugin-output-manifest'
import { ConfigEnv, defineConfig, loadEnv, UserConfigExport } from 'vite'

const assets = {
    base: 'resources',
    scripts: 'resources/scripts',
    styles: 'resources/styles'
}

const formatName = (name: string): string => name.replace(`${assets.scripts}/`, '').replace(/.css$/gm, '')

export default defineConfig(({ mode }: ConfigEnv) => {
    const devServerConfig = loadEnv(mode, process.cwd(), 'HMR')
    const dev = mode === 'development'
    const config: UserConfigExport = {
        appType: 'custom',
        publicDir: false,
        resolve: {
            alias: {
                '@': path.resolve(__dirname, assets.base),
                '@scripts': path.resolve(__dirname, assets.scripts),
                '@styles': path.resolve(__dirname, assets.styles)
            }
        },
        css: {
            devSourcemap: true
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
                        generate:
                            (keyValueDecorator: KeyValueDecorator, seed: object, opt: OutputManifestParam) => chunks =>
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
                                const js =
                                    formatedName && manifest[formatedName]?.js?.length ? manifest[formatedName].js : []
                                const css =
                                    formatedName && manifest[formatedName]?.css?.length
                                        ? manifest[formatedName].css
                                        : []
                                const dependencies =
                                    formatedName && manifest[formatedName] ? manifest[formatedName].dependencies : []
                                const inject = { js, css, dependencies }

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
        }
    }

    if (dev) {
        config.server = {
            host: '0.0.0.0',
            strictPort: true,
            fs: {
                strict: true,
                allow: ['node_modules', assets.base]
            }
        }

        devServerConfig.HMR_HOST && (config.server.host = devServerConfig.HMR_HOST)
        devServerConfig.HMR_PORT && (config.server.port = parseInt(devServerConfig.HMR_PORT))
        devServerConfig.HMR_HTTPS_KEY &&
            devServerConfig.HMR_HTTPS_CERT &&
            (config.server.https = {
                key: devServerConfig.HMR_HTTPS_KEY,
                cert: devServerConfig.HMR_HTTPS_CERT
            })
    }

    return config
})
