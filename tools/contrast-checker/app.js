const fgColorPicker = document.getElementById('fgColorPicker');
const fgColorText = document.getElementById('fgColorText');
const bgColorPicker = document.getElementById('bgColorPicker');
const bgColorText = document.getElementById('bgColorText');
const previewBox = document.getElementById('previewBox');
const ratioDisplay = document.getElementById('ratioDisplay');

const aaNormalStatus = document.getElementById('aaNormalStatus');
const aaLargeStatus = document.getElementById('aaLargeStatus');
const aaaNormalStatus = document.getElementById('aaaNormalStatus');
const aaaLargeStatus = document.getElementById('aaaLargeStatus');

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function luminance(r, g, b) {
    const a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateRatio(color1, color2) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    if (!rgb1 || !rgb2) return 1;

    const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

function updateUI() {
    let fg = fgColorText.value;
    let bg = bgColorText.value;

    if (!fg.startsWith('#')) fg = '#' + fg;
    if (!bg.startsWith('#')) bg = '#' + bg;

    if (/^#[0-9A-F]{6}$/i.test(fg) && /^#[0-9A-F]{6}$/i.test(bg)) {
        previewBox.style.color = fg;
        previewBox.style.backgroundColor = bg;

        const ratio = calculateRatio(fg, bg);
        ratioDisplay.textContent = ratio.toFixed(2) + ' : 1';

        const updateStatus = (element, pass) => {
            element.textContent = pass ? 'PASS' : 'FAIL';
            element.className = pass ? 'status-pass' : 'status-fail';
        };

        updateStatus(aaNormalStatus, ratio >= 4.5);
        updateStatus(aaLargeStatus, ratio >= 3.0);
        updateStatus(aaaNormalStatus, ratio >= 7.0);
        updateStatus(aaaLargeStatus, ratio >= 4.5);
    }
}

function handleInput(type, isText) {
    if (type === 'fg') {
        if (isText) fgColorPicker.value = fgColorText.value;
        else fgColorText.value = fgColorPicker.value.toUpperCase();
    } else {
        if (isText) bgColorPicker.value = bgColorText.value;
        else bgColorText.value = bgColorPicker.value.toUpperCase();
    }
    updateUI();
}

fgColorPicker.addEventListener('input', () => handleInput('fg', false));
fgColorText.addEventListener('input', () => handleInput('fg', true));
bgColorPicker.addEventListener('input', () => handleInput('bg', false));
bgColorText.addEventListener('input', () => handleInput('bg', true));

updateUI();
