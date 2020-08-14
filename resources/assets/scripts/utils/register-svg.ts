const requireSvg = (
    (): void => {
        const loadSvg = (r: any): void => {
            r.keys().forEach(r)
        }

        loadSvg(require.context('../../svg/', true, /\.svg$/))
    }
)()

export default requireSvg
