/* ============================================
   ТАТаудио - Компоненты JavaScript
   ============================================ */

'use strict';

// ============================================
// Product Filter
// ============================================
class ProductFilter {
  constructor(container, options = {}) {
    this.container = container;
    this.products = container.querySelectorAll('.product-card');
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.searchInput = document.querySelector('.search__input');
    this.activeFilter = 'all';
    this.searchQuery = '';
    
    this.init();
  }
  
  init() {
    // Filter buttons
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => this.handleFilter(btn));
    });
    
    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', TATAudio.debounce((e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.filterProducts();
      }, 300));
    }
  }
  
  handleFilter(btn) {
    this.filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
    this.activeFilter = btn.dataset.filter;
    this.filterProducts();
  }
  
  filterProducts() {
    this.products.forEach(product => {
      const category = product.dataset.category || 'all';
      const title = product.querySelector('.product-card__title')?.textContent.toLowerCase() || '';
      const description = product.querySelector('.product-card__description')?.textContent.toLowerCase() || '';
      
      const matchesCategory = this.activeFilter === 'all' || category === this.activeFilter;
      const matchesSearch = !this.searchQuery || 
        title.includes(this.searchQuery) || 
        description.includes(this.searchQuery);
      
      if (matchesCategory && matchesSearch) {
        product.style.display = '';
        product.classList.add('fade-in-up');
        setTimeout(() => product.classList.add('visible'), 50);
      } else {
        product.style.display = 'none';
        product.classList.remove('visible');
      }
    });
  }
}

// ============================================
// Service Filter
// ============================================
class ServiceFilter {
  constructor(container) {
    this.container = container;
    this.services = container.querySelectorAll('.service-card');
    this.filterBtns = document.querySelectorAll('[data-service-filter]');
    
    this.init();
  }
  
  init() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => this.handleFilter(btn));
    });
  }
  
  handleFilter(btn) {
    this.filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
    
    const filter = btn.dataset.serviceFilter;
    
    this.services.forEach(service => {
      const category = service.dataset.category || 'all';
      
      if (filter === 'all' || category === filter) {
        service.style.display = '';
        service.classList.add('fade-in-up');
        setTimeout(() => service.classList.add('visible'), 50);
      } else {
        service.style.display = 'none';
      }
    });
  }
}

// ============================================
// Gallery Filter & Lightbox
// ============================================
class Gallery {
  constructor(container, options = {}) {
    this.container = container;
    this.items = container.querySelectorAll('.gallery-item');
    this.filterBtns = document.querySelectorAll('[data-gallery-filter]');
    this.lightbox = null;
    
    this.init();
  }
  
  init() {
    // Filter functionality
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => this.handleFilter(btn));
    });
    
    // Lightbox functionality
    this.items.forEach(item => {
      item.addEventListener('click', () => this.openLightbox(item));
    });
    
    // Create lightbox element
    this.createLightbox();
  }
  
  handleFilter(btn) {
    this.filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
    
    const filter = btn.dataset.galleryFilter;
    
    this.items.forEach((item, index) => {
      const category = item.dataset.category || 'all';
      
      if (filter === 'all' || category === filter) {
        item.style.display = '';
        item.style.transitionDelay = `${index * 50}ms`;
        item.classList.add('fade-in');
        setTimeout(() => item.classList.add('visible'), 50);
      } else {
        item.style.display = 'none';
        item.classList.remove('visible');
      }
    });
  }
  
  createLightbox() {
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'lightbox';
    this.lightbox.innerHTML = `
      <div class="lightbox__overlay"></div>
      <div class="lightbox__content">
        <button class="lightbox__close">&times;</button>
        <button class="lightbox__prev">&#10094;</button>
        <button class="lightbox__next">&#10095;</button>
        <img class="lightbox__image" src="" alt="">
        <div class="lightbox__caption">
          <h4 class="lightbox__title"></h4>
          <p class="lightbox__description"></p>
        </div>
      </div>
    `;
    document.body.appendChild(this.lightbox);
    
    // Event listeners
    this.lightbox.querySelector('.lightbox__overlay').addEventListener('click', () => this.closeLightbox());
    this.lightbox.querySelector('.lightbox__close').addEventListener('click', () => this.closeLightbox());
    this.lightbox.querySelector('.lightbox__prev').addEventListener('click', () => this.navigate(-1));
    this.lightbox.querySelector('.lightbox__next').addEventListener('click', () => this.navigate(1));
    
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('lightbox--active')) return;
      
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.navigate(-1);
      if (e.key === 'ArrowRight') this.navigate(1);
    });
    
    this.currentIndex = 0;
    this.visibleItems = [...this.items];
  }
  
  openLightbox(item) {
    this.visibleItems = [...this.items].filter(i => i.style.display !== 'none');
    this.currentIndex = this.visibleItems.indexOf(item);
    
    this.updateLightboxContent(item);
    this.lightbox.classList.add('lightbox--active');
    document.body.style.overflow = 'hidden';
  }
  
  closeLightbox() {
    this.lightbox.classList.remove('lightbox--active');
    document.body.style.overflow = '';
  }
  
  navigate(direction) {
    this.currentIndex += direction;
    
    if (this.currentIndex < 0) {
      this.currentIndex = this.visibleItems.length - 1;
    } else if (this.currentIndex >= this.visibleItems.length) {
      this.currentIndex = 0;
    }
    
    this.updateLightboxContent(this.visibleItems[this.currentIndex]);
  }
  
  updateLightboxContent(item) {
    const img = item.querySelector('.gallery-item__image');
    const title = item.querySelector('.gallery-item__title');
    const category = item.querySelector('.gallery-item__category');
    
    this.lightbox.querySelector('.lightbox__image').src = img.src;
    this.lightbox.querySelector('.lightbox__title').textContent = title?.textContent || '';
    this.lightbox.querySelector('.lightbox__description').textContent = category?.textContent || '';
  }
}

// ============================================
// Reviews System
// ============================================
class ReviewsSystem {
  constructor(container) {
    this.container = container;
    this.reviews = container.querySelectorAll('.review-card');
    this.sortSelect = document.querySelector('[data-reviews-sort]');
    this.filterSelect = document.querySelector('[data-reviews-filter]');
    this.pagination = document.querySelector('.reviews-pagination');
    this.itemsPerPage = 6;
    this.currentPage = 1;
    
    this.init();
  }
  
  init() {
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', () => this.sortReviews());
    }
    
    if (this.filterSelect) {
      this.filterSelect.addEventListener('change', () => this.filterReviews());
    }
    
    this.showPage(1);
  }
  
  sortReviews() {
    const sortBy = this.sortSelect.value;
    const reviewsArray = [...this.reviews];
    
    reviewsArray.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.dataset.date) - new Date(a.dataset.date);
      } else if (sortBy === 'date-asc') {
        return new Date(a.dataset.date) - new Date(b.dataset.date);
      } else if (sortBy === 'rating-desc') {
        return parseInt(b.dataset.rating) - parseInt(a.dataset.rating);
      } else if (sortBy === 'rating-asc') {
        return parseInt(a.dataset.rating) - parseInt(b.dataset.rating);
      }
      return 0;
    });
    
    reviewsArray.forEach((review, index) => {
      review.style.order = index;
    });
  }
  
  filterReviews() {
    const filter = this.filterSelect.value;
    
    this.reviews.forEach(review => {
      const service = review.dataset.service || 'all';
      
      if (filter === 'all' || service === filter) {
        review.style.display = '';
      } else {
        review.style.display = 'none';
      }
    });
    
    this.showPage(1);
  }
  
  showPage(page) {
    this.currentPage = page;
    const visibleReviews = [...this.reviews].filter(r => r.style.display !== 'none');
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    
    visibleReviews.forEach((review, index) => {
      if (index >= start && index < end) {
        review.style.display = '';
      } else {
        review.style.display = 'none';
      }
    });
    
    this.updatePagination(visibleReviews.length);
  }
  
  updatePagination(totalItems) {
    if (!this.pagination) return;
    
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    this.pagination.innerHTML = '';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = `pagination__btn ${this.currentPage === 1 ? 'pagination__btn--disabled' : ''}`;
    prevBtn.textContent = '←';
    prevBtn.disabled = this.currentPage === 1;
    prevBtn.addEventListener('click', () => this.showPage(this.currentPage - 1));
    this.pagination.appendChild(prevBtn);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `pagination__btn ${i === this.currentPage ? 'pagination__btn--active' : ''}`;
      pageBtn.textContent = i;
      pageBtn.addEventListener('click', () => this.showPage(i));
      this.pagination.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = `pagination__btn ${this.currentPage === totalPages ? 'pagination__btn--disabled' : ''}`;
    nextBtn.textContent = '→';
    nextBtn.disabled = this.currentPage === totalPages;
    nextBtn.addEventListener('click', () => this.showPage(this.currentPage + 1));
    this.pagination.appendChild(nextBtn);
  }
}

// ============================================
// Countdown Timer
// ============================================
class CountdownTimer {
  constructor(element) {
    this.element = element;
    this.endDate = new Date(element.dataset.enddate);
    this.daysEl = element.querySelector('[data-days]');
    this.hoursEl = element.querySelector('[data-hours]');
    this.minutesEl = element.querySelector('[data-minutes]');
    this.secondsEl = element.querySelector('[data-seconds]');
    
    this.init();
  }
  
  init() {
    this.update();
    this.interval = setInterval(() => this.update(), 1000);
  }
  
  update() {
    const now = new Date();
    const diff = this.endDate - now;
    
    if (diff <= 0) {
      clearInterval(this.interval);
      this.element.innerHTML = '<span class="countdown-expired">Акция завершена</span>';
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (this.daysEl) this.daysEl.textContent = this.pad(days);
    if (this.hoursEl) this.hoursEl.textContent = this.pad(hours);
    if (this.minutesEl) this.minutesEl.textContent = this.pad(minutes);
    if (this.secondsEl) this.secondsEl.textContent = this.pad(seconds);
  }
  
  pad(num) {
    return num.toString().padStart(2, '0');
  }
}

// ============================================
// Slider/Carousel
// ============================================
class Slider {
  constructor(container, options = {}) {
    this.container = container;
    this.slides = container.querySelectorAll('.slide');
    this.options = {
      autoplay: options.autoplay !== false,
      autoplaySpeed: options.autoplaySpeed || 5000,
      dots: options.dots !== false,
      arrows: options.arrows !== false,
      infinite: options.infinite !== false
    };
    
    this.currentIndex = 0;
    this.isPlaying = false;
    
    this.init();
  }
  
  init() {
    this.createWrapper();
    
    if (this.options.dots) {
      this.createDots();
    }
    
    if (this.options.arrows) {
      this.createArrows();
    }
    
    if (this.options.autoplay) {
      this.play();
      
      this.container.addEventListener('mouseenter', () => this.pause());
      this.container.addEventListener('mouseleave', () => this.play());
    }
    
    // Touch support
    this.initTouch();
  }
  
  createWrapper() {
    this.track = document.createElement('div');
    this.track.className = 'slider__track';
    
    this.slides.forEach(slide => {
      slide.classList.add('slider__slide');
      this.track.appendChild(slide);
    });
    
    this.container.innerHTML = '';
    this.container.appendChild(this.track);
    this.container.classList.add('slider');
  }
  
  createDots() {
    this.dotsContainer = document.createElement('div');
    this.dotsContainer.className = 'slider__dots';
    
    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `slider__dot ${index === 0 ? 'slider__dot--active' : ''}`;
      dot.addEventListener('click', () => this.goTo(index));
      this.dotsContainer.appendChild(dot);
    });
    
    this.container.appendChild(this.dotsContainer);
    this.dots = this.dotsContainer.querySelectorAll('.slider__dot');
  }
  
  createArrows() {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'slider__arrow slider__arrow--prev';
    prevBtn.innerHTML = '&#10094;';
    prevBtn.addEventListener('click', () => this.prev());
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'slider__arrow slider__arrow--next';
    nextBtn.innerHTML = '&#10095;';
    nextBtn.addEventListener('click', () => this.next());
    
    this.container.appendChild(prevBtn);
    this.container.appendChild(nextBtn);
  }
  
  initTouch() {
    let startX = 0;
    let endX = 0;
    
    this.container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    this.container.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      
      if (startX - endX > 50) {
        this.next();
      } else if (endX - startX > 50) {
        this.prev();
      }
    });
  }
  
  goTo(index) {
    this.currentIndex = index;
    
    if (this.options.infinite) {
      if (index < 0) {
        this.currentIndex = this.slides.length - 1;
      } else if (index >= this.slides.length) {
        this.currentIndex = 0;
      }
    } else {
      this.currentIndex = Math.max(0, Math.min(index, this.slides.length - 1));
    }
    
    this.updateTrack();
    this.updateDots();
  }
  
  prev() {
    this.goTo(this.currentIndex - 1);
  }
  
  next() {
    this.goTo(this.currentIndex + 1);
  }
  
  updateTrack() {
    const offset = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;
  }
  
  updateDots() {
    if (!this.dots) return;
    
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('slider__dot--active', index === this.currentIndex);
    });
  }
  
  play() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.interval = setInterval(() => this.next(), this.options.autoplaySpeed);
  }
  
  pause() {
    this.isPlaying = false;
    clearInterval(this.interval);
  }
}

// ============================================
// Tabs Component
// ============================================
class Tabs {
  constructor(container) {
    this.container = container;
    this.tabs = container.querySelectorAll('[data-tab]');
    this.panels = container.querySelectorAll('[data-tab-panel]');
    
    this.init();
  }
  
  init() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => this.activate(tab));
    });
    
    // Activate first tab
    if (this.tabs.length) {
      this.activate(this.tabs[0]);
    }
  }
  
  activate(activeTab) {
    const panelId = activeTab.dataset.tab;
    
    // Update tabs
    this.tabs.forEach(tab => {
      tab.classList.toggle('tabs__tab--active', tab === activeTab);
      tab.setAttribute('aria-selected', tab === activeTab);
    });
    
    // Update panels
    this.panels.forEach(panel => {
      const isActive = panel.dataset.tabPanel === panelId;
      panel.classList.toggle('tabs__panel--active', isActive);
      panel.hidden = !isActive;
    });
  }
}

// ============================================
// Accordion Component
// ============================================
class Accordion {
  constructor(container, options = {}) {
    this.container = container;
    this.items = container.querySelectorAll('.accordion__item');
    this.options = {
      singleOpen: options.singleOpen !== false
    };
    
    this.init();
  }
  
  init() {
    this.items.forEach(item => {
      const header = item.querySelector('.accordion__header');
      const content = item.querySelector('.accordion__content');
      
      header.addEventListener('click', () => this.toggle(item));
      
      // Set initial state
      if (item.classList.contains('accordion__item--active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  }
  
  toggle(item) {
    const content = item.querySelector('.accordion__content');
    const isOpen = item.classList.contains('accordion__item--active');
    
    if (this.options.singleOpen) {
      this.closeAll();
    }
    
    if (isOpen) {
      item.classList.remove('accordion__item--active');
      content.style.maxHeight = '0';
    } else {
      item.classList.add('accordion__item--active');
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  }
  
  closeAll() {
    this.items.forEach(item => {
      const content = item.querySelector('.accordion__content');
      item.classList.remove('accordion__item--active');
      content.style.maxHeight = '0';
    });
  }
}

// ============================================
// Before/After Slider
// ============================================
class BeforeAfter {
  constructor(container) {
    this.container = container;
    this.beforeImg = container.querySelector('.before-after__before');
    this.afterImg = container.querySelector('.before-after__after');
    this.slider = container.querySelector('.before-after__slider');
    this.handle = container.querySelector('.before-after__handle');
    
    this.init();
  }
  
  init() {
    this.handle.addEventListener('mousedown', (e) => this.startDrag(e));
    this.handle.addEventListener('touchstart', (e) => this.startDrag(e));
    
    this.container.addEventListener('mousemove', (e) => this.drag(e));
    this.container.addEventListener('touchmove', (e) => this.drag(e));
    
    document.addEventListener('mouseup', () => this.stopDrag());
    document.addEventListener('touchend', () => this.stopDrag());
  }
  
  startDrag(e) {
    e.preventDefault();
    this.isDragging = true;
    this.container.classList.add('before-after--dragging');
  }
  
  drag(e) {
    if (!this.isDragging) return;
    
    const rect = this.container.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    this.slider.style.left = percentage + '%';
    this.beforeImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
  }
  
  stopDrag() {
    this.isDragging = false;
    this.container.classList.remove('before-after--dragging');
  }
}

// ============================================
// Initialize Components
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Product filter
  const productsGrid = document.querySelector('.products__grid');
  if (productsGrid) {
    new ProductFilter(productsGrid);
  }
  
  // Service filter
  const servicesGrid = document.querySelector('.services__grid');
  if (servicesGrid) {
    new ServiceFilter(servicesGrid);
  }
  
  // Gallery
  const galleryGrid = document.querySelector('.gallery__grid');
  if (galleryGrid) {
    new Gallery(galleryGrid);
  }
  
  // Reviews
  const reviewsContainer = document.querySelector('.reviews__list');
  if (reviewsContainer) {
    new ReviewsSystem(reviewsContainer);
  }
  
  // Countdown timers
  document.querySelectorAll('.countdown-timer').forEach(el => new CountdownTimer(el));
  
  // Sliders
  document.querySelectorAll('.slider-container').forEach(el => new Slider(el));
  
  // Tabs
  document.querySelectorAll('.tabs').forEach(el => new Tabs(el));
  
  // Accordions
  document.querySelectorAll('.accordion').forEach(el => new Accordion(el));
  
  // Before/After
  document.querySelectorAll('.before-after').forEach(el => new BeforeAfter(el));
});

// ============================================
// Export Classes
// ============================================
window.TATAudio = window.TATAudio || {};
window.TATAudio.ProductFilter = ProductFilter;
window.TATAudio.ServiceFilter = ServiceFilter;
window.TATAudio.Gallery = Gallery;
window.TATAudio.ReviewsSystem = ReviewsSystem;
window.TATAudio.CountdownTimer = CountdownTimer;
window.TATAudio.Slider = Slider;
window.TATAudio.Tabs = Tabs;
window.TATAudio.Accordion = Accordion;
window.TATAudio.BeforeAfter = BeforeAfter;
