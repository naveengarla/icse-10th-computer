/* Expression reduction: each row is the expression after one more operation, with the new part highlighted. */
(function () {
  var JP = globalThis.JP;
  var h = JP.dom.h;
  var A = '\u0001', B = '\u0002';

  function rowText(text) {
    var i = text.indexOf(A), j = text.indexOf(B);
    if (i < 0 || j < 0) return h('code.calc-expr', text);
    return h('code.calc-expr', text.slice(0, i), h('mark', text.slice(i + 1, j)), text.slice(j + 1));
  }
  JP.ui.calcRow = rowText;

  JP.ui.CalcView = function () {
    var list = h('ol.calc-list');
    var el = h('section.panel.calc', h('h4', 'Working out this line ', h('span.sub', 'one operation at a time')), list);
    function show(calc) {
      JP.dom.clear(list);
      el.style.display = calc && calc.length ? '' : 'none';
      if (!calc) return;
      calc.forEach(function (c) {
        list.appendChild(h('li', rowText(c.text), c.note ? h('div.calc-note', c.note) : null));
      });
    }
    show(null);
    return { el: el, show: show };
  };
})();
