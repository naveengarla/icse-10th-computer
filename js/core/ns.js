/* Shared namespace + content registry. Content files call JP.content.add({...stage}). */
(function () {
  var JP = (globalThis.JP = globalThis.JP || {});
  JP.ui = JP.ui || {};
  JP.pages = JP.pages || {};

  var stages = [];
  JP.content = {
    add: function (stage) {
      stage.cards.forEach(function (c, i) { if (!c.id) c.id = stage.id + '-' + (i + 1); });
      stages.push(stage);
      stages.sort(function (a, b) {
        var am = parseInt((a.milestone || 'M1').slice(1), 10);
        var bm = parseInt((b.milestone || 'M1').slice(1), 10);
        return am === bm ? a.n - b.n : am - bm;
      });
    },
    list: function () { return stages; },
    get: function (id) { return stages.filter(function (s) { return s.id === id; })[0]; },

    // Every runnable program inside a card (used by tests and by the cards themselves).
    programsOf: function (card) {
      var out = [];
      switch (card.type) {
        case 'watch':
        case 'explore':
        case 'predict':
        case 'trace':
          out.push({ src: card.code, input: card.input });
          break;
        case 'mcq':
          if (card.code && card.answer === 'output') out.push({ src: card.code, input: card.input });
          break;
        case 'bug':
          out.push({ src: card.code, input: card.input, expectCompileError: !card.line, jdk: false });
          if (card.fixed) out.push({ src: card.fixed, input: card.input });
          break;
        case 'reorder':
          out.push({ src: card.lines.join('\n'), input: card.input });
          break;
        case 'fill':
          out.push({ src: JP.content.fillSolution(card.code), input: card.input });
          break;
        case 'paper':
          out.push({ src: card.solution, input: card.input });
          break;
        case 'quiz':
          card.items.forEach(function (it) { out = out.concat(JP.content.programsOf(it)); });
          break;
      }
      return out;
    },
    exprsOf: function (card) {
      if (card.type === 'reduce') return [{ expr: card.expr, vars: card.vars }];
      if (card.type === 'quiz') {
        var r = [];
        card.items.forEach(function (it) { r = r.concat(JP.content.exprsOf(it)); });
        return r;
      }
      return [];
    },
    // "x = [[5]];" -> "x = 5;"   ([[a|b]] lists accepted alternatives, the first is used)
    fillSolution: function (code) {
      return code.replace(/\[\[(.*?)\]\]/g, function (m, alts) { return alts.split('|')[0]; });
    }
  };
})();
