document.addEventListener('DOMContentLoaded', () => {
    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled'); 
        }
    });

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });

    // --- Intersection Observer for Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- Load Gallery Data ---
    const galleryContainer = document.getElementById('gallery-container');
    
    // Gallery Data con rutas 100% locales en subcarpetas
    const galleryData = [
        {
            "id": 1,
            "title": "Bodas & 15 Años",
            "media": [
                "fotos/bodas/wedding.png",
                "fotos/bodas/video_boda.mp4"
            ],
            "description": "El día más feliz de tu vida, musicalizado a la perfección."
        },
        {
            "id": 2,
            "title": "Gala Corporativa",
            "media": [
                "fotos/corporativo/corp.png",
                "fotos/corporativo/video_corp.mp4"
            ],
            "description": "Elegancia y prestigio para el evento de tu empresa."
        },
        {
            "id": 3,
            "title": "Bares y Clubes",
            "media": [
                "fotos/bares/bar1.jpg"
            ],
            "description": "DJ Cool reventando la pista con la mejor energía Crossover."
        },
        {
            "id": 4,
            "title": "Bautizos y Eventos Infantiles",
            "media": [
                "fotos/infantiles/infantil1.jpg"
            ],
            "description": "Emociones íntimas con un montaje diseñado para la familia."
        }
    ];

    function createGalleryItem(item) {
        const currentUrl = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Mira este increíble evento de Artes y Entretenimiento: ${item.title}`);
        
        const whatsappUrl = `https://api.whatsapp.com/send?phone=573202459032&text=${text}%20${currentUrl}`;
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${currentUrl}`;
    
        // Create media HTML for slideshow (mix of images and videos)
        let mediaHtml = '';
        item.media.forEach((mediaUrl, idx) => {
            let activeClass = idx === 0 ? 'active' : '';
            if (mediaUrl.endsWith('.mp4')) {
                mediaHtml += `<video src="${mediaUrl}" autoplay muted loop playsinline class="gallery-img slide ${activeClass}" style="pointer-events: none;"></video>`;
            } else {
                mediaHtml += `<img src="${mediaUrl}" alt="${item.title}" class="gallery-img slide ${activeClass}">`;
            }
        });
    
        // Added reveal class to gallery items so they pop up on scroll
        return `
            <div class="gallery-item reveal">
                <div class="slideshow-container">
                    ${mediaHtml}
                </div>
                <div class="gallery-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <div class="share-buttons">
                        <a href="${whatsappUrl}" target="_blank" class="share-btn" title="Compartir en WhatsApp"><i class="fab fa-whatsapp"></i></a>
                        <a href="${facebookUrl}" target="_blank" class="share-btn" title="Compartir en Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="${twitterUrl}" target="_blank" class="share-btn" title="Compartir en Twitter"><i class="fab fa-twitter"></i></a>
                    </div>
                </div>
            </div>
        `;
    }

    // Render gallery
    galleryData.forEach((item) => {
        const itemHtml = createGalleryItem(item);
        galleryContainer.innerHTML += itemHtml;
    });
    
    // Observe new gallery items for scroll animation
    setTimeout(() => {
        document.querySelectorAll('#gallery-container .reveal').forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`;
            revealOnScroll.observe(el);
        });
    }, 100);

    // Setup Slideshow logic for each gallery item
    document.querySelectorAll('.gallery-item').forEach(item => {
        const slides = item.querySelectorAll('.slide');
        let currentSlide = 0;
        
        if (slides.length > 1) {
            // Rotate images every 4 seconds
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 4000);
        }
    });

});
