const teammate = document.querySelector('.teammate');
const teammateName = document.querySelector('.teammate__name');

teammateName.addEventListener("click", event => {
  event.preventDefault();
  teammate.classList.toggle("teammate_active");
});