const path = require('path')
const WebpackNotifier = require('webpack-notifier')

const isProduction = process.env.NODE_ENV === 'production'
const publicPath = '/theme/sage/dist/'
const namespace = 'sage'
const appUrl = 'https://0.0.0.0:80'

module.exports = {
    lintOnSave: !isProduction,
    publicPath: publicPath,
    runtimeCompiler: true,
    crossorigin: 'use-credentials',
    filenameHashing: isProduction,
    css: { sourceMap: true },
    pwa: {
        name: namespace,
        manifestCrossorigin: 'use-credentials',
        manifestOptions: {
            icons: [
                {
                    src: 'icons/android-chrome-192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: 'icons/android-chrome-512x512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ]
        },
        // For meta tags
        iconPaths: {
            favicon32: 'icons/favicon-32x32.png',
            favicon16: 'icons/favicon-16x16.png',
            appleTouchIcon: 'icons/apple-touch-icon-152x152.png',
            maskIcon: 'icons/safari-pinned-tab.svg',
            msTileImage: 'icons/msapplication-icon-144x144.png'
        }
    },
    devServer: {
        host: '0.0.0.0',
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
        },
        proxy: {
            '^': {
                target: appUrl,
                changeOrigin: false
            }
        }
    },
    configureWebpack: config => {
        config.devtool = 'cheap-source-map'
        config.plugins.push(
            new WebpackNotifier(
                {
                    title: namespace.toUpperCase(),
                    alwaysNotify: true
                }
            )
        )
    },
    chainWebpack: config => {
        if (config.plugins.has('prefetch')) {
            config.plugin('prefetch')
                .tap(options => {
                    options[0].fileBlacklist = options[0].fileBlacklist || []
                    options[0].fileBlacklist.push(/async-(.)+?/)

                    return options
                })
        }

        config
            .plugin('html')
            .tap(args => {
                args[0].filename = '../resources/views/layouts/app.blade.php'
                args[0].template = 'resources/views/layouts/app-source.blade.php'

                return args
            })

        config.resolve
            .alias
            .set('~', path.resolve(__dirname, 'resources/assets'))
            .end()
    }
}
