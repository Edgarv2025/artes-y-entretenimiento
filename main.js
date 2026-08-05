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
                "assets/infantil-promo.jpg"
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

    // --- Load Paquetes Data ---
    const paquetesContainer = document.getElementById('paquetes-container');
    if (paquetesContainer && typeof paquetesData !== 'undefined') {
        paquetesData.forEach((paquete, index) => {
            const delay = index * 0.2;
            const currentUrl = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(`Mira este paquete para tu evento: ${paquete.titulo} - ${paquete.precio}`);
            const whatsappUrl = `https://api.whatsapp.com/send?phone=573202459032&text=${text}%20${currentUrl}`;

            const itemsHtml = paquete.elementos.map(item => `<li><i class="fas fa-check" style="color: var(--primary-color);"></i> ${item}</li>`).join('');
            
            const paqueteHtml = `
                <div class="paquete-card reveal" style="transition-delay: ${delay}s">
                    <div class="paquete-img-wrapper">
                        <img src="${paquete.imagen}" alt="${paquete.titulo}" class="paquete-img">
                    </div>
                    <div class="paquete-content">
                        <h3>${paquete.titulo}</h3>
                        <div class="paquete-precio">${paquete.precio}</div>
                        <ul class="paquete-items">
                            ${itemsHtml}
                        </ul>
                        <a href="${whatsappUrl}" target="_blank" class="btn-primary" style="width: 100%; text-align: center; margin-top: 20px;">Lo quiero <i class="fab fa-whatsapp"></i></a>
                    </div>
                </div>
            `;
            paquetesContainer.innerHTML += paqueteHtml;
        });

        setTimeout(() => {
            document.querySelectorAll('#paquetes-container .reveal').forEach((el) => {
                revealOnScroll.observe(el);
            });
        }, 100);
    }

    // --- Load Artistas Data ---
    const artistasContainer = document.getElementById('artistas-container');
    if (artistasContainer && typeof artistasData !== 'undefined') {
        artistasData.forEach((artista, index) => {
            const delayClass = index > 0 ? `delay-${index}` : '';
            const featuresHtml = artista.caracteristicas.map(car => `<li><i class="fas ${car.icono}"></i> ${car.texto}</li>`).join('');
            
            const artistaHtml = `
                <div class="artista-card reveal ${delayClass}">
                    <div class="artista-img-wrapper">
                        <div class="artista-img" style="background: url('${artista.imagen}') center/contain no-repeat;"></div>
                        <div class="artista-name-tag ${artista.etiquetaClase}">${artista.nombre}</div>
                    </div>
                    <div class="artista-content">
                        <h3>${artista.subtitulo}</h3>
                        <p>${artista.descripcion}</p>
                        <ul class="artista-features">
                            ${featuresHtml}
                        </ul>
                    </div>
                </div>
            `;
            artistasContainer.innerHTML += artistaHtml;
        });

        setTimeout(() => {
            document.querySelectorAll('#artistas-container .reveal').forEach((el) => {
                revealOnScroll.observe(el);
            });
        }, 100);
    }

    // --- tsParticles Background ---
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("tsparticles", {
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            particles: {
                color: { value: "#d4af37" },
                links: { color: "#d4af37", distance: 150, enable: true, opacity: 0.15, width: 1 },
                move: { enable: true, speed: 0.8, direction: "none", random: true, straight: false, outModes: { default: "bounce" } },
                number: { density: { enable: true, area: 1000 }, value: 50 },
                opacity: { value: 0.4 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 2.5 } }
            },
            detectRetina: true
        });
    }

});
