/* Paper practice: question -> write in notebook -> (hints, structure) -> solution -> self-check -> confidence. */
(function () {
  var JP = globalThis.JP;
  var h = JP.dom.h;

  JP.cards.paper = function (card, ctx) {
    var hintsUsed = 0, structureShown = false;
    var hintBox = h('div.hints');
    var after = h('div.paper-after');
    var hintBtn = card.hints && card.hints.length ? h('button.btn.ghost', { on: { click: function () {
      if (hintsUsed >= card.hints.length) return;
      hintBox.appendChild(h('div.hint', h('strong', 'Hint ' + (hintsUsed + 1) + ': '), h('span', { html: card.hints[hintsUsed] })));
      hintsUsed++;
      if (hintsUsed >= card.hints.length) hintBtn.disabled = true;
      else hintBtn.textContent = '💡 Another hint';
    } } }, '💡 Give me a hint') : null;
    var structBtn = card.structure ? h('button.btn.ghost', { on: { click: function () {
      if (structureShown) return;
      structureShown = true;
      structBtn.disabled = true;
      hintBox.appendChild(h('div.hint', h('strong', 'Structure: '), h('pre.structure', card.structure)));
    } } }, '🧱 Show the structure') : null;
    var doneBtn = h('button.btn.primary', { on: { click: reveal } }, '✓ I have written my answer — show the solution');

    function reveal() {
      doneBtn.style.display = 'none';
      if (hintBtn) hintBtn.disabled = true;
      if (structBtn) structBtn.disabled = true;
      var res = JP.engine.run(card.solution, { input: card.input || '' });
      after.appendChild(h('h3', 'A model answer'));
      after.appendChild(h('p.muted.small', 'Yours does not need to be identical — different variable names or a different loop can also be correct. Compare the logic.'));
      after.appendChild(JP.ui.CodeView(card.solution, {}).el);
      if (card.input) after.appendChild(h('div.muted.small', 'Sample input: ', h('code', card.input.replace(/\n/g, ' ⏎ '))));
      after.appendChild(h('div', h('div.muted.small', 'Output:'), h('pre.console-out', res.output || '(nothing)')));
      after.appendChild(JP.ui.watchButton({ code: card.solution, input: card.input }, { wrap: false }, 'Watch the model answer run', { trace: card.trace }));
      var checks = (card.checklist || []).map(function (c) { return { text: c, box: h('input', { type: 'checkbox' }) }; });
      if (checks.length) {
        after.appendChild(h('h3', 'Check your notebook'));
        after.appendChild(h('div.checklist', checks.map(function (c) { return h('label.check', c.box, h('span', { html: c.text })); })));
      }
      after.appendChild(h('h3', 'How did it go?'));
      var levels = [
        ['alone', 'Right, on my own'],
        ['hints', 'Right, with hints'],
        ['small', 'Mostly right, small mistakes'],
        ['notyet', 'Could not do it yet']
      ];
      var saved = h('div');
      after.appendChild(h('div.confidence', levels.map(function (l) {
        return h('button.btn', { on: { click: function (e) {
          JP.store.paper({
            stage: ctx.stage.id, card: card.id, title: card.title, hintsUsed: hintsUsed, structureShown: structureShown,
            checklist: checks.map(function (c) { return { item: c.text.replace(/<[^>]+>/g, ''), ok: c.box.checked }; }),
            confidence: l[0]
          });
          after.querySelectorAll('.confidence .btn').forEach(function (b) { b.classList.remove('primary'); });
          e.currentTarget.classList.add('primary');
          JP.dom.clear(saved).appendChild(h('p.muted', l[0] === 'notyet' || l[0] === 'small'
            ? 'Saved. Close the solution, wait a few minutes, and write it again from memory — that is how it sticks.'
            : 'Saved. Well done!'));
          ctx.done();
        } } }, l[1]);
      })));
      after.appendChild(saved);
    }

    return h('div.card-paper',
      h('div.paper-banner', '📓 Paper practice — no computer, just your notebook'),
      card.title ? h('h2.card-title', card.title) : null,
      h('div.paper-q', { html: card.q }),
      card.minutes ? h('p.muted', 'Suggested time: ' + card.minutes + ' minutes.') : null,
      h('div.paper-actions', hintBtn, structBtn, doneBtn),
      hintBox, after);
  };
})();
