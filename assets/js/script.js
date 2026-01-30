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
            // Only prevent default if it's a hash link on the SAME page
            if (this.pathname === window.location.pathname) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(this.getAttribute('href').indexOf('#'));
                if (targetId === '#' || targetId === '') return;

                const targetElement = document.querySelector(targetId);
                // Only act if target element exists on this page
                if (targetElement) {
                    // Mobile Menu Handling
                    if (mainNav && mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                        if (menuToggle) {
                            const icon = menuToggle.querySelector('i');
                            if (icon) {
                                icon.classList.remove('fa-times');
                                icon.classList.add('fa-bars');
                            }
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

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, {
            threshold: 0.1, // Trigger earlier (10%) to avoid stuck animations
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* -------------------------------------
       Active Section Link Highlighting
    ------------------------------------- */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    if (sections.length > 0 && navLinks.length > 0) {
        const sectionObserverOptions = {
            threshold: 0.2 // Lower threshold for better mobile detection
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active class from all links
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        // Check if link corresponds to current section
                        const href = link.getAttribute('href');
                        if (href && href.includes('#')) {
                            const id = href.substring(href.indexOf('#') + 1);
                            if (id === entry.target.id) {
                                link.classList.add('active');
                            }
                        }
                    });
                }
            });
        }, sectionObserverOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    /* -------------------------------------
       Global Fixed Navigation Logic
    ------------------------------------- */
    const globalNav = document.getElementById('global-nav');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Filter section elements only (exclude other generic sections if any)
    const navSections = Array.from(document.querySelectorAll('section')).filter(sec => sec.id);

    if (globalNav && prevBtn && nextBtn && navSections.length > 0) {
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
            threshold: 0.5 // Trigger when 50% of section is visible
        });

        navSections.forEach(sec => navObserver.observe(sec));

        // Initialize state
        updateNavButtons(0);
    } else if (globalNav) {
        // Hide global nav if no sections found (e.g. on project detail page)
        globalNav.style.display = 'none';
    }

    /* -------------------------------------
       Contact Form Logic (EmailJS)
    ------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('contact-success');
    const errorMsg = document.getElementById('contact-error');
    const resetBtn = document.getElementById('reset-form-btn');

    if (contactForm && successMsg && errorMsg) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // Only add listener if submitBtn exists (it should, but safety first)
        if (submitBtn) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();

                // Resets
                errorMsg.style.display = 'none';

                // Get Values
                const nameInput = document.getElementById('contact-name');
                const emailInput = document.getElementById('contact-email');
                const messageInput = document.getElementById('contact-message');

                if (!nameInput || !emailInput || !messageInput) return;

                const name = nameInput.value.trim();
                const email = emailInput.value.trim();
                const message = messageInput.value.trim();

                if (!name || !email || !message) {
                    alert('Please fill in all fields.');
                    return;
                }

                // UI Loading State
                let originalBtnText = submitBtn.innerHTML;
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
                        if (successMsg.querySelector('p')) successMsg.querySelector('p').innerText = "Thanks! Message sent successfully.";
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
    }

    if (resetBtn && contactForm && successMsg && errorMsg) {
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
    /* -------------------------------------
       Fixed Starry Background Animation
    ------------------------------------- */
    const canvas = document.getElementById('starry-background');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) { // Check if context exists
            let particles = [];

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();

            class Star {
                constructor() {
                    this.init();
                }

                init() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    // Tiny stars (0.5px - 2px)
                    this.size = Math.random() * 1.5 + 0.5;
                    // Very slow drift
                    this.speedX = Math.random() * 0.15 - 0.075;
                    this.speedY = Math.random() * 0.15 - 0.075;

                    // Cool Tones: Blue, Cyan, Purple, White
                    const hues = [210, 200, 260, 0]; // Blue, Cyan, Purple, White (0 with low sat)
                    this.hue = hues[Math.floor(Math.random() * hues.length)];
                    this.saturation = this.hue === 0 ? '0%' : '80%';

                    // Opacity
                    this.baseAlpha = Math.random() * 0.4 + 0.1; // Low opacity
                    this.alpha = this.baseAlpha;

                    // Twinkle
                    this.twinkleSpeed = Math.random() * 0.01 + 0.002;
                    this.twinkleDir = 1;
                }

                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;

                    // Subtle Twinkle
                    this.alpha += this.twinkleSpeed * this.twinkleDir;
                    if (this.alpha > this.baseAlpha + 0.15 || this.alpha > 0.7) {
                        this.twinkleDir = -1;
                    } else if (this.alpha < this.baseAlpha - 0.1 || this.alpha < 0.05) {
                        this.twinkleDir = 1;
                    }

                    // Warp around
                    if (this.x > canvas.width) this.x = 0;
                    if (this.x < 0) this.x = canvas.width;
                    if (this.y > canvas.height) this.y = 0;
                    if (this.y < 0) this.y = canvas.height;
                }

                draw() {
                    ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}, 75%, ${this.alpha})`;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

                    // Soft Glow
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = `hsla(${this.hue}, ${this.saturation}, 75%, 0.5)`;

                    ctx.fill();
                    ctx.shadowBlur = 0; // Reset
                }
            }

            function initStars() {
                particles = [];
                // Count
                const starCount = Math.floor((canvas.width * canvas.height) / 8000);
                for (let i = 0; i < starCount; i++) {
                    particles.push(new Star());
                }
            }

            initStars();

            function animateStars() {
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    p.update();
                    p.draw();
                });
                requestAnimationFrame(animateStars);
            }

            animateStars();
        }
    }
});
