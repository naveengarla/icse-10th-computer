/* Practice-first reading path. Existing stages and storage are untouched. */
(function () {
  var JP=globalThis.JP, data=JP.guides.methods;
  function node(tag,text) { var e=document.createElement(tag); if(text!==undefined)e.textContent=text; return e; }
  function codeBlock(code){var p=node('pre');p.appendChild(node('code',code));return p;}
  function button(text,fn){var b=node('button',text);b.type='button';b.addEventListener('click',fn);return b;}
  function lookup(id){return data.examples.filter(function(e){return e.id===id;})[0];}
  function norm(text){return text.replace(/\r/g,'').split('\n').map(function(l){return l.replace(/\s+$/,'');}).join('\n').trim();}
  var contents=document.getElementById('contents'), sections=document.getElementById('sections'), number=0;
  function editor(src){
    var group=node('details');group.className='verify';group.appendChild(node('summary','Optional · check or experiment in W3Schools'));
    var code=JP.ui.toW3(src),block=codeBlock(code);group.appendChild(node('p','Copy the whole runnable version below. Replace all code in the editor, then Run. The extra Main launcher is for the web editor; use the class above in the BlueJ exam.'));
    var actions=node('div');actions.className='actions';var status=node('span');status.className='status';status.setAttribute('role','status');
    actions.appendChild(button('Copy runnable code',function(){
      function fallback(){var selection=window.getSelection(),range=document.createRange();range.selectNodeContents(block);selection.removeAllRanges();selection.addRange(range);status.textContent='Code selected. Press Ctrl+C or use Copy, then paste into the editor.';}
      if(navigator.clipboard && navigator.clipboard.writeText)navigator.clipboard.writeText(code).then(function(){status.textContent='Copied. Paste into W3Schools and Run.';},fallback);else fallback();
    }));var link=node('a','Open W3Schools ↗');link.href='https://www.w3schools.com/java/tryjava.asp?filename=demo_helloworld';link.target='_blank';link.rel='noopener';link.className='editor';actions.appendChild(link);actions.appendChild(status);group.appendChild(actions);group.appendChild(block);return group;
  }
  data.batches.forEach(function(batch){
    var link=node('a',batch.title);link.href='#'+batch.id;contents.appendChild(link);
    var section=node('section');section.id=batch.id;section.className='batch';section.appendChild(node('h2',batch.title));var meta=node('p','~'+batch.minutes+' min · '+batch.focus);meta.className='batch-meta';section.appendChild(meta);
    batch.tasks.forEach(function(t){
      number++;var item=node('article');item.id='exercise-'+t.id;item.className='exercise';item.setAttribute('data-task',t.id);item.setAttribute('data-kind',t.kind);
      var badge=node('span',(t.kind==='paper'?'WRITE':t.kind==='recall'?'NAME IT':t.kind==='diagnose'?'FIND THE ERROR':'PREDICT')+' · '+number);badge.className='eyebrow';item.appendChild(badge);item.appendChild(node('h3',t.title));item.appendChild(node('p',t.q));
      var ex=t.example?lookup(t.example):null,result=ex?JP.engine.run(ex.code):null;
      if(ex && t.kind!=='paper')item.appendChild(codeBlock(ex.code));if(t.fragment)item.appendChild(codeBlock(t.fragment));
      var solution=node('div');solution.className='answer-reveal';solution.hidden=true;
      if(t.kind==='paper'){
        var hint=node('details');hint.className='hint';hint.appendChild(node('summary','Need a starting hint?'));hint.appendChild(node('p',t.hint));item.appendChild(hint);
        item.appendChild(button('I wrote it · compare with the solution',function(){solution.hidden=!solution.hidden;this.setAttribute('aria-expanded',String(!solution.hidden));}));
        solution.appendChild(node('h4','Compare your notebook with this school-style solution'));solution.appendChild(codeBlock(ex.code));solution.appendChild(node('h4','Computed output'));solution.appendChild(codeBlock(result.output));
        var list=node('div');list.className='checklist';t.checklist.forEach(function(c){var label=node('label');var input=node('input');input.type='checkbox';label.appendChild(input);label.appendChild(document.createTextNode(' '+c));list.appendChild(label);});solution.appendChild(list);
      }else{
        var controls=node('div');controls.className='attempt-controls';var response=node('textarea');response.rows=t.kind==='recall'?2:3;response.placeholder=t.kind==='diagnose'?'Optional: compiles / does not compile, then your corrected line':t.kind==='recall'?'Optional: write your short answer here':'Optional: type your output, one line per println';response.id='response-'+t.id;
        var label=node('label','Answer on paper, or type here');label.htmlFor=response.id;label.className='answer-label';controls.appendChild(label);controls.appendChild(response);
        var feedback=node('div');feedback.className='feedback';feedback.setAttribute('role','status');
        var actions=node('div');actions.className='actions';
        actions.appendChild(button('I tried on paper · reveal & explain',function(){solution.hidden=!solution.hidden;this.setAttribute('aria-expanded',String(!solution.hidden));}));
        if(t.kind==='output')actions.appendChild(button('Check typed output',function(){if(!response.value.trim()){feedback.textContent='Write your prediction first, or use the paper reveal.';return;}solution.hidden=false;feedback.textContent=norm(response.value)===norm(result.output)?'Correct. Now explain why each line appears.':'Compare the output below. Find the first line that differs, then retry on paper.';}));
        controls.appendChild(actions);controls.appendChild(feedback);item.appendChild(controls);
        if(t.kind==='recall'){solution.appendChild(node('h4','Short exam answer'));solution.appendChild(node('p',t.answer));}
        else if(t.kind==='diagnose'){
          if(result.phase!=='compile')throw new Error('Expected compile error: '+t.id);
          solution.appendChild(node('h4','Does not compile'));solution.appendChild(node('p','Engine check · line '+result.error.line+': '+result.error.message));solution.appendChild(node('p',t.why));
          var fixed=lookup(t.fixed);solution.appendChild(node('h4','Corrected program'));solution.appendChild(codeBlock(fixed.code));solution.appendChild(node('h4','Corrected output'));solution.appendChild(codeBlock(JP.engine.run(fixed.code).output));
        }else {if(!result.ok)throw new Error('Example failed: '+t.id);solution.appendChild(node('h4','Computed output'));solution.appendChild(codeBlock(result.output));solution.appendChild(node('p',t.why));}
        solution.appendChild(node('p','Name the rule: '+t.rule)).className='rule';
        if(t.change){solution.appendChild(node('p','Try one variation: '+t.change)).className='variation';}
        if(t.kind==='output'||t.kind==='diagnose')solution.appendChild(node('p','If you missed it: cover the answer, trace separate values on paper, then try the nearby exercise.')).className='retry';
      }
      item.appendChild(solution);if(ex)item.appendChild(editor(ex.code));section.appendChild(item);
    });sections.appendChild(section);
  });
  var reference=node('section');reference.id='reference';reference.className='reference';reference.appendChild(node('h2','Quick reference · only when needed'));
  data.sections.forEach(function(s){var detail=node('details');detail.appendChild(node('summary',s.title.replace(/^\d+\. /,'')));var body=node('div');body.innerHTML=s.body;detail.appendChild(body);reference.appendChild(detail);});sections.appendChild(reference);
  var rlink=node('a','Quick reference');rlink.href='#reference';contents.appendChild(rlink);
  document.getElementById('print').addEventListener('click',function(){window.print();});
})();
