const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

const airplane = {
  x: 0,
  y: 0,
  angle: 0, // em radianos
  speed: 0,
  altitute: 0,
  maxSpeed: 4,
  acceleration: 0.05,
  friction: 0.02
};

const runway = {
  x: 500,
  y: 500,
  width: 400,
  height: 40
};

function drawAirplane() {
  ctx.save();
  ctx.translate(canvas.width/2, canvas.height/2);
  ctx.rotate(airplane.angle);

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(15, 0);
  ctx.lineTo(-10, -7);
  ctx.lineTo(-5, 0);
  ctx.lineTo(-10, 7);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawHud() {
  ctx.save();
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const speed = airplane.speed.toFixed(2);
  const altitute = airplane.altitute;
  const angleDeg = (airplane.angle * 180 / Math.PI) % 360;
  const normalizedAngle = angleDeg < 0 ? angleDeg + 360 : angleDeg;

  ctx.fillText(`Velocidade: ${speed}`, 10, 10);
  ctx.fillText(`Altitude: ${altitute}`, 10, 30);
  ctx.fillText(`Ângulo: ${normalizedAngle.toFixed(0)}°`, 10, 50);
  
  ctx.restore();
}

function drawRunway(camX, camY) {
  ctx.save();
  ctx.translate(-camX + canvas.width/2, -camY + canvas.height/2);
  ctx.fillStyle = "#333";
  ctx.fillRect(runway.x - runway.width/2, runway.y - runway.height/2, runway.width, runway.height);
  ctx.restore();
}

function drawDirectionIndicator(camX, camY) {
  const dx = runway.x - airplane.x;
  const dy = runway.y - airplane.y;
  const distance = Math.hypot(dx, dy);

  const screenX = dx + canvas.width/2;
  const screenY = dy + canvas.height/2;

  if (screenX < 0 || screenX > canvas.width || screenY < 0 || screenY > canvas.height) {
    const angle = Math.atan2(dy, dx);

    const radius = Math.min(canvas.width, canvas.height) / 2 - 30;
    const indicatorX = canvas.width / 2 + Math.cos(angle) * radius;
    const indicatorY = canvas.height / 2 + Math.sin(angle) * radius;

    ctx.save();
    ctx.translate(indicatorX, indicatorY);
    ctx.rotate(angle);
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-10, -5);
    ctx.lineTo(-10, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function update() {
  if (keys["ArrowUp"]) {
    airplane.speed += airplane.acceleration;
  } else {
    airplane.speed -= airplane.friction;
  }
  airplane.speed = Math.max(0, Math.min(airplane.maxSpeed, airplane.speed));

  if (keys["ArrowLeft"]) airplane.angle -= 0.03;
  if (keys["ArrowRight"]) airplane.angle += 0.03;

  airplane.x += Math.cos(airplane.angle) * airplane.speed;
  airplane.y += Math.sin(airplane.angle) * airplane.speed;
}

function loop() {
  update();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const camX = airplane.x;
  const camY = airplane.y;

  drawRunway(camX, camY);
  drawAirplane();
  drawHud();
  drawDirectionIndicator(camX, camY);

  requestAnimationFrame(loop);
}

loop();