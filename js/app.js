/* =====================================================================
   FELICITY IDC — INTERFACE BEHAVIOUR
   Loader, header, cursor, reveals, counters, form validation.
   Independent of the 3D scene so the page stays functional without it.
===================================================================== */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* -------------------- LOADER -------------------- */
(function loaderSequence(){
  const fill = document.getElementById('loader-fill');
  const pct = document.getElementById('loader-pct');
  const loader = document.getElementById('loader');
  const mask = document.getElementById('loader-mask');
  const duration = prefersReducedMotion ? 200 : 1800;
  const start = performance.now();

  function tick(now){
    const t = Math.min(1, (now - start) / duration);
    fill.style.width = (t*100) + '%';
    pct.textContent = String(Math.floor(t*100)).padStart(2,'0') + '%';
    if(t < 1){ requestAnimationFrame(tick); } else { finish(); }
  }
  requestAnimationFrame(tick);

  function finish(){
    document.body.classList.remove('loading');
    if(typeof gsap !== 'undefined'){
      gsap.to(loader, { autoAlpha:0, duration:.4, delay:.15, onComplete:()=>{ loader.style.display='none'; } });
      gsap.to(mask, { scaleY:0, duration:.9, ease:'power4.inOut', delay:.2, onComplete:()=>{
        mask.style.display='none';
        if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }});
    } else {
      loader.style.display='none';
      mask.style.display='none';
    }
  }
})();

/* -------------------- CUSTOM CURSOR -------------------- */
const cursor = document.getElementById('cursor');
if(window.matchMedia('(hover:hover)').matches && typeof gsap !== 'undefined'){
  window.addEventListener('mousemove', (e)=>{
    gsap.to(cursor, { x:e.clientX, y:e.clientY, duration:.15, ease:'power2.out' });
  });
  document.querySelectorAll('a, button, .industry-row').forEach(el=>{
    el.addEventListener('mouseenter', ()=>cursor.classList.add('grow'));
    el.addEventListener('mouseleave', ()=>cursor.classList.remove('grow'));
  });
}

/* -------------------- HEADER + PROGRESS -------------------- */
const header = document.getElementById('site-header');
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', ()=>{
  header.classList.toggle('scrolled', window.scrollY > 40);
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progressBar.style.width = scrolled + '%';
}, { passive:true });

/* -------------------- SMOOTH ANCHOR SCROLL -------------------- */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const target = document.querySelector(a.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  });
});

/* -------------------- MAGNETIC BUTTONS -------------------- */
if(typeof gsap !== 'undefined'){
  document.querySelectorAll('.magnetic').forEach(btn=>{
    btn.addEventListener('mousemove', (e)=>{
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      gsap.to(btn, { x:x*0.25, y:y*0.4, duration:.3, ease:'power2.out' });
    });
    btn.addEventListener('mouseleave', ()=>{ gsap.to(btn, { x:0, y:0, duration:.4, ease:'elastic.out(1,0.4)' }); });
  });
}

/* -------------------- SCROLLTRIGGER REVEALS -------------------- */
if(typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined'){
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.reveal').forEach(el=>{
    gsap.to(el, { opacity:1, y:0, duration:1, ease:'power3.out',
      scrollTrigger:{ trigger:el, start:'top 88%' } });
  });

  gsap.utils.toArray('.draw-line').forEach(path=>{
    try{
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      gsap.to(path, { strokeDashoffset:0, duration:1.6, ease:'power2.inOut',
        scrollTrigger:{ trigger:path, start:'top 90%' } });
    }catch(e){}
  });

  gsap.utils.toArray('.metric-val[data-count]').forEach(el=>{
    const end = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const obj = { val:0 };
    ScrollTrigger.create({
      trigger:el, start:'top 90%', once:true,
      onEnter:()=>{
        gsap.to(obj, { val:end, duration:1.6, ease:'power2.out',
          onUpdate:()=>{ el.textContent = Math.floor(obj.val).toLocaleString() + suffix; } });
      }
    });
  });

  gsap.utils.toArray('.ops-bar-fill').forEach(el=>{
    ScrollTrigger.create({
      trigger:el, start:'top 90%', once:true,
      onEnter:()=>{ gsap.to(el, { width: el.dataset.w + '%', duration:1.4, ease:'power2.out' }); }
    });
  });

  if(!prefersReducedMotion){
    gsap.to('.collage-main img', { yPercent:8, ease:'none',
      scrollTrigger:{ trigger:'#facility', start:'top bottom', end:'bottom top', scrub:true } });
  }

  window.addEventListener('resize', ()=>ScrollTrigger.refresh());
} else {
  // No GSAP fallback: reveal everything immediately.
  document.querySelectorAll('.reveal').forEach(el=>{ el.style.opacity = 1; el.style.transform = 'none'; });
}

/* -------------------- INDUSTRY ROWS -------------------- */
document.querySelectorAll('.industry-row').forEach(row=>{
  const descEl = row.querySelector('.industry-desc');
  descEl.textContent = row.dataset.desc;
  row.addEventListener('mouseenter', ()=>row.classList.add('open'));
  row.addEventListener('mouseleave', ()=>row.classList.remove('open'));
  row.addEventListener('click', ()=>row.classList.toggle('open'));
});

/* -------------------- CONTACT FORM VALIDATION -------------------- */
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

function validateField(field){
  const input = field.querySelector('input, select, textarea');
  const name = field.dataset.field;
  let valid = true;
  if(name === 'email'){ valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()); }
  else if(name === 'requirement'){ valid = input.value !== ''; }
  else { valid = input.value.trim().length > 1; }
  field.classList.toggle('error', !valid);
  return valid;
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const fields = form.querySelectorAll('.field');
  let allValid = true;
  fields.forEach(f=>{ if(!validateField(f)) allValid = false; });

  if(!allValid){
    status.textContent = 'PLEASE REVIEW HIGHLIGHTED FIELDS';
    status.style.color = '#d33';
    return;
  }
  status.style.color = 'var(--orange)';
  status.textContent = 'TRANSMITTING REQUEST...';
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  setTimeout(()=>{
    status.textContent = 'REQUEST RECEIVED — OUR TEAM WILL RESPOND SHORTLY.';
    form.reset();
    submitBtn.disabled = false;
  }, 900);
});

document.getElementById('download-bluebook').addEventListener('click', (e)=>{
  e.preventDefault();
  status.style.color = 'var(--orange)';
  status.textContent = 'BLUEBOOK REQUEST LOGGED — CHECK YOUR INBOX SHORTLY.';
});
