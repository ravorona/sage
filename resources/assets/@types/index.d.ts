import Main from '~/scripts/components/Main'

export {}

declare global {
    interface Window {
        application: Main
    }
}
