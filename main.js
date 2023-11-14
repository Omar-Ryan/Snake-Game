let gameBoard = document.querySelector(".game-board");
let scoreEle = document.querySelector(".score");
let highScoreEle = document.querySelector(".high-score");
let controls = document.querySelectorAll(".controls i");
let popup = document.querySelector(".popup");
let layer = document.querySelector(".layer");

let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 10;
let snakeBody = [];
let positionX = 0,
  positionY = 0;
let setIntervalId;
let score = 0;

// Getting high score from local storage
let hightScore = localStorage.getItem("high-score") || 0;
highScoreEle.innerHTML = `high-score: ${hightScore}`;

const changeFoodPosition = () => {
  // Random Position For Food
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};
// handle Game Over & Show popup
const handleGameOver = () => {
  clearInterval(setIntervalId);

  let divText = document.createTextNode(
    `Nice Try - Refresh to try again &  The Score Is : ${score}`
  );

  popup.appendChild(divText);

  layer.className = "layer done";
  popup.className = "popup done";
};

// Change Position Value Based on Key press
const changeDirection = (e) => {
  if (e.key === "ArrowUp" && positionY != 1) {
    positionX = 0;
    positionY = -1;
  } else if (e.key === "ArrowDown" && positionY != -1) {
    positionX = 0;
    positionY = 1;
  } else if (e.key === "ArrowRight" && positionX != -1) {
    positionX = 1;
    positionY = 0;
  } else if (e.key === "ArrowLeft" && positionX != 1) {
    positionX = -1;
    positionY = 0;
  }
};

controls.forEach((key) => {
  //  change direction by Key
  key.addEventListener("click", () =>
    changeDirection({ key: key.dataset.key })
  );
});

const initGame = () => {
  if (gameOver) return handleGameOver();
  let divMarkUp = `<div class="food" style="grid-area: ${foodY} / ${foodX}"> </div>`;
  // Check If The Snake Hit The Food
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]);
    // console.log(snakeBody); // Test
    // Increase The Score
    score++;
    hightScore = score >= hightScore ? score : hightScore;
    localStorage.setItem("high-score", hightScore);
    scoreEle.innerHTML = `Score: ${score}`;
    highScoreEle.innerHTML = `high-score: ${hightScore}`;
  }
  for (let i = snakeBody.length - 1; i > 0; i--) {
    // Shifting forward the values of The element In the snake body by one
    snakeBody[i] = snakeBody[i - 1];
  }
  // Setting The First element Of the Snake body to current the snake position
  snakeBody[0] = [snakeX, snakeY];
  // Updating The Snake's Head Position
  snakeX += positionX;
  snakeY += positionY;
  // Checking If the Snake's Head is out of the wall
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    divMarkUp += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"> </div>`;
    // Checking If the snake head hit the body
    if (
      i !== 0 &&
      snakeBody[0][0] === snakeBody[i][0] &&
      snakeBody[0][1] === snakeBody[i][1]
    ) {
      gameOver = true;
    }
  }
  gameBoard.innerHTML = divMarkUp;
};

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);
