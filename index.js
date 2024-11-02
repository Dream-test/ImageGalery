let imageIndex = 0;
let imagesData = {};
let timerId;
let timerId1;
let time = 100;

function updateTimer() {
  time -= 0.5;
  if (time <= 0) {
    timerRestart();
    imageIndex += 1;
    display();
    return;
  }
  document.querySelector(".bar").style.width = time + "%";
  timerId = setTimeout(updateTimer, 15);
}

function timerRestart() {
  document.querySelector(".bar").style.width = "100%";
  time = 100;
}

function randPage() {
  return Math.floor(Math.random() * 100);
}

function displayLargeImage() {
  document.querySelectorAll("img").forEach((image) => {
    image.parentElement.classList.remove("selected");
  });
  document.getElementById("image4").src =
    imagesData.hits[imageIndex].webformatURL;
  document.querySelector(
    ".authorNick"
  ).textContent = `${imagesData.hits[imageIndex].user}`;
  document.getElementById("image4").classList.add("loading");
  document
    .getElementById(`image${imageIndex}`)
    .parentElement.classList.add("selected");
}

function onImageLoaded() {
  document.getElementById("image4").classList.remove("loading");
  if (document.getElementById("display").textContent === "Stop") {
    clearTimeout(timerId1);
    timerRestart();
    updateTimer();
  }
}

function refresh() {
  if (imageIndex === 4) {
    imageIndex = 0;
    if (document.getElementById("display").textContent === "Stop") {
      display();
      return;
    } else {
      displayLargeImage();
      return;
    }
  } else {
    document.getElementById(`image${imageIndex}`).src =
      imagesData.hits[imageIndex].previewURL;
    imageIndex += 1;
  }
  timerId1 = setTimeout(refresh, 400);
}

function getPage() {
  timerRestart();
  imageIndex = 0;
  fetch(
    `https://pixabay.com/api/?key=46432520-438daec7e40c93a9941b5d938&page=${randPage()}&per_page=4&image_type=photo`
  )
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      imagesData = responseData;
      refresh();
    });
}

function display() {
  clearTimeout(timerId);
  if (!imagesData || !imagesData.hits || imagesData.hits.length === 0) {
    getPage();
    return;
  }
  if (imageIndex === 4) {
    imageIndex = 0;
    getPage();
    return;
  }
  displayLargeImage();
}

function play() {
  if (document.getElementById("display").textContent === "Start") {
    document.getElementById("display").textContent = "Stop";
    updateTimer();
  } else {
    document.getElementById("display").textContent = "Start";
    clearTimeout(timerId);
    displayLargeImage();
  }
}

function handleClick(event) {
  timerRestart();
  if (event.target.tagName !== "IMG") return;
  const images = Array.from(document.querySelectorAll("#slider img"));
  imageIndex = images.indexOf(event.target);
  if (document.getElementById("display").textContent === "Stop") {
    play();
  } else {
    displayLargeImage();
  }
}

function init() {
  getPage();
  document.querySelector("button").addEventListener("click", getPage);
  document.getElementById("display").addEventListener("click", play);
  document.getElementById("image4").addEventListener("load", onImageLoaded);
  document.getElementById("slider").addEventListener("click", handleClick);
}

window.addEventListener("DOMContentLoaded", init);
