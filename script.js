const board = document.getElementById("boardgame");
const instructions = document.getElementById("instructions");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScore = document.getElementById("highScore");
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = foodPosition();
let gameStarted = false;
let direction = "right";
let gameInterval;
let gameDelay = 200;
let high_score = 0;

function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

function drawSnake() {
    if(gameStarted){
        snake.forEach((segment) => {
            const SnakeElement = createGameElement("div", "snake");
            setPosition(SnakeElement, segment);
            board.appendChild(SnakeElement);
          });
    }
  
}

function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}
// draw();

function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

function foodPosition() {
  let x = Math.floor(Math.random() * gridSize) + 1;
  let y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

function move() {
  let head = { ...snake[0] };
  switch (direction) {
    case "left":
      head.x--;
      break;

    case "right":
      head.x++;
      break;
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    food = foodPosition();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      collision();
      draw();
    }, gameDelay);
  } else {
    snake.pop();
  }
}

function StartGame() {
  gameStarted = true;
  instructions.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    collision();
    draw();
  }, gameDelay);
}

function HandleKey(event) {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
    StartGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;

      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowRight":
        direction = "right";
        break;

      case "ArrowLeft":
        direction = "left";
        break;
    }
  }
}

document.addEventListener("keydown", HandleKey);

function increaseSpeed() {
  if (gameDelay > 150) {
    gameDelay -= 5;
  } else if (gameDelay > 100) {
    gameDelay -= 3;
  } else if (gameDelay > 50) {
    gameDelay -= 2;
  } else if (gameDelay > 20) {
    gameDelay -= 1;
  }
}

function collision() {
  const head = snake[0];
  if (head.x < 1 || head.y < 1 || head.x > gridSize || head.y > gridSize) {
    resetGame();
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = foodPosition();
  direction = "right";
  gameDelay = 200;
  updateScore();
}

function updateScore() {
  const current = snake.length - 1;
  score.textContent = current.toString().padStart(3, "0");
}

function updateHighScore() {
  const current = snake.length - 1;
  if (current > high_score) {
    high_score = current;
    highScore.textContent = high_score.toString().padStart(3, "0");
  }
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructions.style.display = "block";
  logo.style.display = "block";
}
