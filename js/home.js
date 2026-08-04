document.addEventListener('site-data-ready', (e) => {
  const data = e.detail;
  renderHero(data.hero);
  renderServices(data.services);
  renderProcess(data.process);
  renderAboutTeaser(data.aboutTeaser);
  initReveal();
});

function renderHero(hero) {
  const root = document.getElementById('hero-root');
  root.innerHTML = `
    <section class="hero">
      <div class="wrap">
        <div class="eyebrow">${hero.eyebrow}</div>
        <h1>${hero.headline}<br><em>${hero.headlineAccent}</em></h1>
        <p class="sub">${hero.sub}</p>
        <div class="hero-ctas">
          <a href="${hero.primaryCta.href}" class="btn btn-primary">${hero.primaryCta.label}</a>
          <a href="${hero.secondaryCta.href}" class="btn btn-ghost">${hero.secondaryCta.label}</a>
        </div>
        <div class="level" aria-hidden="true">
          <div class="level-track">
            <div class="level-ticks">
              ${'<span></span>'.repeat(11)}
            </div>
            <div class="bubble"></div>
          </div>
          <div class="level-label">${hero.levelLabel}</div>
        </div>
      </div>
    </section>
  `;
}

function renderServices(services) {
  const root = document.getElementById('services-root');
  const cards = services.items.map(item => `
    <div class="service-card${item.featured ? ' featured' : ''}">
      <div class="mono">${item.tag}</div>
      <h3>${item.title}</h3>
      <p>${item.body}</p>
    </div>
  `).join('');

  root.innerHTML = `
    <section class="services" id="services">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <div class="section-num">${services.eyebrow}</div>
            <h2>${services.headline}</h2>
          </div>
          <p>${services.sub}</p>
        </div>
        <div class="service-grid reveal">${cards}</div>
      </div>
    </section>
  `;
}

function renderProcess(process) {
  const root = document.getElementById('process-root');
  const steps = process.steps.map(step => `
    <div class="step">
      <span class="num">${step.num}</span>
      <h3>${step.title}</h3>
      <p>${step.body}</p>
    </div>
  `).join('');

  root.innerHTML = `
    <section class="process" id="process">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <div class="section-num">${process.eyebrow}</div>
            <h2>${process.headline}</h2>
          </div>
          <p>${process.sub}</p>
        </div>
        <div class="process-steps reveal">${steps}</div>
      </div>
    </section>
  `;
}

function renderAboutTeaser(about) {
  const root = document.getElementById('about-root');
  root.innerHTML = `
    <section class="about" id="about">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <div class="section-num">${about.eyebrow}</div>
            <h2>${about.headline}</h2>
          </div>
        </div>
        <p class="about-quote reveal">&ldquo;${about.quote}&rdquo;</p>
        <p class="body reveal">${about.body}</p>
        <a href="${about.link.href}" class="text-link reveal">${about.link.label} &rarr;</a>
      </div>
    </section>
  `;
}