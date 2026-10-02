// Tabs logic
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
    });
});

// CSV to JSON
const csvInput = document.getElementById('csvInput');
const jsonOutput = document.getElementById('jsonOutput');

function csvToJson(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return '[]';
    
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const obj = {};
        const currentLine = lines[i].split(',');
        
        for (let j = 0; j < headers.length; j++) {
            let val = currentLine[j] ? currentLine[j].trim() : '';
            // Basic type casting
            if (!isNaN(val) && val !== '') val = Number(val);
            else if (val.toLowerCase() === 'true') val = true;
            else if (val.toLowerCase() === 'false') val = false;
            
            obj[headers[j]] = val;
        }
        result.push(obj);
    }
    return JSON.stringify(result, null, 2);
}

document.getElementById('c2j-convert').addEventListener('click', () => {
    try {
        jsonOutput.value = csvToJson(csvInput.value);
    } catch (e) {
        jsonOutput.value = 'Error parsing CSV: ' + e.message;
    }
});

// JSON to CSV
const jsonInput = document.getElementById('jsonInput');
const csvOutput = document.getElementById('csvOutput');

function jsonToCsv(jsonText) {
    const data = JSON.parse(jsonText);
    if (!Array.isArray(data) || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    let csv = headers.join(',') + '\n';
    
    data.forEach(row => {
        const rowData = headers.map(header => {
            let val = row[header] !== undefined && row[header] !== null ? row[header] : '';
            // Escape commas and quotes if string
            if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
                val = '"' + val.replace(/"/g, '""') + '"';
            }
            return val;
        });
        csv += rowData.join(',') + '\n';
    });
    
    return csv;
}

document.getElementById('j2c-convert').addEventListener('click', () => {
    try {
        csvOutput.value = jsonToCsv(jsonInput.value);
    } catch (e) {
        csvOutput.value = 'Error parsing JSON: ' + e.message;
    }
});

// Copy and Download Handlers
function copyToClipboard(elId, btn) {
    const el = document.getElementById(elId);
    el.select();
    navigator.clipboard.writeText(el.value);
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
}

function downloadFile(contentId, filename, type) {
    const content = document.getElementById(contentId).value;
    if (!content) return;
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.getElementById('c2j-copy').addEventListener('click', function() { copyToClipboard('jsonOutput', this); });
document.getElementById('c2j-download').addEventListener('click', () => { downloadFile('jsonOutput', 'converted.json', 'application/json'); });

document.getElementById('j2c-copy').addEventListener('click', function() { copyToClipboard('csvOutput', this); });
document.getElementById('j2c-download').addEventListener('click', () => { downloadFile('csvOutput', 'converted.csv', 'text/csv'); });
