// const teammate = document.querySelector('.teammate');
// const teammateName = document.querySelector('.teammate__name');

// teammateName.addEventListener("click", event => {
//   event.preventDefault();
//   // teammate.parentNode.childNode
//   teammate.classList.toggle("teammate_active");
//   // this.classList.add("teammate_active");
// });

$(".teammate__name").on("click", e => {
  const currentTeammate = $(e.currentTarget);
  const currentItem = currentTeammate.closest(".teammate");

  currentItem.toggleClass("teammate_active").siblings().removeClass("teammate_active");
  

});