const canvas = document.getElementById('mist');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = 300;
}
resize();
window.addEventListener('resize', resize);

const particles = [];

for (let i = 0; i < 200; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: 280 + Math.random() * 20,
    r: 80 + Math.random() * 140,
    alpha: 0.015 + Math.random() * 0.04,
    speed: 0.08 + Math.random() * 0.2,
    drift: (Math.random() - 0.5) * 0.15
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    grad.addColorStop(0, `rgba(210,200,180,${p.alpha})`);
    grad.addColorStop(0.5, `rgba(180,170,150,${p.alpha * 0.4})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    p.x += p.speed + p.drift;

    if (p.x - p.r > canvas.width) {
      p.x = -p.r;
      p.y = 280 + Math.random() * 20;
    }
  }

  requestAnimationFrame(draw);
}

draw();
