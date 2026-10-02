const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewArea = document.getElementById('previewArea');
const previewImg = document.getElementById('previewImg');
const fileInfo = document.getElementById('fileInfo');
const convertBtn = document.getElementById('convertBtn');
const formatSelect = document.getElementById('formatSelect');
const scaleSelect = document.getElementById('scaleSelect');

let currentFile = null;

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

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }
    currentFile = file;
    const url = URL.createObjectURL(file);
    previewImg.src = url;
    previewArea.style.display = 'block';
    fileInfo.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
    convertBtn.disabled = false;
    
    // Cleanup URL when image loads
    previewImg.onload = () => {
        URL.revokeObjectURL(url);
    };
}

convertBtn.addEventListener('click', () => {
    if (!currentFile) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
        const scale = parseFloat(scaleSelect.value);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const targetFormat = formatSelect.value;
        const dataUrl = canvas.toDataURL(targetFormat, 1.0);
        
        const a = document.createElement('a');
        a.href = dataUrl;
        const extension = targetFormat.split('/')[1];
        a.download = `converted_image.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const url = URL.createObjectURL(currentFile);
    img.src = url;
});
