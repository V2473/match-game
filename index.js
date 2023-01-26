import anime from "/node_modules/animejs/lib/anime.es.js";

let MatchGridLogic = (
  size = [600, 500],
  grid = [3, 3],
  time = 120,
  theme = { colors: "white", font: '"Arial", sans-serif' }
) => {
  const game = document.querySelector(".game");
  // const fragment = document.createDocumentFragment();
  const width = size[0];
  const height = size[1];
  const col = grid[0];
  const row = grid[1];
  const sameElementsAmount = 2;
  let currentTime = time * 1000;
  let numberOfElements = col * row;
  let stages = ["start", "play", "lose", "win", "pause"];
  let currentStage = stages[0];
  let matchedAmount = 0;
  game.style.setProperty("background", theme.colors);

  game.style.setProperty("font-family", theme.font);

  let menu = document.createElement("div");
  let menuText = document.createElement("div");
  let overlay = document.createElement("div");
  let timer = document.createElement("div");
  let overlayText = document.createElement("div");
  let timerValue = document.createElement("div");
  let restart = document.createElement("div");
  let resume = document.createElement("div");
  let restartText = document.createElement("div");
  let restartIcon = document.createElement("div");
  let menuButton = document.createElement("div");

  menuButton.classList.add("menu-button");
  menuButton.innerHTML = "Pause";
  menuButton.onclick = () => {
    currentStage = stages[4];
    overlayChange();
  };

  game.onmouseleave = () => {
    if (currentStage === stages[0]) {
      return;
    }
    currentStage = stages[4];
    overlayChange();
  };

  menuText.classList.add("menu-text");

  menu.appendChild(menuButton);
  menu.appendChild(menuText);


  overlayText.classList.add("overlay-text");
  overlayText.innerHTML = "Time is up!";

  restart.classList.add("restart");
  restart.innerHTML = "Restart";
  restart.onclick = () => {
    restartFunction();
  };

  resume.classList.add("resume");
  resume.innerHTML = "Resume";
  resume.onclick = () => {
    currentStage = stages[1];
    overlayChange();
    resumeTimer();
  };

  overlay.appendChild(restart);
  overlay.appendChild(resume);
  overlay.appendChild(overlayText);


  overlay.onclick = () => {
    overlayChange();
  };

  let overlayChange = () => {
    restart.innerHTML = "Restart";
    overlayText.innerHTML = "";
    resume.style.display = "flex";

    if (currentStage === stages[0]) {
      overlay.classList.add("overlay-active");
      resume.style.display = "none";
      pauseTimer();
      restart.innerHTML = "Start";
      overlayText.innerHTML = "Match the cards. Press Start to begin.";
      return;
    }

    if (currentStage === stages[1]) {
      overlay.classList.remove("overlay-active");
      return;
    }
    if (currentStage === stages[2]) {
      overlayText.innerHTML = "Time is up!";

      overlay.classList.add("overlay-active");
      resume.style.display = "none";
      return;
    }

    if (currentStage === stages[3]) {
      overlayText.innerHTML = "You win!";
      pauseTimer();
      overlay.classList.add("overlay-active");
      resume.style.display = "none";
      return;
    }
    if (currentStage === stages[4]) {
      overlayText.innerHTML = "Paused";
      pauseTimer();
      overlay.classList.add("overlay-active");

      // currentStage = stages[4];
      // menuText.innerHTML = "Paused";
      return;
    }
    // if (currentStage === stages[4]) {
    //   resumeTimer();
    //   // currentStage = stages[1];
    //   menuText.innerHTML = showTime(time * 1000);
    //   return;
    // }
  };

  let restartFunction = () => {
    
    compareCards('restart')
    gameInit(true);
  }

  function showTime(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return seconds == 60
      ? minutes + 1 + ":00"
      : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  let timerFunction = setInterval(() => {
    if (currentTime > 0) {
      currentTime -= 100;
      menuText.innerHTML = showTime(currentTime);
    } else {
      clearInterval(timerFunction);
      lose();
    }
  }, 100);

  let pauseTimer = () => {
    clearInterval(timerFunction);
  };

  let resumeTimer = () => {
    menuText.innerHTML = showTime(currentTime);
    timerFunction = setInterval(() => {
      if (currentTime > 0) {
        currentTime -= 100;
        menuText.innerHTML = showTime(currentTime);
      } else {
        clearInterval(timerFunction);
        lose();
      }
    }

      , 100);
  };

  let win = () => {
    currentStage = stages[3];
    menuText.innerHTML = "You win";
    menu.classList.add("win");
    // overlay.classList.add("overlay");
    overlayChange();
  };

  let lose = () => {
    currentStage = stages[2];
    // overlay.innerHTML = "Time is up!";
    // menu.classList.add("lose");
    overlayChange();
  };


  menu.classList.add("menu");
  menuText.innerHTML = showTime(time * 1000);
  overlay.classList.add("overlay");
  game.appendChild(menu);
  game.appendChild(overlay);

  const cardSize = [width / col, height * 0.85 / row];

  game.style.setProperty("height", height + "px");
  game.style.setProperty("width", width + "px");
  // game.style.setProperty("background-color", "#f5f5f500");

  let makeAnimation = (target) => {
    let flipped = target.classList.contains("flipped");
    let matched = target.classList.contains("matched");

    let flipAnimation = anime({
      targets: target,
      rotateY: [
        {
          value: flipped ? 180 : 0,
          duration: 100,
        },
      ],
      scale: matched
        ? [
            {
              value: 1,
              duration: 50,
              delay: 100,
            },
            {
              value: 1.5,
              duration: 50,
              delay: 100,
            },
            {
              value: 1,
              duration: 50,
              delay: 150,
            },
          ]
        : [{ value: 1, duration: 0 }],
      easing: "easeInOutExpo",
      // duration: 250,
      loop: false,
      autoplay: false,
    });

    flipAnimation.play();
  };

  while (numberOfElements % sameElementsAmount !== 0) {
    numberOfElements--;
  }

  let cards = [];

  for (let i = 0; i < numberOfElements / sameElementsAmount; i++) {
    cards.push(...Array(sameElementsAmount).fill(i + 1));
  }

  let shuffle = (array) => {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  let gameInit = (res = false) => {
    currentTime = time * 1000;
    if (res) {
      currentStage = stages[1];
      game.innerHTML = "";
      game.appendChild(menu);
      game.appendChild(overlay);
    } 
    clearInterval(timerFunction);
    matchedAmount = 0
    overlayChange();
    res ? resumeTimer() : '';
    shuffle(cards);


    for (let i = 0; i < numberOfElements; i++) {
      let cardContainer = document.createElement("div");
      cardContainer.classList.add("card-container");

      let card = document.createElement("div");
      card.setAttribute("id", i);
      cardContainer.appendChild(card);
      let back = document.createElement("div");
      back.innerHTML = cards[i];
      back.classList.add("back");
      let front = document.createElement("div");
      let frontBackground = document.createElement("div");
      frontBackground.style.background = `linear-gradient(${Math.floor(
        Math.random() * 360
      )}deg, hsl(${Math.random() * 360}, 50%, 50%), hsl(${
        Math.random() * 360
      }, 50%, 50%))`;
      frontBackground.style.borderRadius = "5%";
      frontBackground.style.width = "80%";
      frontBackground.style.height = "80%";

      front.classList.add("front");
      front.style.background = `lightgray`;
      front.style.borderRadius = "5%";
      frontBackground.style.padding = "3%";

      front.appendChild(frontBackground);

      card.appendChild(back);
      card.appendChild(front);
      cardContainer.onclick = function () {
        let currentCard = cardContainer.children[0];
        compareCards(currentCard);
      };
      card.classList.add("card");
      cardContainer.style.setProperty("width", `${cardSize[0]}px`);
      cardContainer.style.height = `${cardSize[1]}px`;
      cardContainer.style.fontSize = `${cardSize[0] / 2}px`;

      game.appendChild(cardContainer);
    }
  };

  gameInit();

  let comparing = {
    ids: [],
    value: null,
  };

  let timeout = false;

  let compareCards = (card) => {

    if (card === 'restart'){
      comparing.ids = [];
      comparing.value = null;
      return;
    }

    let cardId = card.getAttribute("id");
    let cardValue = card.children[0].innerHTML;
    if (
      comparing.ids.includes(cardId) ||
      timeout ||
      card.classList.contains("matched")
    ) {
      return;
    }
    card.classList.toggle("flipped");

    makeAnimation(card);

    let timeoutTime = 1000;

    if (comparing.value === cardValue || comparing.ids.length === 0) {
      timeoutTime = 150;
    }
    timeout = true;

    setTimeout(() => {
      comparing.ids.push(cardId);

      if (comparing.value) {
        if (comparing.value === cardValue) {
          matchedAmount++;
          if (matchedAmount > numberOfElements / sameElementsAmount - sameElementsAmount) {
            currentStage = stages[3];
            overlayChange();

            Array.from(game.children).forEach((child) => {
              if (child.classList.contains("card-container") && !child.children[0].classList.contains("matched")) {
              // child.children[0].classList.add("matched");
              child.children[0].classList.add("flipped");
              makeAnimation(child.children[0]);
              }
            })
          }
          comparing.ids.forEach((id) => {
            let comparingCard = document.getElementById(id);
            comparingCard.classList.add("flipped");
            comparingCard.classList.add("matched");
            makeAnimation(comparingCard);
          });
          card.classList.add("flipped");
          card.classList.add("matched");
          comparing.ids = [];
          comparing.value = null;
          makeAnimation(card);
        } else {
          comparing.ids.forEach((id) => {
            let card = document.getElementById(id);
            card.classList.toggle("flipped");

            makeAnimation(card);
          });
          comparing.ids = [];
          comparing.value = null;
        }
      } else {
        comparing.value = cardValue;
      }
      timeout = false;
    }, timeoutTime);

  };
};


class MatchGrid  {
  constructor(
    size = [600, 500],
    grid = [4, 3],
    time = 120,
    theme = { colors: "white", font: '"Arial", sans-serif' }
  ) {
    this.size = size;
    this.grid = grid;
    this.time = time;
    this.theme = theme;
  }

  start() {
    MatchGridLogic(this.size, this.grid, this.time, this.theme);
  }
}

const theGame = new MatchGrid();
theGame.start();