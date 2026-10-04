/* Memory as labelled boxes. Each type has its own box shape/colour. Changed boxes pulse. */
(function () {
  var JP = globalThis.JP;
  var h = JP.dom.h;

  var TYPE_HINT = {
    int: 'whole number', long: 'big whole number', short: 'small whole number', byte: 'tiny whole number',
    double: 'decimal number', float: 'decimal number', char: 'one character', boolean: 'true / false',
    String: 'text', Scanner: 'keyboard reader'
  };

  function box(b) {
    var t = b.type;
    var cls = 'mbox t-' + (/^(int|long|short|byte)$/.test(t) ? 'int' : /^(double|float)$/.test(t) ? 'double' : /^(char|boolean|String|Scanner)$/.test(t) ? t : 'obj');
    var val;
    if (b.empty) val = h('span.mval.empty', '?');
    else if (t === 'Scanner') val = h('span.mval', '⌨');
    else if (t === 'char') val = h('span.mval', h('span', JP.engine.values.lit(b.value)), h('small.code', String(b.value.v)));
    else val = h('span.mval', b.text);
    return h('div', { class: cls + (b.changed ? ' changed' : '') + (b.empty ? ' is-empty' : ''), title: b.name + ' is a ' + t + ' box (' + (TYPE_HINT[t] || t) + ')' },
      h('div.mname', b.name),
      h('div.mcell', val),
      h('div.mtype', t));
  }

  JP.ui.MemoryView = function () {
    var body = h('div.mem-body');
    var el = h('section.panel.mem', h('h4', 'Memory ', h('span.sub', 'boxes that hold values')), body);
    function show(mem) {
      JP.dom.clear(body);
      if (!mem) return;
      var any = false;
      if (mem.fields.length) {
        any = true;
        body.appendChild(h('div.frame.fields', h('div.frame-name', 'class boxes (static fields)'), h('div.boxes', mem.fields.map(box))));
      }
      (mem.objects || []).forEach(function (ob) {
        any = true;
        var labels = [];
        mem.frames.forEach(function (f) { f.vars.forEach(function (b) { if (b.value && b.value.v && b.value.v.objectId === ob.id) labels.push(b.name); }); });
        body.appendChild(h('div.frame.object-fields',
          h('div.frame-name', 'Object #' + ob.id + ' of ' + ob.type + (labels.length ? ' ← ' + labels.join(', ') : ob.implicit ? ' — BlueJ main object' : '')),
          h('div.boxes', ob.fields.length ? ob.fields.map(box) : h('span.muted', 'no fields'))));
      });
      var n = mem.frames.length;
      mem.frames.forEach(function (f, i) {
        if (!f.vars.length && n === 1) return;
        any = true;
        body.appendChild(h('div', { class: 'frame' + (i === n - 1 ? ' active' : ' paused') },
          n > 1 ? h('div.frame-name', f.name + '()' + (f.objectId ? ' on object #' + f.objectId : '') + (i === n - 1 ? ' — running now' : ' — waiting')) : null,
          h('div.boxes', f.vars.length ? f.vars.map(box) : h('span.muted', 'no boxes yet'))));
      });
      if (!any) body.appendChild(h('p.muted.empty-mem', 'No boxes yet. A box appears when a variable is declared.'));
    }
    return { el: el, show: show };
  };
})();
