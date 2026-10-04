/* Comparing what she typed with what Java produced, with a helpful hint when it is "nearly" right. */
(function () {
  var JP = globalThis.JP;

  function norm(s) { return String(s).replace(/\r/g, '').trim(); }
  function unquote(s) {
    var m = s.match(/^"(.*)"$/) || s.match(/^'(.)'$/);
    return m ? m[1] : s;
  }

  // expected: the value as Java prints it (e.g. 5.0, A, Hello). kind: 'value' | 'output'
  JP.ui.compareAnswer = function (typed, expected, kind) {
    var t = norm(typed), e = norm(expected);
    if (kind === 'output') {
      var tl = t.split('\n').map(function (l) { return l.replace(/\s+$/, ''); }).join('\n');
      var el = e.split('\n').map(function (l) { return l.replace(/\s+$/, ''); }).join('\n');
      if (tl === el) return { ok: true };
      if (tl.replace(/\s+/g, '') === el.replace(/\s+/g, '')) return { ok: false, near: true, hint: 'The characters are right but the spaces or lines are different. Java prints spaces only where the program puts them.' };
      return { ok: false, hint: hintFor(tl, el) };
    }
    if (t === e) return { ok: true };
    var tu = unquote(t), eu = unquote(e);
    if (tu === eu) return { ok: true };
    return { ok: false, hint: hintFor(tu, eu) };
  };

  function hintFor(t, e) {
    var tn = Number(t), en = Number(e);
    if (t !== '' && !isNaN(tn) && !isNaN(en) && tn === en) {
      if (/\.0$/.test(e) && !/\./.test(t)) return 'The number is right, but this is a double — Java always writes a double with a decimal point, like ' + e + '.';
      if (!/\./.test(e) && /\./.test(t)) return 'The number is right, but this is a whole-number type (int/long) — Java writes it without a decimal point: ' + e + '.';
    }
    if (t.toLowerCase() === e.toLowerCase()) return 'Check capital and small letters — Java treats them as different.';
    return '';
  }
})();
