document.addEventListener('DOMContentLoaded', function () {
    // View More Button Logic
    const viewMoreBtn = document.getElementById('view-more-btn');
    const hiddenContent = document.querySelector('.timeline-hidden-content');

    if (viewMoreBtn && hiddenContent) {
        viewMoreBtn.addEventListener('click', function (e) {
            e.preventDefault();

            if (hiddenContent.style.display === 'none' || hiddenContent.style.display === '') {
                hiddenContent.style.display = 'block';
                viewMoreBtn.innerHTML = 'View Less <i class="fas fa-chevron-up"></i>';
            } else {
                hiddenContent.style.display = 'none';
                viewMoreBtn.innerHTML = 'View More <i class="fas fa-chevron-down"></i>';
            }
        });
    }

    // Mobile Menu Toggle Logic
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            mainNav.classList.toggle('active');

            // Optional: Toggle icon between bars and times (X)
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (mainNav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // Smooth scrolling & Section Transitions
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Mobile Menu Handling
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }

                // Apply Transition Effect
                const allSections = document.querySelectorAll('section');
                allSections.forEach(sec => {
                    if (sec !== targetElement) {
                        sec.classList.add('section-dimmed');
                    }
                });

                // Scroll
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Reset after scroll finishes (approx 800ms)
                setTimeout(() => {
                    allSections.forEach(sec => sec.classList.remove('section-dimmed'));
                }, 800);
            }
        });
    });

    // Force Download Logic for Resume
    document.querySelectorAll('.download-resume').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            // Check if it is a valid file request
            if (!url) return;

            const filename = url.split('/').pop();

            // Visual feedback (optional)
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';

            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    const blobUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = blobUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(blobUrl);
                    document.body.removeChild(a);

                    // Reset text
                    this.innerHTML = originalText;
                })
                .catch(err => {
                    console.error('Download failed:', err);
                    this.innerHTML = originalText;
                    // Fallback to default behavior if fetch fails
                    window.location.href = url;
                });
        });
    });

    /* -------------------------------------
       Scroll Reveal Logic (IntersectionObserver)
    ------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* -------------------------------------
       Active Section Link Highlighting
    ------------------------------------- */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    const sectionObserverOptions = {
        threshold: 0.3 // Trigger when 30% of section is visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    // Check if link corresponds to current section
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, sectionObserverOptions);

    /* -------------------------------------
       Global Fixed Navigation Logic
    ------------------------------------- */
    const globalNav = document.getElementById('global-nav');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Filter section elements only (exclude other generic sections if any)
    const navSections = Array.from(document.querySelectorAll('section')).filter(sec => sec.id);

    // Current active section index
    let currentSectionIndex = 0;

    function updateNavButtons(index) {
        currentSectionIndex = index;

        // Previous Button State
        if (index <= 0) {
            prevBtn.style.opacity = '0.5';
            prevBtn.style.pointerEvents = 'none';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.pointerEvents = 'auto';
        }

        // Next Button State
        if (index >= navSections.length - 1) {
            nextBtn.style.opacity = '0.5';
            nextBtn.style.pointerEvents = 'none';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.pointerEvents = 'auto';
        }
    }

    // Nav Click Handlers
    prevBtn.addEventListener('click', () => {
        if (currentSectionIndex > 0) {
            scrollToSection(currentSectionIndex - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentSectionIndex < navSections.length - 1) {
            scrollToSection(currentSectionIndex + 1);
        }
    });

    function scrollToSection(index) {
        const target = navSections[index];
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Observer to track which section is currently centered
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determine index of intersecting section
                const index = navSections.indexOf(entry.target);
                if (index !== -1) {
                    updateNavButtons(index);
                }
            }
        });
    }, {
        threshold: 0.6 // Trigger when 60% of section is visible (centering logic)
    });

    navSections.forEach(sec => navObserver.observe(sec));

    // Initialize state
    updateNavButtons(0);

    /* -------------------------------------
       Restore Top Nav Highlighting
    ------------------------------------- */
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    /* -------------------------------------
       Contact Form Logic (Mailto Fallback)
    ------------------------------------- */
    /* -------------------------------------
       Contact Form Logic (EmailJS)
    ------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('contact-success');
    const errorMsg = document.getElementById('contact-error');
    const resetBtn = document.getElementById('reset-form-btn');
    const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Resets
            errorMsg.style.display = 'none';

            // Get Values
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            // UI Loading State
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Prepare Parameters (Match your EmailJS template variable names)
            const templateParams = {
                from_name: name,
                from_email: email,
                message: message,
                to_name: "Achyutha Ravula",
                to_email: "achyutharavula21@gmail.com" // Explicitly sending this in case template expects it
            };

            // REPLACE THESE IDS WITH YOUR ACTUAL EMAILJS SERVICE/TEMPLATE IDS
            const serviceID = "service_6bdzmae";
            const adminTemplateID = "template_3isqahm";   // Notifies You
            const autoReplyTemplateID = "template_91f90yd"; // Notifies User

            // 1. Send Notification to Admin (You)
            emailjs.send(serviceID, adminTemplateID, templateParams)
                .then(function () {
                    console.log("Admin notification sent successfully");

                    // 2. Send Auto-Reply to User (Non-blocking)
                    emailjs.send(serviceID, autoReplyTemplateID, templateParams)
                        .catch(err => console.warn("Auto-reply failed (non-critical):", err));

                    // Success UI (We show success immediately if Admin email works)
                    contactForm.style.display = 'none';
                    successMsg.style.display = 'block';
                    successMsg.querySelector('p').innerText = "Thanks! Message sent successfully.";
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                })
                .catch(function (error) {
                    // Critical Error: Admin notification failed
                    console.error('EmailJS Admin Notification Failed:', error);
                    errorMsg.style.display = 'block';

                    errorMsg.innerHTML = `
                        <p><i class="fas fa-exclamation-circle"></i> Error: ${error.text || "Failed to send"}.</p>
                        <p class="text-muted small" style="margin-bottom: 10px;">(Problem with Template ID: ${adminTemplateID})</p>
                        <button id="fallback-mailto-btn" class="btn btn-secondary btn-sm">
                            <i class="fas fa-envelope"></i> Send via Email App
                        </button>
                    `;

                    // Add listener to the new button
                    setTimeout(() => {
                        const fallbackBtn = document.getElementById('fallback-mailto-btn');
                        if (fallbackBtn) {
                            fallbackBtn.addEventListener('click', function () {
                                const subject = `Portfolio Contact from ${name}`;
                                const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
                                window.location.href = `mailto:achyutharavula21@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                            });
                        }
                    }, 0);

                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            contactForm.reset();
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';
            contactForm.style.display = 'block';
        });
    }
    /* -------------------------------------
       Hero Image 3D Tilt Effect
    ------------------------------------- */
    const heroContainer = document.querySelector('.hero-container');
    const avatarWrapper = document.querySelector('.hero-avatar');

    if (heroContainer && avatarWrapper) {
        heroContainer.addEventListener('mousemove', (e) => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) return;

            const rect = avatarWrapper.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            // Invert logic for tilt:
            // Move mouse RIGHT -> rotateY positive
            // Move mouse DOWN -> rotateX negative
            const rotateX = -mouseY / 10;
            const rotateY = mouseX / 10;

            avatarWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        heroContainer.addEventListener('mouseleave', () => {
            avatarWrapper.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            avatarWrapper.style.transition = 'transform 0.5s ease-out';
        });

        heroContainer.addEventListener('mouseenter', () => {
            avatarWrapper.style.transition = 'transform 0.1s ease-out';
        });
    }
});
