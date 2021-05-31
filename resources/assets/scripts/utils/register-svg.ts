/*
 * Copyright © 2021 - яαvoroηα
 *
 * @project Sage
 * @file register-svg.ts
 * @author ravorona
 */

const requireSvg = (
    (): void => {
        const loadSvg = (r: any): void => {
            r.keys().forEach(r)
        }

        loadSvg(require.context('../../svg/', true, /\.svg$/))
    }
)()

export default requireSvg
