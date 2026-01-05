// Theme Toggle and Enhanced Mouse Effect Script - Green & Yellow Theme

// Theme Toggle Functionality
(function() {
  // Get theme from localStorage or default to light
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  // Create theme toggle button
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', 'Toggle theme');
  document.body.appendChild(themeToggle);

  // Theme toggle event listener
  themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    
    // Add animation
    themeToggle.style.transform = 'rotate(360deg) scale(1.3)';
    setTimeout(() => {
      themeToggle.style.transform = '';
    }, 400);
  });
})();

// Enhanced Mouse Effect - Green & Yellow Particles
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'mouseCanvas';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let particles = [];
  const particleCount = 70;

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Enhanced Particle class with Green & Yellow colors
  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
      this.x = Math.random() * canvas.width;
      this.baseSize = Math.random() * 4 + 2;
      // Randomly assign green or yellow
      this.isGreen = Math.random() > 0.5;
    }

    reset() {
      this.x = mouseX + (Math.random() - 0.5) * 200;
      this.y = mouseY + (Math.random() - 0.5) * 200;
      this.size = this.baseSize;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.life = Math.random() * 150 + 100;
      this.maxLife = this.life;
      this.opacity = Math.random() * 0.6 + 0.4;
      this.isGreen = Math.random() > 0.5;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life--;

      // Enhanced attraction to mouse
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200) {
        const force = (200 - distance) / 200;
        this.speedX += (dx / distance) * force * 0.02;
        this.speedY += (dy / distance) * force * 0.02;
      }

      // Repulsion from other particles
      particles.forEach(p => {
        if (p !== this) {
          const dx = p.x - this.x;
          const dy = p.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 30 && distance > 0) {
            const force = (30 - distance) / 30;
            this.speedX -= (dx / distance) * force * 0.01;
            this.speedY -= (dy / distance) * force * 0.01;
          }
        }
      });

      // Friction
      this.speedX *= 0.97;
      this.speedY *= 0.97;

      // Size pulsing
      this.size = this.baseSize + Math.sin(Date.now() * 0.003 + this.x * 0.01) * 1;

      if (this.life <= 0 || this.x < -50 || this.x > canvas.width + 50 || 
          this.y < -50 || this.y > canvas.height + 50) {
        this.reset();
      }
    }

    draw() {
      const opacity = (this.life / this.maxLife) * this.opacity;
      const theme = document.documentElement.getAttribute('data-theme');
      
      // Dynamic color based on particle type and theme
      let color;
      if (this.isGreen) {
        // Green particles
        if (theme === 'dark') {
          color = `rgba(129, 199, 132, ${opacity})`; // Light green
        } else {
          color = `rgba(102, 187, 106, ${opacity})`; // Medium green
        }
      } else {
        // Yellow particles
        if (theme === 'dark') {
          color = `rgba(255, 213, 79, ${opacity})`; // Light yellow
        } else {
          color = `rgba(255, 193, 7, ${opacity})`; // Medium yellow
        }
      }
      
      // Draw particle with glow effect
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      
      // Glow effect
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size * 3
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color.replace(/[\d\.]+\)$/, '0)'));
      
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw connection lines to nearby particles (only same color)
      particles.forEach(p => {
        if (p !== this && p.isGreen === this.isGreen) {
          const dx = p.x - this.x;
          const dy = p.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const lineOpacity = (1 - distance / 120) * opacity * 0.25;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = color.replace(/[\d\.]+\)$/, lineOpacity + ')');
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
    }
  }

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Mouse move handler
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Mouse trail effect with alternating colors
  let trail = [];
  const maxTrailLength = 20;

  document.addEventListener('mousemove', (e) => {
    trail.push({ 
      x: e.clientX, 
      y: e.clientY, 
      time: Date.now(),
      size: Math.random() * 8 + 4,
      isGreen: Math.random() > 0.5
    });
    if (trail.length > maxTrailLength) {
      trail.shift();
    }
  });

  function drawTrail() {
    const theme = document.documentElement.getAttribute('data-theme');
    
    trail.forEach((point, index) => {
      const age = Date.now() - point.time;
      const opacity = Math.max(0, 1 - age / 400);
      const size = point.size * opacity;
      
      if (opacity > 0) {
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, size * 2
        );
        
        if (point.isGreen) {
          if (theme === 'dark') {
            gradient.addColorStop(0, `rgba(129, 199, 132, ${opacity})`);
            gradient.addColorStop(1, `rgba(129, 199, 132, 0)`);
          } else {
            gradient.addColorStop(0, `rgba(102, 187, 106, ${opacity * 0.7})`);
            gradient.addColorStop(1, `rgba(102, 187, 106, 0)`);
          }
        } else {
          if (theme === 'dark') {
            gradient.addColorStop(0, `rgba(255, 213, 79, ${opacity})`);
            gradient.addColorStop(1, `rgba(255, 213, 79, 0)`);
          } else {
            gradient.addColorStop(0, `rgba(255, 193, 7, ${opacity * 0.7})`);
            gradient.addColorStop(1, `rgba(255, 193, 7, 0)`);
          }
        }
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    });

    // Remove old trail points
    trail = trail.filter(point => Date.now() - point.time < 400);
  }

  // Enhanced animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw trail first (behind particles)
    drawTrail();
    
    // Update and draw particles
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  // Start animation
  animate();

  // Add mouse leave handler to fade out
  document.addEventListener('mouseleave', () => {
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
  });
})();

// Smooth scroll animations for elements
(function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe all sections
  document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll(
      '.content-section, .reflection-item, .links-list li, .contact-info li, .homework-section'
    );
    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(section);
    });
  });
})();

// Add parallax effect to main content
(function() {
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const main = document.querySelector('main');
    
    if (main) {
      const scrollDiff = currentScrollY - lastScrollY;
      const parallaxValue = scrollDiff * 0.1;
      
      main.style.transform = `translateY(${parallaxValue}px)`;
    }
    
    lastScrollY = currentScrollY;
  });
})();

// Audio Quote Playback Functionality
(function() {
  let currentAudio = null;
  let currentButton = null;

  function initializeAudioButtons() {
    const playButtons = document.querySelectorAll('.play-quote-btn');
    
    playButtons.forEach(button => {
      button.addEventListener('click', function() {
        const audioSrc = this.getAttribute('data-audio');
        
        // If no audio source, don't do anything (for the first quote)
        if (!audioSrc || audioSrc.trim() === '') {
          return;
        }
        
        // If this button is already playing, stop it
        if (currentButton === this && currentAudio && !currentAudio.paused) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          this.classList.remove('playing');
          this.querySelector('.play-icon').textContent = '▶';
          currentAudio = null;
          currentButton = null;
          return;
        }
        
        // Stop any currently playing audio
        if (currentAudio && currentButton) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          currentButton.classList.remove('playing');
          currentButton.querySelector('.play-icon').textContent = '▶';
        }
        
        // Play new audio
        currentAudio = new Audio(audioSrc);
        currentButton = this;
        
        // Preload the audio
        currentAudio.preload = 'auto';
        
        this.classList.add('playing');
        this.querySelector('.play-icon').textContent = '⏸';
        
        // Wait for audio to be ready before playing
        currentAudio.addEventListener('canplaythrough', () => {
          currentAudio.play().catch(error => {
            console.error('Error playing audio:', error);
            this.classList.remove('playing');
            this.querySelector('.play-icon').textContent = '▶';
            currentAudio = null;
            currentButton = null;
          });
        }, { once: true });
        
        // Try to play immediately (for cached files)
        currentAudio.play().catch(error => {
          // If immediate play fails, wait for canplaythrough event
          console.log('Audio not ready yet, waiting...');
        });
        
        // When audio ends, reset button
        currentAudio.addEventListener('ended', () => {
          this.classList.remove('playing');
          this.querySelector('.play-icon').textContent = '▶';
          currentAudio = null;
          currentButton = null;
        });
        
        // Handle errors
        currentAudio.addEventListener('error', (e) => {
          console.error('Audio error:', e);
          console.error('Audio source:', audioSrc);
          this.classList.remove('playing');
          this.querySelector('.play-icon').textContent = '▶';
          currentAudio = null;
          currentButton = null;
        });
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAudioButtons);
  } else {
    initializeAudioButtons();
  }
})();
