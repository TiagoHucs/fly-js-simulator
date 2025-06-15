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

function drawShadow() {
  const a = airplane.altitute;
  ctx.save();
  ctx.translate((canvas.width/2) + a, (canvas.height/2) + a);
  ctx.rotate(airplane.angle);

  ctx.fillStyle = "gray";
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
  const friction = airplane.friction;
  const angleDeg = (airplane.angle * 180 / Math.PI) % 360;
  
  const normalizedAngle = angleDeg < 0 ? angleDeg + 360 : angleDeg;
  
  let data = [];
  data.push({desc: 'Speed: ',value: speed});
  data.push({desc: 'Altitude',value: altitute});
  data.push({desc: 'Friction',value: friction});
  data.push({desc: 'Ângulo',value: `${normalizedAngle.toFixed(0)}°`});
  data.push({desc: 'Coordenates', value: `${Math.trunc(airplane.x)} : ${Math.trunc(airplane.y)}`})

  for(let i = 0 ; i < data.length ; i ++ ){
    ctx.fillText(`${data[i].desc}: ${data[i].value}`, 10, 10 + (i*20));
  }
  
  ctx.restore();
}

function drawRunway(camX, camY) {
  ctx.save();
  ctx.translate(-camX + canvas.width / 2, -camY + canvas.height / 2);

  const x = runway.x - runway.width / 2;
  const y = runway.y - runway.height / 2;
  const w = runway.width;
  const h = runway.height;

  // Corpo da pista
  ctx.fillStyle = "#333";
  ctx.fillRect(x, y, w, h);

  // Linha tracejada horizontal no centro da pista
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.setLineDash([15, 10]); // 15px traço, 10px espaço
  ctx.beginPath();
  ctx.moveTo(x + 10, y + h / 2);
  ctx.lineTo(x + w - 10, y + h / 2);
  ctx.stroke();
  ctx.setLineDash([]); // resetar o padrão

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

  //trecho com simulacao improvisada
  if(keys['a'] && airplane.altitute < 10){
    airplane.altitute += 0.1;
  } else if (keys['z'] && airplane.altitute > 0){
    airplane.altitute -= 0.1;
  } else if (airplane.altitute < 0){
    airplane.altitute = 0;
  }

  if(airplane.altitute <= 0){
    airplane.friction = 0.02;
  } else {
    airplane.friction = 0.01;
  }
  //fim trecho com simulacao improvisada

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
  drawShadow();
  drawAirplane();
  drawHud();
  drawDirectionIndicator(camX, camY);

  requestAnimationFrame(loop);
}

loop();