(function() {

// const loop = (direction, event) => {
//   event.preventDefault();  
//   const $this = $(e.currentTarget);
//   const container = $('.slider__list');

//   if (direction == "right") {
//     // если перед appendChild не было create, он возьмет существующий в DOM элемент и переместит его в конец
//     // itemsList.appendChild(itemsList.firstElementChild);
//     // const nextItem = itemsList.next(); 
//     // itemsList.prepend(nextItem);    

//   } else {
//     // что и куда вставляем: последний элемент перед первым
//     // itemsList.insertBefore(itemsList.lastElementChild, itemsList.firstElementChild);
//     // const prevItem = currentItem.prev(); 
//     // itemsList.append(prevItem);
//   }
// };

// $('.slider__arrow_left').on('click', e => loop("left", e));
// $('.slider__arrow_right').on('click', e => loop("right", e));

// import $ from "jquery";

const move = (items, slideIndexToMove, activeSlideIndex) => {
  const slideToMove = $(items).eq(slideIndexToMove);
  activeSlide = $(items).eq(activeSlideIndex);
  // console.log(slideToMove, activeSlide);
  slideToMove.addClass('slider__item_active').siblings().removeClass('slider__item_active');
};

$('.slider__arrow').on('click', e => {
  e.preventDefault();
  const $this = $(e.currentTarget);
  const list = $($this).siblings('.slider__list');
  const items = $(list).find('.slider__item');
  // console.log(items);
  const activeItem = $(items).filter('.slider__item_active');
  let requiredItem; // искомый элемент

  if ($this.hasClass('slider__arrow_left')) {
    requiredItem = activeItem.prev();
    requiredItem = requiredItem.length ? requiredItem : items.last();
    // console.log(requiredItem);
  } else
    if ($this.hasClass('slider__arrow_right')) {
      requiredItem = activeItem.next();
      requiredItem = requiredItem.length ? requiredItem : items.first();
      // console.log(requiredItem);
    }

    // console.log(items);

    move(items, requiredItem.index(), activeItem.index());

});

})()
