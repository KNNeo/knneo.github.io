//--LOADER--//
const loaderIds = {
    unload: ['hourglass_empty', 'hourglass_bottom', 'hourglass_full'],
    sheet: ['loop', 'cached'],
    viewer: ['photo_size_select_small', 'photo_size_select_large', 'photo_size_select_actual']
};

function runLoader(sequence) {
    let loaderStates = loaderIds[sequence];
    let loader = document.querySelector('.loader');
    if (loader) {
        if (window.loading) {
            if (!loaderStates || !loaderStates.length)
                console.error('Loader state not found, stopping loader');
            let current = loaderStates.indexOf(loader.innerText);
            loader.innerText = loaderStates[current + 1 >= loaderStates.length ? 0 : current + 1];
            setTimeout(function () {
                runLoader(sequence);
            }, 350);
        }
        else
            loader.parentElement.removeChild(loader);
    }
}

function createLoader(onclick) {
    let loader = document.querySelector('.loader') || document.createElement('div');
    loader.classList.add('loader');
    if (onclick) loader.onclick = onclick;
    if (!document.querySelector('.loader'))
        document.body.appendChild(loader);
}

function startLoader(sequence) {
    window.loading = true;
    runLoader(sequence);
}

function stopLoader() {
    window.loading = false;
    runLoader();
}

function testLoader(sequence = 'sheet') {
    createLoader();
    startLoader(sequence);
}