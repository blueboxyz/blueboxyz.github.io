function copyDiscord(e) {
  if (e) e.preventDefault();
  navigator.clipboard.writeText('bluebo').catch(() => {});
  const btn = document.querySelector('.discord-copy');
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => { btn.textContent = orig; }, 2000);
}
