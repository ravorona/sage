import '~/styles/application.scss'
import '~/scripts/utils/register-service-worker'

import Main from '~/scripts/components/Main'

/**
 * Application scripts
 */
const checkReadyState = (): void => {
    if (document.readyState === 'complete') {
        window.application = new Main('sage')

        /**
         * Start app
         */
        window.application.start()
    }
}

/**
 * Reset page scroll
 */
if (window.history && 'scrollRestoration' in window.history) {
    history.scrollRestoration = 'manual'
} else {
    window.scrollTo(0, 0)
}

/**
 * Add document state event listener
 */
document.addEventListener('readystatechange', checkReadyState)

/**
 * Check state on start
 */
checkReadyState()

