const navToggle=document.querySelector('.nav-toggle');

navToggle.addEventListener('click',()=>{
    document.body.classList.toggle('nav-open');
});

navLinks.forEach(link=>{
    link.addEventListener('click',()=>{
        document.body.classList.remove('nav-open');
    })
});


/*var overlay=document.getElementById("overlay");

window.addEventListener('load', function()
{
    overlay.style.display='none';
});*/


