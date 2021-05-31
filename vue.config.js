/**
 * Dependencies
 */
const path = require('path')
const fs = require('fs')
const WebpackNotifier = require('webpack-notifier')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')

/**
 * Configuration files
 */
const isProduction = process.env.NODE_ENV === 'production'
const configPath = isProduction ? './resources/assets/config.prod' : './resources/assets/config'
const config = require(configPath)
const webmanifest = require('./resources/assets/webmanifest')

/**
 * Configurations
 */

const publicPath = `${config.publicPath}/dist/`
const host = config.devDomain || 'localhost'
const port = config.devPort || 8080
const devServerConfiguration = {
    host: host,
    port: port,
    public: `${host}:${port}`,
    writeToDisk: true,
    disableHostCheck: true,
    overlay: {
        warnings: true,
        errors: true
    },
    watchOptions: {
        poll: true,
        ignored: [
            /node_modules/,
            /vendor/,
            /public/,
            /dist/,
            /.php$/,
            /.twig$/,
            /.htm?l$/
        ]
    }
}

/**
 * Enable https
 */
if (config.https && config.https.key && config.https.cert) {
    devServerConfiguration.https = true
    devServerConfiguration.key = fs.readFileSync(config.https.key)
    devServerConfiguration.cert = fs.readFileSync(config.https.cert)
}

/**
 * Export vue configurations
 */
module.exports = {
    pages: {
        application: {
            entry: 'resources/assets/scripts/application.ts',
            filename: '../resources/views/layouts/app.blade.php',
            template: 'resources/views/layouts/app-source.blade.php'
        },
        editor: 'resources/assets/scripts/editor.ts',
        critical: 'resources/assets/scripts/critical.ts',
        'block-editor': 'resources/assets/scripts/block-editor.ts'
    },
    lintOnSave: !isProduction,
    publicPath: publicPath,
    runtimeCompiler: true,
    crossorigin: 'use-credentials',
    filenameHashing: isProduction,
    css: { sourceMap: true },
    pwa: webmanifest,
    devServer: devServerConfiguration,
    configureWebpack: config => {
        config.devtool = 'cheap-source-map'

        config.plugins.push(
            new SpriteLoaderPlugin(
                {
                    plainSprite: true,
                    spriteAttrs: {
                        id: 'svg-sprite'
                    }
                }
            )
        )

        config.plugins.push(
            new WebpackNotifier(
                {
                    title: 'Assets Bundler',
                    contentImage: path.resolve('./public/icons/apple-touch-icon-120x120.png'),
                    sound: 'Purr',
                    alwaysNotify: true
                }
            )
        )

        config.plugins.push(
            new WebpackManifestPlugin(
                {
                    writeToFileEmit: true,
                    publicPath: publicPath,
                    fileName: 'assets.json',
                    generate: (seed, files) => {
                        return files.reduce(
                            (manifest, { name, path, isInitial }) => {
                                if (!isInitial) {
                                    const fileInfo = path.split('.')

                                    name = fileInfo[0] + '.' + fileInfo[fileInfo.length - 1]
                                }

                                return (
                                    {
                                        ...manifest,
                                        [name]: path
                                    }
                                )
                            },
                            seed
                        )
                    },
                    filter: file => file.path.match(/.*.(css|js|ttf|woff2?)$/)
                }
            )
        )

        /*
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: 'svg-sprite-loader',
                    options: {
                        extract: true,
                        spriteFilename: 'svg/sprite.svg',
                        symbolId: 'icon-[name]'
                    }
                },
                'svg-transform-loader',
                {
                    loader: 'svgo-loader',
                    options: {
                        plugins: [
                            { removeTitle: true },
                            { convertColors: { shorthex: false } },
                            { convertPathData: false }
                        ]
                    }
                }]
        })
        */
    },
    chainWebpack: config => {
        // const svgRule = config.module.rule('svg')

        if (config.plugins.has('prefetch')) {
            config.plugin('prefetch')
                .tap(options => {
                    options[0].fileBlacklist = options[0].fileBlacklist || []
                    options[0].fileBlacklist.push(/async-(.)+?/)

                    return options
                })
        }

        config.resolve
            .alias
            .set('@', path.resolve(__dirname, 'resources/assets'))
            .set('@script', path.resolve(__dirname, 'resources/assets/scripts'))
            .set('@style', path.resolve(__dirname, 'resources/assets/styles'))
            .end()

        config.module
              .rule('svg')
              .use('svg-sprite-loader')
              .loader(
                  'svg-sprite-loader',
                  {
                      options: {
                          extract: true,
                          spriteFilename: 'svg/sprite.svg',
                          symbolId: 'icon-[name]'
                      }
                  }
              )

        /*
        config.module
            .rule('svg')
            .use('svg-sprite-loader')
            .loader(
                'svg-sprite-loader',
                {
                    options: {
                        extract: true,
                        spriteFilename: 'svg/sprite.svg',
                        symbolId: 'icon-[name]'
                    }
                }
            )
            .loader(
                'svgo-loader', {
                options: {
                    plugins: [
                        { removeTitle: true },
                        { convertColors: { shorthex: false } },
                        { convertPathData: false }
                    ]
                }
            })
        */
    }
}
