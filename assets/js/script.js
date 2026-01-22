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

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // If on mobile and menu is open, close it
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }

                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
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
});
