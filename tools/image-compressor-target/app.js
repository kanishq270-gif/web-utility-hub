// app.js
document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const originalSizeEl = document.getElementById('originalSize');
    const compressedSizeEl = document.getElementById('compressedSize');
    const previewImg = document.getElementById('previewImg');
    const downloadBtn = document.getElementById('downloadBtn');
    
    const radioTargets = document.querySelectorAll('input[name="targetSize"]');
    const qualitySliderGroup = document.getElementById('qualitySliderGroup');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityVal = document.getElementById('qualityVal');

    let currentFile = null;
    let activeObjectUrl = null;

    // UI Listeners
    radioTargets.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                qualitySliderGroup.style.display = 'block';
            } else {
                qualitySliderGroup.style.display = 'none';
            }
            if (currentFile) processImage(currentFile);
        });
    });

    qualitySlider.addEventListener('input', (e) => {
        qualityVal.textContent = e.target.value;
    });

    qualitySlider.addEventListener('change', () => {
        if (currentFile && document.querySelector('input[name="targetSize"]:checked').value === 'custom') {
            processImage(currentFile);
        }
    });

    // Drag and Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        if (!file.type.match(/image\/(jpeg|png|webp)/)) {
            alert('Please select a valid image (JPG, PNG, WebP).');
            return;
        }
        currentFile = file;
        originalSizeEl.textContent = formatBytes(file.size);
        processImage(file);
    }

    function processImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                compressImage(img, file.name);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    async function compressImage(img, filename) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const targetMode = document.querySelector('input[name="targetSize"]:checked').value;
        
        if (targetMode === 'custom') {
            const quality = parseInt(qualitySlider.value) / 100;
            canvas.toBlob((blob) => {
                displayResult(blob, filename);
            }, 'image/jpeg', quality);
        } else {
            // Target size in bytes
            const targetBytes = parseInt(targetMode) * 1024;
            await iterativeBinarySearch(canvas, targetBytes, filename);
        }
    }

    function toBlobAsync(canvas, mimeType, quality) {
        return new Promise(resolve => canvas.toBlob(resolve, mimeType, quality));
    }

    async function iterativeBinarySearch(canvas, targetBytes, filename) {
        let min = 0.0;
        let max = 1.0;
        let bestQuality = 0.0;
        let bestBlob = null;
        const maxIterations = 6;

        for (let attempt = 0; attempt < maxIterations; attempt++) {
            if (max - min < 0.05) break;

            let mid = (min + max) / 2;
            let blob = await toBlobAsync(canvas, 'image/jpeg', mid);

            if (blob.size > targetBytes) {
                // Too big, lower the max
                max = mid;
            } else {
                // Fits, try to push quality higher
                min = mid;
                bestQuality = mid;
                bestBlob = blob;
            }
        }

        if (!bestBlob) {
            // fallback if it never fit
            bestBlob = await toBlobAsync(canvas, 'image/jpeg', min);
        }

        displayResult(bestBlob, filename);
    }


    function displayResult(blob, originalFilename) {
        compressedSizeEl.textContent = formatBytes(blob.size);
        
        if (activeObjectUrl) {
            URL.revokeObjectURL(activeObjectUrl);
        }
        activeObjectUrl = URL.createObjectURL(blob);
        previewImg.src = activeObjectUrl;
        
        downloadBtn.href = activeObjectUrl;
        downloadBtn.download = originalFilename.replace(/\.[^/.]+$/, "") + "_compressed.jpg";
        
        previewContainer.style.display = 'block';
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
});
