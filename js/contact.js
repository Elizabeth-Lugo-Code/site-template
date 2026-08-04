document.addEventListener('site-data-ready', (e) => {
  const businessData = e.detail.business;
  const data = e.detail.contact;
  renderContactIntro(data.intro);
  renderContactForm(data.form);
  renderContactInfo(data.info, businessData);
  initReveal();
});

function renderContactIntro(intro) {
  const root = document.getElementById('contact-intro-root');
  if (!root) return;

  root.innerHTML = `
    <section class="contact-intro">
      <div class="wrap">
        <div class="eyebrow">${intro.eyebrow}</div>
        <h1>${intro.headline}</h1>
        <p class="sub">${intro.sub}</p>
      </div>
    </section>
  `;
}

// Maps a field name (from content.json's form.fields array) to its
// input markup. Add more entries here if a future site needs a field
// type this template doesn't have yet (e.g. "date", "dropdown").
function renderFormField(fieldName) {
  const fieldConfig = {
    name:    { label: 'Name',    type: 'text',  tag: 'input' },
    email:   { label: 'Email',   type: 'email', tag: 'input' },
    phone:   { label: 'Phone',   type: 'tel',   tag: 'input' },
    message: { label: 'Message', tag: 'textarea' }
  };

  const field = fieldConfig[fieldName];
  if (!field) return '';

  const inputHtml = field.tag === 'textarea'
    ? `<textarea id="${fieldName}" name="${fieldName}" rows="5"></textarea>`
    : `<input type="${field.type}" id="${fieldName}" name="${fieldName}">`;

  return `
    <div class="form-field">
      <label for="${fieldName}">${field.label}</label>
      ${inputHtml}
    </div>
  `;
}

function renderContactForm(form) {
  const root = document.getElementById('contact-form-root');
  if (!root) return;

  const fieldsHtml = form.fields.map(renderFormField).join('');

  root.innerHTML = `
    <section class="contact-form-section reveal">
      <div class="wrap">
        <form id="contact-form">
          ${fieldsHtml}
          <button type="submit" class="btn btn-primary">${form.submitLabel}</button>
        </form>
      </div>
    </section>
  `;

  // Placeholder submit handler — swap this for a real form backend
  // (Formspree, Netlify Forms, etc.) when a real site goes live.
  document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Form submission not yet connected to a backend.');
  });
}

function renderContactInfo(info, business) {
  const root = document.getElementById('contact-info-root');
  if (!root) return;

  const addressHtml = info.showAddress && business.address
    ? `<p>${business.address.street}<br>${business.address.city}, ${business.address.state} ${business.address.zip}</p>`
    : '';

  const phoneHtml = info.showPhone && business.phone
    ? `<p><a href="tel:${business.phone}">${business.phone}</a></p>`
    : '';

  const emailHtml = info.showEmail && business.email
    ? `<p><a href="mailto:${business.email}">${business.email}</a></p>`
    : '';

  const socialHtml = info.showSocial ? renderSocialLinks({ business }) : '';

  const mapHtml = info.mapEmbedUrl
    ? `<iframe src="${info.mapEmbedUrl}" class="contact-map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    : '';

  root.innerHTML = `
    <section class="contact-info reveal">
      <div class="wrap">
        ${addressHtml}
        ${phoneHtml}
        ${emailHtml}
        ${socialHtml ? `<ul class="footer-social">${socialHtml}</ul>` : ''}
        ${mapHtml}
      </div>
    </section>
  `;
}