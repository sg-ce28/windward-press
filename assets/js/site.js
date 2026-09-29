/* Windward Free Press - public site behaviour (comments, poll, forms).  MOCK SITE FOR TRAINING. */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function initials(name) {
    return name.split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
  }

  // Comments under an article.
  var list = document.getElementById('comment-list');
  if (list) {
    var slug = list.getAttribute('data-article');
    var items = (WFP.DATA.comments[slug] || []);
    list.innerHTML = items.map(function (c) {
      return '<div class="comment"><div class="comment__avatar">' + esc(initials(c.who)) + '</div><div>' +
        '<div class="comment__meta"><strong>' + esc(c.who) + '</strong> · ' + esc(c.when) + '</div>' +
        '<p>' + esc(c.text) + '</p></div></div>';
    }).join('') || '<p class="muted">No comments yet.</p>';
    var count = document.getElementById('comment-count');
    if (count) { count.textContent = items.length; }
  }

  var cform = document.getElementById('comment-form');
  if (cform) {
    cform.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var out = document.getElementById('comment-result');
      out.hidden = false;
      out.className = 'alert alert--ok';
      out.textContent = 'Thanks. Comments are reviewed by our engagement desk before they appear. (Training site: nothing was sent.)';
      cform.reset();
    });
  }

  // Sidebar poll.
  var poll = document.getElementById('poll');
  if (poll) {
    var P = WFP.DATA.poll;
    var total = P.counts.reduce(function (a, b) { return a + b; }, 0);
    var q = document.getElementById('poll-q');
    q.textContent = P.question;
    var opts = document.getElementById('poll-opts');
    opts.innerHTML = P.options.map(function (o, i) {
      return '<label class="poll__opt"><input type="radio" name="poll" value="' + i + '"> ' + esc(o) + '</label>';
    }).join('');
    var results = document.getElementById('poll-results');
    function showResults() {
      results.hidden = false;
      results.innerHTML = P.options.map(function (o, i) {
        var pct = Math.round(P.counts[i] / total * 100);
        return '<div><small>' + esc(o) + ': <strong>' + pct + '%</strong></small><div class="poll__bar"><span style="width:' + pct + '%"></span></div></div>';
      }).join('') + '<div class="poll__meta">' + esc(P.note) + '</div>';
    }
    document.getElementById('poll-vote').addEventListener('click', function () {
      showResults();
      document.getElementById('poll-thanks').hidden = false;
    });
    document.getElementById('poll-show').addEventListener('click', function (ev) { ev.preventDefault(); showResults(); });
  }

  // Contact / tips form.
  var tform = document.getElementById('contact-form');
  if (tform) {
    tform.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var out = document.getElementById('contact-result');
      out.hidden = false;
      out.className = 'alert alert--ok';
      out.textContent = 'Message received. (Training site: nothing was sent.)';
      tform.reset();
    });
  }
})();
