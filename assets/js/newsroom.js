/* Windward Free Press - contributor newsroom (sign-in, session, page rendering).
 * MOCK SITE FOR TRAINING. The sign-in is simulated in the browser so the exercise runs from a folder. */

window.WFP = window.WFP || {};

(function () {
  'use strict';

  var KEY = 'wfp_session';
  // Shared contributor login. See onboarding.html.
  var CONTRIBUTOR = { user: 'contributor', pass: 'Ridge-2026', name: 'Contributor (shared)' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function money(n) { return '$' + n.toLocaleString('en-US'); }

  function readSession() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }

  function initLogin() {
    var form = document.getElementById('login-form');
    if (!form) { return; }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var u = document.getElementById('username').value.trim();
      var p = document.getElementById('password').value;
      var err = document.getElementById('login-error');
      if (u === CONTRIBUTOR.user && p === CONTRIBUTOR.pass) {
        localStorage.setItem(KEY, JSON.stringify({ user: u, name: CONTRIBUTOR.name }));
        location.href = 'dashboard.html';
      } else {
        err.hidden = false;
        err.textContent = 'Sign-in failed. Contributors: use the shared login from your onboarding page.';
      }
    });
  }

  function requireSession() {
    var s = readSession();
    if (!s) { location.replace('login.html'); return null; }
    var who = document.getElementById('who');
    if (who) { who.textContent = s.name; }
    var logout = document.getElementById('logout');
    if (logout) {
      logout.addEventListener('click', function (ev) {
        ev.preventDefault();
        localStorage.removeItem(KEY);
        location.href = 'login.html';
      });
    }
    var here = location.pathname.split('/').pop();
    var links = document.querySelectorAll('.nr-nav a');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('href') === here) { links[i].classList.add('is-active'); }
    }
    return s;
  }

  function render() {
    var D = WFP.DATA;
    var el;

    if ((el = document.getElementById('campaign'))) {
      var c = D.campaign;
      var pct = Math.round(c.budgetSpent / c.budgetTotal * 100);
      el.innerHTML =
        '<div class="grid grid--3">' +
          '<div class="card"><div class="stat__label">Client</div><div class="stat__value" style="font-size:1.05rem">' + esc(c.client) + '</div><div class="stat__foot">Campaign: ' + esc(c.name) + '</div></div>' +
          '<div class="card"><div class="stat__label">Budget spent</div><div class="stat__value">' + money(c.budgetSpent) + '</div><div class="bar"><span style="width:' + pct + '%"></span></div><div class="stat__foot">of ' + money(c.budgetTotal) + ' (' + pct + '%)</div></div>' +
          '<div class="card"><div class="stat__label">Site launched</div><div class="stat__value">' + esc(c.launched) + '</div><div class="stat__foot">Disclosure on site: ' + esc(c.disclosure) + '</div></div>' +
        '</div>' +
        '<div class="card"><div class="card__head"><h2>Objective</h2></div><p>' + esc(c.objective) + '</p>' +
        '<div class="memo">' + esc(c.note) + '</div></div>';
    }

    if ((el = document.getElementById('schedule-body'))) {
      el.innerHTML = D.schedule.map(function (r) {
        var cls = r.status === 'published' ? 'badge--ok' : r.status === 'draft' ? 'badge--warn' : 'badge--muted';
        return '<tr><td class="mono">' + esc(r.date) + '</td><td><strong>' + esc(r.headline) + '</strong><br><small class="muted">' + esc(r.slug) + '</small></td>' +
          '<td>' + esc(r.angle) + '</td><td>' + esc(r.talkingPoint) + '</td><td><span class="badge ' + cls + '">' + esc(r.status) + '</span></td></tr>';
      }).join('');
    }

    if ((el = document.getElementById('personas-body'))) {
      el.innerHTML = D.personas.map(function (p) {
        return '<tr><td><strong>' + esc(p.name) + '</strong></td><td>' + esc(p.voice) + '</td><td>' + esc(p.window) + '</td><td>' + esc(p.assigned) + '</td></tr>';
      }).join('');
      var note = document.getElementById('personas-note');
      if (note) { note.textContent = D.personasNote; }
    }

    if ((el = document.getElementById('analytics'))) {
      var A = D.analytics;
      el.innerHTML =
        '<div class="grid grid--3">' +
          '<div class="card"><div class="stat__label">Visits, ' + esc(A.period) + '</div><div class="stat__value">' + A.visits.toLocaleString('en-US') + '</div></div>' +
          '<div class="card"><div class="stat__label">Comments</div><div class="stat__value">' + A.comments.total + '</div><div class="stat__foot">' + A.comments.personas + ' by personas, ' + A.comments.organic + ' organic. ' + esc(A.comments.note) + '</div></div>' +
          '<div class="card"><div class="stat__label">Poll responses</div><div class="stat__value">' + A.poll.responses + '</div><div class="stat__foot">' + esc(A.poll.note) + '</div></div>' +
        '</div>' +
        '<div class="card"><div class="card__head"><h2>Where visits come from</h2></div>' +
        A.sources.map(function (s) {
          return '<div><small>' + esc(s.name) + ': <strong>' + s.pct + '%</strong></small><div class="bar"><span style="width:' + s.pct + '%"></span></div></div>';
        }).join('') + '</div>';
    }

    if ((el = document.getElementById('invoices-body'))) {
      var sum = 0;
      el.innerHTML = D.invoices.map(function (i) {
        sum += i.amount;
        return '<tr><td class="mono">' + esc(i.no) + '</td><td class="mono">' + esc(i.date) + '</td><td>' + esc(i.to) + '</td><td>' + esc(i.item) + '</td><td class="mono">' + money(i.amount) + '</td></tr>';
      }).join('') + '<tr><td colspan="4"><strong>Total billed, September</strong></td><td class="mono"><strong>' + money(sum) + '</strong></td></tr>';
    }

    if ((el = document.getElementById('sources-body'))) {
      el.innerHTML = D.sources.map(function (s) {
        return '<tr><td><strong>' + esc(s.name) + '</strong></td><td>' + esc(s.presentedAs) + '</td><td>' + esc(s.actually) + '</td></tr>';
      }).join('');
    }
  }

  WFP.initLogin = initLogin;
  WFP.requireSession = requireSession;
  WFP.render = render;
})();
