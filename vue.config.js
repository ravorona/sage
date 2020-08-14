/**
 * Dependencies
 */
const path = require('path')
const fs = require('fs')
const WebpackNotifier = require('webpack-notifier')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')

/**
 * Configuration files
 */
const config = require('./resources/assets/config')
const webmanifest = require('./resources/assets/webmanifest')

/**
 * Configurations
 */
const isProduction = process.env.NODE_ENV === 'production'
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
    lintOnSave: !isProduction,
    publicPath: `${config.publicPath}/dist`,
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
    },
    chainWebpack: config => {
        const svgRule = config.module.rule('svg')

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

        svgRule.uses.clear()
    }
}
