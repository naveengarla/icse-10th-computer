/* Stage player: one card at a time with a progress strip and prev/next. Route: #/stage/<id>/<card number> */
(function () {
  var JP = globalThis.JP;
  var h = JP.dom.h;

  var KIND = {
    learn: 'Learn', watch: 'Watch & predict', explore: 'Explore', reduce: 'Step-by-step calculation', mcq: 'Quick question',
    predict: 'Predict', trace: 'Trace it yourself', bug: 'Find the mistake', reorder: 'Put in order', fill: 'Fill the blanks',
    paper: 'Paper practice', digits: 'Digit machine', quiz: 'Mastery check'
  };

  JP.pages.stage = {
    render: function (main, args) {
      var st = JP.content.get(args[0]);
      if (!st) { location.hash = '#/'; return; }
      var i = Math.max(0, Math.min(st.cards.length - 1, (parseInt(args[1], 10) || 1) - 1));
      if (args[1] === 'done') return renderDone(main, st);
      JP.store.setPos(st.id, i);
      var card = st.cards[i];

      var dots = h('div.dots', st.cards.map(function (c, k) {
        return h('a', {
          href: '#/stage/' + st.id + '/' + (k + 1),
          class: 'dot' + (k === i ? ' cur' : '') + (JP.store.isDone(st.id, c.id) ? ' done' : '') + (c.type === 'paper' ? ' paper' : '') + (c.type === 'quiz' ? ' quiz' : ''),
          title: (k + 1) + '. ' + (KIND[c.type] || c.type) + (c.title ? ': ' + c.title : '')
        });
      }));

      var nextBtn = h('a.btn.primary', { href: i + 1 < st.cards.length ? '#/stage/' + st.id + '/' + (i + 2) : '#/stage/' + st.id + '/done' }, i + 1 < st.cards.length ? 'Next ▶' : 'Finish stage ✓');
      var ctx = {
        stage: st,
        wrap: st.wrap !== false,
        done: function () {
          JP.store.markDone(st.id, card.id);
          var d = dots.children[i];
          if (d) d.classList.add('done');
          nextBtn.classList.add('pulse');
        },
        log: function (item, answer, expected, ok) {
          JP.store.log({ stage: st.id, card: card.id, item: item, answer: String(answer), expected: String(expected), ok: !!ok });
        }
      };
      var render = JP.cards[card.type];
      var body = render ? render(card, ctx) : h('div.fb.no', 'Unknown card type ' + card.type);

      main.appendChild(h('div.stage-head',
        h('a.back', { href: '#/' }, '← Journey'),
        h('div.stage-heading', h('span.stage-pill', 'Stage ' + (st.n === 99 ? '✓' : st.n)), h('span.stage-name', st.title)),
        dots));
      main.appendChild(h('div.card-kind', KIND[card.type] || card.type, h('span.muted', '  ·  card ' + (i + 1) + ' of ' + st.cards.length)));
      main.appendChild(h('article.card', body));
      main.appendChild(h('div.card-nav',
        i > 0 ? h('a.btn.ghost', { href: '#/stage/' + st.id + '/' + i }, '◀ Previous') : h('span'),
        nextBtn));

      // time on task (only while the tab is visible)
      var last = Date.now();
      var timer = setInterval(function () {
        var now = Date.now();
        if (document.visibilityState === 'visible') JP.store.addTime(st.id, now - last);
        last = now;
      }, 15000);
      return { leave: function () { clearInterval(timer); if (document.visibilityState === 'visible') JP.store.addTime(st.id, Date.now() - last); } };
    }
  };

  function renderDone(main, st) {
    var stages = JP.content.list();
    var k = stages.indexOf(st);
    var next = stages[k + 1];
    var done = JP.store.doneCount(st);
    var missed = st.cards.filter(function (c) { return !JP.store.isDone(st.id, c.id); });
    main.appendChild(h('section.stage-done',
      h('h1', '🎉 Stage ' + (st.n === 99 ? '' : st.n + ' ') + 'finished'),
      h('p.lead', st.title),
      st.recap ? h('div.recap', h('h3', 'What you now carry in your head'), h('ul', st.recap.map(function (r) { return h('li', { html: r }); }))) : null,
      missed.length ? h('p', 'You skipped ' + missed.length + ' card' + (missed.length > 1 ? 's' : '') + ': ',
        missed.map(function (c) { return h('a', { href: '#/stage/' + st.id + '/' + (st.cards.indexOf(c) + 1) }, '#' + (st.cards.indexOf(c) + 1) + ' '); })) : h('p.muted', done + ' of ' + st.cards.length + ' cards complete.'),
      h('div.hero-row', next ? h('a.btn.primary.big', { href: '#/stage/' + next.id + '/1' }, 'Next: ' + next.title + ' ▶') : null, h('a.btn.ghost', { href: '#/' }, 'Back to the journey'))));
  }
})();
