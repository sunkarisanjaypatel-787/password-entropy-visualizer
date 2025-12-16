// --- SELECT DOM ELEMENTS ---
const passwordInput = document.getElementById('passwordInput');
const togglePassword = document.getElementById('togglePassword');
const strengthMessage = document.getElementById('strengthMessage');
const strengthText = document.getElementById('strengthText');
const strengthBar = document.getElementById('strengthBar');
const scoreCounter = document.getElementById('scoreCounter');
const securityAdvice = document.getElementById('securityAdvice');
const timeToCrackDisplay = document.getElementById('timeToCrack'); // Must match HTML ID

// --- REQUIREMENT LIST ITEMS ---
const reqLength = document.getElementById('req-length');
const reqUpper = document.getElementById('req-upper');
const reqLower = document.getElementById('req-lower');
const reqNumber = document.getElementById('req-number');
const reqSymbol = document.getElementById('req-symbol');

// --- REGEX PATTERNS ---
const patterns = {
    upper: /[A-Z]/,
    lower: /[a-z]/,
    number: /\d/,
    symbol: /[!@#$%^&*(),.?":{}|<>]/
};

// --- 1. TOGGLE PASSWORD VISIBILITY ---
togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
    this.classList.toggle('fa-eye');
});

// --- 2. MAIN INPUT LISTENER ---
passwordInput.addEventListener('input', function () {
    const value = passwordInput.value;
    
    // --- A. SCORE CALCULATION ---
    let rawScore = 0;
    if (value.length > 0) {
        rawScore += Math.min(value.length * 3, 45); // Max 45 pts for length
    }
    if (patterns.upper.test(value)) rawScore += 10;
    if (patterns.lower.test(value)) rawScore += 10;
    if (patterns.number.test(value)) rawScore += 15;
    if (patterns.symbol.test(value)) rawScore += 20;
    
    // Cap score at 100
    if (rawScore > 100) rawScore = 100;

    // --- B. UPDATE REQUIREMENTS LIST ---
    if (value.length >= 8) setValid(reqLength, true); else setValid(reqLength, false);
    if (patterns.upper.test(value)) setValid(reqUpper, true); else setValid(reqUpper, false);
    if (patterns.lower.test(value)) setValid(reqLower, true); else setValid(reqLower, false);
    if (patterns.number.test(value)) setValid(reqNumber, true); else setValid(reqNumber, false);
    if (patterns.symbol.test(value)) setValid(reqSymbol, true); else setValid(reqSymbol, false);

    // --- C. UPDATE VISUALS (Bar & Text) ---
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
    if (rawScore > 0) strengthBar.style.width = `${rawScore}%`;
    
    // Animate the number
    animateScore(parseInt(scoreCounter.innerText) || 0, rawScore);

    // --- D. CRACK TIME ESTIMATION (The Fix) ---
    const crackData = calculateCrackTime(value);
    if (timeToCrackDisplay) {
        timeToCrackDisplay.textContent = crackData;
    }

    // --- E. SECURITY ADVICE ---
    // Override advice based on actual difficulty
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
});

// --- HELPER FUNCTIONS ---

function setValid(element, isValid) {
    if(!element) return; // Safety check
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

// Updated Crack Time Logic (Uses Math instead of BigInt for better short-password handling)
function calculateCrackTime(password) {
    if (!password) return "0 seconds";

    // 1. Calculate Pool Size
    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/\d/.test(password)) poolSize += 10;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) poolSize += 32;

    if (poolSize === 0) return "0 seconds";

    // 2. Calculate Combinations (Pool^Length)
    const combinations = Math.pow(poolSize, password.length);

    // 3. Assume 10 Billion guesses per second
    const guessesPerSecond = 10000000000; 

    // 4. Calculate Seconds
    const seconds = combinations / guessesPerSecond;

    // 5. Format Output
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
