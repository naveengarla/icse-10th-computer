/* Output console with a visible cursor, and the keyboard-input tape. */
(function () {
  var JP = globalThis.JP;
  var h = JP.dom.h;

  JP.ui.ConsoleView = function () {
    var pre = h('pre.console-out');
    var el = h('section.panel.console', h('h4', 'Output ', h('span.sub', 'the screen')), pre);
    function show(out, prevOut) {
      JP.dom.clear(pre);
      var old = prevOut && out.indexOf(prevOut) === 0 ? prevOut.length : out.length;
      pre.appendChild(document.createTextNode(out.slice(0, old)));
      if (old < out.length) pre.appendChild(h('span.fresh', out.slice(old)));
      pre.appendChild(h('span.cursor', { title: 'The cursor: the next print starts here' }, ' '));
    }
    return { el: el, show: show };
  };

  // Shows the typed input; the part already read by the program is greyed out.
  JP.ui.InputTape = function (text, opts) {
    opts = opts || {};
    var view = h('pre.tape-view');
    var area = h('textarea.tape-edit', { rows: 3, spellcheck: false });
    area.value = text || '';
    var editing = false;
    var editBtn = opts.onChange ? h('button.btn.tiny', {
      on: {
        click: function () {
          editing = !editing;
          if (!editing) opts.onChange(area.value);
          render(0);
          editBtn.textContent = editing ? 'Use this input' : 'Change input';
        }
      }
    }, 'Change input') : null;
    var el = h('section.panel.tape', h('h4', 'Keyboard input ', h('span.sub', 'what the user types'), editBtn), view, area);
    var lastPos = 0;
    function render(pos) {
      lastPos = pos;
      view.style.display = editing ? 'none' : '';
      area.style.display = editing ? '' : 'none';
      JP.dom.clear(view);
      var t = area.value;
      if (!t) { view.appendChild(h('span.muted', '(nothing typed)')); return; }
      view.appendChild(h('span.used', t.slice(0, pos)));
      view.appendChild(h('span.left', t.slice(pos)));
    }
    render(0);
    return { el: el, show: function (pos) { render(pos || 0); }, get: function () { return area.value; }, refresh: function () { render(lastPos); } };
  };
})();
