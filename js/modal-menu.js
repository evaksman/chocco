const openButton = document.querySelector('.hamburger');

openButton.addEventListener("click", event => {
  event.preventDefault();
  const overlayElement = document.querySelector('.overlay');
  overlayElement.style.display = "flex";

  overlayElement.addEventListener("click", event => {
    if (!event.target.classList.contains("menu"))
      closeButton.click(); 
  });
  
  const closeButton = document.querySelector('.overlay__close');

  closeButton.addEventListener("click", event => {
    event.preventDefault();
    overlayElement.style.display = "none";
  });

});