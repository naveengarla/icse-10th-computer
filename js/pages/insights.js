/* For the parent: time spent, where she struggles, paper-task confidence, export. */
(function () {
  var JP = globalThis.JP;
  var h = JP.dom.h;

  function mins(ms) { return Math.round(ms / 60000) + ' min'; }
  function when(t) { var d = new Date(t); return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }

  JP.pages.insights = {
    render: function (main) {
      var data = JP.store.data();
      var stages = JP.content.list();
      main.appendChild(h('div.page-head', h('h1', 'For parents'), h('p.muted', 'What she has done, and where she is getting stuck. Everything is stored only in this browser.')));

      // per stage
      main.appendChild(h('h2', 'Progress by stage'));
      main.appendChild(h('table.data',
        h('thead', h('tr', h('th', 'Stage'), h('th', 'Cards done'), h('th', 'Time spent'), h('th', 'Planned'), h('th', 'Answers right first time'))),
        h('tbody', stages.map(function (st) {
          var s = data.stages[st.id] || { ms: 0 };
          var att = data.attempts.filter(function (a) { return a.stage === st.id; });
          var firstByItem = {};
          att.forEach(function (a) { var k = a.card + '|' + a.item; if (!(k in firstByItem)) firstByItem[k] = a.ok; });
          var keys = Object.keys(firstByItem);
          var right = keys.filter(function (k) { return firstByItem[k]; }).length;
          return h('tr', h('td', st.n === 99 ? 'Checkpoint' : st.n + '. ' + st.title), h('td', JP.store.doneCount(st) + ' / ' + st.cards.length), h('td', mins(s.ms || 0)), h('td', st.minutes + ' min'),
            h('td', keys.length ? right + ' / ' + keys.length + ' (' + Math.round(100 * right / keys.length) + '%)' : '—'));
        }))));

      // struggles
      var groups = {};
      data.attempts.forEach(function (a) {
        var k = a.stage + '|' + a.card + '|' + a.item;
        (groups[k] = groups[k] || { a: a, wrong: [], tries: 0, solved: false }).tries++;
        if (a.ok) groups[k].solved = true; else groups[k].wrong.push(a);
      });
      var hard = Object.keys(groups).map(function (k) { return groups[k]; }).filter(function (g) { return g.wrong.length; })
        .sort(function (x, y) { return y.wrong.length - x.wrong.length; });
      main.appendChild(h('h2', 'Where she went wrong'));
      if (!hard.length) main.appendChild(h('p.muted', 'No wrong answers recorded yet.'));
      else main.appendChild(h('table.data',
        h('thead', h('tr', h('th', 'Where'), h('th', 'Question'), h('th', 'Wrong tries'), h('th', 'What she answered'), h('th', 'Correct'), h('th', 'Solved?'))),
        h('tbody', hard.slice(0, 60).map(function (g) {
          var st = JP.content.get(g.a.stage);
          var idx = st ? st.cards.map(function (c) { return c.id; }).indexOf(g.a.card) : -1;
          return h('tr', { class: g.wrong.length >= 2 ? 'warn' : '' },
            h('td', idx >= 0 ? h('a', { href: '#/stage/' + g.a.stage + '/' + (idx + 1) }, 'S' + st.n + ' #' + (idx + 1)) : g.a.card),
            h('td', g.a.item),
            h('td', String(g.wrong.length)),
            h('td', h('code', g.wrong.map(function (w) { return w.answer; }).join('  |  ').slice(0, 160))),
            h('td', h('code', String(g.a.expected).slice(0, 80))),
            h('td', g.solved ? 'yes' : 'no'));
        }))));

      // paper
      main.appendChild(h('h2', 'Paper practice'));
      var label = { alone: '✅ right, on her own', hints: '🟡 right with hints', small: '🟠 small mistakes', notyet: '🔴 not yet' };
      if (!data.paper.length) main.appendChild(h('p.muted', 'No paper tasks done yet.'));
      else main.appendChild(h('table.data',
        h('thead', h('tr', h('th', 'When'), h('th', 'Task'), h('th', 'Hints'), h('th', 'Structure shown'), h('th', 'Self-check missed'), h('th', 'Her rating'))),
        h('tbody', data.paper.slice().reverse().map(function (p) {
          var missed = (p.checklist || []).filter(function (c) { return !c.ok; }).map(function (c) { return c.item; });
          return h('tr', h('td', when(p.t)), h('td', p.title || p.card), h('td', String(p.hintsUsed)), h('td', p.structureShown ? 'yes' : 'no'), h('td.small', missed.join('; ') || '—'), h('td', label[p.confidence] || p.confidence));
        }))));

      main.appendChild(h('h2', 'Data'));
      main.appendChild(h('div.hero-row',
        h('button.btn', { on: { click: function () {
          var blob = new Blob([JP.store.exportJSON()], { type: 'application/json' });
          var a = h('a', { href: URL.createObjectURL(blob), download: 'java-progress-' + new Date().toISOString().slice(0, 10) + '.json' });
          document.body.appendChild(a); a.click(); a.remove();
        } } }, 'Download progress (JSON)'),
        h('button.btn.ghost.danger', { on: { click: function () {
          if (confirm('Erase ALL progress and answers in this browser? This cannot be undone.')) { JP.store.reset(); JP.router.go('#/insights'); }
        } } }, 'Reset all progress')));
    }
  };
})();
