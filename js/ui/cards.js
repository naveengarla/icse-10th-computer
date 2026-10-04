/* One renderer per card type. Each gets (card, ctx) and returns an element.
   ctx: {stage, done(), log(item, answer, expected, ok)} */
(function () {
  var JP = globalThis.JP;
  var h = JP.dom.h;
  var Cards = (JP.cards = {});

  function staticCode(src, wrap) {
    var snippet = true;
    try { snippet = JP.engine.parse(src).snippet; } catch (e) { snippet = !/\bclass\b/.test(src); }
    return JP.ui.CodeView(src, { wrap: wrap && snippet }).el;
  }
  function html(s) { return s ? h('div.prose', { html: s }) : null; }
  function intro(card) { return [card.title ? h('h2.card-title', card.title) : null, html(card.intro || card.body)]; }
  function outputOf(card) {
    var r = JP.engine.run(card.code, { input: card.input || '' });
    return r;
  }
  function watchButton(card, ctx, label, extra) {
    var holder = h('div.watch-holder');
    var btn = h('button.btn', {
      on: {
        click: function () {
          btn.style.display = 'none';
          var st = JP.ui.Stepper(Object.assign({ code: card.code, input: card.input, wrap: ctx.wrap, noW3: false }, extra || {}));
          holder.appendChild(st.el);
          st.el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, label || 'Watch it run step by step');
    return h('div', btn, holder);
  }
  JP.ui.watchButton = watchButton;
  function feedback(ok, text) {
    return h('div', { class: 'fb ' + (ok ? 'ok' : 'no') }, h('strong', ok ? '✓ Correct. ' : '✗ Not yet. '), text || '');
  }
  // always a node, so callers can append it unconditionally
  function explainBox(s) { return s ? h('div.explain', { html: s }) : h('span'); }

  // ---------- learn: explanation (+ optional code) ----------
  Cards.learn = function (card, ctx) {
    ctx.done();
    return h('div.card-learn', intro(card), card.code ? staticCode(card.code, ctx.wrap) : null, html(card.after),
      card.key ? h('div.keyidea', h('span.keyidea-tag', 'Remember'), h('span', { html: card.key })) : null);
  };

  // ---------- watch: stepper with prediction gates ----------
  Cards.watch = function (card, ctx) {
    var after = html(card.after);
    if (after) after.style.display = 'none';
    var st = JP.ui.Stepper({
      code: card.code, input: card.input, wrap: ctx.wrap, gates: card.gates, trace: card.trace,
      log: { stage: ctx.stage.id, card: card.id },
      onFinish: function () { ctx.done(); if (after) after.style.display = ''; }
    });
    return h('div.card-watch', intro(card),
      card.gates && card.gates.length ? h('p.tip', '⏸ The program will stop and ask you to predict. Think first, then answer.') : h('p.tip', 'Press “Next step ▶” (or the → key) and watch what changes after each step.'),
      st.el, after);
  };

  // ---------- explore: editable playground ----------
  Cards.explore = function (card, ctx) {
    ctx.done();
    var st = JP.ui.Stepper({ code: card.code, input: card.input, wrap: ctx.wrap, editable: true, trace: card.trace });
    return h('div.card-explore', intro(card),
      card.tryThis ? h('div.trythis', h('strong', 'Try this: '), h('ul', card.tryThis.map(function (t) { return h('li', { html: t }); }))) : null,
      st.el);
  };

  // ---------- reduce: expression worked out one operation at a time ----------
  Cards.reduce = function (card, ctx) {
    var r = JP.engine.reduce(card.expr, card.vars || {});
    var Vs = JP.engine.values;
    var box = h('div.reduce');
    var varsRow = h('div.boxes', Object.keys(card.vars || {}).map(function (k) {
      var v = card.vars[k];
      return h('div', { class: 'mbox t-' + (/^(int|long)$/.test(v.t) ? 'int' : v.t === 'float' ? 'double' : v.t) }, h('div.mname', k), h('div.mcell', h('span.mval', Vs.lit(v))), h('div.mtype', v.t));
    }));
    if (!r.ok) return h('div', intro(card), h('div.fb.no', 'Engine error: ' + r.error));
    var rows = h('ol.calc-list.big');
    var shown = 0;
    var nextBtn = h('button.btn.primary', { on: { click: step } }, 'Next operation ▶');
    var afterBox = h('div.after-vars');
    function step() {
      if (shown >= r.snaps.length) return;
      var s = r.snaps[shown++];
      rows.appendChild(h('li.appear', JP.ui.calcRow(s.text), s.note ? h('div.calc-note', s.note) : null));
      if (shown >= r.snaps.length) {
        nextBtn.style.display = 'none';
        var changed = Object.keys(r.vars).filter(function (k) { return card.vars[k] && Vs.lit(r.vars[k]) !== Vs.lit(card.vars[k]); });
        afterBox.appendChild(h('div.result', 'Answer: ', h('code', Vs.lit(r.value)), ' (', r.type, ')',
          changed.length ? h('span', '   Boxes changed: ', changed.map(function (k) { return h('code.chg', k + ' = ' + Vs.lit(r.vars[k])); })) : null));
        ctx.done();
      }
    }
    var ask = null;
    if (card.ask !== false) {
      var inp = h('input.answer', { placeholder: 'your answer' });
      var fbx = h('div');
      var check = function () {
        if (!inp.value.trim()) return;
        var cmp = JP.ui.compareAnswer(inp.value, Vs.lit(r.value), 'value');
        if (!cmp.ok) cmp = JP.ui.compareAnswer(inp.value, Vs.str(r.value), 'value');
        ctx.log('reduce ' + card.expr, inp.value, Vs.lit(r.value), cmp.ok);
        JP.dom.clear(fbx).appendChild(feedback(cmp.ok, cmp.ok ? 'Now watch how Java gets there:' : 'Java gets ' + Vs.lit(r.value) + '. ' + (cmp.hint || '') + ' Watch each operation:'));
        inp.disabled = true;
        checkBtn.disabled = true;
        reveal.style.display = '';
        step();
      };
      var checkBtn = h('button.btn.primary', { on: { click: check } }, 'Check');
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
      ask = h('div.ask', h('label', card.q || 'Work it out on paper first. What is the final value?'), h('div.gate-input', inp, checkBtn), fbx);
    }
    var reveal = h('div', rows, nextBtn, afterBox);
    if (ask) reveal.style.display = 'none'; else step();
    box.appendChild(h('div.reduce-head', varsRow.childNodes.length ? h('div', h('div.muted.small', 'Boxes before:'), varsRow) : null,
      h('div.reduce-expr', h('code', card.expr))));
    if (ask) box.appendChild(ask);
    box.appendChild(reveal);
    return h('div.card-reduce', intro(card), box, html(card.after));
  };

  // ---------- mcq ----------
  Cards.mcq = function (card, ctx) {
    var correct = card.answer;
    if (correct === 'output') {
      var out = outputOf(card).output.replace(/\n$/, '');
      correct = card.options.map(String).indexOf(out);
      if (correct < 0) return h('div.fb.no', 'Content error: no option matches the real output ' + JSON.stringify(out));
    }
    var tries = 0, over = false;
    var fbx = h('div');
    var letters = 'abcd';
    var opts = card.options.map(function (o, i) {
      var b = h('button.option', {
        on: {
          click: function () {
            if (over || b.classList.contains('wrong')) return;
            tries++;
            var ok = i === correct;
            ctx.log(card.q.replace(/<[^>]+>/g, '').slice(0, 80), String(o), String(card.options[correct]), ok);
            if (ok) {
              b.classList.add('right');
              over = true;
              JP.dom.clear(fbx).appendChild(feedback(true, ''));
              fbx.appendChild(explainBox(card.explain));
              if (card.code) fbx.appendChild(watchButton(card, ctx));
              ctx.done();
            } else {
              b.classList.add('wrong');
              if (tries >= 2) {
                over = true;
                opts[correct].classList.add('right');
                JP.dom.clear(fbx).appendChild(feedback(false, 'The answer is (' + letters[correct] + ').'));
                fbx.appendChild(explainBox(card.explain));
                if (card.code) fbx.appendChild(watchButton(card, ctx));
                ctx.done();
              } else JP.dom.clear(fbx).appendChild(feedback(false, card.hint || 'Think again — one more try.'));
            }
          }
        }
      }, h('span.opt-letter', '(' + letters[i] + ')'), h('span', { html: JP.dom.esc(String(o)) }));
      return b;
    });
    return h('div.card-mcq', card.title ? h('h2.card-title', card.title) : null, h('div.q', { html: card.q }), card.code ? staticCode(card.code, ctx.wrap) : null, h('div.options', opts), fbx);
  };

  // ---------- predict: type the output / a variable's final value ----------
  Cards.predict = function (card, ctx) {
    var r = outputOf(card);
    var ask = card.ask || 'output';
    var expected, label;
    if (ask === 'output') { expected = r.output; label = 'Write exactly what appears on the screen (use a new line for each println):'; }
    else {
      var last = r.steps.filter(function (s) { return s.kind !== 'end'; }).pop();
      expected = JP.ui.traceValueOf(last.mem, ask.slice(4));
      label = 'What is the value of ' + ask.slice(4) + ' at the end?';
    }
    var inp = ask === 'output' ? h('textarea.answer', { rows: Math.max(2, expected.split('\n').length), placeholder: 'output' }) : h('input.answer', { placeholder: 'value' });
    var fbx = h('div');
    var tries = 0;
    var check = function () {
      if (!inp.value.trim()) return;
      tries++;
      var cmp = JP.ui.compareAnswer(inp.value, expected, ask === 'output' ? 'output' : 'value');
      ctx.log((card.title || card.q || 'predict').replace(/<[^>]+>/g, '').slice(0, 80), inp.value, expected, cmp.ok);
      JP.dom.clear(fbx);
      if (cmp.ok) {
        fbx.appendChild(feedback(true, ''));
        finish();
      } else if (tries >= 2) {
        fbx.appendChild(feedback(false, cmp.hint || ''));
        fbx.appendChild(h('div.answer-key', h('div.muted.small', 'Java’s answer:'), h('pre.console-out', expected)));
        finish();
      } else {
        fbx.appendChild(feedback(false, (cmp.hint || 'Trace it again line by line on paper.') + ' You have one more try.'));
      }
    };
    function finish() {
      inp.disabled = true;
      checkBtn.disabled = true;
      fbx.appendChild(explainBox(card.explain));
      fbx.appendChild(watchButton(card, ctx, 'Watch it run step by step', { trace: card.trace }));
      ctx.done();
    }
    var checkBtn = h('button.btn.primary', { on: { click: check } }, 'Check');
    if (ask !== 'output') inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
    return h('div.card-predict', card.title ? h('h2.card-title', card.title) : null, html(card.q), staticCode(card.code, ctx.wrap),
      card.input ? h('div.muted.small', 'Keyboard input: ', h('code', card.input.replace(/\n/g, ' ⏎ '))) : null,
      h('label.ask', label), h('div.gate-input', inp, checkBtn), fbx);
  };

  // ---------- trace: fill in a trace table ----------
  Cards.trace = function (card, ctx) {
    var r = outputOf(card);
    var rows = JP.ui.traceRows(r.steps, card.trace);
    var cols = card.trace.cols;
    var inputs = [];
    var tb = h('tbody');
    rows.forEach(function (row, ri) {
      var tr = h('tr', h('td.muted', String(ri + 1)));
      inputs.push([]);
      row.cells.forEach(function (c, ci) {
        var given = card.given && card.given[ri] && card.given[ri][ci] !== undefined && card.given[ri][ci] !== null;
        var inp = h('input.cell', { size: 5, value: given ? c : '', disabled: given });
        inputs[ri].push({ el: inp, exp: c, given: given });
        tr.appendChild(h('td', inp));
      });
      if (card.trace.at === 'loop') {
        var sel = h('select.cell', h('option', { value: '' }, '?'), h('option', { value: 'true' }, 'true'), h('option', { value: 'false' }, 'false'));
        inputs[ri].push({ el: sel, exp: String(row.cond), given: false });
        tr.appendChild(h('td', sel));
      }
      tb.appendChild(tr);
    });
    var table = h('table.trace.fill', h('thead', h('tr', h('th', '#'), cols.map(function (c) { return h('th', h('code', c)); }), card.trace.at === 'loop' ? h('th', 'condition') : null)), tb);
    var extra = [];
    if (card.askPasses) {
      var passes = 0;
      r.steps.forEach(function (s) { (s.loops || []).forEach(function (l) { if (l.pass > passes) passes = l.pass; }); });
      var pi = h('input.answer.short');
      extra.push({ label: 'How many times does the loop body run?', el: pi, exp: String(passes) });
    }
    if (card.askOutput) {
      var oi = h('textarea.answer', { rows: 2 });
      extra.push({ label: 'What is the output?', el: oi, exp: r.output, output: true });
    }
    var fbx = h('div');
    var tries = 0;
    var check = function () {
      tries++;
      var wrong = 0;
      inputs.forEach(function (row) {
        row.forEach(function (c) {
          if (c.given) return;
          var ok = JP.ui.compareAnswer(c.el.value, c.exp, 'value').ok;
          c.el.classList.toggle('ok', ok);
          c.el.classList.toggle('no', !ok);
          if (!ok) wrong++;
        });
      });
      extra.forEach(function (x) {
        var ok = JP.ui.compareAnswer(x.el.value, x.exp, x.output ? 'output' : 'value').ok;
        x.el.classList.toggle('ok', ok);
        x.el.classList.toggle('no', !ok);
        if (!ok) wrong++;
      });
      ctx.log('trace ' + (card.title || ''), wrong + ' wrong cells', '0 wrong', wrong === 0);
      JP.dom.clear(fbx);
      if (!wrong) {
        fbx.appendChild(feedback(true, 'Your trace table matches Java exactly.'));
        done();
      } else {
        fbx.appendChild(feedback(false, wrong + ' cell' + (wrong > 1 ? 's are' : ' is') + ' not right (marked red). Fix them and check again' + (tries >= 1 ? ', or reveal the answer.' : '.')));
        fbx.appendChild(h('button.btn.ghost', { on: { click: function () { revealAll(); done(); } } }, 'Show the answer'));
      }
    };
    function revealAll() {
      inputs.forEach(function (row) { row.forEach(function (c) { if (!c.el.classList.contains('ok')) { c.el.value = c.exp; c.el.classList.remove('no'); c.el.classList.add('shown'); } }); });
      extra.forEach(function (x) { x.el.value = x.exp; x.el.classList.add('shown'); });
    }
    var finished = false;
    function done() {
      if (finished) return;
      finished = true;
      fbx.appendChild(explainBox(card.explain));
      fbx.appendChild(watchButton(card, ctx, 'Watch it run with the trace table', { trace: card.trace }));
      ctx.done();
    }
    return h('div.card-trace', card.title ? h('h2.card-title', card.title) : null, html(card.q),
      h('div.trace-layout', staticCode(card.code, ctx.wrap), h('div', h('div.trace-scroll', table),
        extra.map(function (x) { return h('div.ask', h('label', x.label), x.el); }),
        h('button.btn.primary', { on: { click: check } }, 'Check my table'))),
      fbx);
  };

  // ---------- bug: click the line with the mistake ----------
  Cards.bug = function (card, ctx) {
    var r = JP.engine.run(card.code, { input: card.input || '' });
    var answer = card.line || (r.phase === 'compile' ? r.error.line : null);
    var fbx = h('div');
    var over = false, tries = 0;
    var cv = JP.ui.CodeView(card.code, {
      wrap: ctx.wrap && !/\bclass\b/.test(card.code),
      onLineClick: function (ln) {
        if (over) return;
        tries++;
        var ok = ln === answer;
        ctx.log('find the bug: ' + (card.title || ''), 'line ' + ln, 'line ' + answer, ok);
        if (ok || tries >= 2) {
          over = true;
          cv.mark({ good: [answer], bad: ok ? [] : [ln] });
          JP.dom.clear(fbx).appendChild(feedback(ok, ok ? 'That is the line.' : 'The mistake is on line ' + answer + '.'));
          if (r.phase === 'compile' && !card.line) fbx.appendChild(h('div.compile-msg', h('strong', 'What Java says: '), r.error.message));
          fbx.appendChild(explainBox(card.explain));
          if (card.fixed) fbx.appendChild(h('div', h('div.muted.small', 'Corrected:'), staticCode(card.fixed, ctx.wrap)));
          ctx.done();
        } else {
          cv.mark({ bad: [ln] });
          JP.dom.clear(fbx).appendChild(feedback(false, 'Line ' + ln + ' is fine. Look again — one more try.'));
        }
      }
    });
    return h('div.card-bug', card.title ? h('h2.card-title', card.title) : null, html(card.q || '<p>One line has a mistake. <strong>Click that line.</strong></p>'), cv.el, fbx);
  };

  // ---------- reorder: build the program from jumbled lines ----------
  Cards.reorder = function (card, ctx) {
    var expectedOut = JP.engine.run(card.lines.join('\n'), { input: card.input || '' }).output;
    var order = card.lines.map(function (l, i) { return i; });
    // deterministic shuffle that never leaves it solved
    var seed = card.id.split('').reduce(function (a, c) { return (a * 31 + c.charCodeAt(0)) >>> 0; }, 7);
    for (var i = order.length - 1; i > 0; i--) { seed = (seed * 1103515245 + 12345) >>> 0; var j = seed % (i + 1); var t = order[i]; order[i] = order[j]; order[j] = t; }
    if (order.every(function (v, k) { return v === k; })) order.reverse();
    var pool = order.slice(), built = [];
    var poolEl = h('div.lines.pool'), builtEl = h('div.lines.built');
    var fbx = h('div');
    function render() {
      JP.dom.clear(poolEl);
      JP.dom.clear(builtEl);
      pool.forEach(function (li) { poolEl.appendChild(h('button.line-chip', { on: { click: function () { pool.splice(pool.indexOf(li), 1); built.push(li); render(); } } }, h('code', { html: JP.dom.highlight(card.lines[li].trim()) }))); });
      built.forEach(function (li, k) { builtEl.appendChild(h('button.line-chip.placed', { title: 'Click to send back', on: { click: function () { built.splice(k, 1); pool.push(li); render(); } } }, h('span.ln', String(k + 1)), h('code', { html: JP.dom.highlight(card.lines[li].trim()) }))); });
      if (!built.length) builtEl.appendChild(h('div.muted', 'Click lines on the left in the order Java should run them.'));
      checkBtn.disabled = pool.length > 0;
    }
    var tries = 0;
    var check = function () {
      tries++;
      var src = built.map(function (li) { return card.lines[li]; }).join('\n');
      var exact = built.every(function (v, k) { return card.lines[v] === card.lines[k]; });
      var rr = JP.engine.run(src, { input: card.input || '' });
      var ok = exact || (rr.phase !== 'compile' && !rr.error && rr.output === expectedOut);
      ctx.log('reorder ' + (card.title || ''), src, card.lines.join('\n'), ok);
      JP.dom.clear(fbx);
      if (ok) {
        fbx.appendChild(feedback(true, exact ? '' : 'Your order is different from ours but gives the same output — that also works.'));
        fbx.appendChild(explainBox(card.explain));
        ctx.done();
      } else {
        var why = rr.phase === 'compile' ? 'Java would not accept this order: line ' + rr.error.line + ' — ' + rr.error.message : rr.error ? rr.error.message : 'It runs, but prints ' + JSON.stringify(rr.output) + ' instead of ' + JSON.stringify(expectedOut) + '.';
        fbx.appendChild(feedback(false, why));
        if (tries >= 2) fbx.appendChild(h('button.btn.ghost', { on: { click: function () { pool = []; built = card.lines.map(function (l, k) { return k; }); render(); fbx.appendChild(explainBox(card.explain)); ctx.done(); } } }, 'Show the right order'));
      }
    };
    var checkBtn = h('button.btn.primary', { on: { click: check } }, 'Check');
    render();
    return h('div.card-reorder', card.title ? h('h2.card-title', card.title) : null, html(card.q),
      h('div.reorder-grid', h('div', h('div.col-title', 'Jumbled lines'), poolEl), h('div', h('div.col-title', 'Your program'), builtEl)),
      checkBtn, fbx);
  };

  // ---------- fill: fill in the blanks ----------
  Cards.fill = function (card, ctx) {
    var blanks = [];
    var codeBox = h('pre.fill-code');
    var lines = card.code.split('\n');
    lines.forEach(function (line, li) {
      var row = h('div.fill-line', h('span.ln', String(li + 1)));
      var last = 0, m, re = /\[\[(.*?)\]\]/g;
      while ((m = re.exec(line))) {
        row.appendChild(h('code', { html: JP.dom.highlight(line.slice(last, m.index)) }));
        var alts = m[1].split('|');
        var inp = h('input.blank', { size: Math.max(3, alts[0].length + 1), spellcheck: false });
        blanks.push({ el: inp, alts: alts });
        row.appendChild(inp);
        last = m.index + m[0].length;
      }
      row.appendChild(h('code', { html: JP.dom.highlight(line.slice(last)) || ' ' }));
      codeBox.appendChild(row);
    });
    var ref = JP.engine.run(JP.content.fillSolution(card.code), { input: card.input || '' });
    var fbx = h('div');
    var tries = 0;
    function squash(s) { return s.replace(/\s+/g, ''); }
    var check = function () {
      tries++;
      var allOk = true;
      blanks.forEach(function (b) {
        var ok = b.alts.some(function (a) { return squash(a) === squash(b.el.value); });
        b.ok = ok;
      });
      // also accept anything that makes the program behave identically
      var k = 0;
      var filled = card.code.replace(/\[\[(.*?)\]\]/g, function () { return blanks[k++].el.value; });
      var rr = JP.engine.run(filled, { input: card.input || '' });
      var same = rr.phase !== 'compile' && !rr.error && rr.output === ref.output && !card.strict;
      blanks.forEach(function (b) {
        var ok = b.ok || same;
        b.el.classList.toggle('ok', ok);
        b.el.classList.toggle('no', !ok);
        if (!ok) allOk = false;
      });
      ctx.log('fill ' + (card.title || ''), filled, JP.content.fillSolution(card.code), allOk);
      JP.dom.clear(fbx);
      if (allOk) {
        fbx.appendChild(feedback(true, ''));
        fbx.appendChild(explainBox(card.explain));
        ctx.done();
      } else {
        var msg = rr.phase === 'compile' ? 'Java would complain: ' + rr.error.message : 'The red blanks are not right yet.';
        fbx.appendChild(feedback(false, msg));
        if (tries >= 2) fbx.appendChild(h('button.btn.ghost', { on: { click: function () { blanks.forEach(function (b) { if (!b.el.classList.contains('ok')) { b.el.value = b.alts[0]; b.el.classList.remove('no'); b.el.classList.add('shown'); } }); fbx.appendChild(explainBox(card.explain)); ctx.done(); } } }, 'Show the answers'));
      }
    };
    return h('div.card-fill', card.title ? h('h2.card-title', card.title) : null, html(card.q), codeBox, h('button.btn.primary', { on: { click: check } }, 'Check'), fbx);
  };

  // ---------- quiz: several items in a row (mastery check) ----------
  Cards.quiz = function (card, ctx) {
    var total = card.items.length, finished = 0;
    var score = h('div.quiz-score');
    var list = h('div.quiz-items');
    card.items.forEach(function (it, i) {
      it.id = it.id || card.id + '-q' + (i + 1);
      var counted = false;
      var sub = {
        stage: ctx.stage, wrap: ctx.wrap,
        log: ctx.log,
        done: function () {
          if (counted) return;
          counted = true;
          finished++;
          score.textContent = finished + ' of ' + total + ' answered';
          if (finished === total) ctx.done();
        }
      };
      list.appendChild(h('div.quiz-item', h('div.quiz-num', 'Q' + (i + 1)), Cards[it.type](it, sub)));
    });
    score.textContent = '0 of ' + total + ' answered';
    return h('div.card-quiz', intro(card), score, list);
  };
})();
