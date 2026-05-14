/* ============================================
   cursor.js — Custom Cursor + Light Trail
   ============================================ */
(function () {
  // Skip touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.body.classList.add('cursor-active');

  // Create elements
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let isHovering = false;

  const hoverSelectors = 'a, button, .service-card, .gallery-item, .pricing-card';

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
  });

  // Hover detection
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(hoverSelectors)) {
      isHovering = true;
      ring.classList.add('cursor-ring--hover');
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(hoverSelectors)) {
      isHovering = false;
      ring.classList.remove('cursor-ring--hover');
    }
  });

  // Trail particles
  let lastTrailTime = 0;
  document.addEventListener('mousemove', function (e) {
    const now = Date.now();
    if (now - lastTrailTime < 40) return;
    lastTrailTime = now;

    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
    document.body.appendChild(trail);

    // Random scatter direction
    const angle = Math.random() * Math.PI * 2;
    const dist = 8 + Math.random() * 12;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;

    requestAnimationFrame(function () {
      trail.style.opacity = '0';
      trail.style.transform = 'translate(' + (e.clientX + tx) + 'px, ' + (e.clientY + ty) + 'px)';
    });

    setTimeout(function () {
      if (trail.parentNode) trail.parentNode.removeChild(trail);
    }, 650);
  });

  // rAF loop for ring lerp
  function animate() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px)';
    requestAnimationFrame(animate);
  }
  animate();
})();
