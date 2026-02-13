/* ============================================
   ТАТаудио - Анимации JavaScript
   ============================================ */

'use strict';

// ============================================
// Parallax Effect
// ============================================
class Parallax {
  constructor(options = {}) {
    this.elements = document.querySelectorAll('[data-parallax]');
    this.speed = options.speed || 0.5;
    
    if (this.elements.length) {
      this.init();
    }
  }
  
  init() {
    window.addEventListener('scroll', () => this.update());
    this.update();
  }
  
  update() {
    const scrollY = window.pageYOffset;
    
    this.elements.forEach(element => {
      const speed = parseFloat(element.dataset.parallax) || this.speed;
      const offset = scrollY * speed;
      element.style.transform = `translateY(${offset}px)`;
    });
  }
}

// ============================================
// Tilt Effect (3D Card)
// ============================================
class TiltEffect {
  constructor(options = {}) {
    this.elements = document.querySelectorAll('[data-tilt]');
    this.maxTilt = options.maxTilt || 10;
    this.perspective = options.perspective || 1000;
    
    if (this.elements.length) {
      this.init();
    }
  }
  
  init() {
    this.elements.forEach(element => {
      element.addEventListener('mousemove', (e) => this.handleMove(e, element));
      element.addEventListener('mouseleave', (e) => this.handleLeave(e, element));
    });
  }
  
  handleMove(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = ((y - centerY) / centerY) * this.maxTilt;
    const tiltY = ((centerX - x) / centerX) * this.maxTilt;
    
    element.style.transform = `perspective(${this.perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
  }
  
  handleLeave(e, element) {
    element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  }
}

// ============================================
// Typewriter Effect
// ============================================
class Typewriter {
  constructor(element, options = {}) {
    this.element = element;
    this.text = options.text || element.textContent;
    this.speed = options.speed || 50;
    this.delay = options.delay || 0;
    this.loop = options.loop || false;
    this.cursor = options.cursor || true;
    
    this.element.textContent = '';
    this.index = 0;
    this.isTyping = false;
    
    if (this.cursor) {
      this.cursorElement = document.createElement('span');
      this.cursorElement.className = 'typewriter-cursor';
      this.cursorElement.textContent = '|';
      this.element.appendChild(this.cursorElement);
    }
    
    setTimeout(() => this.start(), this.delay);
  }
  
  start() {
    this.isTyping = true;
    this.type();
  }
  
  type() {
    if (this.index < this.text.length) {
      const char = this.text.charAt(this.index);
      
      if (this.cursorElement) {
        this.element.insertBefore(document.createTextNode(char), this.cursorElement);
      } else {
        this.element.textContent += char;
      }
      
      this.index++;
      setTimeout(() => this.type(), this.speed);
    } else {
      this.isTyping = false;
      
      if (this.loop) {
        setTimeout(() => this.erase(), 2000);
      }
    }
  }
  
  erase() {
    if (this.index > 0) {
      const text = this.element.textContent;
      
      if (this.cursorElement) {
        this.element.textContent = '';
        this.element.appendChild(this.cursorElement);
        this.element.insertBefore(document.createTextNode(text.slice(0, -2)), this.cursorElement);
      } else {
        this.element.textContent = text.slice(0, -1);
      }
      
      this.index--;
      setTimeout(() => this.erase(), this.speed / 2);
    } else {
      setTimeout(() => this.type(), 500);
    }
  }
}

// ============================================
// CountUp Animation
// ============================================
class CountUp {
  constructor(element, options = {}) {
    this.element = element;
    this.target = parseFloat(element.dataset.count) || 0;
    this.duration = options.duration || 2000;
    this.decimals = options.decimals || 0;
    this.prefix = options.prefix || '';
    this.suffix = options.suffix || '';
    
    this.hasAnimated = false;
    this.observer = null;
    
    this.init();
  }
  
  init() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.animate();
          this.hasAnimated = true;
          this.observer.unobserve(this.element);
        }
      });
    }, { threshold: 0.5 });
    
    this.observer.observe(this.element);
  }
  
  animate() {
    const startTime = performance.now();
    const startValue = 0;
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (this.target - startValue) * easeOut;
      
      this.element.textContent = this.prefix + currentValue.toFixed(this.decimals) + this.suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    
    requestAnimationFrame(update);
  }
}

// ============================================
// Scroll Reveal Animation
// ============================================
class ScrollReveal {
  constructor(options = {}) {
    this.elements = document.querySelectorAll('[data-reveal]');
    this.options = {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px 0px -50px 0px',
      once: options.once !== false
    };
    
    if (this.elements.length) {
      this.init();
    }
  }
  
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);
          
          if (this.options.once) {
            observer.unobserve(entry.target);
          }
        } else if (!this.options.once) {
          entry.target.classList.remove('revealed');
        }
      });
    }, this.options);
    
    this.elements.forEach(element => observer.observe(element));
  }
}

// ============================================
// Stagger Animation
// ============================================
class StaggerAnimation {
  constructor(container, options = {}) {
    this.container = container;
    this.children = container.children;
    this.staggerDelay = options.staggerDelay || 100;
    this.animationClass = options.animationClass || 'fade-in-up';
    
    this.init();
  }
  
  init() {
    Array.from(this.children).forEach((child, index) => {
      child.style.transitionDelay = `${index * this.staggerDelay}ms`;
      child.classList.add(this.animationClass);
    });
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(this.children).forEach(child => {
            child.classList.add('visible');
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(this.container);
  }
}

// ============================================
// Text Scramble Effect
// ============================================
class TextScramble {
  constructor(element) {
    this.element = element;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  
  setText(newText) {
    const oldText = this.element.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  
  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.element.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// ============================================
// Magnetic Button Effect
// ============================================
class MagneticButton {
  constructor(element, options = {}) {
    this.element = element;
    this.strength = options.strength || 30;
    
    this.init();
  }
  
  init() {
    this.element.addEventListener('mousemove', (e) => this.handleMove(e));
    this.element.addEventListener('mouseleave', () => this.handleLeave());
  }
  
  handleMove(e) {
    const rect = this.element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const moveX = (x / rect.width) * this.strength;
    const moveY = (y / rect.height) * this.strength;
    
    this.element.style.transform = `translate(${moveX}px, ${moveY}px)`;
  }
  
  handleLeave() {
    this.element.style.transform = 'translate(0, 0)';
  }
}

// ============================================
// Cursor Trail Effect
// ============================================
class CursorTrail {
  constructor(options = {}) {
    this.trailLength = options.trailLength || 10;
    this.trail = [];
    this.enabled = window.innerWidth > 1024;
    
    if (this.enabled) {
      this.init();
    }
  }
  
  init() {
    // Create trail elements
    for (let i = 0; i < this.trailLength; i++) {
      const dot = document.createElement('div');
      dot.className = 'cursor-trail-dot';
      dot.style.cssText = `
        position: fixed;
        width: ${8 - i * 0.5}px;
        height: ${8 - i * 0.5}px;
        background: var(--color-accent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: ${1 - i * 0.1};
        transition: transform 0.1s ease;
      `;
      document.body.appendChild(dot);
      this.trail.push({ element: dot, x: 0, y: 0 });
    }
    
    document.addEventListener('mousemove', (e) => this.handleMove(e));
    this.animate();
  }
  
  handleMove(e) {
    this.trail[0].x = e.clientX;
    this.trail[0].y = e.clientY;
  }
  
  animate() {
    for (let i = this.trailLength - 1; i > 0; i--) {
      this.trail[i].x += (this.trail[i - 1].x - this.trail[i].x) * 0.3;
      this.trail[i].y += (this.trail[i - 1].y - this.trail[i].y) * 0.3;
    }
    
    this.trail.forEach((dot, index) => {
      dot.element.style.left = dot.x + 'px';
      dot.element.style.top = dot.y + 'px';
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// ============================================
// Initialize Animations
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize parallax
  new Parallax();
  
  // Initialize tilt effect
  new TiltEffect();
  
  // Initialize scroll reveal
  new ScrollReveal();
  
  // Initialize count up
  document.querySelectorAll('[data-count]').forEach(el => new CountUp(el));
  
  // Initialize magnetic buttons
  document.querySelectorAll('[data-magnetic]').forEach(el => new MagneticButton(el));
  
  // Initialize typewriter
  document.querySelectorAll('[data-typewriter]').forEach(el => {
    new Typewriter(el, {
      text: el.dataset.typewriter,
      speed: parseInt(el.dataset.speed) || 50
    });
  });
});

// ============================================
// Export Classes
// ============================================
window.TATAudio = window.TATAudio || {};
window.TATAudio.Parallax = Parallax;
window.TATAudio.TiltEffect = TiltEffect;
window.TATAudio.Typewriter = Typewriter;
window.TATAudio.CountUp = CountUp;
window.TATAudio.ScrollReveal = ScrollReveal;
window.TATAudio.StaggerAnimation = StaggerAnimation;
window.TATAudio.TextScramble = TextScramble;
window.TATAudio.MagneticButton = MagneticButton;
window.TATAudio.CursorTrail = CursorTrail;
