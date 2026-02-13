const typingTarget = document.getElementById("typing-target");
const copyEmailButton = document.getElementById("copy-email");
const yearEl = document.getElementById("year");
const navLinks = document.querySelectorAll(".nav-links a");
const revealEls = document.querySelectorAll(".reveal");
const cursorGlow = document.getElementById("cursor-glow");
const fxCanvas = document.getElementById("fx-canvas");

const titlePhrases = [
  "Aspiring AI & ML Engineer",
  "Internship-Ready Problem Solver",
  "Engineering Student with Build Experience"
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function runTyping() {
  if (!typingTarget) return;

  const phrase = titlePhrases[phraseIndex];
  if (!deleting) {
    charIndex += 1;
    typingTarget.textContent = phrase.slice(0, charIndex);
    if (charIndex === phrase.length) {
      deleting = true;
      setTimeout(runTyping, 1200);
      return;
    }
  } else {
    charIndex -= 1;
    typingTarget.textContent = phrase.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % titlePhrases.length;
    }
  }

  setTimeout(runTyping, deleting ? 35 : 60);
}

if (typingTarget) runTyping();

if (copyEmailButton) {
  copyEmailButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("r.jerphin@gmail.com");
      copyEmailButton.textContent = "Email Copied";
      setTimeout(() => {
        copyEmailButton.textContent = "Copy Email";
      }, 1200);
    } catch {
      copyEmailButton.textContent = "Copy failed";
    }
  });
}

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealEls.forEach((el) => revealObserver.observe(el));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.remove("active"));
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add("active");
    });
  },
  { threshold: 0.35 }
);

["projects", "skills", "education", "contact"].forEach((id) => {
  const section = document.getElementById(id);
  if (section) sectionObserver.observe(section);
});

const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;

  document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);

  if (cursorGlow) {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }
});

window.addEventListener("pointerleave", () => {
  if (cursorGlow) cursorGlow.style.opacity = "0";
});

window.addEventListener("pointerenter", () => {
  if (cursorGlow) cursorGlow.style.opacity = "0.55";
});

function initCardTilt() {
  const cards = document.querySelectorAll(
    ".hero-text, .hero-card, .panel, .project-card, .readiness-card, .contact"
  );

  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (window.matchMedia("(max-width: 980px)").matches) return;

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = (0.5 - (y / rect.height)) * 7;

      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

function initFxCanvas() {
  if (!fxCanvas) return;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    fxCanvas.style.display = "none";
    return;
  }

  const ctx = fxCanvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let rafId;

  const particleCount = Math.min(120, Math.max(60, Math.floor(window.innerWidth / 12)));

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    fxCanvas.width = Math.floor(width * dpr);
    fxCanvas.height = Math.floor(height * dpr);
    fxCanvas.style.width = `${width}px`;
    fxCanvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r: Math.random() * 2 + 0.7
    }));
  }

  function connectParticles() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist > maxDist) continue;

        const alpha = (1 - dist / maxDist) * 0.24;
        ctx.strokeStyle = `rgba(119, 167, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  function drawPointerPulse(time) {
    const pulse = 34 + Math.sin(time * 0.0024) * 8;
    const gradient = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, pulse * 4);
    gradient.addColorStop(0, "rgba(84, 240, 255, 0.20)");
    gradient.addColorStop(0.45, "rgba(77, 216, 179, 0.08)");
    gradient.addColorStop(1, "rgba(84, 240, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(pointer.x, pointer.y, pulse * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  function tick(time) {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -20) particle.x = width + 20;
      if (particle.x > width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = height + 20;
      if (particle.y > height + 20) particle.y = -20;

      const distanceToPointer = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);
      if (distanceToPointer < 140) {
        const push = (140 - distanceToPointer) / 140;
        particle.x += (particle.x - pointer.x) * 0.008 * push;
        particle.y += (particle.y - pointer.y) * 0.008 * push;
      }

      ctx.fillStyle = "rgba(84, 240, 255, 0.58)";
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fill();
    });

    connectParticles();
    drawPointerPulse(time);
    rafId = window.requestAnimationFrame(tick);
  }

  resize();
  tick(0);

  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 120);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(rafId);
      return;
    }
    tick(0);
  });
}

initCardTilt();
initFxCanvas();
