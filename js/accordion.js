$(".teammate__name").on("click", e => {
  const currentTeammate = $(e.currentTarget);
  const currentItem = currentTeammate.closest(".teammate");

  currentItem.toggleClass("teammate_active").siblings().removeClass("teammate_active");
});