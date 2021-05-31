/*
 * Copyright © 2021 - яαvoroηα
 *
 * @project Sage
 * @file index.d.ts
 * @author ravorona
 */

import Main from '~/scripts/components/Main'

export {}

declare global {
    interface Window {
        application: Main
    }
}
