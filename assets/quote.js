/* Quote request: one FormSubmit AJAX POST, honeypot, time trap, success only on success:"true". */
(function () {
  var form = document.getElementById('quoteForm');
  if (!form) return;
  var PHONE = '1-888-779-2284';
  var TEL = '<a href="tel:+18887792284">' + PHONE + '</a>';
  var started = Date.now();
  var busy = false, sent = false;
  var out = document.getElementById('formStatus');
  var btn = form.querySelector('button[type="submit"]');
  var label = btn.innerHTML;

  function to() { return atob(form.getAttribute('data-u')) + '@' + atob(form.getAttribute('data-d')); }
  function show(kind, html) { out.className = 'fstatus ' + kind; out.innerHTML = html; }
  function field(n) { return form.elements[n]; }

  form.addEventListener('input', function () {
    if (sent && !busy) { sent = false; btn.disabled = false; btn.innerHTML = label; }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy || sent) return;
    var name = field('name'), phone = field('phone'), zip = field('zip'), email = field('email');
    [name, phone, zip, email].forEach(function (i) { i.removeAttribute('aria-invalid'); });
    var wrong = [];
    if (name.value.trim().length < 2) wrong.push(name);
    var d = phone.value.replace(/\D/g, '');
    if (d.length < 10 || d.length > 11) wrong.push(phone);
    if (!/^(\d{5}(-\d{4})?|[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d)$/.test(zip.value.trim())) wrong.push(zip);
    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) wrong.push(email);
    if (wrong.length) {
      wrong.forEach(function (i) { i.setAttribute('aria-invalid', 'true'); });
      wrong[0].focus();
      show('bad', 'Please check the highlighted fields: your name, a phone number with area code, and a ZIP or postal code.');
      return;
    }
    // Bots fill hidden fields; quietly stop.
    if (field('_honey').value) { show('ok', 'Thank you.'); return; }
    if (Date.now() - started < 3500) { show('bad', 'Please wait a moment, then press send again.'); return; }

    var jets = field('jets');
    var payload = {
      name: name.value.trim(),
      phone: phone.value.trim(),
      zip: zip.value.trim(),
      email: email.value.trim(),
      jets_interest: jets ? jets.value : '',
      notes: field('notes').value.trim(),
      page: location.pathname,
      _subject: 'Jetted walk-in tub quote request (walkintubswithjets.com)',
      _template: 'table',
      _captcha: 'false'
    };
    busy = true; btn.disabled = true; btn.textContent = 'Sending...'; show('', '');
    fetch('https://formsubmit.co/ajax/' + to(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.json().catch(function () { return {}; });
    }).then(function (j) {
      if (j && String(j.success) === 'true') {
        sent = true; form.reset(); btn.textContent = 'Request sent';
        show('ok', '<strong>Thank you, your request was sent.</strong> A specialist from Aging Safely Baths will call you, usually within one business day. If you would rather talk now, call ' + TEL + '.');
      } else {
        show('warn', 'Sorry, we could not confirm that your request went through. Please call ' + TEL + ' so it does not get lost.');
      }
    }).catch(function () {
      show('bad', 'Your request did not send. Please check your connection and try again, or call ' + TEL + '.');
    }).then(function () {
      setTimeout(function () {
        busy = false;
        if (!sent) { btn.disabled = false; btn.innerHTML = label; }
      }, 2500);
    });
  });
})();
