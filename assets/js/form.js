/* ============================================================================
   CONTACT FORM
   Progressive enhancement over a real <form>. Validation is inline, on blur
   and on submit — never on every keystroke, which punishes people mid-word.
   ========================================================================== */

const RULES = {
  name: (v) => (v.trim().length >= 2 ? '' : 'Please tell us your name.'),
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address.',
  topic: (v) => (v ? '' : 'Choose what this is about.'),
  message: (v) =>
    v.trim().length >= 10 ? '' : 'A sentence or two is enough to point you the right way.',
};

export function initForm(scope = document) {
  const form = scope.querySelector('[data-contact-form]');
  if (!form) return;

  const fields = [...form.querySelectorAll('[data-field]')];
  const done = scope.querySelector('[data-form-done]');

  const validateOne = (wrap) => {
    const control = wrap.querySelector('.field__control');
    const rule = RULES[control.name];
    if (!rule) return true;
    const msg = rule(control.value);
    wrap.classList.toggle('is-invalid', Boolean(msg));
    control.setAttribute('aria-invalid', msg ? 'true' : 'false');
    const err = wrap.querySelector('.field__error');
    if (err) err.textContent = msg;
    return !msg;
  };

  fields.forEach((wrap) => {
    const control = wrap.querySelector('.field__control');
    control.addEventListener('blur', () => validateOne(wrap));
    control.addEventListener('input', () => {
      if (wrap.classList.contains('is-invalid')) validateOne(wrap);
    });
  });

  /* Pre-tag the topic when arriving from the Partners page CTA. */
  const preset = new URL(window.location.href).searchParams.get('topic');
  const topic = form.querySelector('[name="topic"]');
  if (preset && topic && [...topic.options].some((o) => o.value === preset)) {
    topic.value = preset;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = fields.map(validateOne);
    if (results.includes(false)) {
      const firstBad = fields.find((w) => w.classList.contains('is-invalid'));
      firstBad?.querySelector('.field__control')?.focus();
      return;
    }

    /* No backend is wired on this build — the form hands off to mail so the
       message is never silently lost. Swap this for a POST when the endpoint
       exists; nothing else on the page needs to change. */
    const data = new FormData(form);
    const subject = encodeURIComponent(`[${data.get('topic')}] ${data.get('name')}`);
    const body = encodeURIComponent(
      `${data.get('message')}\n\nFrom: ${data.get('name')} (${data.get('email')})`
    );
    window.location.href = `mailto:hello@startnet.in?subject=${subject}&body=${body}`;

    if (done) {
      done.hidden = false;
      done.focus?.();
    }
  });
}
