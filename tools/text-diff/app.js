const originalText = document.getElementById('originalText');
const modifiedText = document.getElementById('modifiedText');
const diffOutput = document.getElementById('diffOutput');
const compareBtn = document.getElementById('compareBtn');
const swapBtn = document.getElementById('swapBtn');
const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');

function performDiff() {
    const text1 = originalText.value;
    const text2 = modifiedText.value;

    const diff = Diff.diffWords(text1, text2);
    
    diffOutput.innerHTML = '';

    diff.forEach((part) => {
        const span = document.createElement('span');
        span.textContent = part.value;
        if (part.added) {
            span.classList.add('diff-added');
        } else if (part.removed) {
            span.classList.add('diff-removed');
        }
        diffOutput.appendChild(span);
    });

    if (diffOutput.innerHTML === '') {
        diffOutput.innerHTML = 'No differences found.';
    }
}

compareBtn.addEventListener('click', performDiff);

swapBtn.addEventListener('click', () => {
    const temp = originalText.value;
    originalText.value = modifiedText.value;
    modifiedText.value = temp;
    performDiff();
});

clearBtn.addEventListener('click', () => {
    originalText.value = '';
    modifiedText.value = '';
    diffOutput.innerHTML = 'Results will appear here...';
});

sampleBtn.addEventListener('click', () => {
    originalText.value = 'The quick brown fox jumps over the lazy dog.\nWeb Utility Hub is great.';
    modifiedText.value = 'The quick red fox leaps over the lazy dog.\nWeb Utility Hub is amazing.';
    performDiff();
});

originalText.addEventListener('input', performDiff);
modifiedText.addEventListener('input', performDiff);
