const menu = document.querySelector('.menu');
const nav = document.querySelector('#navigation');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
document.querySelectorAll('.languages a').forEach(a => a.addEventListener('click', () => { a.href = a.getAttribute('href').split('#')[0] + location.hash; }));
let toastTimer;
const pt = document.documentElement.lang === 'pt';
if ('serviceWorker' in navigator && location.protocol !== 'file:') window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
function toast(message) { const el = document.querySelector('.toast'); el.textContent = message; el.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 4500); }
document.querySelectorAll('[data-share]').forEach(button => button.addEventListener('click', async () => {
 const url = location.origin + location.pathname + location.hash;
 try {
  if (navigator.share) { await navigator.share({title: document.title, url}); return; }
  if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(url);
  else { const input = document.createElement('textarea'); input.value = url; input.style.position = 'fixed'; input.style.opacity = '0'; document.body.append(input); input.select(); const copied = document.execCommand('copy'); input.remove(); button.focus(); if (!copied) throw new Error('copy'); }
  toast(pt ? 'Ligação copiada.' : 'Link copied.');
 } catch(error) { if (error.name !== 'AbortError') toast(pt ? 'Copie a ligação na barra de endereço para partilhar.' : 'Copy the link from your address bar to share.'); }
}));
