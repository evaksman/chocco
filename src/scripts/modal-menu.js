(function() {

const openButton = document.querySelector('.hamburger');
const body = document.body;

openButton.addEventListener("click", event => {
  event.preventDefault();
  const overlayElement = document.querySelector('.overlay');
  overlayElement.style.display = "flex";
  body.style.overflow = "hidden";

  overlayElement.addEventListener("click", event => {
    if (!event.target.classList.contains("menu"))
      closeButton.click(); 
  });
  
  const closeButton = document.querySelector('.overlay__close');

  closeButton.addEventListener("click", event => {
    event.preventDefault();
    overlayElement.style.display = "none";
    body.style.overflow = "visible";
  });

});

})()