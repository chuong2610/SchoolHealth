/* =================================================================
   ANIMATION UTILITIES
   Professional animation management and scroll-triggered effects
   ================================================================= */

/**
 * Initialize scroll-triggered animations
 */
export const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: unobserve after animation triggers
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.animate-reveal').forEach(el => {
        observer.observe(el);
    });

    return observer;
};

/**
 * Add stagger delays to multiple elements
 */
export const addStaggerDelays = (selector, baseDelay = 100) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.animationDelay = `${baseDelay * (index + 1)}ms`;
    });
};

/**
 * Trigger success animation on form elements
 */
export const triggerSuccessAnimation = (element) => {
    element.classList.remove('animate-error-shake');
    element.classList.add('animate-success-pulse');

    setTimeout(() => {
        element.classList.remove('animate-success-pulse');
    }, 600);
};

/**
 * Trigger error animation on form elements
 */
export const triggerErrorAnimation = (element) => {
    element.classList.remove('animate-success-pulse');
    element.classList.add('animate-error-shake');

    setTimeout(() => {
        element.classList.remove('animate-error-shake');
    }, 500);
};

/**
 * Animate number counting
 */
export const animateNumber = (element, start, end, duration = 1000) => {
    const startTime = performance.now();
    const startNum = parseInt(start);
    const endNum = parseInt(end);
    const difference = endNum - startNum;

    const updateNumber = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startNum + (difference * easeOutCubic));

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    };

    requestAnimationFrame(updateNumber);
};

/**
 * Create ripple effect on button click
 */
export const createRippleEffect = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const radius = Math.max(rect.width, rect.height);
    const left = event.clientX - rect.left - radius / 2;
    const top = event.clientY - rect.top - radius / 2;

    ripple.style.width = ripple.style.height = radius + 'px';
    ripple.style.left = left + 'px';
    ripple.style.top = top + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'ripple 0.6s ease-out';

    // Add ripple keyframes if not exists
    if (!document.querySelector('#ripple-keyframes')) {
        const style = document.createElement('style');
        style.id = 'ripple-keyframes';
        style.textContent = `
      @keyframes ripple {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
        document.head.appendChild(style);
    }

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
};

/**
 * Auto-initialize animations on DOM content loaded
 */
export const autoInitAnimations = () => {
    // Initialize scroll animations
    initScrollAnimations();

    // Add stagger delays to common elements
    addStaggerDelays('.animate-stagger-fade-in', 150);

    // Add ripple effect to buttons
    document.querySelectorAll('.animate-button-hover').forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });

    // Add smooth scrolling to anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add parallax effect to designated elements
    const parallaxElements = document.querySelectorAll('.animate-parallax');
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            parallaxElements.forEach(el => {
                const rate = scrolled * -0.5;
                el.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    // Performance optimization: Disable animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        document.documentElement.style.setProperty('--animation-duration-slow', '0.2s');
        document.documentElement.style.setProperty('--animation-duration-normal', '0.15s');
    }
};

/**
 * Page transition animations
 */
export const pageTransition = {
    enter: (callback) => {
        document.body.classList.add('animate-fade-in');
        setTimeout(callback, 300);
    },

    exit: (callback) => {
        document.body.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(callback, 300);
    }
};

/**
 * Modal animation helpers
 */
export const modalAnimations = {
    show: (modalElement) => {
        modalElement.classList.remove('animate-modal-exit');
        modalElement.classList.add('animate-modal-enter');
    },

    hide: (modalElement, callback) => {
        modalElement.classList.remove('animate-modal-enter');
        modalElement.classList.add('animate-modal-exit');
        setTimeout(callback, 300);
    }
};

/**
 * Form validation animations
 */
export const formAnimations = {
    showError: (fieldElement, message) => {
        triggerErrorAnimation(fieldElement);

        // Show error message with animation
        const errorDiv = fieldElement.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.add('animate-fade-in-up');
        }
    },

    showSuccess: (fieldElement) => {
        triggerSuccessAnimation(fieldElement);

        // Hide error message
        const errorDiv = fieldElement.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.classList.add('animate-fade-out');
        }
    },

    submitStart: (submitButton) => {
        submitButton.classList.add('animate-pulse');
        submitButton.disabled = true;
    },

    submitComplete: (submitButton, success = true) => {
        submitButton.classList.remove('animate-pulse');
        submitButton.disabled = false;

        if (success) {
            submitButton.classList.add('animate-success-pulse');
            setTimeout(() => {
                submitButton.classList.remove('animate-success-pulse');
            }, 600);
        }
    }
};

/**
 * Loading animations
 */
export const loadingAnimations = {
    showSkeleton: (container) => {
        container.innerHTML = `
      <div class="animate-skeleton" style="height: 20px; margin-bottom: 10px; border-radius: 4px;"></div>
      <div class="animate-skeleton" style="height: 20px; margin-bottom: 10px; border-radius: 4px; width: 80%;"></div>
      <div class="animate-skeleton" style="height: 20px; margin-bottom: 10px; border-radius: 4px; width: 60%;"></div>
    `;
    },

    showProgress: (container, progress = 0) => {
        container.innerHTML = `
      <div class="animate-progress" style="height: 4px; border-radius: 2px;">
        <div style="width: ${progress}%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 2px; transition: width 0.3s ease;"></div>
      </div>
    `;
    },

    showSpinner: (container, text = 'Loading...') => {
        container.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div class="animate-spin" style="width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #667eea; border-radius: 50%; margin: 0 auto 1rem;"></div>
        <p style="color: #6b7280; margin: 0;">${text}</p>
      </div>
    `;
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInitAnimations);
} else {
    autoInitAnimations();
} 