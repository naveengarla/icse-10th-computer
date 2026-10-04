/* Standalone reading path; does not change stage state or progress. */
(function () {
  var JP=globalThis.JP, data=JP.guides.methods;
  function node(tag,text) { var e=document.createElement(tag); if(text!==undefined)e.textContent=text; return e; }
  function codeBlock(code){var p=node('pre');p.appendChild(node('code',code));return p;}
  var contents=document.getElementById('contents'), sections=document.getElementById('sections');
  data.sections.forEach(function(s){
    var link=node('a',s.title);link.href='#'+s.id;contents.appendChild(link);
    var section=node('section');section.id=s.id;section.appendChild(node('h2',s.title));
    var body=node('div');body.innerHTML=s.body;section.appendChild(body);sections.appendChild(section);
  });
  data.examples.forEach(function(ex){
    var mount=document.querySelector('[data-example="'+ex.id+'"]');
    var box=node('article');box.className='example';box.setAttribute('data-example-id',ex.id);
    box.appendChild(node('h3',ex.title));box.appendChild(node('p',ex.before));
    var runnable=JP.ui.toW3(ex.code),label=node('p','Runnable code · paste the entire block into W3Schools');label.className='version';box.appendChild(label);
    var block=codeBlock(runnable);box.appendChild(block);
    var actions=node('div');actions.className='actions';var copy=node('button','Copy runnable code');copy.type='button';
    var status=node('span');status.className='status';status.setAttribute('role','status');
    copy.addEventListener('click',function(){
      function fallback(){var selection=window.getSelection(), range=document.createRange();range.selectNodeContents(block);selection.removeAllRanges();selection.addRange(range);status.textContent='Code selected. Press Ctrl+C (or use Copy), then paste it into the editor.';}
      if(navigator.clipboard && navigator.clipboard.writeText)navigator.clipboard.writeText(runnable).then(function(){status.textContent='Copied. Replace all code in the editor, then Run.';},fallback);else fallback();
    });actions.appendChild(copy);
    var editor=node('a','Open W3Schools ↗');editor.href='https://www.w3schools.com/java/tryjava.asp?filename=demo_helloworld';editor.target='_blank';editor.rel='noopener';editor.className='editor';actions.appendChild(editor);actions.appendChild(status);box.appendChild(actions);
    var school=node('details');school.appendChild(node('summary','School / BlueJ version — use this structure in the exam'));school.appendChild(codeBlock(ex.code));box.appendChild(school);
    var output=node('details');output.className='output';output.appendChild(node('summary','I predicted it — reveal expected output'));
    var result=JP.engine.run(ex.code);if(!result.ok)throw new Error('Guide example failed: '+ex.id);
    output.appendChild(codeBlock(result.output));output.appendChild(node('p',ex.after));box.appendChild(output);
    var change=node('p','Change one thing: '+ex.tryThis);change.className='try';box.appendChild(change);mount.appendChild(box);
  });
  document.getElementById('print').addEventListener('click',function(){window.print();});
  var closed=[];
  window.addEventListener('beforeprint',function(){closed=[];document.querySelectorAll('details').forEach(function(d){if(!d.open){closed.push(d);d.open=true;}});});
  window.addEventListener('afterprint',function(){closed.forEach(function(d){d.open=false;});});
})();
