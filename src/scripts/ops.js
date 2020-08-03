(function() {

// import $ from "jquery";
// const MobileDetect = require('mobile-detect');
//   // mobileDetect = new MobileDetect(req.headers['user-agent']);
// const touchswipe = require('touchswipe');


const sections = $("section");
const display = $(".maincontent");
const sideMenu = $(".fixed-menu");
const menuItems = sideMenu.find(".fixed-menu__item");

// http://hgoebl.github.io/mobile-detect.js/
const mobileDetect = new MobileDetect(window.navigator.userAgent);
const isMobile = mobileDetect.mobile();

let inScroll = false;

sections.first().addClass("active");
sideMenu.find(".fixed-menu__item").first().addClass("fixed-menu__item_active");

const countSectionPosition = sectionEq => {
  const position = -100 * sectionEq;

  if (isNaN(position)) {
    console.error("Передано неверное значение в countSectionPosition");
    return 0;
  }

  return position;
};

const changeMenuThemeForSection = sectionEq => {
  const currentSection = sections.eq(sectionEq);
  const menuTheme = currentSection.attr("data-sidemenu-theme");
  const activeClass = "fixed-menu_shadowed";

  if (menuTheme == "black")
    sideMenu.addClass(activeClass);
  else
    sideMenu.removeClass(activeClass);
};

const resetActiveClassForItem = (items, itemEq, activeClass) => {
  items.eq(itemEq).addClass(activeClass).siblings().removeClass(activeClass);
};

const performTransition = sectionEq => {
  if (inScroll) return;

  const transitionOver = 1000;
  const mouseInertiaOver = 300;

  inScroll = true;
  const position = countSectionPosition(sectionEq);

  changeMenuThemeForSection(sectionEq);

  display.css({
    transform: `translateY(${position}%)`
  });

  resetActiveClassForItem(sections, sectionEq, "active");

  // код ниже можно сделать в обработчике события transitionend
  setTimeout(() => {
    inScroll = false;
    resetActiveClassForItem(menuItems, sectionEq, "fixed-menu__item_active");
  }, transitionOver + mouseInertiaOver);
};

const viewportScroller = () => {
  const activeSection = sections.filter(".active");
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  return {
    next() {
      if (nextSection.length)
        performTransition(nextSection.index());
    },
    prev() {
      if (prevSection.length)
        performTransition(prevSection.index());
    }
  };
};

// нужно понять, в какую сторону скроллят
// ! этого события нет на мобилках
$(window).on("wheel", e => {
  const deltaY = e.originalEvent.deltaY;
  const scroller = viewportScroller();

  if (deltaY > 0)
    scroller.next();

  if (deltaY < 0)
    scroller.prev();
});


$(window).on("keydown", e => {
  // исключим скролл при нахождении в полях ввода
  const tagName = e.target.tagName.toLowerCase();
  const userTypingInInputs = tagName == "input" || tagName == "textarea";

  if (userTypingInInputs) return;

  const scroller = viewportScroller();

  switch (e.keyCode) {
    case 38:
      scroller.prev();
      break;
    case 40:
      scroller.next();
      break;
  }
});

$(".wrapper").on("touchmove", e => e.preventDefault());

$("[data-scroll-to]").on("click", e => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr("data-scroll-to");
  const reqSection = $(`[data-section-id=${target}]`);

  performTransition(reqSection.index());
});

if (isMobile != null) {
  // https://cdnjs.cloudflare.com/ajax/libs/jquery.touchswipe/1.6.19/jquery.touchSwipe.min.js
  $("body").swipe({
    //Generic swipe handler for all directions
    swipe: function (event, direction) {
      const scroller = viewportScroller();
      let scrollDirection = "";

      if (direction == "up") scrollDirection = "next";
      if (direction == "down") scrollDirection = "prev";

      scroller[scrollDirection]();
    }
  });
}

})()

