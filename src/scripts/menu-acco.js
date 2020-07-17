(function() {

// import $ from "jquery";

const calcWidth = item => {
  let reqItemWidth = 0;

  const screenWidth = $(window).width();
  const list = item.closest(".products-menu");
  const titleBlocks = list.find(".products-menu__title");
  const titleWidth = titleBlocks.width() * titleBlocks.length;

  const isMobile = window.matchMedia("(max-width: 768px").matches;

  if (isMobile)
    reqItemWidth = screenWidth - titleWidth;
  else
    reqItemWidth = 530;

  const textContainer = item.find(".products-menu__container");
  const paddingLeft = parseInt(textContainer.css("padding-left"));
  const paddingRight = parseInt(textContainer.css("padding-right"));

  return {
    list: reqItemWidth,
    textContainer: reqItemWidth - paddingLeft - paddingRight
  };
};

const closeEveryItemInList = list => {
  const items = list.find(".products-menu__item");
  const content = list.find(".products-menu__content");

  items.removeClass("active");
  content.width(0);
};

const openItem = item => {
  const hiddenContent = item.find(".products-menu__content");
  const reqWidth = calcWidth(item);
  const textBlock = item.find(".products-menu__container");

  item.addClass("active");
  hiddenContent.width(reqWidth.list);
  textBlock.width(reqWidth.textContainer);
};

$(".products-menu__title").on("click", e => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const item = $this.closest(".products-menu__item");
  const itemOpened = item.hasClass("active");
  const list = $this.closest(".products-menu");

  if (itemOpened)
    closeEveryItemInList(list);
  else {
    closeEveryItemInList(list);
    openItem(item);
  }
});

$(".products-menu__close").on("click", e => {
  e.preventDefault();
  closeEveryItemInList($(".products-menu"));
});

})()