document.addEventListener('DOMContentLoaded', () => {

    // --- Références aux éléments DOM ---
    const header = document.getElementById('mainHeader');
    const mobileMenuIcon = document.getElementById('mobileMenuIcon');
    const mainNav = document.getElementById('mainNav');
    const burgerIcon = mobileMenuIcon ? mobileMenuIcon.querySelector('.fa-bars') : null;
    const closeIcon = mobileMenuIcon ? mobileMenuIcon.querySelector('.fa-times') : null;
    const contactForm = document.getElementById('contactForm');
    const currentYearSpan = document.getElementById('currentYear');
    const sections = document.querySelectorAll('.section-padding'); // Pour animation

    // --- 1. Header Shadow on Scroll ---
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 2. Mobile Menu Toggle ---
    if (mobileMenuIcon && mainNav && burgerIcon && closeIcon) {
        mobileMenuIcon.addEventListener('click', () => {
            mainNav.classList.toggle('mobile-nav-active');
            // Bascule l'affichage des icônes burger/croix
            const isActive = mainNav.classList.contains('mobile-nav-active');
            burgerIcon.style.display = isActive ? 'none' : 'block';
            closeIcon.style.display = isActive ? 'block' : 'none';
        });
    }

    // --- 3. Smooth Scroll Function (pour liens internes #) ---
    window.smoothScroll = function(target) {
        const element = document.querySelector(target);
        if (element && header) {
            const headerOffset = header.offsetHeight;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        } else if (element) { // Fallback si header non trouvé
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // --- 4. Close Mobile Menu (appelée par onclick sur les liens) ---
    // S'assure que la fonction est globale pour être appelée depuis l'HTML
    window.closeMobileMenu = function() {
         if (mainNav && mainNav.classList.contains('mobile-nav-active') && burgerIcon && closeIcon) {
             mainNav.classList.remove('mobile-nav-active');
             burgerIcon.style.display = 'block';
             closeIcon.style.display = 'none';
         }
    }

    // --- 5. Contact Form Submission (Simulation) ---
    if (contactForm) {
        emailjs.init(EMAILJS_USER_ID); // Utilise la variable sécurisée
    
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Empêche l'envoi classique
    
            emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
            .then(function(response) {
                console.log('Formulaire soumis avec succès !', response.status, response.text);
                alert('Message envoyé avec succès ! Je vous répondrai bientôt.');
                contactForm.reset(); // Vide le formulaire après envoi
            }, function(error) {
                console.error('Erreur lors de l\'envoi du formulaire :', error);
                alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
            });
        });
    }

    // --- 6. Scroll Animations (Fade-in simple) ---
    if (sections.length > 0) {
        const animateOnScroll = () => {
            sections.forEach(section => {
                if (!section.hasAttribute('style')) { // Applique les styles initiaux une seule fois
                   section.style.opacity = '0';
                   section.style.transform = 'translateY(30px)';
                   section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                }
                const sectionTop = section.getBoundingClientRect().top;
                const screenHeight = window.innerHeight;
                // Déclenche quand le haut de la section est à 80% de la hauteur de l'écran
                if (sectionTop < screenHeight * 0.8) {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }
                 // Optionnel: Remettre l'opacité à 0 si on remonte ? (Peut être lourd)
                 /* else if (sectionTop > screenHeight) {
                    section.style.opacity = '0';
                    section.style.transform = 'translateY(30px)';
                 } */
            });
        };

        // Écouteur de scroll pour l'animation
        window.addEventListener('scroll', animateOnScroll);
        // Déclenche une fois au chargement pour les éléments déjà visibles
        animateOnScroll();
    }

    // --- 7. Active Navigation Link Highlighting ---
    if (mainNav) {
        const currentLocation = window.location.pathname.split('/').pop(); // Ex: 'projects.html', 'index.html', ou ''
        const navLinks = mainNav.querySelectorAll('a');

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (!linkHref) return; // Ignore les liens sans href

            const linkPage = linkHref.split('/').pop().split('#')[0]; // Nom du fichier (ex: 'projects.html')
            const linkAnchor = linkHref.includes('#') ? '#' + linkHref.split('#')[1] : null; // Ancre (ex: '#experience')

            link.classList.remove('active'); // Enlève 'active' de tous

            // Cas 1: Page actuelle correspond au lien (ex: sur projects.html et lien vers projects.html)
            if (linkPage !== '' && currentLocation === linkPage && !linkAnchor) {
                 link.classList.add('active');
            }
            // Cas 2: Sur la page d'accueil (index.html ou /) et lien vers l'accueil
            else if ((currentLocation === 'index.html' || currentLocation === '') && (linkPage === 'index.html' || linkHref === 'index.html')) {
                 // Ne pas mettre actif si c'est un lien avec ancre comme "index.html#experience"
                 if (!linkAnchor) {
                    link.classList.add('active');
                 }
            }
            // Cas 3: Sur la page d'accueil et le lien est juste "#" (considéré comme Accueil)
             else if ((currentLocation === 'index.html' || currentLocation === '') && linkHref === '#') {
                  link.classList.add('active');
             }
        });
    }

     // --- 8. Update Footer Year ---
     if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
     }

}); // Fin de l'événement DOMContentLoaded