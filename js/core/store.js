/* Progress + attempt log in localStorage (one JSON blob). */
(function () {
  var JP = globalThis.JP;
  var KEY = 'jp-foundations-v1';
  var data;

  function blank() {
    return { created: Date.now(), stages: {}, attempts: [], paper: [], settings: {} };
  }
  function load() {
    try { data = JSON.parse(localStorage.getItem(KEY)) || blank(); } catch (e) { data = blank(); }
    if (!data.stages) data.stages = {};
    if (!data.attempts) data.attempts = [];
    if (!data.paper) data.paper = [];
    if (!data.settings) data.settings = {};
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* private mode: progress lives for this tab only */ }
  }
  function stage(id) {
    if (!data.stages[id]) data.stages[id] = { pos: 0, done: {}, ms: 0, firstSeen: Date.now() };
    return data.stages[id];
  }
  load();

  JP.store = {
    data: function () { return data; },
    stage: stage,
    setPos: function (id, pos) { stage(id).pos = pos; save(); },
    markDone: function (id, cardId) {
      var s = stage(id);
      if (!s.done[cardId]) { s.done[cardId] = Date.now(); save(); }
    },
    isDone: function (id, cardId) { return !!(data.stages[id] && data.stages[id].done[cardId]); },
    doneCount: function (st) {
      var s = data.stages[st.id];
      if (!s) return 0;
      return st.cards.filter(function (c) { return s.done[c.id]; }).length;
    },
    addTime: function (id, ms) {
      if (ms > 0 && ms < 10 * 60 * 1000) { stage(id).ms += ms; save(); }
    },
    // every answer she gives: {stage, card, item, answer, expected, ok}
    log: function (entry) {
      entry.t = Date.now();
      data.attempts.push(entry);
      if (data.attempts.length > 3000) data.attempts.splice(0, data.attempts.length - 3000);
      save();
    },
    paper: function (entry) {
      entry.t = Date.now();
      data.paper.push(entry);
      save();
    },
    setting: function (k, v) {
      if (arguments.length > 1) { data.settings[k] = v; save(); }
      return data.settings[k];
    },
    exportJSON: function () { return JSON.stringify(data, null, 2); },
    reset: function () { data = blank(); save(); }
  };
})();
