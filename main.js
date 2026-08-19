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
    
    // Gallery Data
    const galleryData = [
        {
            "id": 1,
            "title": "Bodas & 15 Años",
            "media": [
                "fotos/bodas/wedding.png",
                "assets/boda_3.jpg",
                "fotos/bodas/video_boda.mp4"
            ],
            "description": "El día más feliz de tu vida, musicalizado a la perfección."
        },
        {
            "id": 2,
            "title": "Gala Corporativa",
            "media": [
                "fotos/corporativo/corp.png",
                "assets/corp_3.jpg",
                "fotos/corporativo/video_corp.mp4"
            ],
            "description": "Elegancia y prestigio para el evento de tu empresa."
        },
        {
            "id": 3,
            "title": "Bares y Clubes",
            "media": [
                "fotos/bares/bar1.jpg",
                "assets/bar_2.jpg",
                "assets/bar_3.jpg"
            ],
            "description": "DJ Cool reventando la pista con la mejor energía Crossover."
        },
        {
            "id": 4,
            "title": "Bautizos y Eventos Infantiles",
            "media": [
                "assets/infantil-promo.jpg",
                "assets/bautizo_2.jpg",
                "assets/bautizo_3.jpg"
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
                <div class="paquete-card reveal active" style="transition-delay: ${delay}s">
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
            
            // Generate multiple images for slideshow
            let imgHtml = '';
            if (artista.imagenes && artista.imagenes.length > 0) {
                artista.imagenes.forEach((img, idx) => {
                    const activeClass = idx === 0 ? 'active' : '';
                    imgHtml += `<img src="${img}" alt="${artista.nombre}" class="artista-img slide ${activeClass}">`;
                });
            } else if (artista.imagen) {
                // Fallback for old data structure
                imgHtml = `<img src="${artista.imagen}" alt="${artista.nombre}" class="artista-img slide active">`;
            }

            const artistaHtml = `
                <div class="artista-card reveal active ${delayClass}">
                    <div class="artista-img-wrapper slideshow-container-artist">
                        ${imgHtml}
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

        // Setup Slideshow logic for each artist item
        document.querySelectorAll('.slideshow-container-artist').forEach(item => {
            const slides = item.querySelectorAll('.slide');
            let currentSlide = 0;
            
            if (slides.length > 1) {
                setInterval(() => {
                    slides[currentSlide].classList.remove('active');
                    currentSlide = (currentSlide + 1) % slides.length;
                    slides[currentSlide].classList.add('active');
                }, 3500); // slightly different timing from gallery
            }
        });
    }

    // --- Load Testimonios Data ---
    const testimoniosTrack = document.getElementById('testimonios-track');
    if (testimoniosTrack && typeof testimoniosData !== 'undefined') {
        testimoniosData.forEach(t => {
            const starsHtml = '<i class="fas fa-star"></i>'.repeat(t.estrellas);
            const html = `
                <div class="testimonio-card">
                    <div class="stars">${starsHtml}</div>
                    <p class="testimonio-text">"${t.comentario}"</p>
                    <div class="testimonio-author">${t.nombre}</div>
                    <div class="testimonio-meta">
                        <span><i class="fas fa-music" style="color: var(--primary-color);"></i> ${t.servicio}</span>
                        <span>${t.fecha}</span>
                    </div>
                </div>
            `;
            testimoniosTrack.innerHTML += html;
        });

        // Simple carousel sliding logic
        let currentScroll = 0;
        const cardWidth = 380; // 350px card + 30px gap
        setInterval(() => {
            // Check if we reached the end
            if (testimoniosTrack.scrollWidth - testimoniosTrack.clientWidth <= currentScroll) {
                currentScroll = 0;
            } else {
                currentScroll += cardWidth;
            }
            testimoniosTrack.style.transform = `translateX(-${currentScroll}px)`;
        }, 3000);
    }

    // --- FAQ Accordion ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            // Close others
            faqQuestions.forEach(q => {
                if (q !== btn) q.classList.remove('active');
            });
            // Toggle current
            btn.classList.toggle('active');
        });
    });

    // --- Review Modal Logic ---
    window.openReviewModal = function() {
        document.getElementById('review-modal').classList.add('show');
    };

    window.closeReviewModal = function() {
        document.getElementById('review-modal').classList.remove('show');
    };

    window.submitReview = function() {
        const nombre = document.getElementById('rm-nombre').value;
        const estrellas = document.getElementById('rm-estrellas').value;
        const comentario = document.getElementById('rm-comentario').value;

        if(!nombre || !comentario) {
            alert('Por favor, ingresa tu nombre y un comentario.');
            return;
        }

        const estrellasTexto = '⭐'.repeat(estrellas);
        const mensaje = `Hola! Quiero dejar mi reseña sobre el servicio:%0A%0A*Nombre:* ${nombre}%0A*Calificación:* ${estrellasTexto} (${estrellas}/5)%0A*Comentario:* "${comentario}"%0A%0A¡Muchas gracias!`;
        const url = `https://api.whatsapp.com/send?phone=573202459032&text=${mensaje}`;
        
        window.open(url, '_blank');
        closeReviewModal();
        
        // Reset form
        document.getElementById('rm-nombre').value = '';
        document.getElementById('rm-estrellas').value = '5';
        document.getElementById('rm-comentario').value = '';
    };

    window.addEventListener('click', function(event) {
        const reviewModal = document.getElementById('review-modal');
        const flashModal = document.getElementById('flash-modal');
        if (event.target === reviewModal) {
            closeReviewModal();
        }
        if (event.target === flashModal) {
            closeFlashModal();
        }
    });

    // --- Visit Counter Logic ---
    const visitCountEl = document.getElementById('visit-count');
    if(visitCountEl) {
        const baseDate = new Date('2024-01-01').getTime();
        const now = new Date().getTime();
        const diffDays = Math.floor((now - baseDate) / (1000 * 60 * 60 * 24));
        
        let storedVisits = localStorage.getItem('site_visits');
        let currentVisits = 1000 + (diffDays * 7); 
        
        if(storedVisits) {
            currentVisits = parseInt(storedVisits) + Math.floor(Math.random() * 3) + 1;
        }
        
        localStorage.setItem('site_visits', currentVisits);
        visitCountEl.innerText = currentVisits.toLocaleString('es-CO');
    }

    // --- FOMO Notification Logic ---
    const fomoMessages = [
        "Carlos M. acaba de reservar el Plan Prestige",
        "Una nueva fecha para el Plan Elegance acaba de ser apartada",
        "Bodas & 15 Años: nueva celebración agendada para diciembre",
        "Una familia de Bogotá acaba de reservar DJ Cool para su evento",
        "DJ Ice acaba de ser contratado para una celebración este sábado",
        "Una nueva fecha de noviembre acaba de quedar apartada",
        "El Plan Prestige acaba de recibir una nueva reserva",
        "Una pareja de Bogotá está cotizando un paquete para su boda",
        "Nueva solicitud recibida para 15 años en Bogotá",
        "Una fecha de diciembre acaba de entrar en proceso de reserva",
        "Nueva contratación: DJ Cool + paquete de sonido para evento privado",
        "Una celebración de 15 años acaba de reservar uno de nuestros paquetes premium",
        "Nueva reserva del Plan Prestige para una celebración especial",
        "Una familia acaba de elegir el Plan Elegance para su evento",
        "Nueva consulta recibida para contratación de DJ + artista",
        "Una fecha disponible para noviembre acaba de recibir una solicitud de reserva",
        "Varias personas están consultando disponibilidad para diciembre",
        "Nueva cotización solicitada para DJ Ice + producción musical",
        "Otra celebración se suma a nuestra agenda: fecha reservada para diciembre",
        "Nueva solicitud de contratación para DJ + artista en Bogotá",
        "Carlos M. acaba de reservar el Plan Prestige",
        "Bodas & 15 Años agendado para Diciembre",
        "Familia Gómez reservó DJ Cool para este sábado",
        "Última fecha de Noviembre apartada hace 1 hora",
        "Alguien de Bogotá está cotizando un paquete"
    ];
    
    const fomoNotification = document.getElementById('fomo-notification');
    const fomoMessageEl = document.getElementById('fomo-message');
    
    if(fomoNotification && fomoMessageEl) {
        // [CONFIGURACIÓN] Tiempo de espera para las Notificaciones FOMO
        // 45000 = 45 segundos de espera entre cada notificación. Puedes cambiar este número.
        setInterval(() => {
            const randomMsg = fomoMessages[Math.floor(Math.random() * fomoMessages.length)];
            fomoMessageEl.innerText = randomMsg;
            fomoNotification.classList.add('show');
            
            // 5000 = 5 segundos que dura la notificación visible en pantalla
            setTimeout(() => {
                fomoNotification.classList.remove('show');
            }, 5000);
            
        }, 45000); 
    }

    // --- Flash Offer Modal Logic ---
    window.closeFlashModal = function() {
        document.getElementById('flash-modal').classList.remove('show');
        sessionStorage.setItem('flash_offer_seen', 'true');
    };

    const flashModal = document.getElementById('flash-modal');
    if(flashModal && !sessionStorage.getItem('flash_offer_seen')) {
        
        // [CONFIGURACIÓN] Tiempo de espera para el Regalo de 1 Hora Gratis
        // 60000 = 60 segundos (2 minutos) de espera antes de que salte. Puedes cambiar este número.
        setTimeout(() => {
            if(!sessionStorage.getItem('flash_offer_seen')) {
                flashModal.classList.add('show');
            }
        }, 60000); 
        
        // Exit intent para PC (cuando el mouse sale por arriba)
        document.addEventListener('mouseleave', (e) => {
            if(e.clientY <= 0 && !sessionStorage.getItem('flash_offer_seen')) {
                flashModal.classList.add('show');
            }
        });
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
