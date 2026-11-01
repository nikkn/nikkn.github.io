// Newsletter signup boxes: submit to Kit in the background and answer in place.
// Without JavaScript (or if the request fails), the form posts to Kit directly.
document.querySelectorAll('form.signup-form').forEach(form => {
  const msg = form.parentElement.querySelector('.signup-msg');
  const btn = form.querySelector('button');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    btn.disabled = true;
    msg.textContent = '';
    try {
      const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.status !== 'failed') {
        form.reset();
        form.hidden = true;
        msg.textContent = 'Almost done: please check your inbox and confirm your email.';
      } else {
        msg.textContent = 'That did not work. Please check the address and try again.';
        btn.disabled = false;
      }
    } catch (err) {
      form.submit();
    }
  });
});
