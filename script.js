let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;

const memoryImages = [
  "assets/images/games/m1.jpg",
  "assets/images/games/m2.jpg",
  "assets/images/games/m3.jpg",
  "assets/images/games/m4.jpg",
  "assets/images/games/m5.jpg",
  "assets/images/games/m6.jpg"
];
let currentPuzzleIndex = 0;
const correctSound = new Audio("assets/audio/correct.mp3");
const wrongSound = new Audio("assets/audio/wrong.mp3");
// Switch between screens
function switchScreen(id) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  document.getElementById(id).classList.add('active');
}

// When clicking profiles
function openSection(section) {
  switchScreen(section);
}

// Auto move from intro → profiles
setTimeout(() => {
  switchScreen('profiles');
}, 2500);
function openGame(game) {
  if (game === "quiz") {
    switchScreen("quiz");
    loadQuestion();
  } else if (game === "jigsaw") {
      currentPuzzleIndex = 0;
    switchScreen("jigsaw");
    startJigsaw();
  } 
  else if (game === "memory") {
  switchScreen("memory");
  startMemoryGame();
}else {
    alert("Coming soon: " + game);
  }
}
let pieces = [];
let dragged = null;

const puzzleImages = [
  "assets/images/games/puzzle1.jpg",
  "assets/images/games/puzzle2.jpg",
  "assets/images/games/puzzle3.jpg"
];

function startJigsaw() {
  const puzzle = document.getElementById("puzzle");
  puzzle.innerHTML = "";
  //  pick image
  const img = puzzleImages[currentPuzzleIndex];
  
  pieces = [];
  
  for (let i = 0; i < 9; i++) {
      pieces.push(i);
    }
    
    pieces.sort(() => Math.random() - 0.5);
    
    pieces.forEach((pieceValue, position) => {
  const div = document.createElement("div");
  div.classList.add("piece");

  const x = pieceValue % 3;
  const y = Math.floor(pieceValue / 3);

  div.style.backgroundImage = `url('${img}')`;
  div.style.backgroundPosition = `-${x * 100}px -${y * 100}px`;

  // ✅ correct piece identity
  div.dataset.correctIndex = pieceValue;

  // ✅ current position in grid
  div.dataset.currentIndex = position;

  div.setAttribute("draggable", true);

  div.addEventListener("dragstart", () => dragged = div);
  div.addEventListener("dragend", () => dragged = null);
  div.addEventListener("dragover", e => e.preventDefault());
  div.addEventListener("drop", () => swapPieces(div));

  puzzle.appendChild(div);
});
}
function swapPieces(target) {
  if (!dragged) return;

  // swap background
  const tempBg = dragged.style.backgroundPosition;
  dragged.style.backgroundPosition = target.style.backgroundPosition;
  target.style.backgroundPosition = tempBg;

  // swap CORRECT INDEX (this is key fix 🔥)
  const tempCorrect = dragged.dataset.correctIndex;
  dragged.dataset.correctIndex = target.dataset.correctIndex;
  target.dataset.correctIndex = tempCorrect;

  checkWin();
}
function checkWin() {
  const pieces = document.querySelectorAll(".piece");

  let correct = true;

  pieces.forEach(piece => {
    if (piece.dataset.currentIndex !== piece.dataset.correctIndex) {
      correct = false;
    }
  });

  if (correct) {
    correctSound.currentTime = 0;
    correctSound.play();

    launchConfetti();

    const puzzle = document.getElementById("puzzle");
    puzzle.innerHTML = `
      <div class="complete-msg">
        <h2>Completed 🎉</h2>
      </div>
    `;

    setTimeout(() => {
      currentPuzzleIndex++;

      if (currentPuzzleIndex < puzzleImages.length) {
        startJigsaw();
      } else {
        showFinalCongrats();
      }
    }, 2000);
  }
}
function showFinalCongrats() {
  const puzzle = document.getElementById("puzzle");

  launchConfetti();

  puzzle.innerHTML = `
    <div class="final-screen">
      <h2>🎉 All Puzzles Completed! 🎉</h2>
      <p>You did amazing 💖</p>
      <button onclick="restartJigsaw()">Play Again</button>
      <button onclick="switchScreen('games')">Back</button>
    </div>
  `;
}
function restartJigsaw() {
  currentPuzzleIndex = 0;
  startJigsaw();
}
function flipCard(card) {
  if (lockBoard) return;
  if (card === firstCard) return;

  card.classList.add("flip");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  checkMatch();
}
function checkMatch() {
  const isMatch = firstCard.dataset.image === secondCard.dataset.image;

  if (isMatch) {
    correctSound.currentTime = 0;
    correctSound.play();
    matches++;

    resetTurn();

    if (matches === memoryImages.length) {
      setTimeout(showMemoryWin, 500);
    }
  } else {
    wrongSound.currentTime = 0;
    wrongSound.play();

    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetTurn();
    }, 800);
  }
}
function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}
function showMemoryWin() {
  launchConfetti();

  const board = document.getElementById("memoryBoard");

  board.innerHTML = `
  <div class="memory-win">
    <h2>🎉 You matched everything! 🎉</h2>
    <button onclick="startMemoryGame()">Play Again</button>
    <button onclick="switchScreen('games')">Back</button>
  </div>
`;
}
function startMemoryGame() {
  const board = document.getElementById("memoryBoard");
  board.innerHTML = "";

  matches = 0;

  firstCard = null;
secondCard = null;
lockBoard = false;
  let cards = [...memoryImages, ...memoryImages]; // duplicate

  // shuffle
  cards.sort(() => Math.random() - 0.5);

  cards.forEach(src => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back" style="background-image:url('${src}')"></div>
      </div>
    `;

    card.dataset.image = src;

    card.addEventListener("click", () => flipCard(card));

    board.appendChild(card);
  });
}
// Quiz Data (PERSONALIZE THIS 🔥)
const quizData = [
  {
    question: "What community does Waths like the most?",
    options: ["Parsi", "Hindu", "Sikh", "Muslim"],
    correct: 2
  },
  {
    question: "What is the shade of Namam color does Rajgopal Thatha use?",
    options: ["saffron", "Hot ", "Sunset orange", "None of them"],
    correct: 3
  },
  {
    question: "Karna is a ",
    options: ["Mahabaratham character", "Cat ", "Dog", "Parrot"],
    correct: 2
  },
  {
    question: "What is the full name of Mayil",
    options: ["Thangamayil", "Mayilkanni ", "Mayilvaganam", "Mayilsaami"],
    correct: 3
  },
  {
    question: "Waths friends from school and college",
    options: ["ilakkiya , Amritha , shreya", "sanjana , ilakkiya , yazhini ", "shreya , ilakkiya , hanvika", "none of the above"],
    correct: 0
  },
  {
    question: "What was the first movie u watched in your first movie date?",
    options: ["DDD", "TTT", "VVV", "KSK"],
    correct: 1
  },
  {
    question: "What are the names of the dogs that wath grew with ?",
    options: ["Karna , Raja , Dharshini", "Karna , Raju , Ravi", "Karna , Raja , Ramu ", "Karna , Raja , Mayil"],
    correct: 2
  }
];

let currentQ = 0;
let score = 0;
let selected = null;

// Load Question
function loadQuestion() {
  const q = quizData[currentQ];
  document.querySelector(".next-btn").disabled = false;
  document.getElementById("question").innerText = q.question;
  document.getElementById("leftMemes").innerHTML = "";
document.getElementById("rightMemes").innerHTML = "";
  q.options.forEach((opt, i) => {
    document.getElementById("opt" + i).innerText = opt;
  });
   document.querySelectorAll('.options button').forEach(btn => {
  btn.classList.remove("selected");
});
  selected = null;
  
}

// Select Answer
function selectAnswer(index) {
  selected = index;

  document.querySelectorAll('.options button').forEach((btn, i) => {
    btn.classList.remove("selected");
  });

  document.getElementById("opt" + index).classList.add("selected");
}

// Next Question
function nextQuestion() {
  if (selected === null) {
    alert("Select an answer!");
    return;
  }

  const isCorrect = selected === quizData[currentQ].correct;

  if (isCorrect) {
    score++;
    correctSound.currentTime = 0;
    correctSound.play();
    launchConfetti();
  } else {
    wrongSound.currentTime = 0;
    wrongSound.play();
  }


  showMemes(isCorrect);
  document.querySelector(".next-btn").disabled = true;

  const scoreEl = document.getElementById("score");
if (scoreEl) {
  scoreEl.innerText = "Score: " + score;
}

  currentQ++;

  if (currentQ < quizData.length) {
    setTimeout(loadQuestion, 4000); // slight delay so memes are visible
  } else {
    setTimeout(showResult, 1000);
  }
}
function launchConfetti() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 }
  });
}
// Show Result
function showResult() {
  document.querySelector(".quiz-container").innerHTML = `
    <h2>Quiz Completed 🎉</h2>
    <p>Your Score: ${score}/${quizData.length}</p>
    <button onclick="restartQuiz()">Play Again</button>
    <button onclick="switchScreen('games')">Back</button>
  `;
}

// Restart
function restartQuiz() {
  currentQ = 0;
  score = 0;
  document.getElementById("leftMemes").innerHTML = "";
document.getElementById("rightMemes").innerHTML = "";
  document.querySelector(".quiz-container").innerHTML = `
    <h2 id="question"></h2>
    <div class="options">
      <button onclick="selectAnswer(0)" id="opt0"></button>
      <button onclick="selectAnswer(1)" id="opt1"></button>
      <button onclick="selectAnswer(2)" id="opt2"></button>
      <button onclick="selectAnswer(3)" id="opt3"></button>
    </div>
    <p id="score">Score: 0</p>
    <button class="next-btn" onclick="nextQuestion()">Next</button>
  `;

  loadQuestion();
}
function showMemes(isCorrect) {
  const left = document.getElementById("leftMemes");
  const right = document.getElementById("rightMemes");

  left.innerHTML = "";
  right.innerHTML = "";

  const folder = isCorrect ? "correct" : "wrong";

  // random images
  const rand1 = Math.floor(Math.random() * 6) + 1;
  const rand2 = Math.floor(Math.random() * 6) + 1;

  const img1 = document.createElement("img");
  img1.src = `assets/images/memes/${folder}/${folder}${rand1}.jpg`;

  const img2 = document.createElement("img");
  img2.src = `assets/images/memes/${folder}/${folder}${rand2}.jpg`;

  left.appendChild(img1);
  right.appendChild(img2);
}
function openNostalgia(type) {
  if (type === "carousel") {
    switchScreen("carousel");
    startCarousel();
  } else if (type === "music") {
    window.open("https://mewtru.com/mixtape/playback?v=ODJUiHraIlQ%2C68ixlbMQaY0%2CIUtvFMtFAOI%2CUWpyWhgrYC8&to=Arun%2520Waths", "_blank");
  } else if (type === "comic") {
    switchScreen("comic");
    startComic();
  }
}
const carouselImages = [
  "assets/images/nostalgia/c1.jpg",
  "assets/images/nostalgia/c2.jpg",
  "assets/images/nostalgia/c3.jpg",
  "assets/images/nostalgia/c4.jpg",
  "assets/images/nostalgia/c5.jpg",
  "assets/images/nostalgia/c6.jpg",
  "assets/images/nostalgia/c7.jpg",
  "assets/images/nostalgia/c8.jpg"
];

function startCarousel() {
  const container = document.getElementById("carousel3d");
  container.innerHTML = "";

  const total = carouselImages.length;
  const angle = 360 / total;

  carouselImages.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;

    const rotate = angle * i;

    img.style.transform = `
      rotateY(${rotate}deg) translateZ(350px)
    `;

    container.appendChild(img);
  });
}
let comicIndex = 0;

const comicPages = [
  "assets/images/nostalgia/comic1.png",
  "assets/images/nostalgia/comic2.png",
  "assets/images/nostalgia/comic3.png",
  "assets/images/nostalgia/comic4.png",
  "assets/images/nostalgia/comic5.png",
  "assets/images/nostalgia/comic6.png",
  "assets/images/nostalgia/comic7.png",
  "assets/images/nostalgia/comic8.png",
  "assets/images/nostalgia/comic9.png",
  "assets/images/nostalgia/comic10.png",
  "assets/images/nostalgia/comic11.png",
  "assets/images/nostalgia/comic12.png",
  "assets/images/nostalgia/comic13.png",
  "assets/images/nostalgia/comic14.png",
  "assets/images/nostalgia/comic15.png",
  "assets/images/nostalgia/comic16.png",
  "assets/images/nostalgia/comic17.png",
  "assets/images/nostalgia/comic18.png",
  "assets/images/nostalgia/comic19.png",
  "assets/images/nostalgia/comic20.png"
];

function startComic() {
  comicIndex = 0;
  updateComic();
}

function updateComic() {
  console.log(comicPages[comicIndex]);
  document.getElementById("comicImage").src = comicPages[comicIndex];
}

function nextPage() {
  if (comicIndex < comicPages.length - 1) {
    comicIndex++;
    updateComic();
  }
}

function prevPage() {
  if (comicIndex > 0) {
    comicIndex--;
    updateComic();
  }
}
function openGoodie(link) {
  window.open(link, "_blank");
}