/* ============================================
   skillmap.js — Skill Map Canvas
   ============================================ */
(function () {
  const canvas = document.getElementById('skillmap-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const nodes = [
    { id: 'ai',     label: 'AI活用',       sub: 'ChatGPT / 文字起こし / 自動化', x: 0.5,  y: 0.5,  r: 28, special: true },
    { id: 'html',   label: 'HTML / CSS',   sub: 'レスポンシブ・アニメーション',  x: 0.18, y: 0.28 },
    { id: 'js',     label: 'JavaScript',   sub: 'DOM・Canvas・API非同期',        x: 0.36, y: 0.13 },
    { id: 'design', label: 'Web Design',   sub: 'UIデザイン・配色・タイポ',       x: 0.64, y: 0.13 },
    { id: 'lp',     label: 'LP制作',        sub: 'CTA設計・CVR最適化',            x: 0.82, y: 0.28 },
    { id: 'biz',    label: '業務改善',      sub: 'フロー分析・ツール導入',         x: 0.86, y: 0.58 },
    { id: 'gas',    label: '自動化/GAS',    sub: 'スプレッドシート・通知連携',     x: 0.7,  y: 0.82 },
    { id: 'manual', label: 'マニュアル',    sub: '現場密着・AI文字起こし',         x: 0.34, y: 0.87 },
    { id: 'sys',    label: 'システム開発',  sub: 'API連携・DB設計',               x: 0.15, y: 0.65 },
  ];

  const edges = [
    ['ai','html'],['ai','js'],['ai','biz'],['ai','manual'],['ai','gas'],
    ['html','js'],['js','design'],['design','lp'],
    ['lp','biz'],['biz','gas'],['gas','sys'],['gas','manual'],
  ];

  let width, height, dpr;
  let pulse = 0;
  let hoveredNode = null;
  let touchResetTimer = null;

  function resize() {
    const parent = canvas.parentElement;
    dpr = window.devicePixelRatio || 1;
    width = parent.clientWidth;
    height = Math.min(Math.round(width * 0.65), 440);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  function getNodePos(node) {
    return { x: node.x * width, y: node.y * height };
  }

  function getNodeRadius(node) {
    return node.r || 20;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    pulse += 0.04;

    // Draw edges
    edges.forEach(function (edge) {
      const a = nodes.find(function (n) { return n.id === edge[0]; });
      const b = nodes.find(function (n) { return n.id === edge[1]; });
      if (!a || !b) return;

      const pa = getNodePos(a);
      const pb = getNodePos(b);

      const isHighlighted = hoveredNode && (hoveredNode.id === a.id || hoveredNode.id === b.id);

      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.strokeStyle = isHighlighted ? 'rgba(0,212,255,0.55)' : 'rgba(0,212,255,0.12)';
      ctx.lineWidth = isHighlighted ? 1.5 : 1;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(function (node) {
      const p = getNodePos(node);
      const r = getNodeRadius(node);
      const isHovered = hoveredNode && hoveredNode.id === node.id;

      if (node.special) {
        // Pulse glow for AI node
        const glowSize = r + 8 + Math.sin(pulse) * 5;
        const grad = ctx.createRadialGradient(p.x, p.y, r * 0.3, p.x, p.y, glowSize);
        grad.addColorStop(0, 'rgba(0,255,204,0.25)');
        grad.addColorStop(1, 'rgba(0,255,204,0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      if (isHovered) {
        // Glow halo
        const haloGrad = ctx.createRadialGradient(p.x, p.y, r, p.x, p.y, r + 14);
        haloGrad.addColorStop(0, 'rgba(0,212,255,0.3)');
        haloGrad.addColorStop(1, 'rgba(0,212,255,0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 14, 0, Math.PI * 2);
        ctx.fillStyle = haloGrad;
        ctx.fill();
      }

      // Node circle
      const nodeGrad = ctx.createRadialGradient(p.x - r * 0.3, p.y - r * 0.3, 0, p.x, p.y, r);
      if (node.special) {
        nodeGrad.addColorStop(0, 'rgba(0,255,204,0.35)');
        nodeGrad.addColorStop(1, 'rgba(0,255,204,0.08)');
      } else {
        nodeGrad.addColorStop(0, 'rgba(0,212,255,0.22)');
        nodeGrad.addColorStop(1, 'rgba(0,212,255,0.04)');
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = nodeGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = node.special
        ? (isHovered ? 'rgba(0,255,204,0.9)' : 'rgba(0,255,204,0.5)')
        : (isHovered ? 'rgba(0,212,255,0.8)' : 'rgba(0,212,255,0.3)');
      ctx.lineWidth = node.special ? 1.5 : 1;
      ctx.stroke();

      // Label
      ctx.fillStyle = node.special ? '#00ffcc' : (isHovered ? '#ffffff' : '#8bafc4');
      ctx.font = (node.special ? '600 ' : '500 ') + (r > 22 ? '11px' : '10px') + " 'Outfit', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, p.x, p.y);

      // Tooltip for hovered node
      if (isHovered && node.sub) {
        const padding = 8;
        ctx.font = "11px 'Noto Sans JP', sans-serif";
        const textW = ctx.measureText(node.sub).width;
        const boxW = textW + padding * 2;
        const boxH = 26;
        let tx = p.x - boxW / 2;
        let ty = p.y - r - boxH - 6;

        // Clamp to canvas
        tx = Math.max(4, Math.min(width - boxW - 4, tx));
        ty = Math.max(4, ty);

        // RoundRect fallback
        ctx.fillStyle = 'rgba(10,22,40,0.92)';
        ctx.strokeStyle = 'rgba(0,212,255,0.35)';
        ctx.lineWidth = 1;
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(tx, ty, boxW, boxH, 5);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillRect(tx, ty, boxW, boxH);
          ctx.strokeRect(tx, ty, boxW, boxH);
        }

        ctx.fillStyle = 'rgba(139,175,196,0.95)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.sub, tx + padding, ty + boxH / 2);
      }
    });

    requestAnimationFrame(draw);
  }

  function getHoveredNode(x, y) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const p = getNodePos(node);
      const r = getNodeRadius(node);
      const dist = Math.hypot(x - p.x, y - p.y);
      if (dist <= r + 4) return node;
    }
    return null;
  }

  canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    hoveredNode = getHoveredNode(x, y);
    canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
  });

  canvas.addEventListener('mouseleave', function () {
    hoveredNode = null;
    canvas.style.cursor = 'default';
  });

  canvas.addEventListener('touchstart', function (e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    hoveredNode = getHoveredNode(x, y);

    if (touchResetTimer) clearTimeout(touchResetTimer);
    touchResetTimer = setTimeout(function () {
      hoveredNode = null;
    }, 1500);
  }, { passive: true });

  // Debounced resize
  let resizeTimer = null;
  window.addEventListener('resize', function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
    }, 150);
  });

  resize();
  draw();
})();
