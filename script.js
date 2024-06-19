// Function to convert hex to RGB
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    let r = 0, g = 0, b = 0;
    if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    } else if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    }
    return [r, g, b];
}

// Function to convert CMYK to RGB
function cmykToRgb(c, m, y, k) {
    c = c / 100;
    m = m / 100;
    y = y / 100;
    k = k / 100;

    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);
    return [Math.round(r), Math.round(g), Math.round(b)];
}

// Function to calculate brightness
function calculateBrightness(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Function to calculate contrast ratio
function calculateContrast(brightness1, brightness2) {
    const L1 = Math.max(brightness1, brightness2) + 0.05;
    const L2 = Math.min(brightness1, brightness2) + 0.05;
    return L1 / L2;
}

/* Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const modeIcon = document.getElementById('mode-icon');
    body.classList.toggle('dark-mode');
    modeIcon.textContent = body.classList.contains('dark-mode') ? '🌚' : '🌞';

    if (body.classList.contains('dark-mode')) {
        document.body.style.backgroundColor = '#202020';
        document.querySelectorAll('.container').forEach(container => {
            container.style.backgroundColor = '#333333';
        });
        document.querySelector('.container-contrast').style.backgroundColor = '#333333';
    } else {
        document.body.style.backgroundColor = '#f0f0f0';
        document.querySelectorAll('.container').forEach(container => {
            container.style.backgroundColor = '#f5f5f5';
        });
        document.querySelector('.container-contrast').style.backgroundColor = '#f5f5f5';
    }
}
*/

// Function to check brightness
function checkBrightness(inputPrefix) {
    const rgbInput = document.getElementById('rgbInput' + inputPrefix).value.trim();
    const hexInput = document.getElementById('hexInput' + inputPrefix).value.trim();
    const cmykInput = document.getElementById('cmykInput' + inputPrefix).value.trim();
    const output = document.getElementById('output' + inputPrefix);
    const colorSquare = document.getElementById('colorSquare' + inputPrefix);

    let r, g, b;

    if (rgbInput) {
        const rgbArray = rgbInput.split(',').map(num => parseInt(num.trim()));
        if (rgbArray.length !== 3 || rgbArray.some(isNaN)) {
            output.textContent = "Please enter a valid RGB value in the format: R,G,B";
            output.style.color = "red";
            return;
        }
        [r, g, b] = rgbArray;
    } else if (hexInput) {
        [r, g, b] = hexToRgb(hexInput);
    } else if (cmykInput) {
        const cmykArray = cmykInput.split(',').map(num => parseFloat(num.trim()));
        if (cmykArray.length !== 4 || cmykArray.some(isNaN)) {
            output.textContent = "Please enter a valid CMYK value in the format: C,M,Y,K";
            output.style.color = "red";
            return;
        }
        [r, g, b] = cmykToRgb(cmykArray[0], cmykArray[1], cmykArray[2], cmykArray[3]);
    } else {
        output.textContent = "Please enter a color value.";
        output.style.color = "red";
        return;
    }

    const brightness = calculateBrightness(r, g, b);
    const brightnessText = brightness >= 128 ? "Light" : "Dark";
    output.textContent = `Brightness: ${brightness.toFixed(2)} - ${brightnessText}`;
    output.style.color = brightness >= 128 ? "black" : "";

    colorSquare.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    colorSquare.style.borderColor = brightness >= 128 ? "black" : "white";

    checkContrastButtonState();
}

// Function to check if the contrast button should be enabled
function checkContrastButtonState() {
    const output1 = document.getElementById('output1').textContent;
    const output2 = document.getElementById('output2').textContent;

    if (output1.includes("Brightness") && output2.includes("Brightness")) {
        document.getElementById('checkContrastBtn').disabled = false;
    } else {
        document.getElementById('checkContrastBtn').disabled = true;
    }
}

// Function to check contrast
function checkContrast() {
    const brightness1 = parseFloat(document.getElementById('output1').textContent.split(':')[1]);
    const brightness2 = parseFloat(document.getElementById('output2').textContent.split(':')[1]);
    const contrast = calculateContrast(brightness1, brightness2);

    let contrastOutput;
    if (contrast >= 14.1) {
        contrastOutput = "Good Contrast";
    } else if (contrast >= 7.1 && contrast < 14) {
        contrastOutput = "Medium Contrast";
    } else {
        contrastOutput = "Poor Contrast";
    }

    document.getElementById('contrastOutput').textContent = `Contrast Ratio: ${contrast.toFixed(2)} - ${contrastOutput}`;
}

// Event listeners
document.getElementById('checkBrightnessBtn1').addEventListener('click', () => checkBrightness(1));
document.getElementById('checkBrightnessBtn2').addEventListener('click', () => checkBrightness(2));
document.getElementById('checkContrastBtn').addEventListener('click', checkContrast);

document.getElementById('rgbInput1').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkBrightness(1);
    }
});

document.getElementById('rgbInput2').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkBrightness(2);
    }
});

document.getElementById('hexInput1').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkBrightness(1);
    }
});

document.getElementById('hexInput2').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkBrightness(2);
    }
});

document.getElementById('cmykInput1').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkBrightness(1);
    }
});

document.getElementById('cmykInput2').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkBrightness(2);
    }
});

// Automatically select text in input fields when focused
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function () {
        this.select();
    });
});