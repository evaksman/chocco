let myMap;

const init = () => {
  myMap = new ymaps.Map("map", {
    // Координаты центра карты.
    // Порядок по умолчанию: «широта, долгота».
    // Чтобы не определять координаты центра карты вручную,
    // воспользуйтесь инструментом Определение координат.
    center: [55.74867539, 37.59621456],
    // Уровень масштабирования. Допустимые значения:
    // от 0 (весь мир) до 19.
    zoom: 14,
    controls: []
  });

  const coords = [
    [55.75864051, 37.58329753],
    [55.74291999, 37.58059386],
    [55.74995205, 37.60477666],
    [55.75712803, 37.61900310]
  ];

  const myCollection = new ymaps.GeoObjectCollection({}, {
    draggable: false, // нельзя перемещать
    iconLayout: 'default#image',
    iconImageHref: "./images/icons/marker.svg", // относительно index.html
    iconImageSize: [46, 57],
    iconImageOffset: [-35, -52]
  });

  coords.forEach(coord => {
    myCollection.add(new ymaps.Placemark(coord));
  });

  myMap.geoObjects.add(myCollection);

  // Выключим масштабирование колесом мыши
  myMap.behaviors.disable('scrollZoom');
};

ymaps.ready(init);