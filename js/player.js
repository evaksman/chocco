// import $ from "jquery";

// инициализация событий в плеере (запуск/пауза, перемотка)
let eventsInit = () => {
  let player = $("#html5-player");
  const playerContainer = $('.player');

  player.on("play", () => {
    playerContainer.toggleClass("paused active");
    let interval;

    const durationSec = player[0].duration;
    $(".player__duration-estimate").text(formatTime(durationSec));

    if (typeof interval != "undefined") {
      clearInterval(interval);
    }

    interval = setInterval(() => {
      const completedSec = player[0].currentTime;
      const completedPercent = completedSec / durationSec * 100;

      $(".player__playback-button").css({
        left: `${completedPercent}%`
      });

      $(".player__duration-completed").text(formatTime(completedSec));
    }, 1000);
  });

  player.on("pause", () => {
    playerContainer.toggleClass("paused active");
  });

  player.on("click", () => {
    if (playerContainer.hasClass("paused"))
      player[0].pause();
  });

  player.on("ended", () => {
    playerContainer.removeClass("paused active");
    player[0].pause();
  });

  $(".player__start").on("click", e => {
    e.preventDefault();

    // перенесем навешивание классов в события play/pause 
    if (playerContainer.hasClass("paused"))
      player[0].pause();
    else
      player[0].play();
  });

  $(".player__playback").on("click", e => {
    const bar = $(e.currentTarget);
    // получим горизонтальную координату курсора в пикселах относительно слоя, в котором событие возникло
    const clickedPosition = e.originalEvent.layerX;
    // переведем в проценты
    const newButtonPositionPercent = clickedPosition / bar.width() * 100;
    // найдем кол-во секунд, на которое нужно перемотать видео
    const newPlaybackPositionSec = player[0].duration / 100 * newButtonPositionPercent;

    $(".player__playback-button").css({
      left: `${newButtonPositionPercent}%`
    });

    player[0].currentTime = newPlaybackPositionSec; // перемотка
  });

  $(".player__splash").on("click", e => {
    player[0].play();
  });

  $(".player__volume-bar").on("click", e => {
    const bar = $(e.currentTarget);
    // получим горизонтальную координату курсора в пикселах относительно слоя, в котором событие возникло
    const clickedPosition = e.originalEvent.layerX;
    // console.log(clickedPosition);
    
    // найдем долю звука от 0 до 1
    const newVolumeValue = clickedPosition / bar.width();
    // console.log(newVolumeValue);

    // переведем в проценты
    const newButtonPositionPercent = 100 - newVolumeValue * 100;
    // console.log(newButtonPositionPercent);

    $(".player__volume-button").css({
      right: `${newButtonPositionPercent}%`
    });

    player[0].volume = newVolumeValue;
  });
};

// перевод времени в минуты
const formatTime = timeSec => {
  const roundTime = Math.round(timeSec);

  const minutes = addZero(Math.floor(roundTime / 60)); // округление в меньшую сторону
  const seconds = addZero(roundTime - minutes * 60);

  function addZero(num) {
    return num < 10 ? `0${num}` : num;
  }

  return `${minutes} : ${seconds}`;
};

// вызов функций с обработчиками событий
eventsInit();

