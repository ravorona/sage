import { defineConfig } from 'vite'
import path from 'path'

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
    server: {
        https: {
            key: '/Users/ravorona/.certificates/ravorona-key.pem',
            cert: '/Users/ravorona/.certificates/ravorona-cert.pem'
        },
        fs: {
            strict: true,
            allow: ['node_modules', 'resources/assets']
        }
    }
})
