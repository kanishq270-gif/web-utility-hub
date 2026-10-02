const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewArea = document.getElementById('previewArea');
const previewImg = document.getElementById('previewImg');
const exifDataContainer = document.getElementById('exifDataContainer');
const stripBtn = document.getElementById('stripBtn');

let currentFile = null;
let currentImgElement = new Image();

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
    if (!file.type.match('image/(jpeg|png)')) {
        alert('Please select a JPEG or PNG image.');
        return;
    }
    currentFile = file;
    const url = URL.createObjectURL(file);
    previewImg.src = url;
    currentImgElement.src = url;
    previewArea.style.display = 'block';
    exifDataContainer.innerHTML = '<p style="color: var(--text-secondary);">Reading EXIF...</p>';
    stripBtn.disabled = true;

    currentImgElement.onload = function() {
        EXIF.getData(currentImgElement, function() {
            const allMetaData = EXIF.getAllTags(this);
            displayExifData(allMetaData);
            stripBtn.disabled = false;
        });
    };
}

function displayExifData(data) {
    if (Object.keys(data).length === 0) {
        exifDataContainer.innerHTML = '<p style="color: #10b981;">No EXIF metadata found in this image!</p>';
        return;
    }

    let tableHtml = '<table><tbody>';
    const importantTags = ['Make', 'Model', 'DateTimeOriginal', 'ExposureTime', 'FNumber', 'ISOSpeedRatings', 'GPSLatitude', 'GPSLongitude'];
    
    // Sort and prioritize important tags
    for (const tag in data) {
        if (typeof data[tag] !== 'object' && tag !== 'thumbnail') {
            const isImportant = importantTags.includes(tag);
            const style = isImportant ? 'font-weight: bold; color: var(--text-primary);' : '';
            tableHtml += `<tr><th style="${style}">${tag}</th><td>${data[tag]}</td></tr>`;
        }
    }
    
    // Check GPS specifically
    if (data.GPSLatitude && data.GPSLongitude) {
        tableHtml += `<tr><th style="font-weight: bold; color: #ef4444;">GPS Data Detected!</th><td>Warning: This image contains location data.</td></tr>`;
    }

    tableHtml += '</tbody></table>';
    exifDataContainer.innerHTML = tableHtml;
}

stripBtn.addEventListener('click', () => {
    if (!currentFile) return;

    // To strip EXIF, we can simply draw the image to a canvas and export it.
    // The canvas does not retain EXIF metadata.
    const canvas = document.createElement('canvas');
    canvas.width = currentImgElement.width;
    canvas.height = currentImgElement.height;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(currentImgElement, 0, 0);

    canvas.toBlob((blob) => {
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = 'clean_' + currentFile.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show success
        const originalText = stripBtn.textContent;
        stripBtn.textContent = 'Cleaned & Saved!';
        stripBtn.style.background = '#10b981';
        setTimeout(() => {
            stripBtn.textContent = originalText;
            stripBtn.style.background = '#ef4444';
        }, 3000);
    }, currentFile.type);
});
