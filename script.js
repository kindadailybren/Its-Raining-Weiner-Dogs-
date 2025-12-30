const canvas = document.getElementById('drawingBoard');
const ctx = canvas.getContext('2d');
const image = document.getElementById('sourceImage');

const spawnRate = 7;

const fallSpeed = 0.5;

let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let cursorDog = { x: 0, y: 0, visible: true };
let drops = [];

let lastSpawnTime = 0;

image.onload = function () {
  cursorDog.x = (canvas.width / 2) - (190 / 2);
  cursorDog.y = (canvas.height / 2) - (130 / 2);

  requestAnimationFrame(animate);
};

if (image.complete) image.onload();


canvas.addEventListener('mousedown', (e) => {
  const mousePos = getMousePosition(canvas, e);

  // Check if clicking inside the main dog
  if (mousePos.x >= cursorDog.x && mousePos.x <= cursorDog.x + 190 &&
    mousePos.y >= cursorDog.y && mousePos.y <= cursorDog.y + 130) {

    isDragging = true;
    dragOffset.x = mousePos.x - cursorDog.x;
    dragOffset.y = mousePos.y - cursorDog.y;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const mousePos = getMousePosition(canvas, e);
  const currentTime = Date.now()

  cursorDog.x = mousePos.x - dragOffset.x;
  cursorDog.y = mousePos.y - dragOffset.y;

  if (currentTime - lastSpawnTime > spawnRate)
    drops.push({
      x: cursorDog.x,
      y: cursorDog.y,
      spawnTime: currentTime // Record when this specific drop was born
    });
  lastSpawnTime = currentTime
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});


function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const currentTime = Date.now();

  for (let i = drops.length - 1; i >= 0; i--) {
    let drop = drops[i];

    let elapsed = currentTime - drop.spawnTime;

    let shift = fallSpeed * elapsed;

    ctx.drawImage(image, drop.x, drop.y + shift, 160, 110);

    if (drop.y + shift > canvas.height) {
      drops.splice(i, 1);
    }
  }

  if (image.complete) {
    ctx.drawImage(image, cursorDog.x, cursorDog.y, 220, 170);
  }

  requestAnimationFrame(animate);
}

function getMousePosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}
