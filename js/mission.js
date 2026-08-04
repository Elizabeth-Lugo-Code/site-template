document.addEventListener('site-data-ready', (e) => {
  const data = e.detail;
  renderMission(data.mission);
  initReveal();
});

function renderMission(mission) {
  const heroRoot = document.getElementById('mission-hero-root');
  heroRoot.innerHTML = `
    <section class="mission-hero">
      <div class="wrap">
        <div class="eyebrow">${mission.eyebrow}</div>
        <h1>${mission.headline}</h1>
        <p class="sub">${mission.intro}</p>
      </div>
    </section>
  `;

  const bodyRoot = document.getElementById('mission-body-root');
  const valueCards = mission.values.map(v => `
    <div class="value-card">
      <h3>${v.title}</h3>
      <p>${v.body}</p>
    </div>
  `).join('');

  bodyRoot.innerHTML = `
    <section>
      <div class="wrap">
        <div class="values-grid reveal">${valueCards}</div>
      </div>
      <div class="mission-closing reveal">
        <p>${mission.closing}</p>
        <a href="${mission.cta.href}" class="btn btn-primary">${mission.cta.label}</a>
      </div>
    </section>
  `;
}