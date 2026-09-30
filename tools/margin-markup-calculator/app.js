// app.js
document.addEventListener('DOMContentLoaded', () => {
    const costPriceEl = document.getElementById('costPrice');
    const sellingPriceEl = document.getElementById('sellingPrice');
    const marginInputEl = document.getElementById('marginInput');
    const resetBtn = document.getElementById('resetBtn');

    const profitOut = document.getElementById('profitOut');
    const marginOut = document.getElementById('marginOut');
    const markupOut = document.getElementById('markupOut');

    let isUpdating = false;
    let activeCalculationMode = 'cost_selling';

    function formatCurrency(val) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    }

    function formatPercent(val) {
        return val.toFixed(2) + '%';
    }

    function calculateFromCostAndSell() {
        const cost = parseFloat(costPriceEl.value);
        const sell = parseFloat(sellingPriceEl.value);

        if (!isNaN(cost) && !isNaN(sell) && sell !== 0 && cost >= 0 && sell >= 0) {
            const profit = sell - cost;
            const margin = (profit / sell) * 100;
            const markup = cost !== 0 ? (profit / cost) * 100 : 0;

            if (document.activeElement !== marginInputEl) {
                marginInputEl.value = margin.toFixed(2);
            }
            updateOutputs(profit, margin, markup);
        } else {
            clearOutputs();
        }
    }

    function calculateFromCostAndMargin() {
        const cost = parseFloat(costPriceEl.value);
        const margin = parseFloat(marginInputEl.value);

        if (!isNaN(cost) && !isNaN(margin) && margin < 100 && cost >= 0) {
            const sell = cost / (1 - (margin / 100));
            const profit = sell - cost;
            const markup = cost !== 0 ? (profit / cost) * 100 : 0;

            if (document.activeElement !== sellingPriceEl) {
                sellingPriceEl.value = sell.toFixed(2);
            }
            updateOutputs(profit, margin, markup);
        } else {
            clearOutputs();
        }
    }

    function updateOutputs(profit, margin, markup) {
        profitOut.textContent = formatCurrency(profit);
        marginOut.textContent = formatPercent(margin);
        markupOut.textContent = formatPercent(markup);
    }

    function clearOutputs() {
        profitOut.textContent = "$0.00";
        marginOut.textContent = "0.00%";
        markupOut.textContent = "0.00%";
    }

    costPriceEl.addEventListener('input', () => {
        if (isUpdating) return;
        isUpdating = true;
        if (activeCalculationMode === 'cost_selling') {
            calculateFromCostAndSell();
        } else {
            calculateFromCostAndMargin();
        }
        isUpdating = false;
    });

    sellingPriceEl.addEventListener('input', () => {
        activeCalculationMode = 'cost_selling';
        if (isUpdating) return;
        isUpdating = true;
        calculateFromCostAndSell();
        isUpdating = false;
    });

    marginInputEl.addEventListener('input', () => {
        activeCalculationMode = 'cost_margin';
        if (isUpdating) return;
        isUpdating = true;
        calculateFromCostAndMargin();
        isUpdating = false;
    });

    resetBtn.addEventListener('click', () => {
        costPriceEl.value = "";
        sellingPriceEl.value = "";
        marginInputEl.value = "";
        clearOutputs();
    });
});
