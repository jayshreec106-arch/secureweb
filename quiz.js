// Cyber Crime Awareness Quiz Logic
const quizQuestions = [
    {
        question: "What is Phishing?",
        options: [
            "A form of sport fishing in rivers",
            "An attempt to trick you into revealing personal information like passwords or bank details using fake emails or websites",
            "A technique to speed up your internet speed",
            "A method to block computer viruses"
        ],
        answer: 1, // Index of correct option
        explanation: "Phishing uses deceptive emails, messages, or websites that look official to trick you into giving away credentials, financial info, or personal details."
    },
    {
        question: "Which of the following is considered the strongest password?",
        options: [
            "password123",
            "Admin@123",
            "MyNameIsJohn",
            "Tr0p!c#G1@ss_88"
        ],
        answer: 3,
        explanation: "A strong password includes uppercase, lowercase, numbers, special characters, is at least 12 characters long, and does not contain obvious words or patterns."
    },
    {
        question: "What does Two-Factor Authentication (2FA) do?",
        options: [
            "It requires you to type your password twice",
            "It allows two different people to access the same account",
            "It adds an extra layer of security by requiring a second verification method (like a phone code) along with your password",
            "It speeds up your login time"
        ],
        answer: 2,
        explanation: "2FA ensures that even if someone steals or guesses your password, they still cannot access your account without the second factor (e.g., OTP, Authenticator App)."
    },
    {
        question: "If a caller claiming to be from your bank asks for your OTP to avoid account block, what should you do?",
        options: [
            "Share the OTP immediately to prevent blockage",
            "Ask them to confirm your account number, then share the OTP",
            "Hang up immediately. Banks never ask for your OTP or sensitive PINs over the phone",
            "Share the OTP but change your password later"
        ],
        answer: 2,
        explanation: "Legitimate organizations, especially banks, will NEVER ask for passwords, CVVs, or OTPs over a phone call, text message, or email."
    },
    {
        question: "How does a QR Code scam work?",
        options: [
            "Scanning a QR code drains your phone battery instantly",
            "Scammers trick you into scanning a QR code to 'receive' money, but it actually authorizes a 'send' payment from your UPI account",
            "Scanning a QR code turns off your phone's screen",
            "A QR code copies your contacts list"
        ],
        answer: 1,
        explanation: "UPI QR codes are ONLY scanned to make payments (send money). You do NOT need to scan a QR code or enter your UPI PIN to receive money."
    },
    {
        question: "Which of the following URL prefixes indicates that a website uses data encryption?",
        options: [
            "http://",
            "https://",
            "www.http://",
            "ftp://"
        ],
        answer: 1,
        explanation: "The 's' in 'https://' stands for 'Secure'. It indicates that the connection is encrypted, protecting data transmitted between your browser and the website."
    },
    {
        question: "Which of the following is a warning sign of a fake online shopping website?",
        options: [
            "Unbelievably low prices on luxury items",
            "Poor website layout, grammatical errors, and no customer service details",
            "Only accepting advanced payment methods like UPI transfer or gift cards (no Cash on Delivery or standard secure card payments)",
            "All of the above"
        ],
        answer: 3,
        explanation: "Fraudulent e-commerce sites often lure victims with unrealistically low prices, lack contact details, have errors, and force non-refundable payment modes."
    },
    {
        question: "A friend messages you on social media asking for urgent money because of an emergency. What is your first step?",
        options: [
            "Send the money immediately to help them",
            "Call your friend directly on their known phone number to verify if it was actually them who sent the message",
            "Block the friend's account immediately",
            "Ignore the message completely"
        ],
        answer: 1,
        explanation: "Social media profiles are frequently hacked or cloned. Always call the person via standard phone network to verify the emergency before transferring any funds."
    },
    {
        question: "When is it safe to log in to bank accounts or enter credit card details on public Wi-Fi?",
        options: [
            "Anytime, as long as you are using a famous browser",
            "Only when using a secured VPN (Virtual Private Network), otherwise it is highly unsafe",
            "Always, public Wi-Fi is protected by the government",
            "If the Wi-Fi doesn't require a password, it is safe"
        ],
        answer: 1,
        explanation: "Public Wi-Fi networks can be intercepted by cybercriminals (Man-in-the-Middle attacks). Avoid financial transactions on public Wi-Fi, or use a reliable VPN to encrypt your session."
    },
    {
        question: "What is the official national portal of India to report cyber crimes?",
        options: [
            "www.police.com",
            "www.cybercrime.gov.in",
            "www.onlinecomplaint.org",
            "www.indiancyberprotection.in"
        ],
        answer: 1,
        explanation: "www.cybercrime.gov.in is the official National Cyber Crime Reporting Portal initiative by the Ministry of Home Affairs, Government of India."
    }
];

let currentQuestionIndex = 0;
let score = 0;
let answered = false;

// DOM Elements
const qNumEl = document.getElementById("question-number");
const qTextEl = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const explanationEl = document.getElementById("explanation-box");
const explanationTextEl = document.getElementById("explanation-text");
const nextBtn = document.getElementById("next-btn");
const progressFill = document.getElementById("progress-fill");
const quizBody = document.getElementById("quiz-body");
const resultBody = document.getElementById("result-body");
const scoreTextEl = document.getElementById("score-text");
const scorePercentageEl = document.getElementById("score-percentage");
const adviceBannerEl = document.getElementById("advice-banner");
const retryBtn = document.getElementById("retry-btn");

function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    answered = false;
    
    if (quizBody && resultBody) {
        quizBody.style.display = "block";
        resultBody.style.display = "none";
    }
    
    showQuestion();
}

function showQuestion() {
    answered = false;
    if (explanationEl) explanationEl.style.display = "none";
    if (nextBtn) {
        nextBtn.style.display = "none";
        nextBtn.innerText = "Next Question";
    }
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    // Update progress bar
    const progressPercent = ((currentQuestionIndex) / quizQuestions.length) * 100;
    if (progressFill) progressFill.style.width = `${progressPercent}%`;
    
    // Set text
    if (qNumEl) qNumEl.innerText = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
    if (qTextEl) qTextEl.innerText = currentQuestion.question;
    
    // Generate Options
    if (optionsContainer) {
        optionsContainer.innerHTML = "";
        currentQuestion.options.forEach((optionText, index) => {
            const button = document.createElement("button");
            button.classList.add("quiz-option");
            button.innerText = optionText;
            button.addEventListener("click", () => selectOption(index, button));
            optionsContainer.appendChild(button);
        });
    }
}

function selectOption(selectedIndex, selectedButton) {
    if (answered) return; // Prevent clicking multiple options
    
    answered = true;
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const optionButtons = optionsContainer.querySelectorAll(".quiz-option");
    
    // Disable all options
    optionButtons.forEach(btn => btn.setAttribute("disabled", "true"));
    
    if (selectedIndex === currentQuestion.answer) {
        // Correct Answer
        selectedButton.classList.add("correct");
        score++;
    } else {
        // Incorrect Answer
        selectedButton.classList.add("incorrect");
        // Highlight correct answer
        optionButtons[currentQuestion.answer].classList.add("correct");
    }
    
    // Show Explanation
    if (explanationEl && explanationTextEl) {
        explanationTextEl.innerText = currentQuestion.explanation;
        explanationEl.style.display = "block";
    }
    
    // Show Next Button
    if (nextBtn) {
        nextBtn.style.display = "inline-block";
        if (currentQuestionIndex === quizQuestions.length - 1) {
            nextBtn.innerText = "See Results";
        }
    }
}

function showResults() {
    if (quizBody && resultBody) {
        quizBody.style.display = "none";
        resultBody.style.display = "block";
    }
    
    if (progressFill) progressFill.style.width = "100%";
    
    const percentage = Math.round((score / quizQuestions.length) * 100);
    
    if (scoreTextEl) scoreTextEl.innerText = `You scored ${score} out of ${quizQuestions.length} questions.`;
    if (scorePercentageEl) scorePercentageEl.innerText = `${percentage}%`;
    
    // Customized Advice Banner based on score
    if (adviceBannerEl) {
        if (percentage >= 80) {
            adviceBannerEl.className = "alert alert-success";
            adviceBannerEl.innerHTML = `<strong>Excellent Job!</strong> You have highly advanced cyber crime safety knowledge. Keep practicing these safe habits and help educate others!`;
        } else if (percentage >= 50) {
            adviceBannerEl.className = "alert alert-warning";
            adviceBannerEl.innerHTML = `<strong>Good Try!</strong> You have basic awareness, but there is room for improvement. Review our Safety Tips and learn how to identify sophisticated scams.`;
        } else {
            adviceBannerEl.className = "alert alert-danger";
            adviceBannerEl.innerHTML = `<strong>Attention Needed!</strong> Your safety score is low. You could be highly vulnerable to online scams. Please read our Cyber Safety Tips carefully to protect yourself online.`;
        }
    }
}

// Event Listeners
if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            showQuestion();
        } else {
            showResults();
        }
    });
}

if (retryBtn) {
    retryBtn.addEventListener("click", initQuiz);
}

// Auto init if page is quiz
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("quiz-body")) {
        initQuiz();
    }
});
