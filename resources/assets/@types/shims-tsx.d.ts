/*
 * Copyright © 2021 - яαvoroηα
 *
 * @project Sage
 * @file shims-tsx.d.ts
 * @author ravorona
 */

import Vue, { VNode } from 'vue'

declare global {
    namespace JSX {
        type Element = VNode
        type ElementClass = Vue

        interface IntrinsicElements {
            [elem: string]: any
        }
    }
}
