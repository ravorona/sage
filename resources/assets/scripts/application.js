"use strict";
/**
 * application scripts
 */
const checkReadyState = () => {
    console.log(window.appInitiated);
    if (document.readyState === 'complete') {
        const stylesheets = document.querySelectorAll('link[as=style]');
        stylesheets.forEach((stylesheet) => {
            stylesheet.setAttribute('rel', 'stylesheet');
            stylesheet.removeAttribute('as');
        });
    }
};
document.addEventListener('readystatechange', () => {
    checkReadyState();
});
if (window.history && 'scrollRestoration' in window.history) {
    history.scrollRestoration = 'manual';
}
else {
    window.scrollTo(0, 0);
}
checkReadyState();
