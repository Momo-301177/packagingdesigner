/* PackagingDesigner.com.au — site motion bundle */
(function(){
  var mq=window.matchMedia;
  var fine = mq && mq('(hover:hover) and (pointer:fine)').matches;
  var reduce = mq && mq('(prefers-reduced-motion: reduce)').matches;
  var AC='#2c45c9';
  var mx=innerWidth/2, my=innerHeight/2;
  addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;},{passive:true});

  /* ---------- scroll progress (all devices) ---------- */
  var prog=document.createElement('div'); prog.id='mprog'; document.body.appendChild(prog);
  function onScroll(){var h=document.documentElement;var d=(h.scrollHeight-h.clientHeight)||1;prog.style.width=((h.scrollTop/d)*100)+'%';}
  addEventListener('scroll',onScroll,{passive:true}); onScroll();

  /* ---------- reveal on scroll (failsafe: gated by html.motion) ---------- */
  document.documentElement.classList.add('motion');
  var revs=document.querySelectorAll('h2, .dcell, .acard, .rcell');
  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:0.12,rootMargin:'0px 0px -6% 0px'}):null;
  revs.forEach(function(el){
    var r=el.getBoundingClientRect();
    if(r.top<innerHeight*0.93){el.classList.add('reveal','in');}
    else{el.classList.add('reveal'); if(io){io.observe(el);} else {el.classList.add('in');}}
  });
  setTimeout(function(){document.querySelectorAll('.reveal:not(.in)').forEach(function(el){if(el.getBoundingClientRect().top<innerHeight)el.classList.add('in');});},4000);

  if(reduce) return; /* no cursor / eyes / magnetic when reduced motion requested */

  /* ---------- data-cursor labels ---------- */
  document.querySelectorAll('.card,.dcell,.acard').forEach(function(e){if(!e.hasAttribute('data-cursor'))e.setAttribute('data-cursor','View');});
  document.querySelectorAll('model-viewer').forEach(function(e){if(e.closest('.cstage'))return;e.setAttribute('data-cursor','Drag to rotate');});

  /* ---------- live googly wordmark eyes (replace static logo img) ---------- */
  var welive=[];
  if(fine){
    document.querySelectorAll('img.wmi').forEach(function(img){
      var span=document.createElement('span'); span.className='wmi welive'; span.setAttribute('aria-hidden','true');
      span.innerHTML='<svg viewBox="0 0 34 23" style="height:26px;width:auto;display:block;overflow:visible">'+
        '<ellipse cx="8.6" cy="11.5" rx="7.2" ry="10" fill="#fff" stroke="'+AC+'" stroke-width="1.6"/>'+
        '<circle class="wp" data-cx="8.6" data-cy="11.5" cx="8.6" cy="11.5" r="3.5" fill="'+AC+'"/>'+
        '<ellipse cx="25.4" cy="11.5" rx="7.2" ry="10" fill="#fff" stroke="'+AC+'" stroke-width="1.6"/>'+
        '<circle class="wp" data-cx="25.4" data-cy="11.5" cx="25.4" cy="11.5" r="3.5" fill="'+AC+'"/></svg>';
      img.parentNode.replaceChild(span,img);
      welive.push(span);
    });
  }

  /* ---------- custom eye cursor + label pill ---------- */
  var eye=null,pill=null,pup=null,ex=mx,ey=my,mode='eye';
  function showCur(){ if(!eye) return; eye.style.display=(mode==='eye')?'block':'none'; pill.style.display=(mode==='pill')?'block':'none'; }
  if(fine){
    eye=document.createElement('div'); eye.className='cur-eye';
    eye.innerHTML='<svg viewBox="0 0 30 40"><ellipse cx="15" cy="20" rx="13" ry="16" fill="#fff" stroke="'+AC+'" stroke-width="2"/><circle cx="15" cy="20" r="5.6" fill="'+AC+'"/></svg>';
    pill=document.createElement('div'); pill.className='cur-pill';
    document.body.appendChild(eye); document.body.appendChild(pill);
    pup=eye.querySelector('circle');
    document.documentElement.classList.add('customcursor');
    document.addEventListener('mouseover',function(e){
      if(e.target.closest('input,textarea,select,[contenteditable]')){mode='off';}
      else{
        var lbl=e.target.closest('[data-cursor]');
        var btn=e.target.closest('button,.btn,.primary,.ghost,.cta,.send,input[type=submit],input[type=button]');
        if(lbl){mode='pill';pill.textContent=lbl.getAttribute('data-cursor');}
        else if(btn){mode='pill';pill.textContent=(btn.classList.contains('send')||/submit/i.test(btn.type||''))?'Send':'Open';}
        else{mode='eye';eye.classList.toggle('lg',!!e.target.closest('a'));}
      }
      showCur();
    });
    document.addEventListener('mouseleave',function(){if(eye)eye.style.display='none';if(pill)pill.style.display='none';});
    document.addEventListener('mouseenter',showCur);
    showCur();
  }

  /* ---------- magnetic CTAs ---------- */
  if(fine){
    document.querySelectorAll('.btn,.primary,.ghost,.send,.nav-r .cta,.lnk').forEach(function(b){
      b.classList.add('magnetic');
      b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();var dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);b.style.transform='translate('+(dx*0.28)+'px,'+(dy*0.28)+'px)';});
      b.addEventListener('mouseleave',function(){b.style.transform='';});
    });
  }

  /* ---------- animation loop: cursor + wordmark eyes ---------- */
  function frame(){
    if(eye){
      ex+=(mx-ex)*0.15; ey+=(my-ey)*0.15;
      eye.style.left=ex+'px'; eye.style.top=ey+'px';
      pill.style.left=mx+'px'; pill.style.top=my+'px';
      var dx=mx-ex,dy=my-ey,ang=Math.atan2(dy,dx),d=Math.min(1,Math.hypot(dx,dy)/34);
      pup.setAttribute('cx',15+Math.cos(ang)*6.2*d); pup.setAttribute('cy',20+Math.sin(ang)*8.6*d);
    }
    for(var i=0;i<welive.length;i++){
      var s=welive[i], svg=s.firstChild; if(!svg) continue;
      var box=svg.getBoundingClientRect(); if(!box.width) continue;
      var sc=box.width/34, pups=s.querySelectorAll('.wp');
      for(var j=0;j<pups.length;j++){
        var p=pups[j], bcx=+p.getAttribute('data-cx'), bcy=+p.getAttribute('data-cy');
        var gx=box.left+bcx*sc, gy=box.top+bcy*sc;
        var a=Math.atan2(my-gy,mx-gx), dd=Math.min(1,Math.hypot(mx-gx,my-gy)/260);
        p.setAttribute('cx',bcx+Math.cos(a)*4.0*dd);
        p.setAttribute('cy',bcy+Math.sin(a)*5.5*dd);
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
