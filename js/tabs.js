// import $ from "jquery";

const findBlockByDataAttr = dataAttr => {
  return $(".reviews__item").filter((ndx, item) => {
    return $(item).attr("data-linked-with") == dataAttr;
  });
};

$(".interactive-avatar__link").on('click', e => {
  e.preventDefault();

  const currentTab = $(e.currentTarget);
  const target = currentTab.attr("data-open");
  const itemToShow = findBlockByDataAttr(target);
  // console.log(itemToShow);
  const currentItem = currentTab.closest(".interactive-avatar");
  // console.log(currentTab, currentItem);

  itemToShow.addClass("reviews__item_active").siblings().removeClass("reviews__item_active");
  currentItem.addClass("interactive-avatar_active").siblings().removeClass("interactive-avatar_active");
});