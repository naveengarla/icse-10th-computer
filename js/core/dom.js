/* Tiny DOM helper: h('div.card#x', {on:{click:fn}, title:'..'}, child, [children], 'text') */
(function () {
  var JP = globalThis.JP;

  function h(sel, attrs) {
    var m = sel.match(/^([a-z0-9]+)?((?:[.#][\w-]+)*)$/i);
    var el = document.createElement((m && m[1]) || 'div');
    if (m && m[2]) {
      m[2].replace(/([.#])([\w-]+)/g, function (_, k, v) {
        if (k === '.') el.classList.add(v); else el.id = v;
      });
    }
    var start = 1;
    if (attrs && typeof attrs === 'object' && !(attrs instanceof Node) && !Array.isArray(attrs)) {
      start = 2;
      for (var k in attrs) {
        var v = attrs[k];
        if (v === undefined || v === null || v === false) continue;
        if (k === 'on') for (var ev in v) el.addEventListener(ev, v[ev]);
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'class') el.className += ' ' + v;
        else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
        else if (k in el && typeof v !== 'string') el[k] = v;
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    for (var i = start; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(el, x); }); return; }
    el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  // Java-ish syntax colouring for display (returns HTML for one line)
  var KW = /\b(int|long|double|float|char|boolean|byte|short|void|if|else|while|do|for|switch|case|default|break|continue|return|class|public|private|static|new|true|false|null|import)\b/g;
  function highlight(line) {
    var out = '';
    // split into strings/chars/comments vs code
    var re = /("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?|\/\/.*$|\/\*.*?(?:\*\/|$))/g, m, last = 0;
    while ((m = re.exec(line))) {
      out += code(line.slice(last, m.index));
      var t = m[0];
      var cls = t[0] === '/' ? 'tk-com' : t[0] === "'" ? 'tk-chr' : 'tk-str';
      out += '<span class="' + cls + '">' + esc(t) + '</span>';
      last = m.index + t.length;
    }
    out += code(line.slice(last));
    return out;
    function code(s) {
      return esc(s)
        .replace(KW, '<span class="tk-kw">$1</span>')
        .replace(/\b(\d+(?:\.\d+)?[LlFfDd]?)\b/g, '<span class="tk-num">$1</span>')
        .replace(/\b(String|Scanner|Math|System|Character|Integer|Double)\b/g, '<span class="tk-cls">$1</span>');
    }
  }

  JP.dom = { h: h, clear: clear, esc: esc, highlight: highlight };
})();
