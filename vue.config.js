const path = require('path')
const fs = require('fs')
const WebpackNotifier = require('webpack-notifier')
const config = require('./resources/assets/config')
const webmanifest = require('./resources/assets/webmanifest')
const isProduction = process.env.NODE_ENV === 'production'
const host = config.devDomain || 'localhost'
const port = config.devPort || 8080

let devServerConfiguration = {
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

if (config.https && config.https.key && config.https.cert) {
    devServerConfiguration.https = true
    devServerConfiguration.key = fs.readFileSync(config.https.key)
    devServerConfiguration.cert = fs.readFileSync(config.https.cert)
}

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
            new WebpackNotifier(
                {
                    title: 'Theme Bundler',
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
