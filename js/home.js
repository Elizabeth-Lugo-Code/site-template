document.addEventListener('site-data-ready', (e) => {
  const data = e.detail.home;
  renderIntro(data.intro);
  renderHighlight(data.highlight1, 'home-highlight1-root');
  renderHighlight(data.highlight2, 'home-highlight2-root');
  renderAbout(data.about);
  initReveal();
});

function renderIntro(intro) {
  const root = document.getElementById('home-intro-root');
  if (!root) return;

  root.innerHTML = `
    <section class="intro">
      <div class="wrap">
        <div class="eyebrow">${intro.eyebrow}</div>
        <h1>${intro.headline}</h1>
        <p class="sub">${intro.sub}</p>
        <div class="intro-ctas">
          <a href="${intro.primaryCta.href}" class="btn btn-primary">${intro.primaryCta.label}</a>
          <a href="${intro.secondaryCta.href}" class="btn btn-ghost">${intro.secondaryCta.label}</a>
        </div>
      </div>
    </section>
  `;
}

// Shared by highlight1 and highlight2 since they're the same shape —
// eyebrow/headline/sub + a grid of items with tag/title/body/featured.
function renderHighlight(highlight, rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;

  const cards = highlight.items.map(item => `
    <div class="highlight-card${item.featured ? ' featured' : ''}">
      <div class="mono">${item.tag}</div>
      <h3>${item.title}</h3>
      <p>${item.body}</p>
    </div>
  `).join('');

  root.innerHTML = `
    <section class="highlight">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <div class="section-num">${highlight.eyebrow}</div>
            <h2>${highlight.headline}</h2>
          </div>
          <p>${highlight.sub}</p>
        </div>
        <div class="highlight-grid reveal">${cards}</div>
      </div>
    </section>
  `;
}

function renderAbout(about) {
  const root = document.getElementById('home-about-root');
  if (!root) return;

  root.innerHTML = `
    <section class="about">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <div class="section-num">${about.eyebrow}</div>
            <h2>${about.headline}</h2>
          </div>
        </div>
        <p class="body reveal">${about.body}</p>
      </div>
    </section>
  `;
}