/* ============================================
   Primelo — 3D Watch & Interactions
   ============================================ */

(function () {
  'use strict';

  /* ---------- Navbar ---------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ---------- 3D Watch — Hero ---------- */
  function initHeroWatch() {
    const canvas = document.getElementById('watchCanvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    /* Lights */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff5e0, 1.2);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xc9a84c, 0.6);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x4488ff, 0.3);
    fillLight.position.set(-3, -2, 4);
    scene.add(fillLight);

    /* Watch Group */
    const watchGroup = new THREE.Group();
    scene.add(watchGroup);

    /* Materials */
    const caseMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      metalness: 0.95,
      roughness: 0.15,
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      metalness: 0.9,
      roughness: 0.2,
    });

    const dialMat = new THREE.MeshStandardMaterial({
      color: 0x0B1D3A,
      metalness: 0.3,
      roughness: 0.5,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      transmission: 0.95,
      thickness: 0.2,
      transparent: true,
      opacity: 0.25,
    });

    const strapMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.1,
      roughness: 0.8,
    });

    /* Case Body */
    const caseGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.45, 64);
    const caseMesh = new THREE.Mesh(caseGeo, caseMat);
    watchGroup.add(caseMesh);

    /* Bezel Ring */
    const bezelGeo = new THREE.TorusGeometry(1.32, 0.06, 16, 64);
    const bezelTop = new THREE.Mesh(bezelGeo, goldMat);
    bezelTop.position.y = 0.22;
    bezelTop.rotation.x = Math.PI / 2;
    watchGroup.add(bezelTop);

    const bezelBottom = bezelTop.clone();
    bezelBottom.position.y = -0.22;
    watchGroup.add(bezelBottom);

    /* Dial Face */
    const dialGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.02, 64);
    const dialMesh = new THREE.Mesh(dialGeo, dialMat);
    dialMesh.position.y = 0.22;
    watchGroup.add(dialMesh);

    /* Hour Markers */
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const isMain = i % 3 === 0;
      const markerGeo = new THREE.BoxGeometry(
        isMain ? 0.06 : 0.03,
        0.02,
        isMain ? 0.18 : 0.1
      );
      const marker = new THREE.Mesh(markerGeo, goldMat);
      const radius = 1.0;
      marker.position.set(
        Math.sin(angle) * radius,
        0.235,
        Math.cos(angle) * radius
      );
      marker.rotation.y = -angle;
      watchGroup.add(marker);
    }

    /* Watch Hands */
    // Hour hand
    const hourHandGeo = new THREE.BoxGeometry(0.05, 0.02, 0.55);
    const hourHand = new THREE.Mesh(hourHandGeo, goldMat);
    hourHand.position.set(0, 0.25, 0.22);
    hourHand.rotation.x = -0.3;
    watchGroup.add(hourHand);

    // Minute hand
    const minuteHandGeo = new THREE.BoxGeometry(0.035, 0.02, 0.75);
    const minuteHand = new THREE.Mesh(minuteHandGeo, new THREE.MeshStandardMaterial({
      color: 0xeeeeee, metalness: 0.8, roughness: 0.2
    }));
    minuteHand.position.set(0.2, 0.25, -0.15);
    minuteHand.rotation.y = 0.5;
    watchGroup.add(minuteHand);

    // Seconds hand
    const secondsHandGeo = new THREE.BoxGeometry(0.015, 0.02, 0.85);
    const secondsHand = new THREE.Mesh(secondsHandGeo, new THREE.MeshStandardMaterial({
      color: 0xc9a84c, metalness: 0.9, roughness: 0.1
    }));
    secondsHand.position.set(-0.1, 0.26, 0.3);
    secondsHand.rotation.y = -0.8;
    watchGroup.add(secondsHand);

    // Center pin
    const centerPinGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 16);
    const centerPin = new THREE.Mesh(centerPinGeo, goldMat);
    centerPin.position.y = 0.26;
    watchGroup.add(centerPin);

    /* Glass / Crystal */
    const glassGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.06, 64);
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.y = 0.26;
    watchGroup.add(glassMesh);

    /* Crown */
    const crownGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.25, 16);
    const crown = new THREE.Mesh(crownGeo, goldMat);
    crown.position.set(1.48, 0, 0);
    crown.rotation.z = Math.PI / 2;
    watchGroup.add(crown);

    /* Lugs and Strap */
    const lugGeo = new THREE.BoxGeometry(0.35, 0.12, 0.5);
    const lugPositions = [
      { x: -0.55, z: 1.45 },
      { x: 0.55, z: 1.45 },
      { x: -0.55, z: -1.45 },
      { x: 0.55, z: -1.45 },
    ];

    lugPositions.forEach(pos => {
      const lug = new THREE.Mesh(lugGeo, caseMat);
      lug.position.set(pos.x, 0, pos.z);
      watchGroup.add(lug);
    });

    // Strap segments (top and bottom)
    const strapGeo = new THREE.BoxGeometry(1.0, 0.15, 1.8);
    const strapTop = new THREE.Mesh(strapGeo, strapMat);
    strapTop.position.set(0, -0.02, 2.3);
    watchGroup.add(strapTop);

    const strapBottom = new THREE.Mesh(strapGeo, strapMat);
    strapBottom.position.set(0, -0.02, -2.3);
    watchGroup.add(strapBottom);

    // Strap taper (rounded ends)
    const strapEndGeo = new THREE.BoxGeometry(0.85, 0.13, 1.2);
    const strapEndTop = new THREE.Mesh(strapEndGeo, strapMat);
    strapEndTop.position.set(0, -0.02, 3.7);
    watchGroup.add(strapEndTop);

    const strapEndBottom = new THREE.Mesh(strapEndGeo, strapMat);
    strapEndBottom.position.set(0, -0.02, -3.7);
    watchGroup.add(strapEndBottom);

    /* Strap buckle */
    const buckleGeo = new THREE.TorusGeometry(0.3, 0.04, 8, 16, Math.PI);
    const buckle = new THREE.Mesh(buckleGeo, goldMat);
    buckle.position.set(0, 0.05, 4.4);
    buckle.rotation.x = Math.PI / 2;
    watchGroup.add(buckle);

    /* Sub-dial decoration */
    const subDialGeo = new THREE.RingGeometry(0.18, 0.22, 32);
    const subDialMat = new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      metalness: 0.8,
      roughness: 0.3,
      side: THREE.DoubleSide,
    });
    const subDial = new THREE.Mesh(subDialGeo, subDialMat);
    subDial.position.set(0, 0.235, -0.45);
    subDial.rotation.x = -Math.PI / 2;
    watchGroup.add(subDial);

    /* Primelo text ring (decorative tiny marks) */
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const dotGeo = new THREE.SphereGeometry(0.01, 4, 4);
      const dot = new THREE.Mesh(dotGeo, goldMat);
      dot.position.set(
        Math.sin(angle) * 1.15,
        0.235,
        Math.cos(angle) * 1.15
      );
      watchGroup.add(dot);
    }

    /* Initial tilt */
    watchGroup.rotation.x = 0.8;
    watchGroup.rotation.z = 0.1;

    /* Scroll-driven rotation with GSAP */
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(watchGroup.rotation, {
      y: Math.PI * 2,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    // Move watch out of view as user scrolls past hero
    gsap.to(watchGroup.position, {
      y: -3,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: '60% top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    gsap.to(watchGroup.rotation, {
      x: 0.2,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: '60% top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    /* Animate loop */
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.005;

      // Gentle floating motion
      watchGroup.position.x = Math.sin(time) * 0.05;
      watchGroup.position.y += Math.sin(time * 2) * 0.0005;

      // Subtle rotation breathing
      watchGroup.rotation.z = 0.1 + Math.sin(time) * 0.02;

      renderer.render(scene, camera);
    }
    animate();

    /* Resize */
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ---------- 3D Watch — About Section ---------- */
  function initAboutWatch() {
    const canvas = document.getElementById('aboutCanvas');
    if (!canvas) return;

    const parent = canvas.parentElement;
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xc9a84c, 1.0);
    dirLight.position.set(3, 5, 3);
    scene.add(dirLight);

    const backLight = new THREE.PointLight(0x4466aa, 0.4);
    backLight.position.set(-3, -1, -3);
    scene.add(backLight);

    /* Minimalist watch — case back view */
    const group = new THREE.Group();

    const caseMat = new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      metalness: 0.85,
      roughness: 0.2,
    });

    const caseGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.4, 64);
    const caseMesh = new THREE.Mesh(caseGeo, caseMat);
    group.add(caseMesh);

    // Engravings (decorative rings)
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(0.4 + i * 0.3, 0.015, 8, 48);
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshStandardMaterial({
        color: 0x0B1D3A, metalness: 0.5, roughness: 0.4
      }));
      ring.position.y = -0.21;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }

    // Crown
    const crownGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 12);
    const crown = new THREE.Mesh(crownGeo, caseMat);
    crown.position.set(1.35, 0, 0);
    crown.rotation.z = Math.PI / 2;
    group.add(crown);

    group.rotation.x = 0.4;
    scene.add(group);

    function animate() {
      requestAnimationFrame(animate);
      group.rotation.y += 0.008;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      const pw = parent.clientWidth;
      const ph = parent.clientHeight;
      camera.aspect = pw / ph;
      camera.updateProjectionMatrix();
      renderer.setSize(pw, ph);
    });
  }

  /* ---------- Scroll Reveal ---------- */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.product-card, .process-step, .testimonial-card'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.aosDelay || 0;
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, parseInt(delay, 10));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  /* ---------- Stat Counter ---------- */
  function initStatCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            let current = 0;
            const duration = 2000;
            const step = target / (duration / 16);

            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              el.textContent = Math.floor(current);
            }, 16);

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /* ---------- Contact Form ---------- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn');
      btn.textContent = 'Sent!';
      btn.style.background = '#2ecc71';
      setTimeout(() => {
        btn.textContent = 'Send Inquiry';
        btn.style.background = '';
        form.reset();
      }, 2500);
    });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ---------- Particles Background (subtle) ---------- */
  function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0.3;';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    const count = 50;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity})`;
        ctx.fill();
      });

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201, 168, 76, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* ---------- Init Everything ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initHeroWatch();
    initAboutWatch();
    initScrollReveal();
    initStatCounters();
    initContactForm();
    initSmoothScroll();
    initParticles();
  });
})();
