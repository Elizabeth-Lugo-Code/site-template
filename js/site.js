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

// Builds <li> links for every social platform present in data.business.socialMedia.
// Platforms with an empty URL are skipped, so a template with only Instagram
// filled in won't render broken Facebook/TikTok links.
function renderSocialLinks(data) {
  const social = data.business.socialMedia || {};
  const labels = data.business.socialMediaLabels || {};

  return Object.keys(social)
    .filter(platform => social[platform])
    .map(platform => {
      const label = labels[platform] || platform;
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

  // navCta is optional — off by default. A client that wants a persistent
  // action button in the nav (e.g. "Get an estimate", "Book now") just
  // flips enabled to true and fills in label/href; no code changes needed.
  const navCta = data.business.navCta;
  const navCtaHtml = navCta && navCta.enabled
    ? `<a href="${navCta.href}" class="nav-cta">${navCta.label}</a>`
    : '';

  // logoPosition drives a class on <nav> so CSS controls the actual layout.
  const logoPosition = data.business.logoPosition || 'left';

  navRoot.innerHTML = `
    <nav class="logo-pos-${logoPosition}">
      <a href="index.html" class="logo">${logoInner}</a>
      <button class="navlinks-mobile-toggle" id="mobile-toggle" aria-label="Toggle menu" aria-expanded="false">&#9776;</button>
      <ul class="navlinks" id="navlinks">
        ${linksHtml}
        ${renderSocialLinks(data)}
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
        <div class="footer-social">${renderSocialLinks(data)}</div>
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