document.addEventListener('site-data-ready', (e) => {
  const data = e.detail;
  renderContact(data.contact, data.business);
  initReveal();
});

function renderContact(contact, business) {
  const heroRoot = document.getElementById('contact-hero-root');
  heroRoot.innerHTML = `
    <section class="contact-hero">
      <div class="wrap">
        <div class="eyebrow">${contact.eyebrow}</div>
        <h1>${contact.headline}</h1>
        <p class="sub">${contact.sub}</p>
      </div>
    </section>
  `;

  const bodyRoot = document.getElementById('contact-body-root');
  bodyRoot.innerHTML = `
    <section>
      <div class="wrap">
        <div class="contact-grid reveal">
          <div class="contact-info">
            <h3>Request your free estimate</h3>
            <p>${contact.sub}</p>
            <div class="contact-detail">
              <span class="mono">Email</span>
              <a href="mailto:${business.email}">${business.email}</a>
            </div>
            <div class="contact-detail">
              <span class="mono">Service</span>
              <span class="val">Interior &amp; exterior remodeling</span>
            </div>
            <div class="contact-detail">
              <span class="mono">Estimates</span>
              <span class="val">Always free</span>
            </div>

            <div class="fb-card">
              <p>${contact.facebookNote}</p>
              <a href="${business.facebook}" target="_blank" rel="noopener" class="btn btn-ghost on-light">${business.facebookLabel} &#8599;</a>
            </div>
          </div>

          <form action="mailto:${business.email}" method="post" enctype="text/plain">
            <div>
              <label for="name">Name</label>
              <input type="text" id="name" name="name" placeholder="Your name" required>
            </div>
            <div>
              <label for="project">Project type</label>
              <input type="text" id="project" name="project" placeholder="e.g. Bathroom remodel, deck, siding">
            </div>
            <div>
              <label for="details">Details</label>
              <textarea id="details" name="details" placeholder="Tell us a bit about the job..."></textarea>
            </div>
            <button type="submit" class="form-btn">Send request</button>
            <p class="form-note">${contact.formNote}</p>
          </form>
        </div>
      </div>
    </section>
  `;
}