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

  // ---- Deep Dive game: 別ページ遷移（iframe廃止） ----
  // スクロール位置を sessionStorage に保存し、戻ってきた時に復元
  const diveBtn = document.getElementById('diveBtn');
  if (diveBtn) {
    diveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.setItem('dive_returnScroll', String(window.scrollY));
      // フェードアウト演出
      document.body.style.transition = 'opacity 0.28s';
      document.body.style.opacity = '0';
      setTimeout(() => {
        window.location.href = 'game/index.html';
      }, 260);
    });
  }
  // ゲームから戻ってきたらスクロール位置復元 + フェードイン
  const ret = sessionStorage.getItem('dive_returnScroll');
  if (ret !== null) {
    sessionStorage.removeItem('dive_returnScroll');
    window.scrollTo(0, parseInt(ret, 10) || 0);
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.4s';
      document.body.style.opacity = '1';
    });
  }

  // ---- Orientation change: 控えめなviewport再計算 ----
  // viewport metaを一瞬書き換えるだけ。displayをnoneにしたりはしない（スクロール阻害になるため）
  function nudgeViewport() {
    const vp = document.querySelector('meta[name="viewport"]');
    if (!vp) return;
    const original = vp.getAttribute('content');
    vp.setAttribute('content', original + ', maximum-scale=1.0');
    requestAnimationFrame(() => vp.setAttribute('content', original));
    window.scrollTo(0, window.scrollY); // 横ズレだけ修正
  }
  window.addEventListener('orientationchange', () => {
    setTimeout(nudgeViewport, 150);
    setTimeout(nudgeViewport, 500);
  });
  // ※ visualViewport.resize は iOS で URL バー伸縮のたびに発火するので
  //   ハンドラを付けない。orientationchangeだけで十分。

  // bfcache から復帰した時、フェード状態のまま固まらないように opacity をリセット
  // (初回ロードのfade-in演出は妨げないため persisted=true のときだけ)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      document.body.style.transition = '';
      document.body.style.opacity = '1';
    }
  });

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
