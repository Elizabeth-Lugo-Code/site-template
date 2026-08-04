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

// Simple inline SVG icons — kept dependency-free (no external icon library).
// Add a new key here if a future site needs a platform not listed yet.
const socialIcons = {
  facebook: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H7.9V12h2.6V9.8c0-2.6 1.5-4 3.9-4 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M14 3c.4 2.3 2 3.9 4.3 4.2v2.6c-1.5 0-2.9-.4-4.1-1.2v6.6a5.6 5.6 0 1 1-4.8-5.5v2.7a2.9 2.9 0 1 0 2.1 2.8V3h2.5z"/></svg>`
};

// Builds social links for every platform present in data.business.socialMedia.
// Platforms with an empty URL are skipped. Pass { asIcons: true } to render
// small circular icon buttons (footer) instead of text links.
function renderSocialLinks(data, { asIcons = false } = {}) {
  const social = data.business.socialMedia || {};
  const labels = data.business.socialMediaLabels || {};

  return Object.keys(social)
    .filter(platform => social[platform])
    .map(platform => {
      const label = labels[platform] || platform;

      if (asIcons) {
        const icon = socialIcons[platform] || '';
        return `<li><a class="social-icon" href="${social[platform]}" target="_blank" rel="noopener" aria-label="${label}">${icon}</a></li>`;
      }

      return `<li><a class="social-link" href="${social[platform]}" target="_blank" rel="noopener">${label} &#8599;</a></li>`;
    })
    .join('');
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
    : `<span class="dot"></span>${data.business.name.toUpperCase().replace(' LLC', '')} <span style="font-weight:500; opacity:0.6; font-size:0.85em;">${data.business.shortTag}</span>`;

  const navCta = data.business.navCta;
  const navCtaHtml = navCta && navCta.enabled
    ? `<a href="${navCta.href}" class="nav-cta">${navCta.label}</a>`
    : '';

  const logoPosition = data.business.logoPosition || 'left';

  // Social links removed from nav — they now live in the footer only,
  // rendered as icons instead of text links.
  navRoot.innerHTML = `
    <nav class="logo-pos-${logoPosition}">
      <a href="index.html" class="logo">${logoInner}</a>
      <button class="navlinks-mobile-toggle" id="mobile-toggle" aria-label="Toggle menu" aria-expanded="false">&#9776;</button>
      <ul class="navlinks" id="navlinks">
        ${linksHtml}
      </ul>
      ${navCtaHtml}
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

  const footer = data.footer || {};
  const currentYear = new Date().getFullYear();
  const copyrightName = footer.copyrightName || data.business.name;

  const footerLogoInner = data.business.logo
    ? `<img src="${data.business.logo}" alt="${data.business.name} logo" class="logo-img">`
    : `<span class="dot"></span>${data.business.name.toUpperCase()}`;

  const footerLinksHtml = (footer.links || []).map(link =>
    `<li><a href="${link.href}">${link.label}</a></li>`
  ).join('');

  footerRoot.innerHTML = `
    <footer>
      <div class="wrap">
        <div class="logo">${footerLogoInner}</div>
        <ul class="footer-links">${footerLinksHtml}</ul>
        <ul class="footer-social">${renderSocialLinks(data, { asIcons: true })}</ul>
        <div class="copyright">&copy; ${currentYear} ${copyrightName}. All rights reserved.</div>
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