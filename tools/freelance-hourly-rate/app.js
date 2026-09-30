// app.js
document.addEventListener('DOMContentLoaded', () => {
    const inputs = ['netSalary', 'expenses', 'taxRate', 'weeksOff', 'hoursPerWeek'];
    const elements = {};
    
    inputs.forEach(id => {
        elements[id] = document.getElementById(id);
        elements[id].addEventListener('input', calculate);
    });

    const hourlyRateOut = document.getElementById('hourlyRateOut');
    const dayRateOut = document.getElementById('dayRateOut');
    const monthlyGrossOut = document.getElementById('monthlyGrossOut');
    const copyBtn = document.getElementById('copyBtn');

    let currentHourlyRate = 0;
    let currentDayRate = 0;

    function calculate() {
        const netSalary = parseFloat(elements.netSalary.value) || 0;
        const expenses = parseFloat(elements.expenses.value) || 0;
        const taxRate = parseFloat(elements.taxRate.value) || 0;
        const weeksOff = parseFloat(elements.weeksOff.value) || 0;
        const hoursPerWeek = parseFloat(elements.hoursPerWeek.value) || 0;

        // Validation
        if (taxRate >= 100 || weeksOff >= 52 || hoursPerWeek <= 0) {
            hourlyRateOut.textContent = "Error";
            dayRateOut.textContent = "Error";
            monthlyGrossOut.textContent = "Error";
            return;
        }

        // Math
        const taxMultiplier = 1 - (taxRate / 100);
        const grossSalaryRequired = netSalary / taxMultiplier;
        const totalRevenueTarget = grossSalaryRequired + expenses;
        
        const workingWeeks = 52 - weeksOff;
        const totalBillableHours = workingWeeks * hoursPerWeek;
        
        const hourlyRate = totalRevenueTarget / totalBillableHours;
        const dayRate = hourlyRate * 8;
        const monthlyGross = totalRevenueTarget / 12;

        currentHourlyRate = hourlyRate;
        currentDayRate = dayRate;

        hourlyRateOut.textContent = formatCurrency(hourlyRate);
        dayRateOut.textContent = formatCurrency(dayRate);
        monthlyGrossOut.textContent = formatCurrency(monthlyGross);
    }

    function formatCurrency(val) {
        if (!isFinite(val)) return "$0.00";
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(val);
    }

    copyBtn.addEventListener('click', () => {
        const textToCopy = `Hourly Rate: ${formatCurrency(currentHourlyRate)} | Day Rate: ${formatCurrency(currentDayRate)}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied!";
            copyBtn.style.backgroundColor = "#22c55e"; // success green
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = "";
            }, 2000);
        });
    });

    // Initial calculation
    calculate();
});
