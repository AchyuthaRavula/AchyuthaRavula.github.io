document.addEventListener('DOMContentLoaded', () => {
    
    /* -------------------------------------
       Carousel Functionality
    ------------------------------------- */
    const track = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.prev-btn');
    const nextButton = document.querySelector('.next-btn');
    const slides = Array.from(track.children);
    const dotsNav = document.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);

    let currentSlideIndex = 0;

    // Helper: Determine how many slides are visible based on viewport width
    function getSlidesPerView() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 992) return 2;
        return 3;
    }

    function updateCarousel() {
        const slidesPerView = getSlidesPerView();
        const slideWidth = slides[0].getBoundingClientRect().width;
        
        // Move track
        const amountToMove = (slideWidth + 30) * currentSlideIndex; // 30 is rough gap size, calculation adjustment needed below for precision
        
        // Better approach: calculate percentage translation
        // 100% / slidesPerView = width % of one slide.
        // we move by (100% / slidesPerView) * currentSlideIndex
        
        const movePercentage = (100 / slidesPerView) * currentSlideIndex;
        track.style.transform = `translateX(-${movePercentage}%)`;

        // Update Dots
        dots.forEach(d => d.classList.remove('current-slide'));
        // Map current index to dot. Logic depends on how many groupings we have.
        // For simplicity, let's highlight the dot corresponding to the leftmost visible slide
        if(dots[currentSlideIndex]) {
            dots[currentSlideIndex].classList.add('current-slide');
        }

        // Hide arrows at boundaries
        const totalSlides = slides.length;
        if (currentSlideIndex === 0) {
            prevButton.style.opacity = '0.5';
            prevButton.style.cursor = 'default';
        } else {
            prevButton.style.opacity = '1';
            prevButton.style.cursor = 'pointer';
        }

        if (currentSlideIndex >= totalSlides - slidesPerView) {
            nextButton.style.opacity = '0.5';
            nextButton.style.cursor = 'default';
        } else {
            nextButton.style.opacity = '1';
            nextButton.style.cursor = 'pointer';
        }
    }

    nextButton.addEventListener('click', () => {
        const slidesPerView = getSlidesPerView();
        if (currentSlideIndex < slides.length - slidesPerView) {
            currentSlideIndex++;
            updateCarousel();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateCarousel();
        }
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
             // Handle bounds if user clicks last dot but fewer slides fit
             const slidesPerView = getSlidesPerView();
             if (index > slides.length - slidesPerView) {
                 currentSlideIndex = slides.length - slidesPerView;
             } else {
                 currentSlideIndex = index;
             }
             updateCarousel();
        });
    });

    // Recalculate on resize
    window.addEventListener('resize', updateCarousel);
    
    // Initial call
    updateCarousel();


    /* -------------------------------------
       Mobile Navigation
    ------------------------------------- */
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    mobileToggle.addEventListener('click', () => {
        if (mainNav.style.display === 'block') {
            mainNav.style.display = 'none';
        } else {
            mainNav.style.display = 'block';
            mainNav.style.position = 'absolute';
            mainNav.style.top = '70px';
            mainNav.style.left = '0';
            mainNav.style.width = '100%';
            mainNav.style.background = '#fff';
            mainNav.style.padding = '20px';
            mainNav.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
            
            // Stack links vertically
            const ul = mainNav.querySelector('ul');
            ul.style.flexDirection = 'column';
            ul.style.alignItems = 'center';
            ul.style.gap = '20px';
        }
    });

    // Close menu when link is clicked
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mainNav.style.display = 'none';
            }
        });
    });

});
