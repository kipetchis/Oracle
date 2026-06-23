// ── SPACE GAME ENGINE ──────────────────────────────────────────────────────
// Depends on globals: state, lang, haptic(), saveState(), checkAchievements()
let _game = null;

function startSpaceGame() {
  const overlay = document.getElementById('gameOverlay');
  const canvas = document.getElementById('gameCanvas');
  overlay.classList.add('active');

  const W = Math.min(window.innerWidth, 420);
  const H = Math.min(window.innerHeight - 60, 700);
  canvas.width = W; canvas.height = H;
  canvas.style.width = W+'px'; canvas.style.height = H+'px';

  const ctx = canvas.getContext('2d');

  _game = {
    ctx, W, H, canvas,
    ship: { x: W/2, y: H - 80, w: 36, h: 28, speed: 0 },
    stars: [],
    asteroids: [],
    particles: [],
    bonuses: [],
    score: 0,
    time: 45,
    lastTick: performance.now(),
    timerInterval: null,
    animFrame: null,
    alive: true,
    touchX: null,
    spawnTimer: 0,
    bonusTimer: 0,
    difficulty: 1
  };

  // Generate starfield
  for (let i = 0; i < 80; i++) {
    _game.stars.push({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.5+0.3, speed: Math.random()*40+15,
      a: Math.random()*0.5+0.2
    });
  }

  // Touch controls
  canvas.addEventListener('touchstart', _gameTouch, {passive:false});
  canvas.addEventListener('touchmove', _gameTouch, {passive:false});
  canvas.addEventListener('touchend', _gameTouchEnd, {passive:false});
  canvas.addEventListener('mousedown', _gameMouse);
  canvas.addEventListener('mousemove', _gameMouse);

  // Timer countdown
  document.getElementById('gameScore').textContent = '⭐ 0';
  document.getElementById('gameTimer').textContent = '45s';
  _game.timerInterval = setInterval(() => {
    if (!_game || !_game.alive) return;
    _game.time--;
    document.getElementById('gameTimer').textContent = _game.time + 's';
    if (_game.time <= 0) endSpaceGame(true);
  }, 1000);

  // Difficulty ramp
  setTimeout(() => { if (_game) _game.difficulty = 1.3; }, 10000);
  setTimeout(() => { if (_game) _game.difficulty = 1.7; }, 20000);
  setTimeout(() => { if (_game) _game.difficulty = 1.9; }, 35000); // ↓ de 2.2 → fin de partie moins brutale

  // Start loop
  _game.animFrame = requestAnimationFrame(gameLoop);
}

function _gameTouch(e) {
  e.preventDefault();
  if (!_game) return;
  const r = _game.canvas.getBoundingClientRect();
  _game.touchX = e.touches[0].clientX - r.left;
}
function _gameTouchEnd(e) { e.preventDefault(); if (_game) _game.touchX = null; }
function _gameMouse(e) {
  if (!_game) return;
  const r = _game.canvas.getBoundingClientRect();
  _game.touchX = e.clientX - r.left;
}

function gameLoop(ts) {
  if (!_game || !_game.alive) return;
  const dt = Math.min((ts - _game.lastTick)/1000, 0.05);
  _game.lastTick = ts;

  const { ctx, W, H, ship } = _game;

  // Move ship toward touch
  if (_game.touchX !== null) {
    const dx = _game.touchX - ship.x;
    ship.x += dx * 8 * dt;
  }
  ship.x = Math.max(ship.w/2, Math.min(W - ship.w/2, ship.x));

  // Spawn asteroids
  _game.spawnTimer += dt;
  const spawnRate = 0.55 / _game.difficulty; // ↑ de 0.45 → moins d'astéroïdes
  while (_game.spawnTimer >= spawnRate) {
    _game.spawnTimer -= spawnRate;
    const size = 14 + Math.random()*20;
    _game.asteroids.push({
      x: Math.random()*(W-40)+20,
      y: -size,
      r: size/2,
      speed: 80 + Math.random()*80 * _game.difficulty,
      rot: Math.random()*Math.PI*2,
      rotSpeed: (Math.random()-0.5)*3
    });
  }

  // Spawn bonus stars
  _game.bonusTimer += dt;
  if (_game.bonusTimer >= 1.8) {
    _game.bonusTimer -= 1.8;
    _game.bonuses.push({
      x: Math.random()*(W-40)+20,
      y: -12,
      speed: 55 + Math.random()*30,
      pulse: 0
    });
  }

  // Update asteroids
  _game.asteroids.forEach(a => {
    a.y += a.speed * dt;
    a.rot += a.rotSpeed * dt;
  });
  _game.asteroids = _game.asteroids.filter(a => a.y < H + 40);

  // Update bonuses
  _game.bonuses.forEach(b => {
    b.y += b.speed * dt;
    b.pulse += dt * 4;
  });
  _game.bonuses = _game.bonuses.filter(b => b.y < H + 20);

  // Update particles
  _game.particles.forEach(p => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    p.a = Math.max(0, p.life / p.maxLife);
  });
  _game.particles = _game.particles.filter(p => p.life > 0);

  // Update stars
  _game.stars.forEach(s => {
    s.y += s.speed * dt;
    if (s.y > H) { s.y = -2; s.x = Math.random()*W; }
  });

  // Collision: ship vs asteroids
  for (const a of _game.asteroids) {
    const dx = ship.x - a.x, dy = ship.y - a.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < a.r + ship.w*0.35) {
      endSpaceGame(false);
      return;
    }
  }

  // Collision: ship vs bonuses
  for (let i = _game.bonuses.length - 1; i >= 0; i--) {
    const b = _game.bonuses[i];
    const dx = ship.x - b.x, dy = ship.y - b.y;
    if (Math.sqrt(dx*dx+dy*dy) < 22) {
      _game.score += 10;
      document.getElementById('gameScore').textContent = '⭐ ' + _game.score;
      // Sparkle particles
      for (let j = 0; j < 8; j++) {
        const angle = (Math.PI*2/8)*j;
        _game.particles.push({
          x: b.x, y: b.y,
          vx: Math.cos(angle)*60+Math.random()*20,
          vy: Math.sin(angle)*60+Math.random()*20,
          life: 0.5, maxLife: 0.5,
          a: 1, color: '#ffd700', r: 2.5
        });
      }
      _game.bonuses.splice(i, 1);
      if (!state.mutedSfx) _playCollectSound();
    }
  }

  // ── DRAW ──
  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#030610';
  ctx.fillRect(0, 0, W, H);

  // Stars
  _game.stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,'+s.a+')';
    ctx.fill();
  });

  // Bonuses (golden stars)
  _game.bonuses.forEach(b => {
    const sz = 10 + Math.sin(b.pulse)*2;
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 10;
    _drawStar(ctx, 0, 0, 5, sz, sz*0.45);
    ctx.restore();
  });

  // Asteroids
  _game.asteroids.forEach(a => {
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.rotate(a.rot);
    ctx.fillStyle = '#5a5a6e';
    ctx.strokeStyle = '#3a3a4a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const pts = 7;
    for (let i = 0; i < pts; i++) {
      const ang = (Math.PI*2/pts)*i - Math.PI/2;
      const rr = a.r * (0.75 + Math.sin(i*2.7)*0.25);
      const px = Math.cos(ang)*rr, py = Math.sin(ang)*rr;
      i===0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // Crater
    ctx.fillStyle = '#4a4a5e';
    ctx.beginPath();
    ctx.arc(a.r*0.2, -a.r*0.15, a.r*0.22, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  });

  // Particles
  _game.particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = (p.color||'#fff') + (p.a < 1 ? Math.round(p.a*255).toString(16).padStart(2,'0') : '');
    ctx.fill();
  });

  // Ship — detailed spaceship
  ctx.save();
  ctx.translate(ship.x, ship.y);

  // Engine flames (animated)
  const flTime = ts * 0.01;
  const fl1 = 12 + Math.sin(flTime * 2.1) * 5;
  const fl2 = 8 + Math.sin(flTime * 3.3 + 1) * 4;

  // Left thruster flame
  const lgL = ctx.createLinearGradient(0, 10, 0, 10 + fl1);
  lgL.addColorStop(0, 'rgba(255,200,50,.9)');
  lgL.addColorStop(0.4, 'rgba(255,100,20,.7)');
  lgL.addColorStop(1, 'rgba(255,60,0,0)');
  ctx.fillStyle = lgL;
  ctx.beginPath();
  ctx.ellipse(-8, 13 + fl1*0.5, 4 + Math.sin(flTime*4)*1, fl1*0.6, 0, 0, Math.PI*2);
  ctx.fill();

  // Right thruster flame
  const lgR = ctx.createLinearGradient(0, 10, 0, 10 + fl2);
  lgR.addColorStop(0, 'rgba(255,200,50,.9)');
  lgR.addColorStop(0.4, 'rgba(255,100,20,.7)');
  lgR.addColorStop(1, 'rgba(255,60,0,0)');
  ctx.fillStyle = lgR;
  ctx.beginPath();
  ctx.ellipse(8, 13 + fl2*0.5, 4 + Math.sin(flTime*5)*1, fl2*0.6, 0, 0, Math.PI*2);
  ctx.fill();

  // Main engine glow
  const glw = ctx.createRadialGradient(0, 14, 0, 0, 14, 14);
  glw.addColorStop(0, 'rgba(255,180,50,.35)');
  glw.addColorStop(1, 'transparent');
  ctx.fillStyle = glw;
  ctx.fillRect(-14, 6, 28, 20);

  // Left wing
  ctx.fillStyle = '#3a5a8a';
  ctx.strokeStyle = '#6090c0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-6, 4);
  ctx.lineTo(-ship.w/2 + 2, 14);
  ctx.lineTo(-ship.w/2 + 4, 6);
  ctx.lineTo(-10, -2);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Right wing
  ctx.beginPath();
  ctx.moveTo(6, 4);
  ctx.lineTo(ship.w/2 - 2, 14);
  ctx.lineTo(ship.w/2 - 4, 6);
  ctx.lineTo(10, -2);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Wing accent lines
  ctx.strokeStyle = '#80b0e0';
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(-8, 5); ctx.lineTo(-14, 12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(8, 5); ctx.lineTo(14, 12); ctx.stroke();

  // Hull body
  const hullGrad = ctx.createLinearGradient(-8, -ship.h/2, 8, ship.h/2);
  hullGrad.addColorStop(0, '#c8d8f0');
  hullGrad.addColorStop(0.3, '#8090b8');
  hullGrad.addColorStop(0.7, '#5060a0');
  hullGrad.addColorStop(1, '#303870');
  ctx.fillStyle = hullGrad;
  ctx.strokeStyle = '#6070a8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -ship.h/2);
  ctx.bezierCurveTo(8, -ship.h/2 + 6, 8, 0, 6, 10);
  ctx.lineTo(-6, 10);
  ctx.bezierCurveTo(-8, 0, -8, -ship.h/2 + 6, 0, -ship.h/2);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Cockpit dome
  const cockGrad = ctx.createRadialGradient(-2, -8, 1, 0, -4, 9);
  cockGrad.addColorStop(0, 'rgba(180,240,255,.95)');
  cockGrad.addColorStop(0.5, 'rgba(80,160,220,.7)');
  cockGrad.addColorStop(1, 'rgba(20,60,140,.5)');
  ctx.fillStyle = cockGrad;
  ctx.strokeStyle = 'rgba(160,220,255,.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, -4, 7, 9, 0, 0, Math.PI*2);
  ctx.fill(); ctx.stroke();

  // Cockpit glint
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  ctx.beginPath();
  ctx.ellipse(-2, -8, 2.5, 3.5, -0.4, 0, Math.PI*2);
  ctx.fill();

  // Hull side stripe
  ctx.strokeStyle = 'rgba(100,200,255,.4)';
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(-4, 2); ctx.lineTo(-5, 9); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(4, 2); ctx.lineTo(5, 9); ctx.stroke();

  // Nose tip glow
  const tipGlow = ctx.createRadialGradient(0, -ship.h/2, 0, 0, -ship.h/2, 6);
  tipGlow.addColorStop(0, 'rgba(180,220,255,.5)');
  tipGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = tipGlow;
  ctx.beginPath(); ctx.arc(0, -ship.h/2, 6, 0, Math.PI*2); ctx.fill();

  ctx.restore();

  _game.animFrame = requestAnimationFrame(gameLoop);
}

function _drawStar(ctx, cx, cy, spikes, outerR, innerR) {
  let rot = Math.PI/2*3, step = Math.PI/spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot)*outerR, cy + Math.sin(rot)*outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot)*innerR, cy + Math.sin(rot)*innerR);
    rot += step;
  }
  ctx.closePath();
  ctx.fill();
}

function _playCollectSound() {
  try {
    const c = new (window.AudioContext||window.webkitAudioContext)();
    const now = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.connect(g); g.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.linearRampToValueAtTime(1320, now+0.08);
    g.gain.setValueAtTime(0.1, now);
    g.gain.linearRampToValueAtTime(0, now+0.15);
    osc.start(now); osc.stop(now+0.15);
  } catch(e){}
}

function endSpaceGame(survived) {
  if (!_game) return;
  _game.alive = false;
  if (_game.timerInterval) clearInterval(_game.timerInterval);
  if (_game.animFrame) cancelAnimationFrame(_game.animFrame);

  const { ctx, W, H, score, canvas } = _game;

  // Remove listeners
  canvas.removeEventListener('touchstart', _gameTouch);
  canvas.removeEventListener('touchmove', _gameTouch);
  canvas.removeEventListener('touchend', _gameTouchEnd);
  canvas.removeEventListener('mousedown', _gameMouse);
  canvas.removeEventListener('mousemove', _gameMouse);

  // Fragment logic: 50+ stars = 1 fragment (max 5)
  const earnedFragment = score >= 100 && (state.planetFragments || 0) < 8;
  if (earnedFragment) {
    state.planetFragments = (state.planetFragments || 0) + 1;
    haptic('celebration');
  }

  // Draw game over screen
  ctx.fillStyle = 'rgba(3,6,16,.85)';
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = 'center';
  ctx.fillStyle = survived ? '#6bff6b' : '#ff6b6b';
  ctx.font = 'bold 32px Montserrat, sans-serif';
  const title = survived
    ? (lang==='fr' ? '🛸 Mission accomplie !' : lang==='es' ? '🛸 ¡Misión cumplida!' : '🛸 Mission complete!')
    : (lang==='fr' ? '💥 Collision !' : lang==='es' ? '💥 ¡Colisión!' : '💥 Collision!');
  ctx.fillText(title, W/2, H*0.28);

  ctx.fillStyle = '#ffd700';
  ctx.font = '600 48px Montserrat, sans-serif';
  ctx.fillText('⭐ ' + score, W/2, H*0.40);

  // Fragment feedback
  const frags = state.planetFragments || 0;
  if (earnedFragment) {
    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 22px Montserrat, sans-serif';
    ctx.fillText(lang==='fr' ? '🧩 +1 Fragment de planète !' : lang==='es' ? '🧩 +1 ¡Fragmento de planeta!' : '🧩 +1 Planet fragment!', W/2, H*0.50);
    ctx.fillStyle = 'rgba(192,132,252,.7)';
    ctx.font = '400 16px Montserrat, sans-serif';
    ctx.fillText(frags + ' / 8 ' + (lang==='fr' ? 'fragments' : lang==='es' ? 'fragmentos' : 'fragments'), W/2, H*0.55);
  } else if (frags >= 8) {
    ctx.fillStyle = '#6bff6b';
    ctx.font = '400 18px Montserrat, sans-serif';
    ctx.fillText(lang==='fr' ? '🪐 Neptune déjà débloquée !' : lang==='es' ? '🪐 ¡Neptuno ya desbloqueado!' : '🪐 Neptune already unlocked!', W/2, H*0.52);
  } else {
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    ctx.font = '400 16px Montserrat, sans-serif';
    const needed = lang==='fr'
      ? `🧩 ${frags}/8 fragments — 100⭐ pour le prochain`
      : lang==='es' ? `🧩 ${frags}/8 fragmentos — 100⭐ para el siguiente`
      : `🧩 ${frags}/8 fragments — 100⭐ for the next one`;
    ctx.fillText(needed, W/2, H*0.52);
  }

  // Save game score to state
  state.gameHighScore = Math.max(state.gameHighScore || 0, score);
  state.gamesPlayed = (state.gamesPlayed || 0) + 1;
  state.lastGameScore = score;
  saveState();

  setTimeout(() => { checkAchievements(); checkPlanetUnlocks(); }, 300);

  // Close button
  ctx.fillStyle = 'rgba(192,132,252,.85)';
  _roundRect(ctx, W/2 - 80, H*0.65, 160, 48, 24);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = '500 18px Montserrat, sans-serif';
  ctx.fillText(lang==='fr' ? 'Continuer' : lang==='es' ? 'Continuar' : 'Continue', W/2, H*0.65 + 30);

  // Click/tap to close
  function _closeGame(e) {
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    const bx = W/2 - 80, by = H*0.65, bw = 160, bh = 48;
    if (cx >= bx && cx <= bx+bw && cy >= by && cy <= by+bh) {
      canvas.removeEventListener('click', _closeGame);
      canvas.removeEventListener('touchstart', _closeGame);
      document.getElementById('gameOverlay').classList.remove('active');
      _game = null;
    }
  }
  canvas.addEventListener('click', _closeGame);
  canvas.addEventListener('touchstart', _closeGame, {passive:false});
}

function _roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r);
  ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}

