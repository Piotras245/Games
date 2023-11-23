function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

document.addEventListener("DOMContentLoaded", () => {
  const bird = document.querySelector(".bird");
  const gameDisplay = document.querySelector(".game-container");
  const ground = document.querySelector(".ground-moving");
  const scoreDisplay = document.querySelector(".score");

  let birdLeft = 220;
  let birdBottom = 100;
  let gravity = 2;
  let isGameOver = false;
  let gap = 430;
  let score = 0;

  function startGame() {
    birdBottom -= gravity;
    bird.style.bottom = birdBottom + "px";
    bird.style.left = birdLeft + "px";
    updateScore();
  }
  let gameTimerId = setInterval(startGame, 20);

  document.addEventListener("mouseup", jump);
  document.addEventListener("keyup", control);

  function control(e) {
    if (e.keyCode === 32) {
      jump();
    }
  }

  function jump() {
    if (!isGameOver && birdBottom < 500) {
      birdBottom += 50;
      bird.style.bottom = birdBottom + "px";
      bird.style.transition = "transform 0.3s";
      bird.style.transform = "rotate(-20deg)"; // Rotate the bird during jump

      // Reset the rotation after the jump animation completes
      setTimeout(() => {
        bird.style.transform = "rotate(10deg)";
      }, 300);
    }
  }

  function generateObstacle() {
    let obstacleLeft = 500;
    let randomHeight = Math.random() * 60;
    let obstacleBottom = randomHeight;
    const obstacle = document.createElement("div");
    const topObstacle = document.createElement("div");
    if (!isGameOver) {
      obstacle.classList.add("obstacle");
      topObstacle.classList.add("topObstacle");
    }
    gameDisplay.appendChild(obstacle);
    gameDisplay.appendChild(topObstacle);
    obstacle.style.left = obstacleLeft + "px";
    topObstacle.style.left = obstacleLeft + "px";
    obstacle.style.bottom = obstacleBottom + "px";
    topObstacle.style.bottom = obstacleBottom + gap + "px";

    function moveObstacle() {
      obstacleLeft -= 2;
      obstacle.style.left = obstacleLeft + "px";
      topObstacle.style.left = obstacleLeft + "px";
      if (obstacleLeft === -60) {
        clearInterval(timerId);
        gameDisplay.removeChild(obstacle);
        gameDisplay.removeChild(topObstacle);
      }
      if (
        (obstacleLeft > 200 &&
          obstacleLeft < 280 &&
          birdLeft === 220 &&
          (birdBottom < obstacleBottom + 153 ||
            birdBottom > obstacleBottom + gap - 200)) ||
        birdBottom === 0
      ) {
        gameOver();
        clearInterval(timerId);
      }
      if (obstacleLeft === 220) {
        score++;
        updateScore();
      }
    }
    let timerId = setInterval(moveObstacle, 20);
    if (!isGameOver) {
      setTimeout(generateObstacle, 3000);
    }
  }

  function updateScore() {
    scoreDisplay.textContent = "Score: " + score;
  }

  async function gameOver() {
    clearInterval(gameTimerId);
    console.log("game over");
    isGameOver = true;
    document.removeEventListener("keyup", control);
    document.removeEventListener("mouseup", jump);
    ground.classList.add("ground");
    ground.classList.remove("ground-moving");
    console.log(birdBottom);
    const restartGameDiv = document.querySelector(".restartGame");
    restartGameDiv.style.display = "flex";
    restartGameDiv.addEventListener("click", restartGame);

    for (let i = 0; i < 200; i++) {
      birdBottom -= 5;
      bird.style.bottom = birdBottom + "px";
      await sleep(25);
      if (birdBottom <= 0) break;
    }
  }

  function restartGame() {
    window.location.reload();
  }

  generateObstacle();
});
