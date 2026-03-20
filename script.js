// ─── Copy Discord username ───────────────────────────────────────────────────
function copyDiscord(e) {
  if (e) e.preventDefault();
  navigator.clipboard.writeText('bluebo').catch(() => {});
  const btn = document.querySelector('.discord-copy');
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => { btn.textContent = orig; }, 2000);
}

// ─── Mobile nav toggle ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const navUl  = document.querySelector('nav ul');

  if (toggle && navUl) {
    toggle.addEventListener('click', () => {
      navUl.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navUl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navUl.classList.remove('open'));
    });
  }
});
