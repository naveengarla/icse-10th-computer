/* Read-only code listing with line numbers, current/next line markers, dimmed skipped lines and loop badges.
   wrap:true shows the class/main wrapper as a grey frame around a snippet. */
(function () {
  var JP = globalThis.JP;
  var h = JP.dom.h;

  JP.ui.CodeView = function (src, opts) {
    opts = opts || {};
    var lines = src.replace(/\r/g, '').split('\n');
    var rows = [];
    var inComment = false;
    var list = h('div.code-lines');
    lines.forEach(function (text, i) {
      var html;
      if (inComment) {
        var endAt = text.indexOf('*/');
        if (endAt < 0) html = '<span class="tk-com">' + JP.dom.esc(text) + '</span>';
        else {
          html = '<span class="tk-com">' + JP.dom.esc(text.slice(0, endAt + 2)) + '</span>' + JP.dom.highlight(text.slice(endAt + 2));
          inComment = false;
        }
      } else {
        html = JP.dom.highlight(text);
        var open = text.lastIndexOf('/*');
        if (open >= 0 && text.indexOf('*/', open) < 0 && !/"[^"]*\/\*/.test(text)) inComment = true;
      }
      var row = h('div.code-line', { 'data-line': i + 1 },
        h('span.ln', String(i + 1)),
        h('span.mark'),
        h('code.src', { html: html || ' ' }),
        h('span.badge'));
      if (opts.onLineClick) {
        row.classList.add('clickable');
        row.addEventListener('click', function () { opts.onLineClick(i + 1, row); });
      }
      rows.push(row);
      list.appendChild(row);
    });

    var el;
    if (opts.wrap) {
      el = h('div.code-view.wrapped',
        h('div.wrap-head', { title: 'Every Java program lives inside a class and a main() method. We will look at this frame later.' },
          h('code', 'class Main  {  void main()  {'), h('span.wrap-note', 'the frame every program lives in — explained later')),
        list,
        h('div.wrap-foot', h('code', '}  }')));
    } else el = h('div.code-view', list);

    function mark(m) {
      m = m || {};
      rows.forEach(function (r, i) {
        var ln = i + 1;
        r.classList.toggle('cur', ln === m.cur);
        r.classList.toggle('next', ln === m.next && ln !== m.cur);
        r.classList.toggle('skip', !!(m.skip && ln >= m.skip.from && ln <= m.skip.to));
        r.classList.toggle('err', ln === m.error);
        r.classList.toggle('picked', ln === m.picked);
        r.classList.toggle('good', !!(m.good && m.good.indexOf(ln) >= 0));
        r.classList.toggle('bad', !!(m.bad && m.bad.indexOf(ln) >= 0));
        var b = r.querySelector('.badge');
        b.textContent = (m.badges && m.badges[ln]) || '';
      });
      var target = rows[(m.cur || 0) - 1];
      if (target && opts.autoScroll !== false) {
        var box = list.getBoundingClientRect(), tr = target.getBoundingClientRect();
        if (tr.top < box.top || tr.bottom > box.bottom) target.scrollIntoView({ block: 'nearest' });
      }
    }
    return { el: el, mark: mark, rows: rows };
  };

  // Simple editor: textarea + line-number gutter.
  JP.ui.CodeEditor = function (src, onChange) {
    var gutter = h('div.ed-gutter');
    var ta = h('textarea.ed-text', { spellcheck: false, autocapitalize: 'off', autocomplete: 'off', wrap: 'off' });
    ta.value = src;
    function nums() {
      var n = ta.value.split('\n').length;
      var s = '';
      for (var i = 1; i <= n; i++) s += i + '\n';
      gutter.textContent = s;
    }
    ta.addEventListener('input', function () { nums(); if (onChange) onChange(ta.value); });
    ta.addEventListener('scroll', function () { gutter.scrollTop = ta.scrollTop; });
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var s = ta.selectionStart;
        ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(ta.selectionEnd);
        ta.selectionStart = ta.selectionEnd = s + 4;
        nums();
      }
    });
    nums();
    return { el: h('div.editor', gutter, ta), get: function () { return ta.value; }, set: function (v) { ta.value = v; nums(); }, focus: function () { ta.focus(); } };
  };
})();
