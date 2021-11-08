<div class="guide">
    <div class="container">
        <div class="guide-wrapper">
            @for($guide = 0; $guide < 12; $guide++)
                <div class="guide-element"></div>
            @endfor
        </div>
    </div>
</div>

<script>
    const guide = localStorage.getItem('guide')

    if (guide) {
        document.querySelector('.guide').classList.add('active')
    }

    document.addEventListener(
        'keyup',
        e => {
            if (e.code === 'Digit9') {
                const guide = localStorage.getItem('guide')

                document.querySelector('.guide').classList.toggle('active')

                if (guide) {
                    localStorage.removeItem('guide')
                } else {
                    localStorage.setItem('guide', '1')
                }
            }

            if (e.code === 'Digit0') {
                document.body.classList.toggle('debug')
            }
        }
    )
</script>
