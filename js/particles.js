(() => {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, particles, bubbles, jellies, planktons, dpr;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.15;
      this.speedY = (Math.random() - 0.5) * 0.15;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.01 + 0.005;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += this.pulseSpeed;
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
      if (this.y < -10) this.y = height + 10;
      if (this.y > height + 10) this.y = -10;
    }

    draw() {
      const glow = this.opacity * (0.6 + 0.4 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${glow})`;
      ctx.fill();
      if (this.size > 1) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${glow * 0.1})`;
        ctx.fill();
      }
    }
  }

  class Bubble {
    constructor() {
      this.reset();
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + 20;
      this.size = Math.random() * 3 + 1;
      this.speed = Math.random() * 0.3 + 0.1;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.02 + 0.01;
      this.opacity = Math.random() * 0.08 + 0.02;
    }

    update() {
      this.y -= this.speed;
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * 0.3;
      if (this.y < -20) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 212, 255, ${this.opacity})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }

  class Jellyfish {
    constructor() {
      this.reset();
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + 80;
      this.size = Math.random() * 25 + 18;
      this.speed = Math.random() * 0.1 + 0.04;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.008 + 0.003;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.015 + 0.008;
      this.opacity = Math.random() * 0.12 + 0.08;
      this.tentacles = Math.floor(Math.random() * 4) + 5;
      this.tentaclePhase = Math.random() * Math.PI * 2;
      this.hue = Math.random() > 0.5 ? 190 : 170;
    }

    update() {
      this.y -= this.speed;
      this.wobble += this.wobbleSpeed;
      this.pulse += this.pulseSpeed;
      this.tentaclePhase += 0.012;
      this.x += Math.sin(this.wobble) * 0.4;
      if (this.y < -100) this.reset();
    }

    draw() {
      const breathe = 1 + 0.12 * Math.sin(this.pulse);
      const o = this.opacity * (0.7 + 0.3 * Math.sin(this.pulse));
      const w = this.size * breathe;
      const h = this.size * 0.65 * breathe;

      ctx.save();
      ctx.translate(this.x, this.y);

      // bell (dome)
      ctx.beginPath();
      ctx.ellipse(0, 0, w, h, 0, Math.PI, 0);
      const grad = ctx.createRadialGradient(0, -h * 0.3, 0, 0, 0, w);
      grad.addColorStop(0, `hsla(${this.hue}, 100%, 75%, ${o * 1.5})`);
      grad.addColorStop(0.6, `hsla(${this.hue}, 80%, 60%, ${o * 0.8})`);
      grad.addColorStop(1, `hsla(${this.hue}, 80%, 50%, 0)`);
      ctx.fillStyle = grad;
      ctx.fill();

      // bell edge glow
      ctx.beginPath();
      ctx.ellipse(0, 0, w, h, 0, Math.PI, 0);
      ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, ${o * 0.6})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // inner geometric pattern
      ctx.beginPath();
      ctx.ellipse(0, -h * 0.25, w * 0.5, h * 0.35, 0, Math.PI, 0);
      ctx.strokeStyle = `hsla(${this.hue}, 100%, 80%, ${o * 0.4})`;
      ctx.lineWidth = 0.4;
      ctx.stroke();

      // rim
      ctx.beginPath();
      ctx.ellipse(0, 0, w * 0.95, 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${o * 0.3})`;
      ctx.fill();

      // tentacles
      for (let i = 0; i < this.tentacles; i++) {
        const tx = ((i / (this.tentacles - 1)) - 0.5) * w * 1.6;
        const len = this.size * (0.8 + Math.random() * 0.4);
        const sway = Math.sin(this.tentaclePhase + i * 0.8) * 6;
        const sway2 = Math.sin(this.tentaclePhase * 0.7 + i * 1.2) * 4;

        ctx.beginPath();
        ctx.moveTo(tx, 2);
        ctx.bezierCurveTo(
          tx + sway * 0.5, len * 0.33,
          tx + sway, len * 0.66,
          tx + sway + sway2, len
        );
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, ${o * 0.35})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // bioluminescent dots on tentacles
        if (i % 2 === 0) {
          const dotY = len * 0.5;
          const dotX = tx + sway * 0.5;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 1, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${this.hue}, 100%, 85%, ${o * 0.6 * (0.5 + 0.5 * Math.sin(this.pulse * 2 + i))})`;
          ctx.fill();
        }
      }

      ctx.restore();
    }
  }

  class Plankton {
    constructor() {
      this.reset();
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.08;
      this.speedY = -Math.random() * 0.06 - 0.02;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
      this.type = Math.floor(Math.random() * 3);
      this.hue = 160 + Math.random() * 40;
      this.opacity = Math.random() * 0.3 + 0.12;
      this.angle = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.01;
    }

    update() {
      this.x += this.speedX + Math.sin(this.pulse) * 0.1;
      this.y += this.speedY;
      this.pulse += this.pulseSpeed;
      this.angle += this.rotSpeed;
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) { this.y = height + 20; this.x = Math.random() * width; }
    }

    draw() {
      const glow = this.opacity * (0.5 + 0.5 * Math.sin(this.pulse));
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      if (this.type === 0) {
        // diamond shape
        const s = this.size;
        ctx.beginPath();
        ctx.moveTo(0, -s * 2);
        ctx.lineTo(s, 0);
        ctx.lineTo(0, s * 2);
        ctx.lineTo(-s, 0);
        ctx.closePath();
        ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${glow * 0.5})`;
        ctx.fill();
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 80%, ${glow})`;
        ctx.lineWidth = 0.3;
        ctx.stroke();
      } else if (this.type === 1) {
        // ring with cross
        const s = this.size * 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, s, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 75%, ${glow * 0.6})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s * 0.5, 0); ctx.lineTo(s * 0.5, 0);
        ctx.moveTo(0, -s * 0.5); ctx.lineTo(0, s * 0.5);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 80%, ${glow * 0.3})`;
        ctx.lineWidth = 0.3;
        ctx.stroke();
      } else {
        // triangle
        const s = this.size * 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -s * 1.5);
        ctx.lineTo(s * 1.3, s * 0.75);
        ctx.lineTo(-s * 1.3, s * 0.75);
        ctx.closePath();
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 75%, ${glow * 0.7})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 85%, ${glow * 0.4})`;
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function init() {
    resize();
    const count = Math.min(Math.floor((width * height) / 12000), 120);
    particles = Array.from({ length: count }, () => new Particle());
    bubbles = Array.from({ length: 15 }, () => new Bubble());
    jellies = Array.from({ length: 3 }, () => new Jellyfish());
    planktons = Array.from({ length: 30 }, () => new Plankton());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.06;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => { p.update(); p.draw(); });
    bubbles.forEach(b => { b.update(); b.draw(); });
    jellies.forEach(j => { j.update(); j.draw(); });
    planktons.forEach(p => { p.update(); p.draw(); });
    drawConnections();

    requestAnimationFrame(animate);
  }

  init();
  animate();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });
})();
