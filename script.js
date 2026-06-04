/* ==========================================================================
   ROMANTIC BIRTHDAY WEBSITE - INTERACTIVE SCRIPTS & CANVAS ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. GLOBAL ROMANTIC MUSIC PLAYER
     ========================================================================== */
  const musicToggle = document.getElementById('music-toggle-btn');
  const musicIndicator = document.getElementById('music-indicator');
  const bgMusic = document.getElementById('romantic-bg-music');
  let isPlaying = false;

  musicToggle.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      musicIndicator.classList.remove('playing');
      musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    } else {
      // Browsers restrict autoplay, so playing on user gesture works perfectly
      bgMusic.play().then(() => {
        musicIndicator.classList.add('playing');
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
      }).catch(err => {
        console.log("Audio play blocked or failed: ", err);
      });
    }
    isPlaying = !isPlaying;
  });


  /* ==========================================================================
     2. LIGHT/DARK THEME TOGGLER
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle-btn');
  
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('romantic-theme-dark');
    document.body.classList.toggle('romantic-theme-light', !isDark);
    
    // Update theme toggle icon
    if (isDark) {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Trigger canvas recolor where necessary
    resetCanvasColors();
  });


  /* ==========================================================================
     3. LIVE COUNTDOWN TIMER (Elapsed since Feb 15, 2026)
     ========================================================================== */
  const startDate = new Date("2026-02-15T00:00:00");

  function updateJourneyTimer() {
    const now = new Date();
    const elapsedMs = now - startDate;

    const days = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((elapsedMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((elapsedMs / (1000 * 60)) % 60);
    const seconds = Math.floor((elapsedMs / 1000) % 60);

    document.getElementById('countdown-days').textContent = String(days).padStart(2, '0');
    document.getElementById('countdown-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('countdown-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('countdown-seconds').textContent = String(seconds).padStart(2, '0');
  }

  // Update timer every second
  setInterval(updateJourneyTimer, 1000);
  updateJourneyTimer(); // Run once initially


  /* ==========================================================================
     4. GLOBAL CANVAS: PETALS, LANTERNS & STAR ENGINE
     ========================================================================== */
  const globalCanvas = document.getElementById('global-particles-canvas');
  const gCtx = globalCanvas.getContext('2d');
  
  let globalParticles = [];
  let screenWidth = window.innerWidth;
  let screenHeight = window.innerHeight;

  function resizeGlobalCanvas() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    globalCanvas.width = screenWidth;
    globalCanvas.height = screenHeight;
  }
  window.addEventListener('resize', resizeGlobalCanvas);
  resizeGlobalCanvas();

  // Particle colors configurations based on theme
  let petalColor = 'rgba(255, 182, 193, 0.65)';  // Soft light pink
  let lanternColor = 'rgba(235, 140, 110, 0.7)';   // Warm glowing orange-rose
  
  function resetCanvasColors() {
    const isDark = document.body.classList.contains('romantic-theme-dark');
    petalColor = isDark ? 'rgba(224, 155, 166, 0.6)' : 'rgba(255, 182, 193, 0.65)';
    lanternColor = isDark ? 'rgba(240, 120, 100, 0.8)' : 'rgba(235, 140, 110, 0.7)';
  }
  resetCanvasColors();

  // Particle classes
  class SakuraPetal {
    constructor() {
      this.reset();
      this.y = Math.random() * screenHeight; // Distribute vertically on start
    }
    reset() {
      this.x = Math.random() * screenWidth;
      this.y = -20;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 1 - 0.5;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = Math.random() * 0.02 - 0.01;
      this.opacity = Math.random() * 0.4 + 0.4;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y / 30) * 0.5;
      this.angle += this.spin;
      
      if (this.y > screenHeight + 20 || this.x < -20 || this.x > screenWidth + 20) {
        this.reset();
      }
    }
    draw() {
      gCtx.save();
      gCtx.translate(this.x, this.y);
      gCtx.rotate(this.angle);
      gCtx.fillStyle = petalColor;
      gCtx.globalAlpha = this.opacity;
      
      // Draw a cherry blossom petal shape using bezier curves
      gCtx.beginPath();
      gCtx.moveTo(0, 0);
      gCtx.bezierCurveTo(-this.size, -this.size, -this.size*1.5, this.size/2, 0, this.size*1.5);
      gCtx.bezierCurveTo(this.size*1.5, this.size/2, this.size, -this.size, 0, 0);
      gCtx.fill();
      gCtx.restore();
    }
  }

  class SkyLantern {
    constructor() {
      this.reset();
      this.y = screenHeight + Math.random() * screenHeight; // Start well below
    }
    reset() {
      this.x = Math.random() * screenWidth;
      this.y = screenHeight + 50;
      this.width = Math.random() * 20 + 15;
      this.height = this.width * 1.35;
      this.speedY = -(Math.random() * 0.6 + 0.4);
      this.oscillationSpeed = Math.random() * 0.02 + 0.01;
      this.oscillationWidth = Math.random() * 1.5 + 0.5;
      this.angle = Math.random() * Math.PI;
      this.opacity = Math.random() * 0.3 + 0.5;
    }
    update() {
      this.y += this.speedY;
      this.angle += this.oscillationSpeed;
      this.x += Math.sin(this.angle) * this.oscillationWidth;
      
      if (this.y < -this.height) {
        this.reset();
      }
    }
    draw() {
      gCtx.save();
      gCtx.globalAlpha = this.opacity;
      
      // Outer glow effect
      const glow = gCtx.createRadialGradient(
        this.x + this.width/2, this.y + this.height/2, 2,
        this.x + this.width/2, this.y + this.height/2, this.width*1.5
      );
      glow.addColorStop(0, 'rgba(255, 220, 180, 0.8)');
      glow.addColorStop(0.3, lanternColor);
      glow.addColorStop(1, 'rgba(255, 182, 193, 0)');
      
      gCtx.fillStyle = glow;
      gCtx.beginPath();
      gCtx.arc(this.x + this.width/2, this.y + this.height/2, this.width*1.5, 0, Math.PI*2);
      gCtx.fill();
      
      // Lantern body (rounded rectangle)
      gCtx.fillStyle = 'rgba(240, 100, 80, 0.85)';
      gCtx.beginPath();
      gCtx.moveTo(this.x + 4, this.y);
      gCtx.lineTo(this.x + this.width - 4, this.y);
      gCtx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + 6);
      gCtx.lineTo(this.x + this.width - 2, this.y + this.height - 4);
      gCtx.quadraticCurveTo(this.x + this.width - 4, this.y + this.height, this.x + this.width - 8, this.y + this.height);
      gCtx.lineTo(this.x + 8, this.y + this.height);
      gCtx.quadraticCurveTo(this.x + 4, this.y + this.height, this.x + 2, this.y + this.height - 4);
      gCtx.lineTo(this.x, this.y + 6);
      gCtx.quadraticCurveTo(this.x, this.y, this.x + 4, this.y);
      gCtx.closePath();
      gCtx.fill();
      
      // Fire flame at the bottom center
      const flame = gCtx.createRadialGradient(
        this.x + this.width/2, this.y + this.height - 2, 0,
        this.x + this.width/2, this.y + this.height - 2, 8
      );
      flame.addColorStop(0, '#ffffff');
      flame.addColorStop(0.5, '#ffd254');
      flame.addColorStop(1, 'rgba(255, 69, 0, 0)');
      gCtx.fillStyle = flame;
      gCtx.beginPath();
      gCtx.arc(this.x + this.width/2, this.y + this.height - 2, 8, 0, Math.PI*2);
      gCtx.fill();
      
      gCtx.restore();
    }
  }

  // Create initial particle lists
  function initGlobalParticles() {
    globalParticles = [];
    // 30 Petals
    for (let i = 0; i < 32; i++) {
      globalParticles.push(new SakuraPetal());
    }
    // 10 Sky Lanterns
    for (let i = 0; i < 12; i++) {
      globalParticles.push(new SkyLantern());
    }
  }
  initGlobalParticles();

  function animateGlobalParticles() {
    gCtx.clearRect(0, 0, screenWidth, screenHeight);
    
    // Draw background stars if theme is dark
    if (document.body.classList.contains('romantic-theme-dark')) {
      gCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 40; i++) {
        const sx = (Math.sin(i * 12345) * 0.5 + 0.5) * screenWidth;
        const sy = (Math.cos(i * 67890) * 0.5 + 0.5) * screenHeight * 0.6; // Only upper 60%
        const sSize = Math.abs(Math.sin(Date.now() / 800 + i)) * 1.5 + 0.5;
        gCtx.beginPath();
        gCtx.arc(sx, sy, sSize, 0, Math.PI*2);
        gCtx.fill();
      }
    }

    // Render lanterns and petals
    globalParticles.forEach(p => {
      p.update();
      p.draw();
    });
    
    requestAnimationFrame(animateGlobalParticles);
  }
  animateGlobalParticles();


  /* ==========================================================================
     5. INTERSECTION OBSERVER FOR SCROLL-REVEAL CARDS
     ========================================================================== */
  const scrollElements = document.querySelectorAll('.reveal-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -50px 0px"
  });

  scrollElements.forEach(el => observer.observe(el));


  /* ==========================================================================
     6. WHY YOU ARE SPECIAL CARDS (Click Reveal & Heart Sparks)
     ========================================================================= */
  const specialCards = document.querySelectorAll('.special-card');

  specialCards.forEach(card => {
    // Accessible trigger
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });

    card.addEventListener('click', (e) => {
      const isExpanded = card.classList.contains('expanded');
      
      // Close other cards first
      specialCards.forEach(c => c.classList.remove('expanded'));
      
      if (!isExpanded) {
        card.classList.add('expanded');
        // Spawn small burst of floating hearts around the clicked card
        spawnHeartsAroundElement(card);
      }
    });
  });

  // Helper to spawn hearts on click
  function spawnHeartsAroundElement(element) {
    const rect = element.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    const elemTop = rect.top - bodyRect.top;
    const elemLeft = rect.left - bodyRect.left;
    
    for (let i = 0; i < 8; i++) {
      const heart = document.createElement('i');
      heart.className = 'fas fa-heart sparking-heart';
      heart.style.left = `${elemLeft + rect.width / 2 + (Math.random() * 80 - 40)}px`;
      heart.style.top = `${elemTop + rect.height / 2 + (Math.random() * 40 - 20)}px`;
      heart.style.transform = `scale(${Math.random() * 0.5 + 0.6})`;
      heart.style.color = `hsl(${Math.random() * 20 + 345}, 100%, 70%)`; // Rose pink spectrum
      
      document.body.appendChild(heart);
      
      // Clean up after animation finishes
      setTimeout(() => {
        heart.remove();
      }, 1200);
    }
  }


  /* ==========================================================================
     7. PANDA WORLD (Interactive Hug & Floating Pandas Background)
     ========================================================================== */
  const pandaHugBtn = document.getElementById('panda-hug-btn');
  const pandaStage = document.getElementById('panda-stage');
  const pandaSparks = document.getElementById('panda-heart-sparks');
  const pandaSection = document.getElementById('panda-section');

  // Spawn background floating pandas in Section 4
  function spawnBackgroundPandas() {
    const emojis = ['🐼', '❤️', '🐾', '🐼', '🎋'];
    for (let i = 0; i < 8; i++) {
      const pItem = document.createElement('div');
      pItem.className = 'floating-panda-bg';
      pItem.textContent = emojis[i % emojis.length];
      pItem.style.left = `${Math.random() * 85 + 5}%`;
      pItem.style.top = `${Math.random() * 80 + 10}%`;
      pItem.style.animationDelay = `${Math.random() * 4}s`;
      pItem.style.fontSize = `${Math.random() * 1.5 + 1.2}rem`;
      pandaSection.appendChild(pItem);
    }
  }
  spawnBackgroundPandas();

  // Hug button action
  pandaHugBtn.addEventListener('click', () => {
    if (pandaStage.classList.contains('hugging')) return;
    
    pandaStage.classList.add('hugging');
    
    // Wait for pandas to slide together, then burst hearts
    setTimeout(() => {
      for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'sparking-heart';
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        heart.style.left = `calc(50% + ${Math.random() * 60 - 30}px)`;
        heart.style.top = `40%`;
        heart.style.fontSize = `${Math.random() * 1.2 + 0.8}rem`;
        heart.style.color = `hsl(${Math.random() * 20 + 345}, 100%, 65%)`;
        
        pandaSparks.appendChild(heart);
        setTimeout(() => heart.remove(), 1200);
      }
    }, 550);

    // End hug animation
    setTimeout(() => {
      pandaStage.classList.remove('hugging');
    }, 2200);
  });


  /* ==========================================================================
     8. DEMON SLAYER BREATHING ENGINE (Canvas Overlay & Sword Glow)
     ========================================================================== */
  const slayerCanvas = document.getElementById('slayer-canvas');
  const sCtx = slayerCanvas.getContext('2d');
  const katanaHarness = document.getElementById('katana-container');
  const btnWater = document.getElementById('btn-water-style');
  const btnFlame = document.getElementById('btn-flame-style');
  const katanaBlade = document.getElementById('katana-blade');

  let activeBreathingStyle = 'water'; // 'water' or 'flame'
  let breathingParticles = [];

  function resizeSlayerCanvas() {
    const rect = slayerCanvas.getBoundingClientRect();
    slayerCanvas.width = rect.width;
    slayerCanvas.height = rect.height;
  }
  window.addEventListener('resize', resizeSlayerCanvas);
  resizeSlayerCanvas();

  // Switch breathing styles
  btnWater.addEventListener('click', () => {
    activeBreathingStyle = 'water';
    btnWater.classList.add('active');
    btnFlame.classList.remove('active');
    katanaBlade.setAttribute('filter', 'url(#neon-glow-water)');
    katanaBlade.style.setProperty('stop-color', '#ffb6c1');
  });

  btnFlame.addEventListener('click', () => {
    activeBreathingStyle = 'flame';
    btnFlame.classList.add('active');
    btnWater.classList.remove('active');
    katanaBlade.setAttribute('filter', 'url(#neon-glow-water)');
  });

  class BreathingParticle {
    constructor(x, y, style) {
      this.x = x;
      this.y = y;
      this.style = style;
      this.size = Math.random() * 6 + 3;
      this.alpha = 1;
      
      if (this.style === 'water') {
        // Water curves
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        this.angle = Math.random() * Math.PI * 2;
        this.color = `hsl(${Math.random() * 30 + 190}, 95%, 65%)`; // Neon blues/cyans
        this.decay = Math.random() * 0.015 + 0.01;
      } else {
        // Flame sparks floating upwards
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = -(Math.random() * 3 + 1);
        this.color = `hsl(${Math.random() * 25 + 10}, 100%, 55%)`; // Orange/Red flames
        this.decay = Math.random() * 0.02 + 0.015;
      }
    }
    update() {
      if (this.style === 'water') {
        this.x += this.speedX + Math.sin(this.angle) * 1.5;
        this.y += this.speedY + Math.cos(this.angle) * 1.5;
        this.angle += 0.08;
      } else {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size *= 0.98;
      }
      this.alpha -= this.decay;
    }
    draw() {
      sCtx.save();
      sCtx.globalAlpha = this.alpha;
      sCtx.fillStyle = this.color;
      sCtx.shadowBlur = 12;
      sCtx.shadowColor = this.color;
      
      sCtx.beginPath();
      if (this.style === 'water') {
        sCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      } else {
        // Flame droplet shape
        sCtx.moveTo(this.x, this.y - this.size);
        sCtx.quadraticCurveTo(this.x + this.size, this.y, this.x, this.y + this.size);
        sCtx.quadraticCurveTo(this.x - this.size, this.y, this.x, this.y - this.size);
      }
      sCtx.fill();
      sCtx.restore();
    }
  }

  // Generate particles on mousemove along the katana
  katanaHarness.addEventListener('mousemove', (e) => {
    const rect = slayerCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    // Spawn 3 particles per move
    for (let i = 0; i < 3; i++) {
      breathingParticles.push(new BreathingParticle(mx, my, activeBreathingStyle));
    }
  });

  // Touch support for mobile devices
  katanaHarness.addEventListener('touchmove', (e) => {
    const rect = slayerCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    const mx = touch.clientX - rect.left;
    const my = touch.clientY - rect.top;
    
    for (let i = 0; i < 2; i++) {
      breathingParticles.push(new BreathingParticle(mx, my, activeBreathingStyle));
    }
  });

  function animateBreathing() {
    sCtx.clearRect(0, 0, slayerCanvas.width, slayerCanvas.height);
    
    breathingParticles.forEach((p, idx) => {
      p.update();
      p.draw();
      if (p.alpha <= 0 || p.size <= 0.5) {
        breathingParticles.splice(idx, 1);
      }
    });
    
    requestAnimationFrame(animateBreathing);
  }
  animateBreathing();


  /* ==========================================================================
     9. SWEETEST PERSON ALIVE (Bite Interactivity)
     ========================================================================== */
  const biteBtns = document.querySelectorAll('.bite-btn');
  const sweetsLayer = document.getElementById('floating-sweets-layer');

  // Spawn background mini candy icons
  function spawnBackgroundSweets() {
    const sweets = ['🍫', '🍰', '🧁', '🍬', '🍭', '🍩'];
    for (let i = 0; i < 10; i++) {
      const sItem = document.createElement('div');
      sItem.className = 'floating-sweet-bg';
      sItem.textContent = sweets[i % sweets.length];
      sItem.style.left = `${Math.random() * 85 + 5}%`;
      sItem.style.top = `${Math.random() * 85 + 5}%`;
      sItem.style.animationDelay = `${Math.random() * 5}s`;
      sItem.style.fontSize = `${Math.random() * 1.2 + 1}rem`;
      sweetsLayer.appendChild(sItem);
    }
  }
  spawnBackgroundSweets();

  biteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetName = btn.getAttribute('data-target');
      const targetSvg = document.getElementById(`${targetName}-bite-target`);
      const mark = document.getElementById(`${targetName}-bite-mark`);
      
      // Animate scale pop
      targetSvg.style.transform = 'scale(0.85)';
      setTimeout(() => {
        targetSvg.style.transform = 'scale(1.08)';
      }, 150);

      // Positioning the bite marks differently based on SVG design
      mark.style.display = 'block';
      if (targetName === 'choc') {
        mark.style.top = '-10px';
        mark.style.right = '-10px';
      } else if (targetName === 'cake') {
        mark.style.left = '12px';
        mark.style.top = '16px';
      } else if (targetName === 'cookie') {
        mark.style.right = '-8px';
        mark.style.top = '22px';
      } else if (targetName === 'donut') {
        mark.style.left = '42px';
        mark.style.top = '-10px';
      }
      
      // Spawn small floating candy crumbs
      spawnCrumbs(btn);
    });
  });

  function spawnCrumbs(button) {
    const rect = button.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    const elemTop = rect.top - bodyRect.top;
    const elemLeft = rect.left - bodyRect.left;

    for (let i = 0; i < 6; i++) {
      const crumb = document.createElement('div');
      crumb.style.position = 'absolute';
      crumb.style.width = `${Math.random() * 6 + 3}px`;
      crumb.style.height = `${Math.random() * 6 + 3}px`;
      crumb.style.borderRadius = '50%';
      crumb.style.backgroundColor = `hsl(${Math.random() * 30 + 15}, 80%, 45%)`; // Chocolatey colors
      crumb.style.left = `${elemLeft + rect.width/2}px`;
      crumb.style.top = `${elemTop}px`;
      crumb.style.pointerEvents = 'none';
      crumb.style.zIndex = '10';
      
      document.body.appendChild(crumb);

      // Custom quick arc flight
      const angle = Math.random() * Math.PI - Math.PI; // Upwards spread
      const distance = Math.random() * 50 + 20;
      const tX = Math.cos(angle) * distance;
      const tY = Math.sin(angle) * distance + 20; // Gravity drop

      crumb.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${tX}px, ${tY}px) scale(0.2)`, opacity: 0 }
      ], {
        duration: 800,
        easing: 'ease-out'
      }).onfinish = () => crumb.remove();
    }
  }


  /* ==========================================================================
     10. PHOTO GALLERY LIGHTBOX & HEART REACTIONS
     ========================================================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxClose = document.getElementById('lightbox-close-btn');
  const lightboxPrev = document.getElementById('lightbox-prev-btn');
  const lightboxNext = document.getElementById('lightbox-next-btn');
  const lightboxImgWrapper = document.getElementById('lightbox-img-wrapper');
  const lightboxCaption = document.getElementById('lightbox-caption');

  let currentGalleryIndex = 0;

  // Gallery Liked system
  galleryItems.forEach((item, index) => {
    const heartBtn = item.querySelector('.gallery-heart-btn');
    const heartIcon = heartBtn.querySelector('i');
    const countSpan = heartBtn.querySelector('.heart-count');
    
    heartBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid opening lightbox
      
      let count = parseInt(countSpan.textContent);
      
      if (heartIcon.classList.contains('far')) {
        // Liked
        count++;
        heartIcon.className = 'fas fa-heart animate-beat';
        heartIcon.style.color = '#ff4d6d';
      } else {
        // Unliked
        count--;
        heartIcon.className = 'far fa-heart';
        heartIcon.style.color = '';
      }
      countSpan.textContent = count;
    });

    // Open lightbox
    const viewBtn = item.querySelector('.gallery-view-btn');
    viewBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(index);
    });

    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    currentGalleryIndex = index;
    lightbox.setAttribute('aria-hidden', 'false');
    loadLightboxItem(index);
  }

  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
  }

  function loadLightboxItem(index) {
    const item = galleryItems[index];
    const imgEl = item.querySelector('.gallery-real-img');
    const captionText = item.querySelector('.gal-caption').textContent;
    
    if (imgEl && imgEl.getAttribute('src')) {
      lightboxImgWrapper.innerHTML = `
        <img class="lightbox-real-img" src="${imgEl.getAttribute('src')}" alt="${imgEl.getAttribute('alt') || captionText}">
      `;
    } else {
      lightboxImgWrapper.innerHTML = `
        <div class="lightbox-image-fallback">
          <i class="fas fa-camera-retro"></i>
          <span>Add Photo of: "${captionText}"</span>
        </div>
      `;
    }
    
    lightboxCaption.textContent = captionText;
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    loadLightboxItem(currentGalleryIndex);
  });
  lightboxNext.addEventListener('click', () => {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    loadLightboxItem(currentGalleryIndex);
  });

  // Close on outer click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev.click();
      if (e.key === 'ArrowRight') lightboxNext.click();
    }
  });


  /* ==========================================================================
     11. LOVE LETTER ENVELOPE (Wax Seal Click)
     ========================================================================== */
  const waxSeal = document.getElementById('wax-seal');
  const envelope = document.getElementById('letter-envelope');
  const envelopeWrapper = envelope.parentElement;

  waxSeal.addEventListener('click', () => {
    envelope.classList.add('opened');
    envelopeWrapper.classList.add('opened');
    document.getElementById('envelope-hint').textContent = "My heart in words, just for you ❤️";
  });


  /* ==========================================================================
     12. FUTURE TOGETHER (Infinity Path Tracer & Starry Canvas)
     ========================================================================== */
  const futureStarsCanvas = document.getElementById('future-stars-canvas');
  const fCtx = futureStarsCanvas.getContext('2d');
  
  function resizeFutureCanvas() {
    const rect = futureStarsCanvas.getBoundingClientRect();
    futureStarsCanvas.width = rect.width;
    futureStarsCanvas.height = rect.height;
  }
  window.addEventListener('resize', resizeFutureCanvas);
  resizeFutureCanvas();

  let futureStars = [];
  for (let i = 0; i < 45; i++) {
    futureStars.push({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.5 + 0.5,
      blinkSpeed: Math.random() * 0.02 + 0.005,
      angle: Math.random() * Math.PI
    });
  }

  function drawFutureStars() {
    fCtx.clearRect(0, 0, futureStarsCanvas.width, futureStarsCanvas.height);
    fCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    
    futureStars.forEach(s => {
      s.angle += s.blinkSpeed;
      fCtx.globalAlpha = Math.abs(Math.sin(s.angle)) * 0.6 + 0.2;
      
      const px = s.x * futureStarsCanvas.width;
      const py = s.y * futureStarsCanvas.height;
      
      fCtx.beginPath();
      fCtx.arc(px, py, s.size, 0, Math.PI * 2);
      fCtx.fill();
    });
    
    requestAnimationFrame(drawFutureStars);
  }
  drawFutureStars();

  // Infinity Sparkle Path Tracer
  const path = document.querySelector('.infinity-track');
  const sparkle = document.getElementById('infinity-sparkle');
  
  if (path && sparkle) {
    const pathLength = path.getTotalLength();
    let tracerPosition = 0;
    
    function traceInfinity() {
      tracerPosition = (tracerPosition + 1.2) % pathLength;
      const point = path.getPointAtLength(tracerPosition);
      
      sparkle.setAttribute('cx', point.x);
      sparkle.setAttribute('cy', point.y);
      
      requestAnimationFrame(traceInfinity);
    }
    traceInfinity();
  }


  /* ==========================================================================
     13. FINAL SURPRISE CLIMAX (Fireworks & Confetti Engine)
     ========================================================================== */
  const surpriseCanvas = document.getElementById('surprise-fireworks-canvas');
  const surCtx = surpriseCanvas.getContext('2d');
  const finalHugBtn = document.getElementById('final-hug-btn');
  const climaxReveal = document.getElementById('climax-reveal-box');

  function resizeSurpriseCanvas() {
    const rect = surpriseCanvas.getBoundingClientRect();
    surpriseCanvas.width = rect.width;
    surpriseCanvas.height = rect.height;
  }
  window.addEventListener('resize', resizeSurpriseCanvas);
  resizeSurpriseCanvas();

  let fireworks = [];
  let confetti = [];
  let celebrationActive = false;

  class FireworkParticle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.size = Math.random() * 3 + 1.5;
      
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      
      this.speedX = Math.cos(angle) * speed;
      this.speedY = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.01;
      this.gravity = 0.12;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += this.gravity;
      this.alpha -= this.decay;
    }
    draw() {
      surCtx.save();
      surCtx.globalAlpha = this.alpha;
      surCtx.fillStyle = this.color;
      surCtx.beginPath();
      surCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      surCtx.fill();
      surCtx.restore();
    }
  }

  class ConfettiPiece {
    constructor() {
      this.reset();
      this.y = Math.random() * -surpriseCanvas.height; // Start above screen
    }
    reset() {
      this.x = Math.random() * surpriseCanvas.width;
      this.y = -20;
      this.size = Math.random() * 8 + 5;
      this.speedY = Math.random() * 2.5 + 1.5;
      this.speedX = Math.random() * 2 - 1;
      this.rotation = Math.random() * 360;
      this.spin = Math.random() * 4 - 2;
      this.color = `hsl(${Math.random() * 360}, 100%, 75%)`;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y / 20) * 0.3;
      this.rotation += this.spin;
      
      if (this.y > surpriseCanvas.height) {
        this.reset();
      }
    }
    draw() {
      surCtx.save();
      surCtx.translate(this.x, this.y);
      surCtx.rotate((this.rotation * Math.PI) / 180);
      surCtx.fillStyle = this.color;
      
      // Draw rectangular confetti or heart shape
      surCtx.fillRect(-this.size/2, -this.size/2, this.size, this.size/2);
      surCtx.restore();
    }
  }

  function launchFirework() {
    const rx = Math.random() * surpriseCanvas.width;
    const ry = Math.random() * surpriseCanvas.height * 0.5 + 100; // Upper 50%
    const hue = Math.random() * 360;
    const color = `hsl(${hue}, 100%, 70%)`;
    
    for (let i = 0; i < 60; i++) {
      fireworks.push(new FireworkParticle(rx, ry, color));
    }
  }

  finalHugBtn.addEventListener('click', () => {
    climaxReveal.classList.add('reveal');
    celebrationActive = true;

    // Launch multiple immediate fireworks
    for (let i = 0; i < 4; i++) {
      setTimeout(launchFirework, i * 250);
    }

    // Populate confetti if empty
    if (confetti.length === 0) {
      for (let i = 0; i < 80; i++) {
        confetti.push(new ConfettiPiece());
      }
    }

    // Start auto launching fireworks periodically while page is open
    if (!window.celebrationTimer) {
      window.celebrationTimer = setInterval(launchFirework, 1800);
    }
  });

  function animateCelebration() {
    surCtx.clearRect(0, 0, surpriseCanvas.width, surpriseCanvas.height);

    if (celebrationActive) {
      // Fireworks particles
      fireworks.forEach((p, idx) => {
        p.update();
        p.draw();
        if (p.alpha <= 0) {
          fireworks.splice(idx, 1);
        }
      });

      // Confetti pieces
      confetti.forEach(c => {
        c.update();
        c.draw();
      });
    }

    requestAnimationFrame(animateCelebration);
  }
  animateCelebration();

});
