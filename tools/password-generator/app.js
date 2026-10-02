const passwordDisplay = document.getElementById('passwordDisplay');
const strengthBadge = document.getElementById('strengthBadge');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generateBtn');
const lengthSlider = document.getElementById('lengthSlider');
const lenVal = document.getElementById('lenVal');

const chkUpper = document.getElementById('chkUpper');
const chkLower = document.getElementById('chkLower');
const chkNumbers = document.getElementById('chkNumbers');
const chkSymbols = document.getElementById('chkSymbols');

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

function generatePassword() {
    let chars = '';
    if (chkUpper.checked) chars += UPPER;
    if (chkLower.checked) chars += LOWER;
    if (chkNumbers.checked) chars += NUMBERS;
    if (chkSymbols.checked) chars += SYMBOLS;

    if (chars === '') {
        alert('Please select at least one character type.');
        chkLower.checked = true;
        chars += LOWER;
    }

    const length = parseInt(lengthSlider.value);
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars[array[i] % chars.length];
    }

    passwordDisplay.textContent = password;
    updateStrength(length, chars.length);
}

function updateStrength(len, charsetSize) {
    const entropy = len * Math.log2(charsetSize);
    let strength = 'Weak';
    let color = '#ef4444';

    if (entropy > 80) {
        strength = 'Very Strong';
        color = '#10b981';
    } else if (entropy > 60) {
        strength = 'Strong';
        color = '#34d399';
    } else if (entropy > 40) {
        strength = 'Medium';
        color = '#f59e0b';
    }

    strengthBadge.textContent = strength;
    strengthBadge.style.background = color;
}

lengthSlider.addEventListener('input', () => {
    lenVal.textContent = lengthSlider.value;
    generatePassword();
});

[chkUpper, chkLower, chkNumbers, chkSymbols].forEach(chk => {
    chk.addEventListener('change', generatePassword);
});

generateBtn.addEventListener('click', generatePassword);

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(passwordDisplay.textContent);
    const originalHtml = copyBtn.innerHTML;
    copyBtn.innerHTML = 'Copied!';
    setTimeout(() => {
        copyBtn.innerHTML = originalHtml;
    }, 2000);
});

// Initial generation
generatePassword();
