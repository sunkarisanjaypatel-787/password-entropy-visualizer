# 🛡️ Password Entropy Visualizer

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![License](https://img.shields.io/badge/License-MIT-blue)

**A gamified, real-time password security analysis tool.** This project visualizes password strength using mathematical entropy logic, providing users with instant feedback on "crack time," complexity, and overall security scores.

🔗 **[Live Demo] (https://sunkarisanjaypatel-787.github.io/password-entropy-visualizer/)**

---

## 📸 Screenshots

App Interface <img width="1710" height="1112" alt="Screenshot 2025-12-16 at 20 49 18" src="https://github.com/user-attachments/assets/75aa24d3-41dd-453f-986a-327138378b8f"/>



---

## 🚀 Key Features


### 1. 🧠 Real-Time Entropy Calculation
Unlike basic checkers that just count characters, this tool calculates **information entropy** to estimate:
* **Crack Time:** How long it would take a brute-force attack (assuming 10 billion guesses/sec) to break the password.
* **Safety Tiers:** Categorizes passwords from "Instant" cracks to "Unbreakable" (Centuries).

### 2. 🎮 Gamified Scoring System
* **0-100 Score:** A dynamic "health bar" for password strength.
* **Visual Feedback:** The interface changes colors (Red → Yellow → Teal) and provides security advice based on the current score.

### 3. 🎨 Aesthetic UI (Glassmorphism)
* **Modern Design:** Features a frosted glass effect using `backdrop-filter`.
* **Animations:** Smooth counting animations for the score and fluid width transitions for the progress bar.
* **Responsive:** Fully optimized for mobile and desktop devices.

---

## 🛠️ Tech Stack

| Technology | Usage |
| :--- | :--- |
| **HTML5** | Semantic structure and accessibility tags. |
| **CSS3** | Glassmorphism, CSS Variables, Flexbox, Keyframe Animations. |
| **JavaScript (ES6)** | DOM manipulation, Regex validation, Entropy math logic. |
| **FontAwesome** | UI Icons (Eye toggle, Checkmarks). |

---

## 🧮 How It Works ( The Logic)

The core logic resides in `script.js`. It calculates the size of the character pool and determines combinations.

**The Formula:**
$$\text{Combinations} = \text{Pool Size}^{\text{Length}}$$

Where **Pool Size** is determined by:
* Lower Case: +26
* Upper Case: +26
* Numbers: +10
* Symbols: +32

The **Time to Crack** is then derived by dividing total combinations by an assumed processing speed of **10 Billion guesses/second**.

---

## 📂 Project Structure

```bash
password-entropy-visualizer/
│
├── index.html       # Main structure
├── style.css        # Glassmorphism & Animations
├── script.js        # Logic for entropy & UI updates
├── preview-image.png # Screenshot for README
└── README.md        # Documentation
