const SUPABASE_URL = 'https://fjuvaaknonveyjcdmgfu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqdXZhYWtub252ZXlqY2RtZ2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5Mzc3ODIsImV4cCI6MjA4OTUxMzc4Mn0.2Ed8FvYhe8tVJzeOq9u0GGBOIpj53Wn01WQmtzLzisw';

// Mist setup
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
    alpha: 0.03 + Math.random() * 0.08,
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

// Key validation
async function validateKey(inputKey) {
  const bytes = new TextEncoder().encode(inputKey);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  const keyHash = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const response = await fetch(
    'https://fjuvaaknonveyjcdmgfu.supabase.co/functions/v1/clever-api',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ key: keyHash })
    }
  );

  const data = await response.json();
  return data.ok === true;
}

document.querySelector('.enter-btn').addEventListener('click', async () => {
  const input = document.querySelector('.key-input').value.trim();
  if (!input) return;

  const btn = document.querySelector('.enter-btn');
  btn.textContent = 'Checking...';
  btn.style.pointerEvents = 'none';

  const valid = await validateKey(input);

  if (valid) {
    btn.textContent = 'Access granted';
    btn.style.color = '#6b5a3e';
    btn.style.borderColor = '#6b5a3e';
    // Redirect to your dashboard after a short delay
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  } else {
    btn.textContent = 'Invalid key';
    btn.style.color = '#5a2a2a';
    btn.style.borderColor = '#5a2a2a';
    setTimeout(() => {
      btn.textContent = 'Present thy key';
      btn.style.color = '';
      btn.style.borderColor = '';
      btn.style.pointerEvents = '';
    }, 2000);
  }
});
