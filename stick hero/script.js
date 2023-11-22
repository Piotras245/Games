Array.prototype.last = function () {
  return this[this.length - 1];
};

Math.sinus = function (degree) {
  return Math.sin((degree / 180) * Math.PI);
};

let phase = "waiting";
let lastTimestamp;
let heroX;
let heroY;
let sceneOffset;
let platforms = [];
let sticks = [];
let trees = [];
let score = 0;

let moveDirection = 1; // 1 for right, -1 for left
const moveSpeed = 2;

const canvasWidth = 375;
const canvasHeight = 375;
const platformHeight = 100;
const heroDistanceFromEdge = 10;
const paddingX = 100;
const perfectAreaSize = 10;

const backgroundSpeedMultiplier = 0.2;

const hill1BaseHeight = 100;
const hill1Amplitude = 10;
const hill1Stretch = 1;
const hill2BaseHeight = 70;
const hill2Amplitude = 20;
const hill2Stretch = 0.5;

const stretchingSpeed = 4;
const turningSpeed = 4;
const walkingSpeed = 4;
const transitioningSpeed = 2;
const fallingSpeed = 2;

const heroWidth = 17;
const heroHeight = 30;

const canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const introductionElement = document.getElementById("introduction");
const perfectElement = document.getElementById("perfect");
const restartButton = document.getElementById("restart");
const scoreElement = document.getElementById("score");

let lastSnowflakeTime = 0;
const snowflakeDelay = 100;

resetGame();

function resetGame() {
  phase = "waiting";
  lastTimestamp = undefined;
  sceneOffset = 0;
  score = 0;

  introductionElement.style.opacity = 1;
  perfectElement.style.opacity = 0;
  restartButton.style.display = "none";
  scoreElement.innerText = score;

  platforms = [{ x: 50, w: 50 }];
  generatePlatform();

  sticks = [{ x: platforms[0].x + platforms[0].w, length: 0, rotation: 0 }];

  trees = [];
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();
  generateTree();

  heroX = platforms[0].x + platforms[0].w - heroDistanceFromEdge;
  heroY = 0;
  draw();
}

function generateTree() {
  const minimumGap = 30;
  const maximumGap = 150;

  // X coordinate of the right edge of the furthest tree
  const lastTree = trees[trees.length - 1];
  let furthestX = lastTree ? lastTree.x : 0;

  const x =
    furthestX +
    minimumGap +
    Math.floor(Math.random() * (maximumGap - minimumGap));

  const treeColors = ["#6D8821", "#8FAC34", "#98B333"];
  const color = treeColors[Math.floor(Math.random() * 3)];

  trees.push({ x, color });
}

function generatePlatform() {
  const minimumGap = 40;
  const maximumGap = 200;
  const minimumWidth = 20;
  const maximumWidth = 100;

  // X coordinate of the right edge of the furthest platform
  const lastPlatform = platforms[platforms.length - 1];
  let furthestX = lastPlatform.x + lastPlatform.w;

  const x =
    furthestX +
    minimumGap +
    Math.floor(Math.random() * (maximumGap - minimumGap));
  const w =
    minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));

  platforms.push({ x, w });
}

resetGame();

// If space was pressed restart the game
window.addEventListener("keydown", function (event) {
  if (event.key == " ") {
    event.preventDefault();
    resetGame();
    return;
  }
});

window.addEventListener("mousedown", function (event) {
  if (phase == "waiting") {
    lastTimestamp = undefined;
    introductionElement.style.opacity = 0;
    phase = "stretching";
    window.requestAnimationFrame(animate);
  }
});

window.addEventListener("mouseup", function (event) {
  if (phase == "stretching") {
    phase = "turning";
  }
});

window.addEventListener("resize", function (event) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
});

window.requestAnimationFrame(animate);
function animate(timestamp) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
    window.requestAnimationFrame(animate);

    return;
  }

  switch (phase) {
    case "waiting":
      return;
    case "stretching": {
      sticks.last().length += (timestamp - lastTimestamp) / stretchingSpeed;
      break;
    }
    case "turning": {
      sticks.last().rotation += (timestamp - lastTimestamp) / turningSpeed;

      if (sticks.last().rotation > 90) {
        sticks.last().rotation = 90;

        const [nextPlatform, perfectHit] = thePlatformTheStickHits();
        if (nextPlatform) {
          // Increase score
          score += perfectHit ? 2 : 1;
          scoreElement.innerText = score;

          if (perfectHit) {
            perfectElement.style.opacity = 1;
            setTimeout(() => (perfectElement.style.opacity = 0), 1000);
          }

          generatePlatform();
          generateTree();
          generateTree();
        }

        phase = "walking";
      }
      break;
    }
    case "walking": {
      heroX += (timestamp - lastTimestamp) / walkingSpeed;

      const [nextPlatform] = thePlatformTheStickHits();
      if (nextPlatform) {
        const maxHeroX = nextPlatform.x + nextPlatform.w - heroDistanceFromEdge;
        if (heroX > maxHeroX) {
          heroX = maxHeroX;
          phase = "transitioning";
        }
      } else {
        const maxHeroX = sticks.last().x + sticks.last().length + heroWidth;
        if (heroX > maxHeroX) {
          heroX = maxHeroX;
          phase = "falling";
        }
      }
      break;
    }
    case "transitioning": {
      sceneOffset += (timestamp - lastTimestamp) / transitioningSpeed;

      const [nextPlatform] = thePlatformTheStickHits();
      if (sceneOffset > nextPlatform.x + nextPlatform.w - paddingX) {
        sticks.push({
          x: nextPlatform.x + nextPlatform.w,
          length: 0,
          rotation: 0,
        });
        phase = "waiting";
      }
      break;
    }
    case "falling": {
      if (sticks.last().rotation < 180)
        sticks.last().rotation += (timestamp - lastTimestamp) / turningSpeed;

      heroY += (timestamp - lastTimestamp) / fallingSpeed;
      const maxHeroY =
        platformHeight + 100 + (window.innerHeight - canvasHeight) / 2;
      if (heroY > maxHeroY) {
        restartButton.style.display = "block";
        return;
      }
      break;
    }
    default:
      throw Error("Wrong phase");
  }

  draw();
  window.requestAnimationFrame(animate);
  lastTimestamp = timestamp;
}

function thePlatformTheStickHits() {
  if (sticks.last().rotation != 90)
    throw Error(`Stick is ${sticks.last().rotation}°`);
  const stickFarX = sticks.last().x + sticks.last().length;

  const platformTheStickHits = platforms.find(
    (platform) => platform.x < stickFarX && stickFarX < platform.x + platform.w
  );

  if (
    platformTheStickHits &&
    platformTheStickHits.x + platformTheStickHits.w / 2 - perfectAreaSize / 2 <
      stickFarX &&
    stickFarX <
      platformTheStickHits.x + platformTheStickHits.w / 2 + perfectAreaSize / 2
  )
    return [platformTheStickHits, true];

  return [platformTheStickHits, false];
}

//function wchich draws background

function draw() {
  ctx.save();
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  drawBackground();

  // Center main canvas area to the middle of the screen
  ctx.translate(
    (window.innerWidth - canvasWidth) / 2 - sceneOffset,
    (window.innerHeight - canvasHeight) / 2
  );

  // Draw scene
  drawPlatforms();
  // drawHero();
  drawElf();
  drawSticks();
  drawSnowflakes();

  // Restore transformation
  ctx.restore();
}

restartButton.addEventListener("click", function (event) {
  event.preventDefault();
  resetGame();
  restartButton.style.display = "none";
});

//draws Platforms
function drawPlatforms() {
  platforms.forEach(({ x, w }) => {
    // Draw platform
    ctx.fillStyle = "black";
    ctx.fillRect(
      x,
      canvasHeight - platformHeight,
      w,
      platformHeight + (window.innerHeight - canvasHeight) / 2
    );

    // Draw perfect area
    if (sticks.last().x < x) {
      ctx.fillStyle = "red";
      ctx.fillRect(
        x + w / 2 - perfectAreaSize / 2,
        canvasHeight - platformHeight,
        perfectAreaSize,
        perfectAreaSize
      );
    }
  });
}

function drawHero() {
  ctx.save();
  ctx.fillStyle = "black";
  ctx.translate(
    heroX - heroWidth / 2,
    heroY + canvasHeight - platformHeight - heroHeight / 2
  );

  // Body
  drawRoundedRect(
    -heroWidth / 2,
    -heroHeight / 2,
    heroWidth,
    heroHeight - 4,
    5
  );

  // Legs
  const legDistance = 5;
  ctx.beginPath();
  ctx.arc(legDistance, 11.5, 3, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-legDistance, 11.5, 3, 0, Math.PI * 2, false);
  ctx.fill();

  // Eye
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(5, -7, 3, 0, Math.PI * 2, false);
  ctx.fill();

  // Band
  ctx.fillStyle = "red";
  ctx.fillRect(-heroWidth / 2 - 1, -12, heroWidth + 2, 4.5);
  ctx.beginPath();
  ctx.moveTo(-9, -14.5);
  ctx.lineTo(-17, -18.5);
  ctx.lineTo(-14, -8.5);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-10, -10.5);
  ctx.lineTo(-15, -3.5);
  ctx.lineTo(-5, -7);
  ctx.fill();

  ctx.restore();
}

function drawElf() {
  ctx.save();
  ctx.fillStyle = "#ffdbac";

  // Translate to the position of the elf
  ctx.translate(
    heroX - heroWidth / 2,
    heroY + canvasHeight - platformHeight - heroHeight / 2
  );

  // Head
  ctx.beginPath();
  ctx.arc(0, -heroHeight / 2 - 3 , 8, 0, Math.PI * 2, false);
  ctx.fill();

  // Eyes
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(-3, -heroHeight / 2 - 7, 1.5, 0, Math.PI * 2, false);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(3, -heroHeight / 2 - 7, 1.5, 0, Math.PI * 2, false);
  ctx.fill();

  // Mouth
  ctx.beginPath();
  ctx.arc(0, -heroHeight / 2 - 2, 2, 0, Math.PI, false);
  ctx.stroke();

  // Hat
  ctx.fillStyle = "#008000"; // Green color for the hat
  ctx.beginPath();
  ctx.moveTo(-7, -heroHeight / 2 - 11);
  ctx.lineTo(7, -heroHeight / 2 - 11);
  ctx.lineTo(0, -heroHeight / 2 - 28);
  ctx.fill();

  // Red line on the hat
  ctx.strokeStyle = "#FF0000"; // Red color for the line
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-7, -heroHeight / 2 - 11);
  ctx.lineTo(7, -heroHeight / 2 - 11);
  ctx.stroke();

  // Pom-pom on the hat
  ctx.beginPath();
  ctx.fillStyle = "#ffffff"; // White color for the pom-pom
  ctx.arc(0, -heroHeight / 2 - 30, 4, 0, Math.PI * 2, false);
  ctx.fill();

  // Hands
  ctx.fillStyle = "#ffdbac"; // Elf skin color for the hands
  const handWidth = 4;
  const handHeight = 10;
  const spaceBetweenBodyAndHands = 3;

  // Left hand
  ctx.save();
  ctx.rotate(Math.PI); // Rotate by 180 degrees
  ctx.fillRect(
    -heroWidth / 2 + 1,
    -heroHeight / 2 + 10 + spaceBetweenBodyAndHands,
    handWidth,
    handHeight
  );
  ctx.restore();

  // Right hand
  ctx.save();
  ctx.rotate(Math.PI); // Rotate by 180 degrees
  ctx.fillRect(
    heroWidth / 2 - handWidth - 1,
    -heroHeight / 2 + 10 + spaceBetweenBodyAndHands,
    handWidth,
    handHeight
  );
  ctx.restore();

  // Body
  ctx.fillStyle = "#AAFF00";
  ctx.fillRect(-5, -heroHeight / 2 + 5, 10, 15);

  // Legs
  ctx.beginPath();
  ctx.moveTo(-5, -heroHeight / 2 + 20);
  ctx.lineTo(-5, -heroHeight / 2 + 28);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(5, -heroHeight / 2 + 20);
  ctx.lineTo(5, -heroHeight / 2 + 28);
  ctx.stroke();

  ctx.restore();
}

function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.fill();
}

function drawSticks() {
  sticks.forEach((stick) => {
    ctx.save();

    // Move the anchor point to the start of the stick and rotate
    ctx.translate(stick.x, canvasHeight - platformHeight);
    ctx.rotate((Math.PI / 180) * stick.rotation);

    // Draw stick
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -stick.length);
    ctx.stroke();

    // Restore transformations
    ctx.restore();
  });
}

function drawBackground() {
  // Draw sky
  var gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
  gradient.addColorStop(0, "#0E86D4");
  gradient.addColorStop(1, "#68BBE3");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  // Draw hills
  drawHill(hill1BaseHeight, hill1Amplitude, hill1Stretch, "#95C629");
  drawHill(hill2BaseHeight, hill2Amplitude, hill2Stretch, "#659F1C");

  // Draw trees
  trees.forEach((tree) => drawTree(tree.x, tree.color));
}

function drawHill(baseHeight, amplitude, stretch, color) {
  ctx.beginPath();
  ctx.moveTo(0, window.innerHeight);
  ctx.lineTo(0, getHillY(0, baseHeight, amplitude, stretch));
  for (let i = 0; i < window.innerWidth; i++) {
    ctx.lineTo(i, getHillY(i, baseHeight, amplitude, stretch));
  }
  ctx.lineTo(window.innerWidth, window.innerHeight);
  ctx.fillStyle = "#ffff";
  ctx.fill();
}

function drawTree(x) {
  ctx.save();
  ctx.translate(
    (-sceneOffset * backgroundSpeedMultiplier + x) * hill1Stretch,
    getTreeY(x, hill1BaseHeight, hill1Amplitude)
  );

  const treeTrunkHeight = 5;
  const treeTrunkWidth = 2;
  const treeCrownHeight = 25;
  const treeCrownWidth = 10;

  // Draw trunk
  ctx.fillStyle = "#7D833C";
  ctx.fillRect(
    -treeTrunkWidth / 2,
    -treeTrunkHeight,
    treeTrunkWidth,
    treeTrunkHeight
  );

  // Draw crown
  ctx.beginPath();
  ctx.moveTo(-treeCrownWidth / 2, -treeTrunkHeight);
  ctx.lineTo(0, -(treeTrunkHeight + treeCrownHeight));
  ctx.lineTo(treeCrownWidth / 2, -treeTrunkHeight);
  ctx.fillStyle = "#D3D3D3";
  ctx.fill();

  ctx.restore();
}
function drawSnowflakes() {
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, 2, 2);
  }
}

function getHillY(windowX, baseHeight, amplitude, stretch) {
  const sineBaseY = window.innerHeight - baseHeight;
  return (
    Math.sinus((sceneOffset * backgroundSpeedMultiplier + windowX) * stretch) *
      amplitude +
    sineBaseY
  );
}

function getTreeY(x, baseHeight, amplitude) {
  const sineBaseY = window.innerHeight - baseHeight;
  return Math.sinus(x) * amplitude + sineBaseY;
}

// Use this function to draw a circle
function drawCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fill();
}
