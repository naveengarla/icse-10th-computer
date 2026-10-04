/* The step-by-step runner: code + memory + output (+ input, calculation, trace table) with prediction gates.
   opts: {code, input, wrap, gates:[{line, n, ask:'var:x'|'output'|'cond'|'next', q}], trace:{cols, at, output},
          editable, log:{stage, card}, onFinish(), title} */
(function () {
  var JP = globalThis.JP;
  var h = JP.dom.h;
  var active = null;

  document.addEventListener('keydown', function (e) {
    if (!active || !document.body.contains(active.el)) return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.key === 'ArrowRight') { e.preventDefault(); active.next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); active.back(); }
  });

  var QUIET = { loopPass: 1, fall: 1, scopeEnd: 1, back: 1, start: 1, end: 1 };

  JP.ui.Stepper = function (opts) {
    var src = opts.code;
    var input = opts.input || '';
    var res, steps, idx = 0, playing = null, passed = {}, finished = false, gateOpen = null;
    var self = {};

    var left = h('div.st-left');
    var right = h('div.st-right');
    var el = h('div.stepper', left, right);
    self.el = el;

    var mem = JP.ui.MemoryView();
    var con = JP.ui.ConsoleView();
    var calc = JP.ui.CalcView();
    var tape = null, trace = null, code = null, editor = null, editing = false;

    var note = h('div.st-note');
    var gateBox = h('div.st-gate');
    var counter = h('span.st-count');
    var btnRestart = h('button.btn.ghost', { title: 'Back to the start', on: { click: function () { stop(); go(0); } } }, '⟲ Start');
    var btnBack = h('button.btn', { title: 'One step back (← key)', on: { click: function () { self.back(); } } }, '◀ Back');
    var btnNext = h('button.btn.primary', { title: 'Run the next step (→ key)', on: { click: function () { self.next(); } } }, 'Next step ▶');
    var btnPlay = h('button.btn', { title: 'Keep stepping automatically', on: { click: function () { playing ? stop() : play(); } } }, '▶▶ Play');
    var speed = h('select.speed', { title: 'Play speed' },
      h('option', { value: 1400 }, 'slow'), h('option', { value: 700, selected: true }, 'medium'), h('option', { value: 250 }, 'fast'));
    var controls = h('div.st-controls', btnRestart, btnBack, btnNext, btnPlay, speed, counter);

    var editBar = null;
    if (opts.editable) {
      var btnEdit = h('button.btn', { on: { click: function () { setEditing(!editing); } } }, '✎ Edit code');
      editBar = h('div.st-editbar', btnEdit, JP.ui.tryW3Button(function () { return editing ? editor.get() : src; }, /Scanner/.test(src)));
      self._btnEdit = btnEdit;
    }
    var codeHolder = h('div.st-code');
    left.appendChild(h('div.st-head', opts.title ? h('div.st-title', opts.title) : null, editBar || (opts.noW3 ? null : JP.ui.tryW3Button(function () { return src; }, /Scanner/.test(src)))));
    left.appendChild(codeHolder);
    left.appendChild(controls);
    left.appendChild(gateBox);
    left.appendChild(note);

    function setEditing(on) {
      editing = on;
      stop();
      if (on) {
        editor = JP.ui.CodeEditor(src);
        JP.dom.clear(codeHolder).appendChild(editor.el);
        self._btnEdit.textContent = '▶ Run my code';
        self._btnEdit.classList.add('primary');
        controls.style.display = 'none';
        gateBox.style.display = 'none';
        note.className = 'st-note';
        note.textContent = 'Change the code, then press “Run my code” to watch it step by step.';
        editor.focus();
      } else {
        src = editor.get();
        self._btnEdit.textContent = '✎ Edit code';
        self._btnEdit.classList.remove('primary');
        controls.style.display = '';
        build();
      }
    }

    function build() {
      res = JP.engine.run(src, { input: input, maxSteps: opts.maxSteps || 3000 });
      if (opts.onBuild) opts.onBuild(src);
      steps = res.steps;
      idx = 0;
      finished = false;
      code = JP.ui.CodeView(src, { wrap: opts.wrap && res.prog && res.prog.snippet, onLineClick: onLineClick });
      JP.dom.clear(codeHolder).appendChild(code.el);
      JP.dom.clear(right);
      right.appendChild(mem.el);
      right.appendChild(con.el);
      if (/Scanner/.test(src) || input) {
        tape = JP.ui.InputTape(input, { onChange: function (v) { input = v; build(); } });
        right.appendChild(tape.el);
      } else tape = null;
      right.appendChild(calc.el);
      if (opts.trace) {
        trace = JP.ui.TraceTable(opts.trace);
        right.appendChild(trace.el);
      }
      if (res.phase === 'compile') {
        controls.style.display = 'none';
        code.mark({ error: res.error.line });
        note.className = 'st-note error';
        JP.dom.clear(note).appendChild(h('div',
          h('strong', 'Java would refuse to run this program (compile error)'),
          h('div', 'Line ' + res.error.line + ': ' + res.error.message)));
        mem.show(null);
        con.show('', '');
        calc.show(null);
        if (trace) trace.show([], -1);
        return;
      }
      controls.style.display = '';
      render();
    }

    function gateAt(from) {
      if (!opts.gates || from + 1 >= steps.length) return null;
      var target = steps[from + 1];
      for (var gi = 0; gi < opts.gates.length; gi++) {
        if (passed[gi]) continue;
        var g = opts.gates[gi];
        var n = g.n || 1;
        var probeIdx = g.ask === 'next' ? from : from + 1;
        var probe = steps[probeIdx];
        if (probe.line !== g.line || QUIET[probe.kind]) continue;
        if (g.ask === 'cond' && probe.cond === undefined) continue;
        var count = 0;
        for (var j = 0; j <= probeIdx; j++) if (steps[j].line === g.line && !QUIET[steps[j].kind] && (g.ask !== 'cond' || steps[j].cond !== undefined)) count++;
        if (count !== n) continue;
        return { i: gi, g: g, target: target, from: from };
      }
      return null;
    }

    function expectedFor(gate) {
      var g = gate.g, t = gate.target;
      if (g.ask === 'output') return t.out.slice(steps[gate.from].out.length);
      if (g.ask === 'cond') return String(t.cond);
      if (g.ask === 'next') return t.line;
      var name = g.ask.slice(4);
      return JP.ui.traceValueOf(t.mem, name);
    }

    function openGate(gate) {
      stop();
      gateOpen = gate;
      var g = gate.g;
      var exp = expectedFor(gate);
      JP.dom.clear(gateBox);
      // must be 'block', not '': .st-gate is display:none in the stylesheet
      gateBox.style.display = 'block';
      btnNext.disabled = true;
      var q = g.q || defaultQ(g);
      var fb = h('div.gate-fb');
      var body;
      function finish(answer, ok, hint) {
        passed[gate.i] = true;
        JP.store.log({ stage: opts.log && opts.log.stage, card: opts.log && opts.log.card, item: 'predict line ' + g.line + ' (' + g.ask + ')', answer: String(answer), expected: String(exp), ok: ok });
        fb.className = 'gate-fb ' + (ok ? 'ok' : 'no');
        JP.dom.clear(fb).appendChild(h('div',
          h('strong', ok ? '✓ Yes! ' : '✗ Not quite. '),
          ok ? 'Watch it happen:' : ('You said ' + show(answer) + ' — Java gives ' + show(exp) + '. ' + (hint || 'Watch this step carefully:')),
          ' ',
          h('button.btn.primary', { on: { click: function () { gateOpen = null; gateBox.style.display = 'none'; btnNext.disabled = false; go(gate.from + 1); } } }, 'Show me ▶')));
        if (body) body.querySelectorAll('input,button').forEach(function (b) { b.disabled = true; });
      }
      function show(v) {
        if (g.ask === 'next') return 'line ' + v;
        if (g.ask === 'output') return '“' + String(v).replace(/\n$/, '') + '”' + (/\n$/.test(String(v)) ? ' then a new line' : '');
        return '“' + v + '”';
      }
      if (g.ask === 'cond') {
        body = h('div.gate-choices',
          h('button.btn', { on: { click: function () { finish('true', exp === 'true'); } } }, 'true'),
          h('button.btn', { on: { click: function () { finish('false', exp === 'false'); } } }, 'false'));
      } else if (g.ask === 'next') {
        body = h('div.muted', '👆 Click a line in the code.');
        gate.onLine = function (ln) { if (passed[gate.i]) return; code.mark({ cur: steps[gate.from].line, picked: ln }); finish(ln, ln === exp); };
      } else {
        var inp = g.ask === 'output' ? h('textarea.answer', { rows: 2, placeholder: 'Type exactly what appears on the screen' }) : h('input.answer', { placeholder: 'value' });
        var go2 = function () {
          if (!inp.value.trim() && g.ask !== 'output') return;
          var r = JP.ui.compareAnswer(inp.value, exp, g.ask === 'output' ? 'output' : 'value');
          finish(inp.value, r.ok, r.hint);
        };
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); go2(); } });
        body = h('div.gate-input', inp, h('button.btn.primary', { on: { click: go2 } }, 'Check'));
        setTimeout(function () { inp.focus(); }, 30);
      }
      gateBox.appendChild(h('div.gate-q', h('span.gate-tag', 'Predict'), q));
      gateBox.appendChild(body);
      gateBox.appendChild(fb);
      if (gateBox.scrollIntoView) gateBox.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    function defaultQ(g) {
      if (g.ask === 'output') return 'Line ' + g.line + ' is about to run. What exactly will it print?';
      if (g.ask === 'cond') return 'Line ' + g.line + ': is the condition true or false right now?';
      if (g.ask === 'next') return 'Which line will Java run next? Click it in the code.';
      return 'Line ' + g.line + ' is about to run. What will ' + g.ask.slice(4) + ' hold after it?';
    }

    function onLineClick(ln) {
      if (gateOpen && gateOpen.onLine) gateOpen.onLine(ln);
    }

    self.next = function () {
      if (editing || gateOpen || !steps || idx >= steps.length - 1) return false;
      var gate = gateAt(idx);
      if (gate) { openGate(gate); return false; }
      go(idx + 1);
      return true;
    };
    self.back = function () {
      if (editing || gateOpen || idx <= 0) return;
      stop();
      go(idx - 1);
    };
    function go(i) {
      idx = Math.max(0, Math.min(i, steps.length - 1));
      render();
      if (idx === steps.length - 1 && !finished) {
        finished = true;
        if (opts.onFinish) opts.onFinish(res);
      }
    }
    function play() {
      if (idx >= steps.length - 1) go(0);
      btnPlay.textContent = '❚❚ Pause';
      playing = setInterval(function () {
        if (!self.next()) stop();
      }, Number(speed.value));
    }
    function stop() {
      if (playing) clearInterval(playing);
      playing = null;
      btnPlay.textContent = '▶▶ Play';
    }
    self.stop = stop;

    function render() {
      var st = steps[idx];
      var prev = idx > 0 ? steps[idx - 1] : null;
      var nxt = steps[idx + 1];
      var badges = {};
      (st.loops || []).forEach(function (l) { if (l.pass) badges[l.line] = 'pass ' + l.pass; });
      code.mark({ cur: st.line, next: nxt && nxt.line, skip: st.skip, badges: badges, error: st.kind === 'error' ? st.line : null });
      mem.show(st.mem);
      con.show(st.out, prev ? prev.out : '');
      calc.show(st.calc);
      if (tape) tape.show(st.inPos);
      if (trace) trace.show(steps, idx);
      note.className = 'st-note' + (st.kind === 'error' ? ' error' : '') + (st.kind === 'end' ? ' end' : '');
      JP.dom.clear(note);
      note.appendChild(h('span.st-line', st.line ? 'Line ' + st.line : st.kind === 'end' ? 'Done' : 'Start'));
      note.appendChild(document.createTextNode(' ' + st.note));
      counter.textContent = 'step ' + idx + ' of ' + (steps.length - 1);
      btnBack.disabled = idx === 0;
      btnNext.disabled = idx >= steps.length - 1 || !!gateOpen;
      if (!gateOpen) gateBox.style.display = 'none';
    }

    self.result = function () { return res; };
    self.src = function () { return src; };
    self.focus = function () { active = self; };
    el.addEventListener('mousedown', function () { active = self; });
    active = self;
    build();
    return self;
  };
})();
