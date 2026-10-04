/* Trace tables built from engine steps.
   spec: {cols:['i','s'], at: <line> | 'loop', output: bool}
     at:<line>  -> one row after each time that line runs
     at:'loop'  -> one row each time the loop condition is checked (values at that moment) */
(function () {
  var JP = globalThis.JP;
  var h = JP.dom.h;

  function valueOf(mem, name) {
    var parts = name.split('.');
    if (parts.length === 2) {
      var reference = null;
      mem.frames.forEach(function (f) { f.vars.forEach(function (b) { if (b.name === parts[0]) reference = b.value; }); });
      var object = (mem.objects || []).filter(function (o) { return reference && reference.v && o.id === reference.v.objectId; })[0];
      var field = object && object.fields.filter(function (b) { return b.name === parts[1]; })[0];
      return field ? field.text : '—';
    }
    var active = mem.frames[mem.frames.length - 1];
    if (active) {
      var vs = active.vars;
      for (var j = vs.length - 1; j >= 0; j--) if (vs[j].name === name) return vs[j].empty ? '?' : vs[j].text;
    }
    var current = (mem.objects || []).filter(function (o) { return active && o.id === active.objectId; })[0];
    if (current) for (var f = 0; f < current.fields.length; f++) if (current.fields[f].name === name) return current.fields[f].text;
    for (var k = 0; k < mem.fields.length; k++) if (mem.fields[k].name === name) return mem.fields[k].text;
    return '—';
  }

  function rowMatches(st, spec) {
    if (spec.at === 'loop') return st.kind === 'loopCheck';
    return st.line === spec.at && st.kind !== 'loopCheck' && st.kind !== 'cond' && st.kind !== 'forInit';
  }

  // rows: [{stepIndex, cells:[...], cond?, out?}]
  JP.ui.traceRows = function (steps, spec, upto) {
    var rows = [];
    var last = upto === undefined ? steps.length - 1 : upto;
    for (var i = 0; i <= last; i++) {
      var st = steps[i];
      if (!rowMatches(st, spec)) continue;
      var r = { step: i, cells: spec.cols.map(function (c) { return valueOf(st.mem, c); }) };
      if (spec.at === 'loop') r.cond = st.cond;
      if (spec.output) {
        var prev = i > 0 ? steps[i - 1].out : '';
        r.out = st.out.slice(prev.length);
      }
      rows.push(r);
    }
    return rows;
  };
  JP.ui.traceValueOf = valueOf;

  JP.ui.TraceTable = function (spec) {
    var table = h('table.trace');
    var el = h('section.panel.trace-panel', h('h4', 'Trace table ', h('span.sub', spec.at === 'loop' ? 'one row each time the condition is checked' : 'one row each time line ' + spec.at + ' runs')),
      h('div.trace-scroll', table));
    function head() {
      return h('thead', h('tr',
        spec.at === 'loop' ? h('th', 'check') : h('th', '#'),
        spec.cols.map(function (c) { return h('th', h('code', c)); }),
        spec.at === 'loop' ? h('th', 'condition') : null,
        spec.output ? h('th', 'printed') : null));
    }
    function show(steps, upto) {
      JP.dom.clear(table);
      table.appendChild(head());
      var tb = h('tbody');
      var rows = JP.ui.traceRows(steps, spec, upto);
      rows.forEach(function (r, i) {
        tb.appendChild(h('tr', { class: r.step === upto ? 'now' : '' },
          h('td.muted', String(i + 1)),
          r.cells.map(function (c) { return h('td', c); }),
          spec.at === 'loop' ? h('td', { class: r.cond ? 'yes' : 'no' }, r.cond ? 'true → run body' : 'false → stop') : null,
          spec.output ? h('td', h('code', JSON.stringify(r.out).slice(1, -1).replace(/\\n/g, '⏎'))) : null));
      });
      if (!rows.length) tb.appendChild(h('tr', h('td.muted', { colSpan: spec.cols.length + 3 }, 'Rows appear as the program runs.')));
      table.appendChild(tb);
    }
    return { el: el, show: show };
  };
})();
