
const topbar=document.querySelector('.topbar');
const burger=document.querySelector('.burger');
const navLinks=document.querySelector('.nav-links');
window.addEventListener('scroll',()=>{ if(topbar){ topbar.classList.toggle('scrolled', window.scrollY>30);} });
if(burger&&navLinks){burger.addEventListener('click',()=>navLinks.classList.toggle('open'));}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>navLinks&&navLinks.classList.remove('open')));
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');observer.unobserve(e.target);}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
