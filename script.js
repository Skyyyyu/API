document.addEventListener('DOMContentLoaded', function () {

  // ---------- Live search / filter ----------
  var input = document.getElementById('docsSearch');
  if (input) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.method-card'));
    var groups = Array.prototype.slice.call(document.querySelectorAll('.letter-group'));
    var emptyState = document.getElementById('searchEmpty');

    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      var anyVisible = false;

      cards.forEach(function (card) {
        var haystack = card.getAttribute('data-search');
        var match = q === '' || haystack.indexOf(q) !== -1;
        card.style.display = match ? '' : 'none';
        card.classList.toggle('is-match-highlight', q !== '' && match);
        if (match) anyVisible = true;
      });

      groups.forEach(function (group) {
        var visibleInGroup = group.querySelectorAll('.method-card:not([style*="display: none"])').length;
        group.style.display = visibleInGroup === 0 ? 'none' : '';
      });

      if (emptyState) emptyState.style.display = anyVisible ? 'none' : 'block';
    });
  }

  // ---------- Copy-to-clipboard on code blocks ----------
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = btn.parentElement.querySelector('code');
      if (!code) return;
      var text = code.innerText;
      navigator.clipboard.writeText(text).then(function () {
        var original = btn.textContent;
        btn.textContent = 'copied';
        setTimeout(function () { btn.textContent = original; }, 1200);
      });
    });
  });

  // ---------- Scrollspy for letter nav (desktop sidebar) ----------
  var letterLinks = document.querySelectorAll('.letter-nav a');
  var letterGroups = document.querySelectorAll('.letter-group');
  if (letterLinks.length && letterGroups.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          letterLinks.forEach(function (l) { l.classList.remove('active'); });
          var match = document.querySelector('.letter-nav a[href="#letter-' + entry.target.id.replace('letter-', '') + '"]');
          if (match) match.classList.add('active');
        }
      });
    }, { rootMargin: '-100px 0px -70% 0px' });
    letterGroups.forEach(function (g) { observer.observe(g); });
  }
});
