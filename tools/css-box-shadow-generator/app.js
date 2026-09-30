// app.js
document.addEventListener('DOMContentLoaded', () => {
    const previewBox = document.getElementById('previewBox');
    const cssCodeOutput = document.getElementById('cssCodeOutput');
    const copyBtn = document.getElementById('copyBtn');

    const inputs = {
        hOffset: document.getElementById('hOffset'),
        vOffset: document.getElementById('vOffset'),
        blur: document.getElementById('blur'),
        spread: document.getElementById('spread'),
        color: document.getElementById('shadowColor'),
        opacity: document.getElementById('opacity'),
        inset: document.getElementById('insetToggle')
    };

    const values = {
        hOffset: document.getElementById('hOffsetVal'),
        vOffset: document.getElementById('vOffsetVal'),
        blur: document.getElementById('blurVal'),
        spread: document.getElementById('spreadVal'),
        opacity: document.getElementById('opacityVal')
    };

    function hexToRgb(hex) {
        let r = 0, g = 0, b = 0;
        // 3 digits
        if (hex.length == 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        }
        // 6 digits
        else if (hex.length == 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        return `${r}, ${g}, ${b}`;
    }

    function updateShadow() {
        const h = inputs.hOffset.value;
        const v = inputs.vOffset.value;
        const b = inputs.blur.value;
        const s = inputs.spread.value;
        const rgb = hexToRgb(inputs.color.value);
        const a = inputs.opacity.value;
        const inset = inputs.inset.checked ? 'inset ' : '';

        // Update labels
        values.hOffset.textContent = h;
        values.vOffset.textContent = v;
        values.blur.textContent = b;
        values.spread.textContent = s;
        values.opacity.textContent = a;

        // Build CSS
        const cssString = `${inset}${h}px ${v}px ${b}px ${s}px rgba(${rgb}, ${a})`;
        
        // Apply to preview
        previewBox.style.boxShadow = cssString;
        
        // Update code output
        cssCodeOutput.textContent = `box-shadow: ${cssString};`;
    }

    // Attach listeners
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', updateShadow);
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(cssCodeOutput.textContent).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied!";
            copyBtn.style.backgroundColor = "#22c55e"; // success green
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = ""; // reset
            }, 2000);
        });
    });

    // Init
    updateShadow();
});
