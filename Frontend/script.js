// CHANGE THIS ONLY WHEN DEPLOYING
const API_BASE_URL = 'http://127.0.0.1:5000';

// --- SETUP ON LOAD ---
window.onload = () => {
    loadProjects();
    setupScrollAnimations();
};

// --- CORE FUNCTION: SCROLL ANIMATIONS ---
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-show');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px" 
    });

    const hiddenElements = document.querySelectorAll('.scroll-hidden');
    hiddenElements.forEach((el) => observer.observe(el));
}


// --- STATIC FUNCTION: DISPLAY PLACEHOLDER PROJECT NAMES ---
function loadProjects() {
    const container = document.getElementById('projects-container');
    
    // An array of placeholder names instead of actual projects
    const placeholderProjects = [
        "Flowstate - Real-Time Communication Platform"
        
    ];
    
    // Map the placeholders to the clean, minimalist card structure
    container.innerHTML = placeholderProjects.map((name, index) => `
        <div class="project-card loaded" style="animation-delay: ${index * 0.1}s; justify-content: center; align-items: center; text-align: center; min-height: 150px;">
            <h3 style="margin: 0; font-size: 1.6rem; color: var(--text-primary);">${name}</h3>
        </div>
    `).join('');
}

// --- FORM FUNCTION: CONTACT HANDLING ---
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const statusText = document.getElementById('form-status');
    const submitBtn = e.target.querySelector('button');
    
    statusText.style.color = "var(--text-secondary)";
    statusText.innerText = "Sending message...";
    submitBtn.innerText = "Sending...";
    submitBtn.style.opacity = "0.7";
    submitBtn.disabled = true;

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            statusText.style.color = "var(--accent-color)"; // <-- This is the fixed line
            statusText.innerText = "✓ Message sent successfully! I will get back to you soon.";
            document.getElementById('contact-form').reset();
        } else {
            throw new Error(result.error || "Server error");
        }
    } catch (error) {
        statusText.style.color = "#ef4444"; 
        statusText.innerText = "✕ Error sending message. Please try again later or email me directly.";
        console.error(error);
    } finally {
        submitBtn.innerText = "Send Message";
        submitBtn.style.opacity = "1";
        submitBtn.disabled = false;
    }
});