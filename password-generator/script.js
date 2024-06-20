const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const uppercaseCheck = document.getElementById('UpperCase');
const lowercaseCheck = document.getElementById('LowerCase');
const numberCheck = document.getElementById('Number');
const symbolCheck = document.getElementById('Symbol');
const lengthSlider = document.querySelector('.slider');
const passwordLengthInput = document.querySelector('[data-lengthDisplay]');
const strengthCircles = document.querySelectorAll('.indicator .strength-circle');
const generateBtn = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;

handleSlider();

function handleSlider() {
    lengthSlider.value = passwordLength;
    passwordLengthInput.textContent = passwordLength;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 122));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 90));
}

function generateSymbol() {
    const symbols = "!@#$%^&*()_+";
    return symbols[getRndInteger(0, symbols.length - 1)];
}

function strongPass() {
    let uh = uppercaseCheck.checked;
    let ul = lowercaseCheck.checked;
    let un = numberCheck.checked;
    let us = symbolCheck.checked;

    let strength = "weak";

    if (uh && ul && un && us && passwordLength >= 10) {
        strength = "strong";
    } else if (uh && ul && (un || us) && passwordLength >= 6) {
        strength = "medium";
    }

    setIndicator(strength);
}

function setIndicator(strength) {
    strengthCircles.forEach((circle, index) => {
        if (index === 0 && strength === "weak") {
            circle.style.backgroundColor = "#f00"; // Red
        } else if (index <= 1 && strength === "medium") {
            circle.style.backgroundColor = "#ff0"; // Yellow
        } else if (index <= 2 && strength === "strong") {
            circle.style.backgroundColor = "#0f0"; // Green
        } else {
            circle.style.backgroundColor = "transparent"; // Reset other circles
        }
    });

    // Update data attribute for strength level
    const indicator = document.querySelector('.indicator');
    indicator.setAttribute('data-strength', strength);
}

// Event listener for slider input
lengthSlider.addEventListener('input', () => {
    passwordLength = parseInt(lengthSlider.value);
    passwordLengthInput.textContent = passwordLength;
    strongPass(); // Update strength indicator based on new length
});

// Event listener for password length input
passwordLengthInput.addEventListener('input', () => {
    passwordLength = parseInt(passwordLengthInput.textContent);
    handleSlider();
    strongPass(); // Update strength indicator based on new length
});

// Event listener for copy button
copyBtn.addEventListener('click', () => {
    if (password.length !== 0) {
        copyContent();
    }
});

// Event listener for checkbox changes
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
        strongPass(); // Update strength indicator based on checkbox changes
    });
});

// Event listener for generate button
generateBtn.addEventListener('click', () => {
    generatePassword();
});

// Function to generate password based on selected options
function generatePassword() {
    if (passwordLength <= 0) {
        return; // Exit if password length is zero or negative
    }

    password = "";

    const options = {
        lowercase: lowercaseCheck.checked,
        uppercase: uppercaseCheck.checked,
        number: numberCheck.checked,
        symbol: symbolCheck.checked
    };

    const optionKeys = Object.keys(options).filter(key => options[key]);

    if (optionKeys.length === 0) {
        return; // Exit if no checkboxes are selected
    }

    // Generate password based on selected options
    for (let i = 0; i < passwordLength; i++) {
        const randomOption = optionKeys[Math.floor(Math.random() * optionKeys.length)];
        switch (randomOption) {
            case 'lowercase':
                password += generateLowerCase();
                break;
            case 'uppercase':
                password += generateUpperCase();
                break;
            case 'number':
                password += generateRandomNumber();
                break;
            case 'symbol':
                password += generateSymbol();
                break;
            default:
                break;
        }
    }

    // Display generated password and update strength indicator
    passwordDisplay.value = password;
    strongPass();
}

// Function to copy generated password to clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(password);
        const copyMsg = document.querySelector('[data-copyMsg]');
        copyMsg.textContent = "Copied!";
        copyMsg.classList.remove('hidden');
        setTimeout(() => {
            copyMsg.classList.add('hidden');
        }, 1000);
    } catch (err) {
        console.error('Failed to copy:', err);
        const copyMsg = document.querySelector('[data-copyMsg]');
        copyMsg.textContent = "Failed to copy!";
        copyMsg.classList.remove('hidden');
        setTimeout(() => {
            copyMsg.classList.add('hidden');
        }, 1000);
    }
}
