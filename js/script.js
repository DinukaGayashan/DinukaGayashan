



function togglePopup(){
    document.querySelector('.full-screen-popup').classList.toggle('hidden');
}



let isDragging = false;
let startX, scrollLeft, container;

document.addEventListener("mousedown", (e) => {
  container = e.target.closest("#project-cards");
  if (container) {
    isDragging = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

document.addEventListener("mouseleave", () => {
  isDragging = false;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - container.offsetLeft;
  const walk = (x - startX);
  container.scrollLeft = scrollLeft - walk;
});


// const container = document.getElementById("project-cards");
// let isDragging = false;
// let startX, scrollLeft;

// container.addEventListener("mousedown", (e) => {
//   isDragging = true;
//   startX = e.pageX - container.offsetLeft;
//   scrollLeft = container.scrollLeft;
// });

// container.addEventListener("mouseup", () => {
//   isDragging = false;
// });

// container.addEventListener("mouseleave", () => {
//   isDragging = false;
// });

// container.addEventListener("mousemove", (e) => {
//   if (!isDragging) return;
//   e.preventDefault();
//   const x = e.pageX - container.offsetLeft;
//   const walk = (x - startX)/1.5;
//   container.scrollLeft = scrollLeft - walk;
// });
