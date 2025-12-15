// DOM Elements
const metricBtn = document.getElementById('metric-btn');
const imperialBtn = document.getElementById('imperial-btn');
const systemIndicator = document.getElementById('system-indicator');
const metricInputs = document.getElementById('metric-inputs');
const imperialInputs = document.getElementById('imperial-inputs');
const calculateBtn = document.getElementById('calculate-btn');
const resetBtn = document.getElementById('reset-btn');
const resultContainer = document.getElementById('result-container');
const bmiValue = document.getElementById('bmi-value');
const bmiCategory = document.getElementById('bmi-category');
const categoryText = document.getElementById('category-text');
const bmiMessage = document.getElementById('bmi-message');

// Input fields
const heightCmInput = document.getElementById('height-cm');
const weightKgInput = document.getElementById('weight-kg');
const heightFtInput = document.getElementById('height-ft');
const heightInInput = document.getElementById('height-in');
const weightLbsInput = document.getElementById('weight-lbs');

// Set active system
let activeSystem = 'metric';

// Event listeners for system toggles
metricBtn.addEventListener('click', () => {
    setActiveSystem('metric');
    animateButtonClick(metricBtn);
});

imperialBtn.addEventListener('click', () => {
    setActiveSystem('imperial');
    animateButtonClick(imperialBtn);
});

// Calculate BMI when button clicked
calculateBtn.addEventListener('click', () => {
    calculateBMI();
    animateButtonClick(calculateBtn);
});

// Reset all inputs and results
resetBtn.addEventListener('click', () => {
    resetCalculator();
    animateButtonClick(resetBtn);
});

// Function to animate button click
function animateButtonClick(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 200);
}

// Function to set active measurement system
function setActiveSystem(system) {
    activeSystem = system;
    
    // Move indicator
    if (system === 'metric') {
        systemIndicator.style.transform = 'translateX(0)';
        metricBtn.classList.add('active');
        imperialBtn.classList.remove('active');
        metricInputs.style.display = 'block';
        imperialInputs.style.display = 'none';
    } else {
        systemIndicator.style.transform = 'translateX(calc(100% + 16px))';
        metricBtn.classList.remove('active');
        imperialBtn.classList.add('active');
        metricInputs.style.display = 'none';
        imperialInputs.style.display = 'block';
    }
    
    // Clear results when switching systems
    resultContainer.classList.remove('show');
    
    // Animate inputs
    const inputs = document.querySelectorAll('.input-group');
    inputs.forEach((input, index) => {
        input.style.animation = 'none';
        setTimeout(() => {
            input.style.animation = `slideUp 0.5s ease-out ${index * 0.1}s both`;
        }, 10);
    });
}

// Function to calculate BMI
function calculateBMI() {
    let height, weight, bmi;
    
    if (activeSystem === 'metric') {
        // Metric calculation: BMI = weight(kg) / [height(m)]^2
        height = parseFloat(heightCmInput.value) / 100; // Convert cm to meters
        weight = parseFloat(weightKgInput.value);
        
        // Validate inputs
        if (!height || !weight || height <= 0 || weight <= 0) {
            showError('Please enter valid height and weight values.');
            return;
        }
        
        bmi = weight / (height * height);
    } else {
        // Imperial calculation: BMI = [weight(lbs) / (height(in))^2] * 703
        const feet = parseFloat(heightFtInput.value);
        const inches = parseFloat(heightInInput.value) || 0;
        weight = parseFloat(weightLbsInput.value);
        
        // Validate inputs
        if (!feet || !weight || feet <= 0 || weight <= 0) {
            showError('Please enter valid height and weight values.');
            return;
        }
        
        height = (feet * 12) + inches; // Convert to total inches
        bmi = (weight / (height * height)) * 703;
    }
    
    // Round BMI to 1 decimal place
    bmi = Math.round(bmi * 10) / 10;
    
    // Determine BMI category
    let category, categoryClass;
    
    if (bmi < 18.5) {
        category = 'Underweight';
        categoryClass = 'underweight';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        category = 'Normal';
        categoryClass = 'normal';
    } else if (bmi >= 25 && bmi <= 29.9) {
        category = 'Overweight';
        categoryClass = 'overweight';
    } else {
        category = 'Obese';
        categoryClass = 'obese';
    }
    
    // Animate the BMI value counting up
    animateValue(bmiValue, 0, bmi, 1000);
    
    // Update category with animation
    setTimeout(() => {
        bmiCategory.textContent = category;
        bmiCategory.className = `bmi-category ${categoryClass}`;
        categoryText.textContent = category.toLowerCase();
        
        // Add more personalized message
        let message = `Your BMI of ${bmi} suggests you are in the <strong>${category.toLowerCase()}</strong> category. `;
        
        if (category === 'Underweight') {
            message += 'Consider consulting a healthcare provider for dietary advice.';
        } else if (category === 'Normal') {
            message += 'This is considered a healthy weight range for your height.';
        } else if (category === 'Overweight') {
            message += 'Consider incorporating regular physical activity and a balanced diet.';
        } else {
            message += 'Consult a healthcare provider for guidance on weight management.';
        }
        
        bmiMessage.innerHTML = message;
        
        // Animate message appearance
        bmiMessage.style.opacity = '0';
        bmiMessage.style.transform = 'translateY(10px)';
        setTimeout(() => {
            bmiMessage.style.transition = 'all 0.5s ease-out';
            bmiMessage.style.opacity = '1';
            bmiMessage.style.transform = 'translateY(0)';
        }, 300);
        
    }, 1000);
    
    // Show result container with animation
    resultContainer.classList.add('show');
    
    // Scroll to result
    setTimeout(() => {
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 500);
}

// Function to animate number counting
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toFixed(1);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Function to show error with animation
function showError(message) {
    // Create error element
    const errorEl = document.createElement('div');
    errorEl.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    errorEl.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        padding: 20px 25px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(231, 76, 60, 0.3);
        z-index: 1000;
        font-weight: 600;
        display: flex;
        align-items: center;
        transform: translateX(150%);
        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    
    document.body.appendChild(errorEl);
    
    // Animate in
    setTimeout(() => {
        errorEl.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        errorEl.style.transform = 'translateX(150%)';
        setTimeout(() => {
            document.body.removeChild(errorEl);
        }, 500);
    }, 4000);
}

// Function to reset calculator
function resetCalculator() {
    // Clear all input fields with animation
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.transform = 'scale(0.95)';
        input.style.opacity = '0.7';
        setTimeout(() => {
            input.value = '';
            input.style.transform = '';
            input.style.opacity = '';
        }, 200);
    });
    
    // Hide results with animation
    resultContainer.style.transform = 'scale(0.95)';
    resultContainer.style.opacity = '0.7';
    setTimeout(() => {
        resultContainer.classList.remove('show');
        resultContainer.style.transform = '';
        resultContainer.style.opacity = '';
    }, 300);
    
    // Reset to metric system
    setActiveSystem('metric');
}

// Allow pressing Enter to calculate BMI
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        calculateBMI();
        animateButtonClick(calculateBtn);
    }
});

// Add input focus animations
const allInputs = document.querySelectorAll('input');
allInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-3px)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = '';
    });
});

// Initialize with sample data for demonstration
window.addEventListener('load', function() {
    // Animate elements on load
    setTimeout(() => {
        heightCmInput.value = '175';
        weightKgInput.value = '70';
        heightFtInput.value = '5';
        heightInInput.value = '9';
        weightLbsInput.value = '154';
        
        // Add typing animation effect
        simulateTyping(heightCmInput, '175', 100);
        simulateTyping(weightKgInput, '70', 300);
    }, 1000);
});

// Simulate typing effect for demo
function simulateTyping(input, value, delay) {
    setTimeout(() => {
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < value.length) {
                input.value = value.substring(0, i + 1);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
    }, delay);
}
