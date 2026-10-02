const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const mergeBtn = document.getElementById('mergeBtn');
const statusMsg = document.getElementById('statusMsg');

let filesArray = [];

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    for (const file of files) {
        if (file.type === 'application/pdf') {
            filesArray.push(file);
        }
    }
    renderFileList();
    updateMergeBtn();
}

function renderFileList() {
    fileList.innerHTML = '';
    filesArray.forEach((file, index) => {
        const li = document.createElement('li');
        li.className = 'file-item';
        li.draggable = true;
        li.dataset.index = index;
        
        li.innerHTML = `
            <span>☰ ${file.name}</span>
            <button class="remove-btn" onclick="removeFile(${index})">Remove</button>
        `;

        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('drop', handleDrop);
        li.addEventListener('dragenter', e => e.preventDefault());

        fileList.appendChild(li);
    });
}

function removeFile(index) {
    filesArray.splice(index, 1);
    renderFileList();
    updateMergeBtn();
}

function updateMergeBtn() {
    mergeBtn.disabled = filesArray.length < 2;
}

let dragStartIndex;

function handleDragStart(e) {
    dragStartIndex = +e.target.closest('li').dataset.index;
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    const dragEndIndex = +e.target.closest('li').dataset.index;
    swapItems(dragStartIndex, dragEndIndex);
}

function swapItems(fromIndex, toIndex) {
    const itemOne = filesArray[fromIndex];
    filesArray.splice(fromIndex, 1);
    filesArray.splice(toIndex, 0, itemOne);
    renderFileList();
}

mergeBtn.addEventListener('click', async () => {
    try {
        mergeBtn.disabled = true;
        mergeBtn.textContent = 'Merging...';
        statusMsg.textContent = '';

        const mergedPdf = await PDFLib.PDFDocument.create();

        for (const file of filesArray) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfFile = await mergedPdf.save();
        const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'merged.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        statusMsg.textContent = 'Merged successfully!';
    } catch (err) {
        statusMsg.style.color = '#ef4444';
        statusMsg.textContent = 'Error merging PDFs: ' + err.message;
    } finally {
        mergeBtn.disabled = false;
        mergeBtn.textContent = 'Merge & Download';
    }
});
