/*
  site.js
  Shared across every page. Responsible for:
  - Fetching data/content.json once
  - Rendering the nav bar and footer (same on every page)
  - Mobile nav toggle
  - Scroll-reveal animation observer
  - Dispatching 'site-data-ready' so page-specific scripts (home.js, mission.js, contact.js)
    can render their own main content using the same data.
*/

async function loadSiteData() {
  const res = await fetch('data/content.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load content.json');
  return res.json();
}

function renderNav(data) {
  const navRoot = document.getElementById('nav-root');
  if (!navRoot) return;

  const currentPage = document.body.dataset.page;

  const linksHtml = data.nav.map(item => {
    const activeClass = item.page === currentPage ? ' active' : '';
    return `<li><a href="${item.href}" class="${activeClass.trim()}">${item.label}</a></li>`;
  }).join('');

  const logoInner = data.business.logo
    ? `<img src="${data.business.logo}" alt="${data.business.name} logo" class="logo-img"><span class="logo-text">${data.business.name}</span>`
    : `<span class="dot"></span>${data.business.name.toUpperCase().replace(' LLC','')} <span style="font-weight:500; opacity:0.6; font-size:0.85em;">${data.business.shortTag}</span>`;

  navRoot.innerHTML = `
    <nav>
      <a href="index.html" class="logo">${logoInner}</a>
      <button class="navlinks-mobile-toggle" id="mobile-toggle" aria-label="Toggle menu" aria-expanded="false">&#9776;</button>
      <ul class="navlinks" id="navlinks">
        ${linksHtml}
        <li><a class="fb-link" href="${data.business.facebook}" target="_blank" rel="noopener">${data.business.facebookLabel} &#8599;</a></li>
      </ul>
      <a href="contact.html" class="nav-cta">Get an estimate</a>
    </nav>
  `;

  const toggle = document.getElementById('mobile-toggle');
  const links = document.getElementById('navlinks');
  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

function renderFooter(data) {
  const footerRoot = document.getElementById('footer-root');
  if (!footerRoot) return;

  const footerLogoInner = data.business.logo
    ? `<img src="${data.business.logo}" alt="${data.business.name} logo" class="logo-img">`
    : `<span class="dot"></span>${data.business.name.toUpperCase()}`;

  footerRoot.innerHTML = `
    <footer>
      <div class="wrap">
        <div class="logo">${footerLogoInner}</div>
        <div>Construction &amp; Remodeling · Free estimates on any job, big or small</div>
        <div><a href="${data.business.facebook}" target="_blank" rel="noopener">${data.business.facebookLabel} &#8599;</a></div>
      </div>
    </footer>
  `;
}

function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
}

// Boot sequence: load data, render shared chrome, then let the page-specific
// script render main content before wiring up scroll-reveal.
document.addEventListener('DOMContentLoaded', () => {
  loadSiteData()
    .then(data => {
      window.__siteData = data;
      renderNav(data);
      renderFooter(data);
      document.dispatchEvent(new CustomEvent('site-data-ready', { detail: data }));
    })
    .catch(err => {
      console.error(err);
      const main = document.querySelector('main');
      if (main) {
        main.innerHTML = '<div class="wrap" style="padding:80px 0;">Content failed to load. If you\'re opening this file directly (file://), run it through a local server or GitHub Pages instead — browsers block JSON fetches from local files.</div>';
      }
    });
});