// General Interactions and Animation Enhancements
document.addEventListener("DOMContentLoaded", () => {
    // 1. Highlight Active Navigation Link Based on URL
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (currentPath === href || (currentPath === "/" && href === "/")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // 2. Client-side Form Validation and Interactive States for Report Form
    const reportForm = document.getElementById("reportForm");
    if (reportForm) {
        reportForm.addEventListener("submit", (e) => {
            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const messageInput = document.getElementById("message");
            const crimeSelect = document.getElementById("crime_type");
            
            let isValid = true;
            
            // Basic helper to show error style
            const markInvalid = (element, message) => {
                element.classList.add("is-invalid");
                isValid = false;
            };

            const markValid = (element) => {
                element.classList.remove("is-invalid");
                element.classList.add("is-valid");
            };

            // Reset states
            [nameInput, emailInput, messageInput, crimeSelect].forEach(input => {
                if (input) {
                    input.classList.remove("is-invalid", "is-valid");
                }
            });

            // Name validation
            if (nameInput && nameInput.value.trim().length < 3) {
                markInvalid(nameInput);
            } else if (nameInput) {
                markValid(nameInput);
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput && !emailRegex.test(emailInput.value.trim())) {
                markInvalid(emailInput);
            } else if (emailInput) {
                markValid(emailInput);
            }

            // Crime selection validation
            if (crimeSelect && crimeSelect.value === "") {
                markInvalid(crimeSelect);
            } else if (crimeSelect) {
                markValid(crimeSelect);
            }

            // Message validation
            if (messageInput && messageInput.value.trim().length < 10) {
                markInvalid(messageInput);
            } else if (messageInput) {
                markValid(messageInput);
            }

            if (!isValid) {
                e.preventDefault();
                // Play subtle shake effect if elements support it
                const card = reportForm.closest(".glass-card");
                if (card) {
                    card.style.animation = "shake 0.5s ease-in-out";
                    setTimeout(() => {
                        card.style.animation = "";
                    }, 500);
                }
            }
        });
    }

    // 3. Scroll to Reveal Animations for cards
    const cards = document.querySelectorAll(".glass-card, .list-group-item-custom");
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        cards.forEach(card => {
            card.style.opacity = "0.9";
            card.style.transform = "translateY(15px)";
            card.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out";
            observer.observe(card);
        });
    }
});

// Dynamic Shake Animation in CSS inject style if needed
const style = document.createElement('style');
style.innerHTML = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-6px); }
        40%, 80% { transform: translateX(6px); }
    }
`;
document.head.appendChild(style);
