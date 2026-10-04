/* Home: the stage map with progress and one Continue button. */
(function () {
  var JP = globalThis.JP;
  var h = JP.dom.h;

  function status(st) {
    var done = JP.store.doneCount(st), total = st.cards.length;
    return { done: done, total: total, state: done === 0 ? (JP.store.data().stages[st.id] ? 'started' : 'new') : done >= total ? 'done' : 'started' };
  }

  JP.pages.journey = {
    render: function (main) {
      var stages = JP.content.list();
      var next = stages.filter(function (s) { return status(s).state !== 'done'; })[0];
      var totalMin = stages.reduce(function (a, s) { return a + (s.minutes || 0); }, 0);
      var doneMin = stages.reduce(function (a, s) { var t = status(s); return a + (s.minutes || 0) * t.done / t.total; }, 0);

      main.appendChild(h('section.hero',
        h('h1', 'Java in your head'),
        h('p.lead', 'In the exam there is no computer — ', h('em', 'you'), ' are the computer. Here you will learn to see a program run in your mind: one line at a time, boxes changing, decisions taken, loops going round.'),
        h('div.hero-row',
          next ? h('a.btn.primary.big', { href: '#/stage/' + next.id + '/' + (Math.min(JP.store.stage(next.id).pos, next.cards.length - 1) + 1) }, status(next).state === 'new' ? 'Start: ' + next.title + ' ▶' : 'Continue: ' + next.title + ' ▶') : h('span.badge-done', '🎉 All available stages complete!'),
          h('div.overall', h('div.bar', h('div.fill', { style: { width: Math.round(100 * doneMin / totalMin) + '%' } })), h('span.muted', 'about ' + Math.round((totalMin - doneMin) / 60 * 10) / 10 + ' hours to go')))));

      var path = h('ol.journey');
      var milestone = null;
      stages.forEach(function (st) {
        var group = st.milestone || 'M1';
        if (group !== milestone) {
          if (milestone !== null) main.appendChild(path);
          main.appendChild(h('h2', group === 'M1' ? 'M1 · Foundations' : group === 'M2' ? 'M2 · Objects, methods and constructors' : group));
          if (group === 'M2') main.appendChild(h('p.muted', 'Stage 11 pilot is ready for review. Stages 9–10, 12–13 and the M2 checkpoint are still being prepared.'));
          path = h('ol.journey');
          milestone = group;
        }
        var s = status(st);
        path.appendChild(h('li', { class: 'stage-tile ' + s.state },
          h('a', { href: '#/stage/' + st.id + '/' + (s.state === 'done' ? 1 : Math.min(JP.store.stage(st.id).pos, st.cards.length - 1) + 1) },
            h('div.stage-num', st.n % 100 === 99 ? '✓' : String(st.n)),
            h('div.stage-info',
              h('div.stage-title', st.title),
              h('div.stage-sub', st.subtitle || ''),
              h('div.stage-meta', h('span', '~' + st.minutes + ' min'), h('span', s.done + '/' + s.total + ' cards'),
                h('div.bar.small', h('div.fill', { style: { width: Math.round(100 * s.done / s.total) + '%' } })))),
            h('div.stage-state', s.state === 'done' ? '✓ done' : s.state === 'started' ? 'in progress' : ''))));
      });
      main.appendChild(path);
      main.appendChild(h('p.muted.small.center', 'Your progress is saved in this browser on this computer.'));
    }
  };
})();
