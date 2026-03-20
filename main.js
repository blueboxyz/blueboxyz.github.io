/* ============================================================
   BLUEBO — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Hamburger nav ────────────────────────────────────────
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav = document.querySelector('.nav__mobile');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  // ── Active nav link on scroll ────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"], .nav__mobile a[href^="#"]');

  const highlightNav = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ── Fade-up intersection observer ───────────────────────
  const fadeEls = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger children inside a group
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => observer.observe(el));

  // ── Skill bars animate on view ───────────────────────────
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-bar__fill');
        fills.forEach(fill => {
          fill.style.width = fill.dataset.width;
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  const skillSection = document.querySelector('.about__skills');
  if (skillSection) barObserver.observe(skillSection);

  // ── Portfolio render ─────────────────────────────────────
  renderPortfolio();

  // ── Discord copy button ──────────────────────────────────
  const copyBtn = document.querySelector('.discord-card__copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('bluebo').then(() => {
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = 'Copy Username';
          copyBtn.classList.remove('copied');
        }, 2200);
      });
    });
  }

  // ── Smooth scroll for CTA buttons ───────────────────────
  document.querySelectorAll('a[href^="#"], button[data-scroll]').forEach(el => {
    el.addEventListener('click', (e) => {
      const target = el.dataset.scroll || el.getAttribute('href');
      if (!target || target === '#') return;
      const dest = document.querySelector(target);
      if (dest) {
        e.preventDefault();
        dest.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});

// ── Build portfolio from data file ──────────────────────────
function getYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

function renderPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;
  if (typeof PORTFOLIO_ITEMS === 'undefined' || !PORTFOLIO_ITEMS.length) {
    grid.innerHTML = '<p style="color:var(--grey); font-size:13px;">No portfolio items yet. Add some in portfolio-data.js!</p>';
    return;
  }

  grid.innerHTML = '';

  PORTFOLIO_ITEMS.forEach((item, idx) => {
    const vid = getYouTubeId(item.videoUrl);
    const thumb = vid
      ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg`
      : '';

    const tagsHTML = (item.tags || [])
      .map(t => `<span class="tag">${t}</span>`)
      .join('');

    const card = document.createElement('div');
    card.className = 'portfolio-card fade-up';
    card.dataset.delay = idx * 80;

    card.innerHTML = `
      <div class="portfolio-card__thumb" data-vid="${vid}" data-url="${item.videoUrl}">
        ${thumb
          ? `<img src="${thumb}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover;" loading="lazy">`
          : `<div style="width:100%;height:100%;background:var(--bg3);"></div>`
        }
        <div class="play-overlay">
          <div class="play-btn">
            <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
          </div>
        </div>
      </div>
      <div class="portfolio-card__body">
        <div class="portfolio-card__title">${item.title}</div>
        <div class="portfolio-card__desc">${item.description}</div>
        <div class="portfolio-card__tags">${tagsHTML}</div>
      </div>
    `;

    // Click to embed the video
    card.querySelector('.portfolio-card__thumb').addEventListener('click', function () {
      const vidId = this.dataset.vid;
      if (!vidId) { window.open(item.videoUrl, '_blank'); return; }
      this.innerHTML = `<iframe src="https://www.youtube.com/embed/${vidId}?autoplay=1&rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    });

    grid.appendChild(card);

    // Observe for fade-in
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), idx * 80);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    io.observe(card);
  });
}
