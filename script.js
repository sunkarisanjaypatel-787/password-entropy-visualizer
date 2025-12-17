/**
 * PASSWORD ENTROPY VISUALIZER
 * Logic for calculating password strength, estimating crack time, 
 * and updating the UI with real-time feedback.
 */

// --- 1. DOM ELEMENTS SELECTION ---
const passwordInput = document.getElementById('passwordInput');
const togglePassword = document.getElementById('togglePassword');

// UI Elements (Strength & Feedback)
const strengthMessage = document.getElementById('strengthMessage');
const strengthText = document.getElementById('strengthText');
const strengthBar = document.getElementById('strengthBar');
const scoreCounter = document.getElementById('scoreCounter');
const securityAdvice = document.getElementById('securityAdvice');
const timeToCrackDisplay = document.getElementById('timeToCrack');

// Requirement List Items
const reqLength = document.getElementById('req-length');
const reqUpper = document.getElementById('req-upper');
const reqLower = document.getElementById('req-lower');
const reqNumber = document.getElementById('req-number');
const reqSymbol = document.getElementById('req-symbol');

// --- 2. REGEX PATTERNS ---
const patterns = {
    upper: /[A-Z]/,
    lower: /[a-z]/,
    number: /\d/,
    symbol: /[!@#$%^&*(),.?":{}|<>]/
};

// --- 3. EVENT LISTENERS ---

/**
 * Toggle Password Visibility
 * Switches input type between 'password' and 'text'
 */
togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle icon class
    this.classList.toggle('fa-eye-slash');
    this.classList.toggle('fa-eye');
});

/**
 * Main Logic: Real-time Strength Calculation
 * Triggered on every keystroke.
 */
passwordInput.addEventListener('input', function () {
    const value = passwordInput.value;
    
    // --- A. Calculate "Gamified" Score (0-100) ---
    let rawScore = 0;
    
    if (value.length > 0) {
        // Base score for length (up to 45 points)
        rawScore += Math.min(value.length * 3, 45);
    }
    
    // Bonus points for variety
    if (patterns.upper.test(value)) rawScore += 10;
    if (patterns.lower.test(value)) rawScore += 10;
    if (patterns.number.test(value)) rawScore += 15;
    if (patterns.symbol.test(value)) rawScore += 20;
    
    // Cap score at 100
    if (rawScore > 100) rawScore = 100;

    // --- B. Update Requirement List Icons ---
    updateRequirement(reqLength, value.length >= 8);
    updateRequirement(reqUpper, patterns.upper.test(value));
    updateRequirement(reqLower, patterns.lower.test(value));
    updateRequirement(reqNumber, patterns.number.test(value));
    updateRequirement(reqSymbol, patterns.symbol.test(value));

    // --- C. Update UI Visuals (Color & Text) ---
    // Reset base classes
    strengthMessage.className = 'strength-pill'; 
    strengthBar.className = 'progress-bar';
    
    let strengthLabel = "N/A";

    if (rawScore === 0) {
        strengthLabel = "N/A";
        strengthBar.style.width = '0%';
    } 
    else if (rawScore < 40) {
        strengthLabel = "Weak";
        strengthMessage.classList.add('weak');
        strengthBar.classList.add('bar-weak');
    } 
    else if (rawScore < 75) {
        strengthLabel = "Medium";
        strengthMessage.classList.add('medium');
        strengthBar.classList.add('bar-medium');
    } 
    else {
        strengthLabel = "Strong";
        strengthMessage.classList.add('strong');
        strengthBar.classList.add('bar-strong');
    }

    if (strengthText) strengthText.textContent = strengthLabel;
    
    // Update progress bar width
    if (rawScore > 0) strengthBar.style.width = `${rawScore}%`;
    
    // Animate the score number
    animateScore(parseInt(scoreCounter.innerText) || 0, rawScore);

    // --- D. Calculate & Display Crack Time ---
    const crackData = calculateCrackTime(value);
    if (timeToCrackDisplay) {
        timeToCrackDisplay.textContent = crackData;
    }

    // --- E. Update Security Advice ---
    updateSecurityAdvice(value, crackData);
});

// --- 4. HELPER FUNCTIONS ---

/**
 * Updates the visual state of a requirement item (Checkmark vs Dot)
 */
function updateRequirement(element, isValid) {
    if(!element) return;
    const icon = element.querySelector('i');
    
    if (isValid) {
        element.classList.add('valid');
        element.classList.remove('invalid');
        icon.className = 'fa-solid fa-check';
    } else {
        element.classList.remove('valid');
        element.classList.add('invalid');
        icon.className = 'fa-solid fa-circle';
    }
}

/**
 * Animates the number counter from start to end value
 */
function animateScore(start, end) {
    if (start === end) return;
    
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(1000 / (range * 20))); 
    
    let current = start;
    const timer = setInterval(function() {
        current += increment;
        scoreCounter.textContent = current;
        if (current === end) clearInterval(timer);
    }, Math.max(stepTime, 10));
}

/**
 * Updates the context-aware advice text based on crack time
 */
function updateSecurityAdvice(value, crackData) {
    if (value.length === 0) {
        securityAdvice.textContent = "Start typing...";
        securityAdvice.style.color = "#fff";
    } else if (value.length < 8) {
        securityAdvice.textContent = "⚠️ Too short to be secure.";
        securityAdvice.style.color = "#ff6b6b";
    } else if (crackData.includes("century") || crackData.includes("years") || crackData.includes("Forever")) {
        securityAdvice.textContent = "🔥 Unbreakable! Excellent work.";
        securityAdvice.style.color = "#1dd1a1";
    } else if (crackData.includes("days") || crackData.includes("months")) {
        securityAdvice.textContent = "🛡️ Secure enough for most uses.";
        securityAdvice.style.color = "#feca57";
    } else {
        securityAdvice.textContent = "⚠️ Still risky. Add symbols/numbers.";
        securityAdvice.style.color = "#ff6b6b";
    }
}

/**
 * Calculates Brute-Force Crack Time
 * Formula: Combinations = PoolSize ^ Length
 * Assumption: Attacker can guess 10 Billion passwords/second
 */
function calculateCrackTime(password) {
    if (!password) return "0 seconds";

    // 1. Calculate Pool Size
    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/\d/.test(password)) poolSize += 10;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) poolSize += 32;

    if (poolSize === 0) return "0 seconds";

    // 2. Calculate Combinations (Math.pow handles large numbers reasonably well for display)
    const combinations = Math.pow(poolSize, password.length);

    // 3. Rate: 10 Billion guesses per second (High-end GPU array)
    const guessesPerSecond = 10_000_000_000; 

    // 4. Calculate Seconds
    const seconds = combinations / guessesPerSecond;

    // 5. Format Output Human-readability
    if (seconds < 0.001) return "Instant";
    if (seconds < 1) return "< 1 second";
    if (seconds < 60) return Math.round(seconds) + " seconds";
    
    const minutes = seconds / 60;
    if (minutes < 60) return Math.round(minutes) + " minutes";
    
    const hours = minutes / 60;
    if (hours < 24) return Math.round(hours) + " hours";
    
    const days = hours / 24;
    if (days < 30) return Math.round(days) + " days";
    
    const months = days / 30;
    if (months < 12) return Math.round(months) + " months";
    
    const years = days / 365;
    if (years < 100) return Math.round(years) + " years";
    if (years < 100000) return Math.round(years / 100) + " centuries";
    
    return "Forever";
}
