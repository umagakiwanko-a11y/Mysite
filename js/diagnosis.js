/* ============================================
   diagnosis.js — Service Recommendation Diagnosis
   ============================================ */
(function () {
  const steps = document.querySelectorAll('.diag-step');
  const progressBar = document.getElementById('diagProgress');
  const diagResult = document.getElementById('diagResult');
  const diagRetry = document.getElementById('diagRetry');

  if (!steps.length) return;

  const answers = {};

  const serviceMap = {
    '集客':      { icon: '🌐', label: 'RECOMMENDED SERVICE', title: 'LP制作 / Webサイト制作', desc: '集客・認知度アップには、訴求力の高いLPやWebサイトが有効です。CVR最適化・ファーストビュー設計まで一気通貫でサポートします。', price: '¥60,000〜' },
    '効率化':    { icon: '⚙️', label: 'RECOMMENDED SERVICE', title: '業務改善・自動化', desc: '繰り返し作業やコストのかかる手作業をGAS・AIツールで自動化。業務フロー分析から導入まで伴走します。', price: '¥50,000〜' },
    '整理':      { icon: '📋', label: 'RECOMMENDED SERVICE', title: 'マニュアル制作', desc: '現場に直接入り込み、ノウハウを言語化。録音からAI文字起こし・仕上げまで一気通貫で対応します。', price: '¥30,000〜' },
    'わからない': { icon: '💬', label: 'RECOMMENDED SERVICE', title: 'まずは無料相談', desc: '何から始めればよいか分からない方も大歓迎。ヒアリングを通じて最適なプランをご提案します。', price: '相談無料' },
  };

  const sizeNote = {
    '個人':   '個人事業主・フリーランスの方向けに、コストを抑えたスリムなプランもご相談いただけます。',
    '小規模':  '小規模事業者向けに、スピード感を持って対応します。',
    '中規模':  '中規模企業向けの要件定義・複数人対応も対応可能です。',
  };

  const priorityNote = {
    'スピード':   '⚡ スピード重視のご要望に応えるため、最短2週間での納品を目指します。',
    'コスト':     '💰 コスト重視の方には、必要な機能に絞ったミニマムプランをご提案します。',
    'クオリティ': '✨ クオリティ重視の方には、細部までこだわった丁寧な制作をお約束します。',
  };

  function showStep(stepNum) {
    steps.forEach(function (s) { s.classList.remove('active'); });
    const target = document.querySelector('.diag-step[data-step="' + stepNum + '"]');
    if (target) target.classList.add('active');

    if (progressBar) {
      const pct = stepNum === 'result' ? 100 : (parseInt(stepNum) / 3) * 100;
      progressBar.style.width = pct + '%';
    }
  }

  function showResult() {
    const service = serviceMap[answers.q1] || serviceMap['わからない'];
    const size = sizeNote[answers.q2] || '';
    const priority = priorityNote[answers.q3] || '';

    const html = '<div class="diag-result">'
      + '<div class="diag-result-icon">' + service.icon + '</div>'
      + '<p class="diag-result-label">' + service.label + '</p>'
      + '<p class="diag-result-title">' + service.title + '</p>'
      + '<p class="diag-result-desc">' + service.desc + '</p>'
      + (size ? '<p class="diag-result-desc" style="font-size:0.82rem">' + size + '</p>' : '')
      + (priority ? '<p class="diag-result-desc" style="font-size:0.82rem">' + priority + '</p>' : '')
      + '<span class="diag-result-price">' + service.price + '</span>'
      + '</div>';

    if (diagResult) diagResult.innerHTML = html;
    showStep('result');
  }

  // Option click handler
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.diag-option');
    if (!btn) return;

    const step = btn.closest('.diag-step');
    if (!step) return;
    const stepNum = step.getAttribute('data-step');

    // Highlight selection
    step.querySelectorAll('.diag-option').forEach(function (b) { b.classList.remove('selected'); });
    btn.classList.add('selected');

    answers['q' + stepNum] = btn.getAttribute('data-value');

    setTimeout(function () {
      if (stepNum === '3') {
        showResult();
      } else {
        showStep(parseInt(stepNum) + 1);
      }
    }, 300);
  });

  // Retry
  if (diagRetry) {
    diagRetry.addEventListener('click', function () {
      answers.q1 = answers.q2 = answers.q3 = undefined;
      if (progressBar) progressBar.style.width = '0%';
      document.querySelectorAll('.diag-option').forEach(function (b) { b.classList.remove('selected'); });
      showStep(1);
    });
  }
})();
