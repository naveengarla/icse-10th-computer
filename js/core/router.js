/* Hash router: #/  #/stage/s3/4  #/play  #/insights */
(function () {
  var JP = globalThis.JP;
  var h = JP.dom.h;

  function parse() {
    var parts = (location.hash || '#/').replace(/^#\/?/, '').split('/').filter(Boolean);
    return { page: parts[0] || 'journey', args: parts.slice(1) };
  }

  var current = null;
  function render() {
    var r = parse();
    var main = document.getElementById('main');
    if (current && current.leave) current.leave();
    JP.dom.clear(main);
    var page = JP.pages[r.page] || JP.pages.journey;
    current = page.render(main, r.args) || null;
    document.querySelectorAll('.topnav a').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-page') === r.page || (r.page === 'stage' && a.getAttribute('data-page') === 'journey'));
    });
    window.scrollTo(0, 0);
  }

  JP.router = {
    go: function (hash) { if (location.hash === hash) render(); else location.hash = hash; },
    start: function () {
      var nav = document.getElementById('topnav');
      nav.appendChild(h('a', { href: '#/', 'data-page': 'journey' }, 'Journey'));
      nav.appendChild(h('a', { href: 'guides/methods.html', 'data-page': 'read' }, 'Read & practise'));
      nav.appendChild(h('a', { href: '#/play', 'data-page': 'play' }, 'Playground'));
      nav.appendChild(h('a', { href: '#/insights', 'data-page': 'insights' }, 'For parents'));
      window.addEventListener('hashchange', render);
      render();
    }
  };
})();
