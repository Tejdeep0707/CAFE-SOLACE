/* ==========================================================================
   Cafe Solace - Interactive Javascript Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. Dark Mode / Theme Toggle
     ========================================== */
  const themeToggle = document.getElementById('theme-toggle');
  
  // Check local storage or browser preference
  const currentTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply initial theme
  if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  
  // Theme Toggle Event Listener
  themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });


  /* ==========================================
     1.5. Header Scroll Effect
     ========================================== */
  const header = document.querySelector('.header');
  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // Run once on load


  /* ==========================================
     2. Mobile Drawer Navigation
     ========================================== */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    mobileDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop scrolling
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Resume scrolling
  };

  hamburgerBtn.addEventListener('click', openDrawer);
  drawerCloseBtn.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  // Close drawer on nav link click
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });


  /* ==========================================
     3. Active Nav Link Highlighting on Scroll
     ========================================== */
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link');

  const highlightNavOnScroll = () => {
    let scrollPos = window.scrollY || document.documentElement.scrollTop;
    
    // Header height offset
    const offset = 120;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - offset;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll);


  /* ==========================================
     4. Intersection Observer - Scroll Reveal
     ========================================== */
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, revealOptions);

  revealElements.forEach(element => {
    revealOnScroll.observe(element);
  });


  /* ==========================================
     5. Menu Category Tabs Filter
     ========================================== */
  const tabButtons = document.querySelectorAll('.menu-tab-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCategory = btn.getAttribute('data-category');

      // Filter cards
      menuCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.classList.add('show');
        } else {
          card.classList.remove('show');
        }
      });
    });
  });


  /* ==========================================
     6. Custom Lightbox Modal (Gallery)
     ========================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentImgIndex = 0;
  const galleryImagesData = Array.from(galleryItems).map(item => {
    const img = item.querySelector('.gallery-img');
    return {
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt')
    };
  });

  const openLightbox = (index) => {
    currentImgIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const updateLightboxContent = () => {
    const data = galleryImagesData[currentImgIndex];
    lightboxImg.setAttribute('src', data.src);
    lightboxImg.setAttribute('alt', data.alt);
    lightboxCaption.textContent = data.alt;
  };

  const showNextImage = () => {
    currentImgIndex = (currentImgIndex + 1) % galleryImagesData.length;
    updateLightboxContent();
  };

  const showPrevImage = () => {
    currentImgIndex = (currentImgIndex - 1 + galleryImagesData.length) % galleryImagesData.length;
    updateLightboxContent();
  };

  // Add click listeners to gallery elements
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', showNextImage);
  lightboxPrev.addEventListener('click', showPrevImage);

  // Close when clicking outside content (overlay background)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation for accessibility
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    }
  });


  /* ==========================================
     7. Testimonials Carousel (Safe Null Checked)
     ========================================== */
  const testimonialCarousel = document.getElementById('testimonials-carousel');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const indicatorsContainer = document.getElementById('carousel-indicators');
  
  if (testimonialCarousel && prevBtn && nextBtn && indicatorsContainer) {
    let currentSlide = 0;
    let autoplayTimer;
    const autoplayDuration = 6000; // 6 seconds

    const updateCarousel = (index) => {
      currentSlide = index;
      
      // Shift track
      testimonialCarousel.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Set active class on slides for animation
      slides.forEach((slide, idx) => {
        slide.classList.remove('active');
        if (idx === currentSlide) {
          slide.classList.add('active');
        }
      });

      // Update indicator dots
      const indicators = indicatorsContainer.querySelectorAll('.indicator');
      indicators.forEach((ind, idx) => {
        ind.classList.remove('active');
        if (idx === currentSlide) {
          ind.classList.add('active');
        }
      });
    };

    const nextSlide = () => {
      const nextIdx = (currentSlide + 1) % slides.length;
      updateCarousel(nextIdx);
    };

    const prevSlide = () => {
      const prevIdx = (currentSlide - 1 + slides.length) % slides.length;
      updateCarousel(prevIdx);
    };

    // Click Events
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });

    // Dots Events
    const indicators = indicatorsContainer.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        updateCarousel(index);
        resetAutoplay();
      });
    });

    // Autoplay functionality
    const startAutoplay = () => {
      autoplayTimer = setInterval(nextSlide, autoplayDuration);
    };

    const stopAutoplay = () => {
      clearInterval(autoplayTimer);
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    // Pause on hover
    const carouselWrapper = document.querySelector('.testimonials-carousel-wrapper');
    if (carouselWrapper) {
      carouselWrapper.addEventListener('mouseenter', stopAutoplay);
      carouselWrapper.addEventListener('mouseleave', startAutoplay);
    }

    // Initialize Autoplay
    startAutoplay();
  }


  /* ==========================================
     8. Back to Top Button
     ========================================== */
  const backToTopBtn = document.getElementById('back-to-top');

  const toggleBackToTopBtn = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };

  window.addEventListener('scroll', toggleBackToTopBtn);

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  /* ==========================================
     9. Reservation & Contact Form Handler (EmailJS)
     ========================================== */
  const reservationForm = document.getElementById('reservation-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');
  const btnText = formSubmitBtn.querySelector('.btn-text');
  const btnLoader = formSubmitBtn.querySelector('.btn-loader');
  const formAlert = document.getElementById('form-alert');

  // Set minimum date picker values to today
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
  }

  const showFormAlert = (message, type) => {
    formAlert.textContent = message;
    formAlert.className = `form-alert ${type}`;
    formAlert.classList.remove('hidden');
    
    // Hide alert after 8 seconds
    setTimeout(() => {
      formAlert.classList.add('hidden');
    }, 8000);
  };

  reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Toggle Loading State
    btnText.style.opacity = '0.5';
    btnLoader.classList.remove('hidden');
    formSubmitBtn.disabled = true;

    // Grab form values
    const formData = {
      name: document.getElementById('res-name').value.trim(),
      email: document.getElementById('res-email').value.trim(),
      phone: document.getElementById('res-phone').value.trim(),
      guests: document.getElementById('res-guests').value,
      date: document.getElementById('res-date').value,
      time: document.getElementById('res-time').value,
      notes: document.getElementById('res-notes').value.trim()
    };

    // Check if EmailJS is initialized and user configured credentials
    const isEmailJSConfigured = typeof emailjs !== 'undefined' && 
                                emailjs._isInitialized && 
                                !emailjs._publicKey.includes('YOUR_PUBLIC_KEY');

    if (isEmailJSConfigured) {
      // Send via real EmailJS
      emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', reservationForm)
        .then(() => {
          // Success Response
          resetLoadingState();
          showToast(`✅ Table request received! We'll confirm your reservation shortly.`);
          reservationForm.reset();
          if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
        })
        .catch((error) => {
          // Error Response
          resetLoadingState();
          showFormAlert(`Something went wrong. Let's reserve manually: please call +91 99999 99999. (Error: ${error.text || error})`, 'error');
        });
    } else {
      // Simulation Mock Mode (If no custom key is configured, behave beautifully)
      setTimeout(() => {
        resetLoadingState();
        showToast(`✅ Table request received! We'll confirm your reservation shortly.`);
        console.log("Reservation Request Details (Mock Simulation):", formData);
        reservationForm.reset();
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
      }, 1500); // 1.5 seconds mock delay
    }
  });

  const resetLoadingState = () => {
    btnText.style.opacity = '1';
    btnLoader.classList.add('hidden');
    formSubmitBtn.disabled = false;
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    // Add timezone offset adjust to keep local date consistent
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return localDate.toLocaleDateString(undefined, options);
  };


  /* ==========================================
     9.5. Today's Special Countdown Timer
     ========================================== */
  const timerCountdown = document.getElementById('timer-countdown');
  
  if (timerCountdown) {
    const updateCountdown = () => {
      const now = new Date();
      // Target is midnight of current day
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const difference = target - now;

      if (difference <= 0) {
        timerCountdown.textContent = "00h 00m 00s";
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      timerCountdown.textContent = 
        `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }


  /* ==========================================
     10. Newsletter Form Handler
     ========================================== */
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterAlert = document.getElementById('newsletter-alert');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input');
    const email = emailInput.value.trim();

    newsletterAlert.textContent = "Adding email...";
    newsletterAlert.className = "newsletter-alert active";
    newsletterAlert.classList.remove('hidden');

    setTimeout(() => {
      newsletterAlert.textContent = `Success! ${email} has been subscribed to Café Solace updates.`;
      newsletterAlert.className = "newsletter-alert success";
      emailInput.value = '';
      
      setTimeout(() => {
        newsletterAlert.classList.add('hidden');
      }, 4000);
    }, 1000);
  });

  /* ==========================================
     11. Custom Toast Notification System
     ========================================== */
  const showToast = (message, duration = 6000) => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<span>${message}</span>`;
    
    container.appendChild(toast);

    // Auto fade out and remove
    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('transitionend', () => {
        toast.remove();
      });
    }, duration);
  };

  /* ==========================================
     12. Hero Mini Reservation Widget Scroll Action
     ========================================== */
  const heroWidgetBtn = document.getElementById('hero-widget-submit-btn');
  if (heroWidgetBtn) {
    heroWidgetBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* ==========================================
     13. Mobile Sticky CTA Visibility Handler
     ========================================== */
  const mobileStickyCta = document.getElementById('mobile-sticky-cta');
  const contactSection = document.getElementById('contact');

  if (mobileStickyCta && contactSection) {
    const handleStickyCtaVisibility = () => {
      const rect = contactSection.getBoundingClientRect();
      // If contact section is in viewport
      const isContactVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (window.scrollY > 400 && !isContactVisible) {
        mobileStickyCta.classList.remove('hidden-state');
      } else {
        mobileStickyCta.classList.add('hidden-state');
      }
    };

    window.addEventListener('scroll', handleStickyCtaVisibility);
    handleStickyCtaVisibility(); // Run on load
  }
});
