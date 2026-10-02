// Tabs logic
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
    });
});

// Base64 Text
const b64tInput = document.getElementById('b64t-input');
const b64tOutput = document.getElementById('b64t-output');

document.getElementById('b64t-enc').addEventListener('click', () => {
    try { b64tOutput.value = btoa(b64tInput.value); } catch(e) { b64tOutput.value = 'Error: Invalid input for encoding'; }
});
document.getElementById('b64t-dec').addEventListener('click', () => {
    try { b64tOutput.value = atob(b64tInput.value); } catch(e) { b64tOutput.value = 'Error: Invalid Base64 string'; }
});
document.getElementById('b64t-clear').addEventListener('click', () => { b64tInput.value = ''; b64tOutput.value = ''; });
document.getElementById('b64t-copy').addEventListener('click', () => navigator.clipboard.writeText(b64tOutput.value));

// Base64 Image
const imgDropZone = document.getElementById('imgDropZone');
const imgInput = document.getElementById('imgInput');
const b64iOutput = document.getElementById('b64i-output');
const imgPreview = document.getElementById('imgPreview');

imgDropZone.addEventListener('click', () => imgInput.click());
imgInput.addEventListener('change', e => { if (e.target.files.length) encodeImage(e.target.files[0]); });
imgDropZone.addEventListener('dragover', e => e.preventDefault());
imgDropZone.addEventListener('drop', e => {
    e.preventDefault();
    if (e.dataTransfer.files.length) encodeImage(e.dataTransfer.files[0]);
});

function encodeImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        b64iOutput.value = e.target.result;
        imgPreview.src = e.target.result;
        imgPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

document.getElementById('b64i-preview-btn').addEventListener('click', () => {
    if (b64iOutput.value.startsWith('data:image')) {
        imgPreview.src = b64iOutput.value;
        imgPreview.style.display = 'block';
    } else {
        alert('Invalid Base64 image data URI. It should start with data:image/...');
    }
});
document.getElementById('b64i-clear').addEventListener('click', () => { b64iOutput.value = ''; imgPreview.style.display = 'none'; imgPreview.src = ''; });
document.getElementById('b64i-copy').addEventListener('click', () => navigator.clipboard.writeText(b64iOutput.value));

// URL Encode/Decode
const urlInput = document.getElementById('url-input');
const urlOutput = document.getElementById('url-output');

document.getElementById('url-enc-btn').addEventListener('click', () => {
    urlOutput.value = encodeURIComponent(urlInput.value);
});
document.getElementById('url-dec-btn').addEventListener('click', () => {
    try { urlOutput.value = decodeURIComponent(urlInput.value); } catch(e) { urlOutput.value = 'Error: Invalid URL encoding'; }
});
document.getElementById('url-clear').addEventListener('click', () => { urlInput.value = ''; urlOutput.value = ''; });
document.getElementById('url-copy').addEventListener('click', () => navigator.clipboard.writeText(urlOutput.value));
