/* The digit machine: n % 10 picks off the last digit, n / 10 drops it. One click = one line of the loop. */
(function () {
  var JP = globalThis.JP;
  var h = JP.dom.h;

  var MODES = {
    reverse: { acc: 'rev', start: 0, line: 'rev = rev * 10 + d;', apply: function (a, d) { return a * 10 + d; }, say: function (a0, d, a) { return 'rev = ' + a0 + ' * 10 + ' + d + ' = ' + a + '. The old digits move one place left and d joins at the right.'; } },
    sum: { acc: 'sum', start: 0, line: 'sum = sum + d;', apply: function (a, d) { return a + d; }, say: function (a0, d, a) { return 'sum = ' + a0 + ' + ' + d + ' = ' + a + '.'; } },
    count: { acc: 'c', start: 0, line: 'c++;', apply: function (a) { return a + 1; }, say: function (a0, d, a) { return 'c goes from ' + a0 + ' to ' + a + ' — one more digit counted.'; } },
    cube: { acc: 'sum', start: 0, line: 'sum = sum + d * d * d;', apply: function (a, d) { return a + d * d * d; }, say: function (a0, d, a) { return 'sum = ' + a0 + ' + ' + d + '*' + d + '*' + d + ' = ' + a + '.'; } }
  };

  JP.cards.digits = function (card, ctx) {
    var mode = MODES[card.mode || 'reverse'];
    var start = card.n || 1234;
    var n, d, acc, phase, finished;
    var codeLines = ['int n = ' + start + ', copy = n, ' + mode.acc + ' = 0, d;', 'while (n > 0)', '{', '    d = n % 10;', '    ' + mode.line, '    n = n / 10;', '}'];
    var codeEl = h('div.digit-code');
    var tiles = h('div.tiles');
    var boxes = h('div.boxes');
    var say = h('div.st-note');
    var nextBtn = h('button.btn.primary', { on: { click: step } }, 'Next ▶');
    var numIn = h('input.answer.short', { value: String(start), size: 8 });
    var resetBtn = h('button.btn.ghost', { on: { click: function () { var v = parseInt(numIn.value, 10); if (v > 0 && v < 1e9) { start = v; codeLines[0] = 'int n = ' + start + ', copy = n, ' + mode.acc + ' = 0, d;'; reset(); } } } }, 'Use this number');

    function reset() {
      n = start; d = null; acc = mode.start; phase = 'check'; finished = false;
      nextBtn.disabled = false;
      draw(-1, 'Press Next. Each press runs one line of the loop.');
    }
    function step() {
      var curLine, msg, mark = null;
      if (phase === 'check') {
        curLine = 1;
        if (n > 0) { msg = 'Check n > 0: ' + n + ' > 0 is true, so run the loop body.'; phase = 'mod'; }
        else {
          msg = 'Check n > 0: 0 > 0 is false — no digits left, the loop stops. ' + mode.acc + ' = ' + acc + (card.mode === 'reverse' ? ' (the reverse of ' + start + ').' : '.') + ' n is now 0, which is why we kept a copy: copy = ' + start + '.';
          finished = true;
          nextBtn.disabled = true;
          ctx.done();
        }
      } else if (phase === 'mod') {
        curLine = 3; d = n % 10; mark = 'pick';
        msg = 'd = n % 10 → ' + n + ' % 10 = ' + d + '. The remainder after dividing by 10 is always the LAST digit.';
        phase = 'acc';
      } else if (phase === 'acc') {
        curLine = 4;
        var a0 = acc; acc = mode.apply(acc, d);
        msg = mode.say(a0, d, acc);
        phase = 'div';
      } else {
        curLine = 5; mark = 'drop';
        var n0 = n; n = Math.floor(n / 10);
        msg = 'n = n / 10 → ' + n0 + ' / 10 = ' + n + '. Whole-number division throws away the last digit.';
        phase = 'check';
      }
      draw(curLine, msg, mark);
    }
    function draw(cur, msg, mark) {
      JP.dom.clear(codeEl);
      codeLines.forEach(function (l, i) { codeEl.appendChild(h('div', { class: 'code-line' + (i === cur ? ' cur' : '') }, h('code', { html: JP.dom.highlight(l) }))); });
      JP.dom.clear(tiles);
      var s = n > 0 ? String(n) : '';
      if (mark === 'drop') s = String(n * 10 + d);
      if (!s) tiles.appendChild(h('div.tile.gone', '0'));
      s.split('').forEach(function (ch, i) {
        var last = i === s.length - 1;
        tiles.appendChild(h('div', { class: 'tile' + (last && mark === 'pick' ? ' pick' : '') + (last && mark === 'drop' ? ' drop' : '') }, ch));
      });
      JP.dom.clear(boxes);
      [['n', n], ['copy', start], ['d', d], [mode.acc, acc]].forEach(function (b) {
        boxes.appendChild(h('div.mbox.t-int', h('div.mname', b[0]), h('div.mcell', h('span', { class: 'mval' + (b[1] === null ? ' empty' : '') }, b[1] === null ? '?' : String(b[1]))), h('div.mtype', 'int')));
      });
      JP.dom.clear(say).appendChild(document.createTextNode(msg));
      if (finished) say.classList.add('end'); else say.classList.remove('end');
    }
    reset();
    return h('div.card-digits', card.title ? h('h2.card-title', card.title) : null, JP.dom.h('div.prose', { html: card.intro || '' }),
      h('div.digit-machine', h('div', codeEl), h('div', h('div.muted.small', 'n as digit tiles'), tiles, boxes)),
      say, h('div.st-controls', nextBtn, h('span.muted', 'Try another number: '), numIn, resetBtn));
  };
})();
