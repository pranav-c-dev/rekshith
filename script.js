// script.js

document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Change icon
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    const links = document.querySelectorAll('.nav-links li a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact Form Submission (Basic client-side validation)
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;

            // Simple validation
            if (name && email && phone && message) {
                // Here you would typically send the data to a server
                // For now, we just show a success message

                // Change submit button text
                const btn = contactForm.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;

                btn.innerHTML = 'Sent Successfully! <i class="fa-solid fa-check"></i>';
                btn.style.backgroundColor = '#25d366'; // WhatsApp green for success

                // Reset form
                contactForm.reset();

                // Revert button text after 3 seconds
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = ''; // Restore original color via CSS
                }, 3000);
            } else {
                alert('Please fill out all required fields.');
            }
        });
    }

    // Add scroll animation elements check
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation basic CSS
    const animatedElements = document.querySelectorAll('.service-card, .about-grid > div, .feature-list li');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // --- Feedback & Testimonials Logic ---
    const stars = document.querySelectorAll('#starRating i');
    const ratingInput = document.getElementById('fb-rating');
    const leaveFeedbackForm = document.getElementById('leaveFeedbackForm');
    const feedbackContainer = document.getElementById('feedbackContainer');

    // Interactive Star Rating for the form
    if (stars.length > 0) {
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.getAttribute('data-rating'));
                ratingInput.value = rating;

                stars.forEach(s => {
                    if (parseInt(s.getAttribute('data-rating')) <= rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
    }

    // Render a single feedback card
    const renderFeedback = (fb) => {
        const starsHtml = Array(5).fill(0).map((_, i) => {
            return `<i class="fa-solid fa-star" ${i >= fb.rating ? 'style="color:#ddd"' : ''}></i>`;
        }).join('');

        const fbHtml = `
            <div class="feedback-card" style="opacity: 0; transform: translateY(20px); animation: fadeInUp 0.6s forwards;">
                <div class="stars">${starsHtml}</div>
                <p class="review-text">"${fb.message}"</p>
                <div class="reviewer">
                    <div class="r-avatar"><i class="fa-solid fa-user"></i></div>
                    <div class="r-info">
                        <h4>${fb.name}</h4>
                        <span>${fb.tour}</span>
                    </div>
                </div>
            </div>
        `;
        feedbackContainer.insertAdjacentHTML('beforeend', fbHtml); // Append dynamically to end
    };

    // Load feedbacks from local storage
    const loadFeedbacks = () => {
        const storedFeedbacks = JSON.parse(localStorage.getItem('rakshith_feedbacks')) || [];
        if (storedFeedbacks.length > 0 && feedbackContainer) {
            storedFeedbacks.forEach(fb => {
                renderFeedback(fb);
            });
        }
    };

    if (leaveFeedbackForm) {
        // Add a simple animation class via JS
        if (!document.getElementById('feedback-anim')) {
            const style = document.createElement('style');
            style.id = 'feedback-anim';
            style.innerHTML = `@keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }`;
            document.head.appendChild(style);
        }

        loadFeedbacks();

        leaveFeedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('fb-name').value;
            const tour = document.getElementById('fb-tour').value;
            const rating = parseInt(ratingInput.value);
            const message = document.getElementById('fb-message').value;

            if (name && tour && message) {
                const newFeedback = { name, tour, rating, message, date: new Date().toISOString() };

                // Save to localStorage
                const storedFeedbacks = JSON.parse(localStorage.getItem('rakshith_feedbacks')) || [];
                storedFeedbacks.push(newFeedback);
                localStorage.setItem('rakshith_feedbacks', JSON.stringify(storedFeedbacks));

                // Render it instantly
                renderFeedback(newFeedback);

                // Success styling
                const btn = leaveFeedbackForm.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                btn.innerHTML = 'Review Posted! <i class="fa-solid fa-check"></i>';
                btn.style.backgroundColor = '#25d366';

                leaveFeedbackForm.reset();
                stars.forEach(star => star.classList.add('active')); // Reset to 5 stars visually
                ratingInput.value = 5;

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                }, 3000);
            }
        });
    }
});
