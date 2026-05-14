/* ============================================
   simulator.js — Estimate Simulator
   ============================================ */
(function () {
  const priceMap = {
    lp:         60000,
    web:        100000,
    automation: 50000,
    system:     100000,
    manual:     30000,
  };

  const optionMap = {
    rush:    { price: 20000, label: '急ぎ対応（2週間以内）', note: '' },
    support: { price: 12000, label: '月額保守サポート', note: '/月' },
    content: { price: 20000, label: 'コンテンツ制作代行', note: '' },
  };

  const serviceLabelMap = {
    lp:         'LP制作',
    web:        'Webサイト制作',
    automation: '業務改善・自動化',
    system:     'システム開発',
    manual:     'マニュアル制作',
  };

  const simTotal = document.getElementById('simTotal');
  const simBreakdown = document.getElementById('simBreakdown');

  if (!simTotal) return;

  let animFrame = null;
  let currentDisplayed = 0;

  function animateNumber(target) {
    if (animFrame) cancelAnimationFrame(animFrame);
    const start = currentDisplayed;
    const startTime = performance.now();
    const duration = 400;

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (target - start) * eased);
      currentDisplayed = value;
      simTotal.textContent = target === 0 ? '---' : '¥' + value.toLocaleString('ja-JP') + '〜';
      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      }
    }
    animFrame = requestAnimationFrame(step);
  }

  function updateSimulator() {
    const activeServices = document.querySelectorAll('.sim-service-btn.active');
    const checkedOptions = document.querySelectorAll('.sim-option-check:checked');

    let total = 0;
    let breakdownHTML = '';

    if (activeServices.length === 0 && checkedOptions.length === 0) {
      animateNumber(0);
      simBreakdown.innerHTML = '<p class="sim-hint">サービスを選んでください</p>';
      return;
    }

    activeServices.forEach(function (btn) {
      const key = btn.getAttribute('data-service');
      const price = priceMap[key] || 0;
      total += price;
      breakdownHTML += '<div class="sim-breakdown-row"><span>' + serviceLabelMap[key] + '</span><span>¥' + price.toLocaleString('ja-JP') + '〜</span></div>';
    });

    checkedOptions.forEach(function (chk) {
      const key = chk.getAttribute('data-option');
      const opt = optionMap[key];
      if (opt) {
        total += opt.price;
        breakdownHTML += '<div class="sim-breakdown-row sim-breakdown-option"><span>' + opt.label + '</span><span>+¥' + opt.price.toLocaleString('ja-JP') + opt.note + '</span></div>';
      }
    });

    animateNumber(total);
    simBreakdown.innerHTML = breakdownHTML || '<p class="sim-hint">サービスを選んでください</p>';
  }

  // Service button toggle
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.sim-service-btn');
    if (!btn) return;
    btn.classList.toggle('active');
    updateSimulator();
  });

  // Option checkbox change
  document.addEventListener('change', function (e) {
    if (e.target.classList.contains('sim-option-check')) {
      updateSimulator();
    }
  });
})();
