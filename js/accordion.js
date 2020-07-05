const teammate = document.querySelector('.teammate');
const teammateName = document.querySelector('.teammate__name');

teammateName.addEventListener("click", event => {
  event.preventDefault();
  // teammate.parentNode.childNode
  teammate.classList.toggle("teammate_active");
  // this.classList.add("teammate_active");
});