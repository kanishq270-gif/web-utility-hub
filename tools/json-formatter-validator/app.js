// app.js
document.addEventListener('DOMContentLoaded', () => {
    const jsonInput = document.getElementById('jsonInput');
    const errorBanner = document.getElementById('errorBanner');
    const errorMessage = document.getElementById('errorMessage');
    
    const btnSample = document.getElementById('btnSample');
    const btnBeautify2 = document.getElementById('btnBeautify2');
    const btnBeautify4 = document.getElementById('btnBeautify4');
    const btnMinify = document.getElementById('btnMinify');
    const btnCopy = document.getElementById('btnCopy');

    function parseAndFormat(spaces) {
        const raw = jsonInput.value.trim();
        if (!raw) return;

        try {
            const obj = JSON.parse(raw);
            jsonInput.value = JSON.stringify(obj, null, spaces);
            errorBanner.style.display = 'none';
        } catch (e) {
            errorMessage.textContent = e.message;
            errorBanner.style.display = 'block';
        }
    }

    btnBeautify2.addEventListener('click', () => parseAndFormat(2));
    btnBeautify4.addEventListener('click', () => parseAndFormat(4));
    
    btnMinify.addEventListener('click', () => {
        const raw = jsonInput.value.trim();
        if (!raw) return;

        try {
            const obj = JSON.parse(raw);
            jsonInput.value = JSON.stringify(obj);
            errorBanner.style.display = 'none';
        } catch (e) {
            errorMessage.textContent = e.message;
            errorBanner.style.display = 'block';
        }
    });

    btnSample.addEventListener('click', () => {
        const sample = {
            "name": "Web Utility Hub",
            "version": 1.0,
            "isClientSide": true,
            "features": ["Validation", "Minification", "Formatting"],
            "settings": {
                "theme": "dark",
                "defaultIndent": 2
            }
        };
        jsonInput.value = JSON.stringify(sample, null, 2);
        errorBanner.style.display = 'none';
    });

    btnCopy.addEventListener('click', () => {
        const content = jsonInput.value;
        if (!content) return;

        navigator.clipboard.writeText(content).then(() => {
            const originalText = btnCopy.textContent;
            btnCopy.textContent = "✔ Copied";
            btnCopy.style.backgroundColor = "#22c55e"; // success green
            setTimeout(() => {
                btnCopy.textContent = originalText;
                btnCopy.style.backgroundColor = "";
            }, 2000);
        });
    });
});
