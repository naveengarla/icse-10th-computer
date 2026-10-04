/* Engine tests.
   node tests/run.js          -> engine cases + content cards
   node tests/run.js --jdk    -> also compare every program's output with real Java (JDK 21 on PATH) */
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var cp = require('child_process');
var os = require('os');

var ROOT = path.join(__dirname, '..');
var ctx = vm.createContext({ console: console });
ctx.globalThis = ctx;
function load(rel) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), ctx, { filename: rel });
}
['js/engine/values.js', 'js/engine/lexer.js', 'js/engine/parser.js', 'js/engine/library.js',
  'js/engine/checker.js', 'js/engine/interpreter.js'].forEach(load);
var E = ctx.JP.engine;

load('js/guides/methods-data.js');
var CASES = require('./cases.js').concat(require('./m2-school-cases.js'));
CASES = CASES.concat(ctx.JP.guides.methods.examples.map(function (ex) { return {name:'guide methods '+ex.id, src:ex.code}; }));
var useJdk = process.argv.indexOf('--jdk') >= 0;
var only = process.argv.filter(function (a) { return a.indexOf('--only=') === 0; }).map(function (a) { return a.slice(7); })[0];

var pass = 0, fail = 0;
function bad(name, msg) { fail++; console.log('FAIL ' + name + '\n     ' + msg.replace(/\n/g, '\n     ')); }

function lastVars(res) {
  var st = res.steps[res.steps.length - 1];
  var out = {};
  if (!st) return out;
  st.mem.fields.forEach(function (b) { out[b.name] = b.text; });
  st.mem.frames.forEach(function (f) { f.vars.forEach(function (b) { out[b.name] = b.text; }); });
  return out;
}
// variables as they were just before the end step (includes main's locals)
function finalLocals(res) {
  for (var i = res.steps.length - 1; i >= 0; i--) {
    var st = res.steps[i];
    if (st.kind === 'end' || st.kind === 'error') continue;
    var o = {};
    st.mem.frames.forEach(function (f) { f.vars.forEach(function (b) { o[b.name] = b.text; }); });
    return o;
  }
  return {};
}

function runCase(c) {
  if (c.expr) {
    var r = E.reduce(c.expr, c.vars || {});
    if (c.error) {
      if (r.ok) return bad(c.name, 'expected error, got ' + E.values.lit(r.value));
      if (c.error !== true && r.error.indexOf(c.error) < 0) return bad(c.name, 'error text: ' + r.error);
      return pass++;
    }
    if (!r.ok) return bad(c.name, 'error: ' + r.error);
    var got = E.values.lit(r.value);
    if (got !== c.value) return bad(c.name, 'value ' + got + ' expected ' + c.value + '\n' + r.snaps.map(function (s) { return s.text + '   // ' + s.note; }).join('\n'));
    if (c.after) for (var k in c.after) {
      var a = E.values.lit(r.vars[k]);
      if (a !== c.after[k]) return bad(c.name, k + ' = ' + a + ' expected ' + c.after[k]);
    }
    if (c.type && r.type !== c.type) return bad(c.name, 'type ' + r.type + ' expected ' + c.type);
    return pass++;
  }
  var res = E.run(c.src, { input: c.input || '' });
  if (c.compileError) {
    if (res.phase !== 'compile') return bad(c.name, 'expected a compile error, phase=' + res.phase);
    if (c.compileError !== true && res.error.message.indexOf(c.compileError) < 0) return bad(c.name, 'compile error text: ' + res.error.message);
    if (c.errLine && res.error.line !== c.errLine) return bad(c.name, 'error line ' + res.error.line + ' expected ' + c.errLine);
    return pass++;
  }
  if (res.phase === 'compile') return bad(c.name, 'compile error line ' + res.error.line + ': ' + res.error.message);
  if (c.runtimeError) {
    if (!res.error) return bad(c.name, 'expected runtime error');
    if (res.error.message.indexOf(c.runtimeError) < 0 && (res.error.name || '') !== c.runtimeError) return bad(c.name, 'runtime error: ' + (res.error.name || '') + ' ' + res.error.message);
    return pass++;
  }
  if (res.error) return bad(c.name, 'runtime error: ' + res.error.message);
  if (c.out !== undefined && res.output !== c.out) return bad(c.name, 'output\n' + JSON.stringify(res.output) + '\nexpected\n' + JSON.stringify(c.out));
  if (c.vars) {
    var fv = finalLocals(res);
    for (var n in c.vars) if (fv[n] !== c.vars[n]) return bad(c.name, n + ' = ' + fv[n] + ' expected ' + c.vars[n]);
  }
  if (c.passes !== undefined) {
    var max = 0;
    res.steps.forEach(function (s) { s.loops.forEach(function (l) { if (l.pass > max) max = l.pass; }); });
    if (max !== c.passes) return bad(c.name, 'loop passes ' + max + ' expected ' + c.passes);
  }
  if (c.check) {
    var msg = c.check(res);
    if (msg) return bad(c.name, msg);
  }
  pass++;
}

// ---- real Java as the oracle ----
var tmp = useJdk ? fs.mkdtempSync(path.join(os.tmpdir(), 'jp-')) : null;
function javaSource(c) {
  if (/\bclass\b/.test(c.src)) return c.src;
  return 'import java.util.*;\nclass T\n{\nvoid main()\n{\n' + c.src + '\n}\n}\n';
}
function runJdk(c) {
  var file = path.join(tmp, 'Main.java');
  fs.writeFileSync(file, javaSource(c));
  var r = cp.spawnSync('java', ['--enable-preview', '--source', '21', file], { input: c.input || '', encoding: 'utf8', timeout: 20000 });
  return { out: (r.stdout || '').replace(/\r\n/g, '\n'), err: r.stderr || '', status: r.status };
}
function jdkCase(c) {
  if (c.expr || c.jdk === false) return;
  var res = E.run(c.src, { input: c.input || '' });
  var j = runJdk(c);
  var javaCompileFail = /error:/.test(j.err) && j.status !== 0 && !/Exception/.test(j.err);
  if (c.compileError) {
    if (!javaCompileFail) bad('[jdk] ' + c.name, 'engine says compile error but javac accepted it');
    else pass++;
    return;
  }
  if (javaCompileFail) return bad('[jdk] ' + c.name, 'javac rejected it:\n' + j.err.split('\n').slice(0, 4).join('\n'));
  if (res.output !== j.out) return bad('[jdk] ' + c.name, 'engine\n' + JSON.stringify(res.output) + '\njava\n' + JSON.stringify(j.out));
  var javaThrew = /Exception/.test(j.err);
  if (javaThrew !== !!(res.error && res.error.kind === 'runtime')) return bad('[jdk] ' + c.name, 'exception mismatch: java stderr=' + j.err.split('\n')[0] + ' engine=' + JSON.stringify(res.error));
  pass++;
}

CASES.forEach(function (c) {
  if (only && c.name.indexOf(only) < 0) return;
  try { runCase(c); } catch (e) { bad(c.name, 'crash: ' + (e.stack || e.message || e)); }
});

// every prediction gate must actually be reached, and trace tables must have rows
var QUIET = { loopPass: 1, fall: 1, scopeEnd: 1, back: 1, start: 1, end: 1 };
function gateProblems(card, res) {
  if (res.phase === 'compile') return null;
  var probs = [];
  (card.gates || []).forEach(function (g) {
    var count = 0;
    res.steps.forEach(function (s) {
      if (s.line === g.line && !QUIET[s.kind] && (g.ask !== 'cond' || s.cond !== undefined)) count++;
    });
    if (count < (g.n || 1)) probs.push('gate ' + JSON.stringify(g) + ' never triggers (line ' + g.line + ' ran ' + count + ' times)');
    if (g.ask === 'next') {
      var seen = 0;
      res.steps.forEach(function (s, k) {
        if (s.line !== g.line || QUIET[s.kind] || ++seen !== (g.n || 1)) return;
        var t = res.steps[k + 1];
        if (!t || QUIET[t.kind]) probs.push('next-line gate at line ' + g.line + ' has no real next line');
      });
    }
    if (g.ask && g.ask.indexOf('var:') === 0) {
      var nm = g.ask.slice(4);
      var names = nm.split('.');
      if (!names.every(function (name) { return new RegExp('\\b' + name + '\\b').test(card.code); })) probs.push('gate asks about unknown variable ' + nm);
      var hits = res.steps.filter(function (s) { return s.line === g.line && !QUIET[s.kind]; });
      var target = hits[(g.n || 1) - 1];
      if (target && ctx.JP.ui.traceValueOf(target.mem, nm) === '—') probs.push('gate variable ' + nm + ' is not available at the target step');
    }
  });
  if (card.trace && ctx.JP.ui && ctx.JP.ui.traceRows) {
    var rows = ctx.JP.ui.traceRows(res.steps, card.trace);
    if (!rows.length) probs.push('trace table at ' + card.trace.at + ' has no rows');
  }
  return probs.length ? probs.join('\n') : null;
}

// ---- content cards: every runnable snippet must compile and run ----
var contentDir = path.join(ROOT, 'js', 'content');
if (fs.existsSync(contentDir) && !only) {
  load('js/core/ns.js');
  load('js/core/dom.js');
  load('js/ui/trace-table.js');
  fs.readdirSync(contentDir).filter(function (f) { return /\.js$/.test(f); }).sort().forEach(function (f) { load('js/content/' + f); });
  var stages = ctx.JP.content.list();
  stages.forEach(function (stage) {
    stage.cards.forEach(function (card, ci) {
      var name = 'content ' + stage.id + '#' + ci + ' (' + card.type + ')';
      var progs = ctx.JP.content.programsOf(card);
      progs.forEach(function (p) {
        try {
          var res = E.run(p.src, { input: p.input || '' });
          if (res.phase === 'compile' && !p.expectCompileError) return bad(name, 'compile error line ' + res.error.line + ': ' + res.error.message + '\n' + p.src);
          if (p.expectCompileError && res.phase !== 'compile') return bad(name, 'expected a compile error\n' + p.src);
          if (res.error && !p.expectRuntimeError && res.phase !== 'compile') return bad(name, 'runtime error: ' + res.error.message + '\n' + p.src);
          if (p.expectOutput !== undefined && res.output !== p.expectOutput) return bad(name, 'output ' + JSON.stringify(res.output) + ' expected ' + JSON.stringify(p.expectOutput));
          var gm = gateProblems(card, res);
          if (gm) return bad(name, gm);
          pass++;
          if (useJdk && !p.expectCompileError && p.jdk !== false) jdkCase({ name: name, src: p.src, input: p.input, runtimeError: p.expectRuntimeError });
        } catch (e) { bad(name, 'crash: ' + (e.stack || e)); }
      });
      // every accepted alternative in a fill blank must behave exactly like the first one
      (card.type === 'quiz' ? card.items : [card]).forEach(function (it) {
        if (it.type !== 'fill') return;
        var base = E.run(ctx.JP.content.fillSolution(it.code), { input: it.input || '' }).output;
        var bi = 0;
        it.code.replace(/\[\[(.*?)\]\]/g, function (m, alts) {
          var mine = bi++;
          alts.split('|').slice(1).forEach(function (alt) {
            var k = 0;
            var src = it.code.replace(/\[\[(.*?)\]\]/g, function (m2, a2) { return k++ === mine ? alt : a2.split('|')[0]; });
            var r = E.run(src, { input: it.input || '' });
            if (r.phase === 'compile' || r.output !== base) bad(name, 'fill alternative "' + alt + '" ' + (r.phase === 'compile' ? 'does not compile: ' + r.error.message : 'changes the output'));
            else pass++;
          });
        });
      });
      (card.type === 'quiz' ? card.items : [card]).forEach(function (it) {
        if (it.type !== 'mcq' || it.answer !== 'output') return;
        var out = E.run(it.code, {}).output.replace(/\n$/, '');
        if (it.options.map(String).indexOf(out) < 0) bad(name, 'mcq: no option matches the real output ' + JSON.stringify(out));
        else pass++;
      });
      (ctx.JP.content.exprsOf(card) || []).forEach(function (x) {
        var r = E.reduce(x.expr, x.vars || {});
        if (!r.ok && !x.expectError) bad(name, 'expression ' + x.expr + ': ' + r.error);
        else pass++;
      });
    });
  });
}

if (useJdk) {
  console.log('Comparing with real Java (this takes a while)...');
  CASES.forEach(function (c) {
    if (only && c.name.indexOf(only) < 0) return;
    if (c.runtimeError && c.runtimeError !== 'ArithmeticException' && c.runtimeError !== 'StringIndexOutOfBoundsException') return;
    try { jdkCase(c); } catch (e) { bad('[jdk] ' + c.name, 'crash: ' + e.message); }
  });
}

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
