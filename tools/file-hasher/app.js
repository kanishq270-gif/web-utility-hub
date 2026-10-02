const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const resultsContainer = document.getElementById('resultsContainer');
const sha256Result = document.getElementById('sha256Result');
const sha512Result = document.getElementById('sha512Result');

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) handleFile(e.target.files[0]);
});

async function handleFile(file) {
    fileInfo.textContent = `File: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
    resultsContainer.style.display = 'none';
    progressContainer.style.display = 'block';
    progressFill.style.width = '0%';
    progressPercent.textContent = '0%';

    try {
        const buffer = await readFile(file);
        
        // Calculate SHA-256
        const hash256Buffer = await crypto.subtle.digest('SHA-256', buffer);
        const hash256Array = Array.from(new Uint8Array(hash256Buffer));
        const hash256Hex = hash256Array.map(b => b.toString(16).padStart(2, '0')).join('');
        sha256Result.value = hash256Hex;
        
        progressFill.style.width = '50%';
        progressPercent.textContent = '50%';

        // Calculate SHA-512
        const hash512Buffer = await crypto.subtle.digest('SHA-512', buffer);
        const hash512Array = Array.from(new Uint8Array(hash512Buffer));
        const hash512Hex = hash512Array.map(b => b.toString(16).padStart(2, '0')).join('');
        sha512Result.value = hash512Hex;

        progressFill.style.width = '100%';
        progressPercent.textContent = '100%';

        setTimeout(() => {
            progressContainer.style.display = 'none';
            resultsContainer.style.display = 'block';
        }, 500);

    } catch (err) {
        console.error(err);
        alert('Error hashing file.');
        progressContainer.style.display = 'none';
    }
}

function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        // Since we are reading entirely to memory, we show progress
        reader.onprogress = (e) => {
            if (e.lengthComputable) {
                // max 50% for reading
                const percent = Math.round((e.loaded / e.total) * 40);
                progressFill.style.width = percent + '%';
                progressPercent.textContent = percent + '%';
            }
        };
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

function copyHash(inputId, btn) {
    const input = document.getElementById(inputId);
    input.select();
    input.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(input.value);
    
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}
