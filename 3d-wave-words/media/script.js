const container = document.querySelector(".container");

const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const gridSize = 40;
const words = [];


function randomChar() {
  return chars[Math.floor(Math.random() * chars.length)];
}


for (let y = 0; y < gridSize; y++) {
  for (let x = 0; x < gridSize; x++) {
    const word = document.createElement("div");
    word.className = "word";
    word.textContent = randomChar();

    container.appendChild(word);

    words.push({
      el: word,
      x,
      y,
    });
  }
}


function animate(time) {
  time *= 0.002;

  words.forEach((word) => {

    const wave =
      Math.sin(word.x * 0.4 + time) * 20 +
      Math.cos(word.y * 0.4 + time) * 20;

    
    word.el.style.transform = `translateZ(${wave}px)`;
  });

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);