/*
 * Copyright © 2021 - яαvoroηα
 *
 * @project Sage
 * @file Main.ts
 * @author ravorona
 */

import Vue from 'vue'

Vue.config.productionTip = false

export default class Main {
    readonly namespace!: string

    public constructor(namespace: string = 'sage') {
        this.namespace = namespace.toLowerCase().replace(' ', '-')
        console.log('%s created', this.namespace)
    }

    public start(): void {
        console.log('%s started', this.namespace)
    }
}
