document.addEventListener('site-data-ready', (e) => {
  const data = e.detail.mission;
  renderMissionIntro(data.intro);
  renderStory(data.story);
  renderValues(data.values);
  renderMissionCta(data.cta);
  initReveal();
});

function renderMissionIntro(intro) {
  const root = document.getElementById('mission-intro-root');
  if (!root) return;

  root.innerHTML = `
    <section class="mission-intro">
      <div class="wrap">
        <div class="eyebrow">${intro.eyebrow}</div>
        <h1>${intro.headline}</h1>
        <p class="sub">${intro.sub}</p>
      </div>
    </section>
  `;
}

function renderStory(story) {
  const root = document.getElementById('mission-story-root');
  if (!root) return;

  root.innerHTML = `
    <section class="story">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <div class="section-num">${story.eyebrow}</div>
            <h2>${story.headline}</h2>
          </div>
        </div>
        <p class="body reveal">${story.body}</p>
      </div>
    </section>
  `;
}

function renderValues(values) {
  const root = document.getElementById('mission-values-root');
  if (!root) return;

  const cards = values.items.map(item => `
    <div class="value-card">
      <h3>${item.title}</h3>
      <p>${item.body}</p>
    </div>
  `).join('');

  root.innerHTML = `
    <section class="values">
      <div class="wrap">
        <div class="section-head reveal">
          <div>
            <div class="section-num">${values.eyebrow}</div>
            <h2>${values.headline}</h2>
          </div>
        </div>
        <div class="values-grid reveal">${cards}</div>
      </div>
    </section>
  `;
}

function renderMissionCta(cta) {
  const root = document.getElementById('mission-cta-root');
  if (!root) return;

  root.innerHTML = `
    <section class="mission-cta reveal">
      <div class="wrap">
        <a href="${cta.href}" class="btn btn-primary">${cta.label}</a>
      </div>
    </section>
  `;
}