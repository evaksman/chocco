let player;
const playerContainer = $('.player');

// инициализация событий в плеере (запуск/пауза, перемотка)
let eventsInit = () => {
  $(".player__start").on("click", e => {
    e.preventDefault();

    // const btn = $(e.currentTarget);

    // перенесем навешивание классов в одно место, в свитч, чтобы синхронизировать события
    if (playerContainer.hasClass("paused")) {
      // playerContainer.removeClass("paused");
      player.pauseVideo();
    } else {
      // playerContainer.addClass("paused");
      player.playVideo();
    }
  });

  $(".player__playback").on("click", e => {
    const bar = $(e.currentTarget);
    // получим горизонтальную координату курсора в пикселах относительно слоя, в котором событие возникло
    const clickedPosition = e.originalEvent.layerX;
    // переведем в проценты
    const newButtonPositionPercent = clickedPosition / bar.width() * 100;
    // найдем кол-во секунд, на которое нужно перемотать видео
    const newPlaybackPositionSec = player.getDuration() / 100 * newButtonPositionPercent;

    $(".player__playback-button").css({
      left: `${newButtonPositionPercent}%`
    });

    player.seekTo(newPlaybackPositionSec); // перемотка
  });

  $(".player__splash").on("click", e => {
    player.playVideo();
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

// будет выполняться по загрузке видео с периодичностью раз в секунду
const onPlayerReady = () => {
  let interval;

  const durationSec = player.getDuration();
  $(".player__duration-estimate").text(formatTime(durationSec));

  if (typeof interval !== "undefined") {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    const completedSec = player.getCurrentTime();
    const completedPercent = completedSec / durationSec * 100;

    $(".player__playback-button").css({
      left: `${completedPercent}%`
    });

    $(".player__duration-completed").text(formatTime(completedSec));
  }, 1000);
};

// свитч по состояниям плеера
const onPlayerStateChange = event => {
  /*
   -1 (воспроизведение видео не начато)
   0 (воспроизведение видео завершено)
   1 (воспроизведение)
   2 (пауза)
   3 (буферизация)
   5 (видео подают реплики).
 */
  switch (event.data) {
    case 1:
      playerContainer.addClass("active");
      playerContainer.addClass("paused");
      break;
    case 2:
      playerContainer.removeClass("active");
      playerContainer.removeClass("paused");
      break;
  }
};

// YouTube API
function onYouTubeIframeAPIReady() {
  player = new YT.Player("yt-player", {
    height: '405',
    width: '660',
    videoId: 'lBJyaIR1mlw',
    events: {
      'onReady': onPlayerReady, // когда будет загружено видео
      'onStateChange': onPlayerStateChange // изменение состояния плеера
    },
    playerVars: {
      controls: 0,
      disablekb: 1,
      showinfo: 0,
      rel: 0,
      autoplay: 0,
      modestbranding: 1
    }
  });
}

// вызов функции с обработчиками событий
eventsInit();