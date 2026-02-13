/* ============================================
   ТАТаудио - Главный JavaScript файл
   ============================================ */

'use strict';

// ============================================
// DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initModals();
  initForms();
  initRippleEffect();
  initSmoothScroll();
  initScrollProgress();
  initParticles();
});

// ============================================
// Header Scroll Effect
// ============================================
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  let lastScroll = 0;
  const scrollThreshold = 100;
  
  const handleScroll = () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > scrollThreshold) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    
    lastScroll = currentScroll;
  };
  
  window.addEventListener('scroll', throttle(handleScroll, 100));
  handleScroll(); // Initial check
}

// ============================================
// Mobile Menu
// ============================================
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav__link');
  
  if (!menuToggle || !nav) return;
  
  const toggleMenu = () => {
    menuToggle.classList.toggle('menu-toggle--active');
    nav.classList.toggle('nav--active');
    document.body.classList.toggle('menu-open');
    
    if (navOverlay) {
      navOverlay.classList.toggle('nav-overlay--active');
    }
  };
  
  const closeMenu = () => {
    menuToggle.classList.remove('menu-toggle--active');
    nav.classList.remove('nav--active');
    document.body.classList.remove('menu-open');
    
    if (navOverlay) {
      navOverlay.classList.remove('nav-overlay--active');
    }
  };
  
  menuToggle.addEventListener('click', toggleMenu);
  
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('nav--active')) {
        closeMenu();
      }
    });
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('nav--active')) {
      closeMenu();
    }
  });
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right, .scale-in');
  
  if (!animatedElements.length) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => observer.observe(el));
}

// ============================================
// Modal Windows
// ============================================
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modals = document.querySelectorAll('.modal');
  const modalCloses = document.querySelectorAll('.modal__close, .modal__overlay');
  
  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.add('modal--active');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    const firstInput = modal.querySelector('input, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  };
  
  const closeModal = (modal) => {
    modal.classList.remove('modal--active');
    document.body.style.overflow = '';
  };
  
  const closeAllModals = () => {
    modals.forEach(modal => closeModal(modal));
  };
  
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.dataset.modal;
      openModal(modalId);
    });
  });
  
  modalCloses.forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
      const modal = closeBtn.closest('.modal');
      closeModal(modal);
    });
  });
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

// ============================================
// Form Handling
// ============================================
function initForms() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea');
    const phoneInputs = form.querySelectorAll('input[type="tel"]');
    
    // Phone mask
    phoneInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
          if (value[0] === '7' || value[0] === '8') {
            value = value.substring(1);
          }
          
          let formatted = '+7';
          if (value.length > 0) formatted += ' (' + value.substring(0, 3);
          if (value.length >= 3) formatted += ') ' + value.substring(3, 6);
          if (value.length >= 6) formatted += '-' + value.substring(6, 8);
          if (value.length >= 8) formatted += '-' + value.substring(8, 10);
          
          e.target.value = formatted;
        }
      });
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!validateForm(form)) return;
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';
      
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      showNotification('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
      
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      
      // Close modal if form is in modal
      const modal = form.closest('.modal');
      if (modal) {
        setTimeout(() => modal.classList.remove('modal--active'), 2000);
      }
    });
    
    // Real-time validation
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateInput(input));
      input.addEventListener('input', () => {
        if (input.closest('.form-group--error')) {
          validateInput(input);
        }
      });
    });
  });
}

function validateForm(form) {
  const inputs = form.querySelectorAll('[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!validateInput(input)) {
      isValid = false;
    }
  });
  
  return isValid;
}

function validateInput(input) {
  const formGroup = input.closest('.form-group');
  const value = input.value.trim();
  let isValid = true;
  let errorMessage = '';
  
  // Required check
  if (input.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'Это поле обязательно для заполнения';
  }
  
  // Email validation
  if (input.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Введите корректный email';
    }
  }
  
  // Phone validation
  if (input.type === 'tel' && value) {
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(value)) {
      isValid = false;
      errorMessage = 'Введите корректный номер телефона';
    }
  }
  
  // Update UI
  if (formGroup) {
    const errorEl = formGroup.querySelector('.form-group__error');
    
    if (isValid) {
      formGroup.classList.remove('form-group--error');
      if (errorEl) errorEl.textContent = '';
    } else {
      formGroup.classList.add('form-group--error');
      if (errorEl) errorEl.textContent = errorMessage;
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 500);
    }
  }
  
  return isValid;
}

// ============================================
// Notifications
// ============================================
function showNotification(message, type = 'info') {
  const container = document.querySelector('.notifications') || createNotificationContainer();
  
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div class="notification__content">
      <span class="notification__icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span class="notification__message">${message}</span>
    </div>
    <button class="notification__close">×</button>
  `;
  
  container.appendChild(notification);
  
  const closeBtn = notification.querySelector('.notification__close');
  closeBtn.addEventListener('click', () => closeNotification(notification));
  
  setTimeout(() => closeNotification(notification), 5000);
}

function createNotificationContainer() {
  const container = document.createElement('div');
  container.className = 'notifications';
  document.body.appendChild(container);
  return container;
}

function closeNotification(notification) {
  notification.classList.add('notification--hiding');
  setTimeout(() => notification.remove(), 300);
}

// ============================================
// Ripple Effect
// ============================================
function initRippleEffect() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// ============================================
// Smooth Scroll
// ============================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

// ============================================
// Scroll Progress
// ============================================
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) return;
  
  const updateProgress = () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  };
  
  window.addEventListener('scroll', throttle(updateProgress, 50));
}

// ============================================
// Particles
// ============================================
function initParticles() {
  const container = document.querySelector('.hero__particles');
  if (!container) return;
  
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.setProperty('--tx', (Math.random() * 300 - 150) + 'px');
    particle.style.setProperty('--ty', -(Math.random() * 300 + 100) + 'px');
    container.appendChild(particle);
  }
}

// ============================================
// Utility Functions
// ============================================
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// ============================================
// Lazy Loading Images
// ============================================
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if (!images.length) return;
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px'
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// ============================================
// Counter Animation
// ============================================
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };
  
  updateCounter();
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.counter);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
}

// ============================================
// Export functions for use in other modules
// ============================================
window.TATAudio = {
  showNotification,
  validateForm,
  throttle,
  debounce,
  animateCounter,
  initLazyLoading,
  initCounters
};
