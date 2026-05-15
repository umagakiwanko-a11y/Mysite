document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    navbar.classList.toggle('scrolled', current > 60);
    lastScroll = current;
  });

  // ---- Mobile menu ----
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // ---- Scroll reveal ----
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 150);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // ---- Gallery filter ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = navbar.offsetHeight + 20;
        const pos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // 他を閉じる
      document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.style.maxHeight = null;
      });
      // クリックしたものを開閉
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        const answer = btn.nextElementSibling;
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ---- Contact form (Formspree AJAX) ----
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = document.getElementById('submitBtn');
      const msg = document.getElementById('formMessage');

      // バリデーション
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(el => {
        el.classList.remove('input-error');
        if (!el.value.trim()) {
          el.classList.add('input-error');
          valid = false;
        }
      });
      if (!valid) {
        msg.className = 'form-message error visible';
        msg.textContent = '必須項目を入力してください。';
        return;
      }

      // 送信中
      btn.textContent = '送信中...';
      btn.disabled = true;
      btn.classList.add('sending');
      msg.className = 'form-message';
      msg.textContent = '';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          // 成功
          form.reset();
          form.style.display = 'none';
          msg.className = 'form-message success visible';
          msg.innerHTML = `
            <div class="form-success-icon">✓</div>
            <p class="form-success-title">送信が完了しました！</p>
            <p class="form-success-sub">お問い合わせいただきありがとうございます。<br>近日中にご連絡いたします。</p>
          `;
        } else {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'server error');
        }
      } catch {
        // エラー
        msg.className = 'form-message error visible';
        msg.textContent = '送信に失敗しました。時間をおいて再度お試しください。';
        btn.textContent = '送信する';
        btn.disabled = false;
        btn.classList.remove('sending');
      }
    });
  }

  // ---- Deep Dive game modal ----
  const diveBtn   = document.getElementById('diveBtn');
  const gameModal = document.getElementById('gameModal');
  const gameClose = document.getElementById('gameClose');
  const gameFrame = document.getElementById('gameFrame');

  function openGame() {
    gameFrame.src = 'game/index.html';
    gameModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  // 強力リフロー：iOS Safariのビューポート固着バグを解除する複合トリック
  function forceReflow() {
    // 1) viewport meta を一旦書き換えて戻す（ビューポート再計算を促す）
    const vp = document.querySelector('meta[name="viewport"]');
    if (vp) {
      const original = vp.getAttribute('content');
      vp.setAttribute('content', original + ', maximum-scale=1.0');
      // 直後に元へ
      requestAnimationFrame(() => vp.setAttribute('content', original));
    }
    // 2) html を一旦非表示→表示でリフロー強制
    document.documentElement.style.display = 'none';
    void document.documentElement.offsetHeight;
    document.documentElement.style.display = '';
    // 3) 横スクロール位置を強制的に0へ
    window.scrollTo(window.scrollX > 0 ? 0 : window.scrollX, window.scrollY);
    // 4) resize イベント発火
    window.dispatchEvent(new Event('resize'));
  }

  function closeGame() {
    gameModal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { gameFrame.src = ''; }, 350);
    setTimeout(forceReflow, 380);
    setTimeout(forceReflow, 800); // 二段構えでiOS Safariの遅延に対応
  }

  if (diveBtn)   diveBtn.addEventListener('click', openGame);
  if (gameClose) gameClose.addEventListener('click', closeGame);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && gameModal && gameModal.classList.contains('open')) closeGame();
  });

  window.addEventListener('message', e => {
    if (e.data === 'closeGame') closeGame();
    // ゲーム内で画面回転を検知したら、親ページもリフロー
    if (e.data === 'gameOrientationChange') {
      setTimeout(forceReflow, 50);
      setTimeout(forceReflow, 400);
    }
  });

  // ---- Orientation change: force reflow ----
  // iOS Safari等で横→縦に戻した際に vh などが古い値で固定されるのを補正
  window.addEventListener('orientationchange', () => {
    setTimeout(forceReflow, 100);
    setTimeout(forceReflow, 400);
    setTimeout(forceReflow, 900);
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      setTimeout(forceReflow, 50);
    });
  }

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-menu a[href="#${id}"]`);

      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          link.style.color = 'var(--glow)';
        } else {
          link.style.color = '';
        }
      }
    });
  });
});
