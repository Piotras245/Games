let cards = document.querySelectorAll(".card-easy"),
  timeTag = document.querySelector(".time b"),
  flipsTag = document.querySelector(".flips b"),
  refreshBtn = document.querySelector(".details button");

let maxTime = 120;
let timeLeft = maxTime;
let flips = 0;
let matchedCard = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;
let lastMode = 1;
let cardsNumber = 12;

function selectGameMode(mode) {
  listElement = null;
  timerElement = null;
  if (mode == "1") {
    cardsNumber = 12;
    maxTime=120;
    cards = document.querySelectorAll(".card-easy");
  } else if (mode == "2") {
    cardsNumber = 16;
    maxTime = 160;
    cards = document.querySelectorAll(".card-medium");
  } else {
    cardsNumber = 24;
    maxTime = 200;
    cards = document.querySelectorAll(".card-hard");
  }

  cardsNumber = mode == "1" ? 12 : mode == "2" ? 16 : 24;
  shuffleCard();

  refreshBtn.addEventListener("click", shuffleCard);

  cards.forEach((card) => {
    card.addEventListener("click", flipCard);
  });
  document.querySelectorAll(".game-mode").forEach(function (section) {
    section.style.display = "none";
  });
  document.getElementById(`mode-${mode}`).style.display = "block";
}

function initTimer() {
  if (timeLeft <= 0 || matchedCard === cardsNumber / 2) {
    return clearInterval(timer);
  } else {
    timeLeft--;
    timeTag.innerText = timeLeft;
  }
}

function flipCard({ target: clickedCard }) {
  if (!isPlaying) {
    isPlaying = true;
    timer = setInterval(initTimer, 1000);
  }
  if (clickedCard !== cardOne && !disableDeck && timeLeft > 0) {
    flips++;
    flipsTag.innerText = flips;
    clickedCard.classList.add("flip");
    if (!cardOne) {
      return (cardOne = clickedCard);
    }
    cardTwo = clickedCard;
    disableDeck = true;
    let cardOneImg = cardOne.querySelector(".back-view img").src,
      cardTwoImg = cardTwo.querySelector(".back-view img").src;
    matchCards(cardOneImg, cardTwoImg);
  }
}

function matchCards(img1, img2) {
  if (img1 === img2) {
    matchedCard++;
    if (matchedCard == 12 && timeLeft > 0) {
      return clearInterval(timer);
    }
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    return (disableDeck = false);
  }

  setTimeout(() => {
    cardOne.classList.add("shake");
    cardTwo.classList.add("shake");
  }, 400);

  setTimeout(() => {
    cardOne.classList.remove("shake", "flip");
    cardTwo.classList.remove("shake", "flip");
    cardOne = cardTwo = "";
    disableDeck = false;
  }, 1200);
}

function shuffleCard() {
  timeLeft = maxTime;
  flips = matchedCard = 0;
  cardOne = cardTwo = "";
  clearInterval(timer);
  timeTag.innerText = timeLeft;
  flipsTag.innerText = flips;
  disableDeck = isPlaying = false;

  let arr = [];
  for (let i = 1; i <= cardsNumber / 2; i++) {
    arr.push(i);
    arr.push(i);
  }
  console.log(arr);
  console.log(cardsNumber);
  arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

  cards.forEach((card, index) => {
    card.classList.remove("flip");
    let imgTag = card.querySelector(".back-view img");
    setTimeout(() => {
      imgTag.src = `images/img-${arr[index]}.png`;
    }, 500);
    card.addEventListener("click", flipCard);
  });
}

shuffleCard();

refreshBtn.addEventListener("click", shuffleCard);

cards.forEach((card) => {
  card.addEventListener("click", flipCard);
});
