/*
 * Copyright (c) 2023 яαvoroηα
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of
 *  this software and associated documentation files (the "Software"), to deal in
 *  the Software without restriction, including without limitation the rights to
 *  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 *  the Software, and to permit persons to whom the Software is furnished to do so,
 *  subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 *  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 *  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 *  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

export default class Guide {
    namespace: string = 'guide'

    constructor() {
        const guide = document.createElement('div')
        const wrapper = document.createElement('div')
        const container = document.createElement('div')
        const count = 12

        console.info('[%s] bootstrap', this.namespace)

        guide.classList.add('guide')
        container.classList.add('container')
        wrapper.classList.add('guide-wrapper')

        for (let i = 0; i < count; i++) {
            const element = document.createElement('div')

            element.classList.add('guide-element')
            wrapper.appendChild(element)
        }

        container.appendChild(wrapper)
        guide.appendChild(container)
        document.body.appendChild(guide)
    }

    start(): void {
        console.info('[%s] started', this.namespace)

        const guide = localStorage.getItem('guide')

        guide && document.querySelector('.guide')?.classList.add('active')

        document.addEventListener('keyup', (e: KeyboardEvent): void => {
            if (e.code === 'Digit9') {
                const guide = localStorage.getItem('guide')

                document.querySelector('.guide')?.classList.toggle('active')

                if (guide) {
                    localStorage.removeItem('guide')
                } else {
                    localStorage.setItem('guide', '1')
                }
            }

            if (e.code === 'Digit0') {
                document.body.classList.toggle('debug')
            }
        })
    }
}
