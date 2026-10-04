/* Browser smoke test: visit every route, click every button inside each card a few times, report errors. */
(function () {
  var JP = globalThis.JP;
  var errors = [];
  var where = 'start';
  window.addEventListener('error', function (e) { errors.push(where + ': ' + e.message + ' @' + (e.filename || '').split('/').pop() + ':' + e.lineno); });
  var origErr = console.error;
  console.error = function () { errors.push(where + ': console.error ' + Array.prototype.join.call(arguments, ' ')); origErr.apply(console, arguments); };
  window.open = function () { return null; };

  var routes = ['#/', '#/play', '#/insights'];
  var only = (location.search.match(/only=([\w,]+)/) || [])[1];
  JP.content.list().forEach(function (st) {
    if (only && only.split(',').indexOf(st.id) < 0) return;
    st.cards.forEach(function (c, i) { routes.push('#/stage/' + st.id + '/' + (i + 1)); });
    routes.push('#/stage/' + st.id + '/done');
  });
  routes.push('#/insights', '#/');

  function poke(root) {
    root.querySelectorAll('input.answer, textarea.answer, input.cell').forEach(function (el) { if (!el.disabled && !el.value) el.value = '0'; });
    root.querySelectorAll('select.cell').forEach(function (el) { el.value = 'true'; });
    var btns = root.querySelectorAll('button');
    for (var k = 0; k < btns.length; k++) {
      var b = btns[k];
      if (b.disabled || /real Java|Reset|Pause|Play/.test(b.textContent)) continue;
      try { b.click(); } catch (e) { errors.push(where + ': click "' + b.textContent.trim() + '": ' + e.message); }
    }
    root.querySelectorAll('.code-row, .cv-line, [data-line]').forEach(function (el, k) { if (k < 3) el.click(); });
  }

  // press Next until it stops; a disabled Next before the last step is only fine if the question is visible
  function checkStuck(root) {
    root.querySelectorAll('.stepper').forEach(function (st) {
      var ctl = st.querySelector('.st-controls');
      if (!ctl || getComputedStyle(ctl).display === 'none') return;
      var nextBtn = [].filter.call(ctl.querySelectorAll('button'), function (b) { return /Next step/.test(b.textContent); })[0];
      if (!nextBtn) return;
      for (var k = 0; k < 500 && !nextBtn.disabled; k++) nextBtn.click();
      var m = (st.querySelector('.st-count') || {}).textContent.match(/step (\d+) of (\d+)/);
      if (!m || +m[1] >= +m[2]) return;
      var gate = st.querySelector('.st-gate');
      if (!gate || getComputedStyle(gate).display === 'none' || !gate.offsetHeight) errors.push(where + ': Next disabled at ' + m[0] + ' with no visible question');
    });
  }

  var r = 0;
  function next() {
    if (r >= routes.length) {
      document.getElementById('result').textContent = 'SMOKE ' + (errors.length ? 'FAIL\n' + errors.join('\n') : 'OK') + ' (' + routes.length + ' routes)';
      return;
    }
    where = routes[r++];
    location.hash = where;
    setTimeout(function () {
      var main = document.getElementById('main');
      if (!main.children.length) errors.push(where + ': nothing rendered');
      var card = main.querySelector('article.card') || main;
      checkStuck(card);
      for (var round = 0; round < 6; round++) poke(card);
      if (/Content error|Engine error|Unknown card/.test(card.textContent)) errors.push(where + ': ' + card.textContent.match(/(Content error|Engine error|Unknown card)[^\n]{0,120}/)[0]);
      next();
    }, 20);
  }
  JP.router.start();
  setTimeout(next, 50);
})();
