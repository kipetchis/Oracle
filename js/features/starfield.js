// ── STARFIELD & GYROSCOPIC PARALLAX ────────────────────────────────────────
// Self-contained visual effects, no external dependencies
// ── STARFIELD BACKGROUND ──────────────────────────────────────────────────
(function(){
  const canvas = document.getElementById('starfield');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], _ox = 0, _oy = 0;

  const LAYERS = [
    { count:220, minR:0.2, maxR:0.7, speed:0.3, twinkle:true },   // distant
    { count:100, minR:0.7, maxR:1.3, speed:0.6, twinkle:true },   // mid
    { count:35,  minR:1.3, maxR:2.2, speed:1.0, twinkle:false }   // close
  ];

  // Realistic star color temperature distribution
  const STAR_COLORS = [
    { weight:0.35, h:220, s:60, l:85 },  // blue-white (hot B-type)
    { weight:0.25, h:0,   s:0,  l:100 },  // pure white (A-type)
    { weight:0.15, h:55,  s:70, l:90 },  // warm yellow (G-type, like our Sun)
    { weight:0.12, h:35,  s:80, l:85 },  // gold-orange (K-type)
    { weight:0.08, h:15,  s:75, l:80 },  // pale orange (cool K-type)
    { weight:0.05, h:0,   s:65, l:78 }   // reddish (M-type, red dwarfs)
  ];

  function pickStarColor(){
    let r = Math.random(), acc = 0;
    for(const c of STAR_COLORS){
      acc += c.weight;
      if(r < acc) return c;
    }
    return STAR_COLORS[1]; // fallback white
  }

  function resize(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    generateStars();
  }

  function generateStars(){
    stars = [];
    // Extra margin so stars are visible when parallax shifts
    const margin = 60;
    LAYERS.forEach(layer => {
      for(let i = 0; i < layer.count; i++){
        const color = pickStarColor();
        stars.push({
          x: Math.random() * (W + margin*2) - margin,
          y: Math.random() * (H + margin*2) - margin,
          r: layer.minR + Math.random() * (layer.maxR - layer.minR),
          speed: layer.speed,
          twinkle: layer.twinkle,
          phase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.3 + Math.random() * 0.8,
          baseAlpha: 0.5 + Math.random() * 0.5,
          h: color.h, s: color.s, l: color.l
        });
      }
    });
  }

  let _raf;
  function draw(t){
    ctx.clearRect(0, 0, W, H);
    const time = t * 0.001;

    for(let i = 0; i < stars.length; i++){
      const s = stars[i];
      const px = s.x + _ox * s.speed;
      const py = s.y + _oy * s.speed;

      let alpha = s.baseAlpha;
      if(s.twinkle){
        alpha *= 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.phase);
      }

      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.h},${s.s}%,${s.l}%,${alpha.toFixed(2)})`;
      ctx.fill();

      // Glow for larger stars
      if(s.r > 1.2){
        ctx.beginPath();
        ctx.arc(px, py, s.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.h},${s.s}%,${s.l}%,${(alpha * 0.1).toFixed(3)})`;
        ctx.fill();
      }
    }

    _raf = requestAnimationFrame(draw);
  }

  // Hook into parallax system
  window._starfieldOffset = function(x, y){
    _ox = x; _oy = y;
  };

  window.addEventListener('resize', resize, {passive:true});
  resize();
  _raf = requestAnimationFrame(draw);

  // Pause when hidden
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){
      cancelAnimationFrame(_raf);
    } else {
      _raf = requestAnimationFrame(draw);
    }
  });
})();

// ── PARALLAXE GYROSCOPIQUE ────────────────────────────────────────────────
(function(){
  let _bx = 0, _by = 0;
  const SMOOTH = 0.06;
  const STAR_FACTOR = 10;
  const ORB_FACTOR  = 14;
  let _gyroActive = false;

  function applyParallax(x, y){
    _bx += (x - _bx) * SMOOTH;
    _by += (y - _by) * SMOOTH;
    if(window._starfieldOffset) window._starfieldOffset(_bx * STAR_FACTOR, _by * STAR_FACTOR);
    document.documentElement.style.setProperty('--gyro-x', `${(_bx * ORB_FACTOR).toFixed(1)}px`);
    document.documentElement.style.setProperty('--gyro-y', `${(_by * ORB_FACTOR).toFixed(1)}px`);
  }

  function onOrientation(e){
    if(e.gamma === null && e.beta === null) return;
    _gyroActive = true;
    applyParallax((e.gamma||0)/90, Math.max(-1,Math.min(1,((e.beta||0)-45)/45)));
  }

  // Fallback souris pour desktop / simulateur
  function setupMouseFallback(){
    document.addEventListener('mousemove', function(e){
      const x = (e.clientX / window.innerWidth  - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      applyParallax(x, y);
    }, {passive:true});
  }

  // Fallback tactile pour mobile sans gyroscope (WebView / Bubblewrap)
  function setupTouchFallback(){
    let _startX = 0, _startY = 0, _active = false;
    document.addEventListener('touchstart', function(e){
      if(e.touches.length !== 1) return;
      _startX = e.touches[0].clientX;
      _startY = e.touches[0].clientY;
      _active = true;
    }, {passive:true});
    document.addEventListener('touchmove', function(e){
      if(!_active || e.touches.length !== 1) return;
      const dx = (e.touches[0].clientX - _startX) / window.innerWidth * 2;
      const dy = (e.touches[0].clientY - _startY) / window.innerHeight * 2;
      applyParallax(
        Math.max(-1, Math.min(1, dx)),
        Math.max(-1, Math.min(1, dy))
      );
    }, {passive:true});
    document.addEventListener('touchend', function(){ _active = false; applyParallax(0,0); }, {passive:true});
  }

  function setupFallback(){
    if('ontouchstart' in window) setupTouchFallback();
    else setupMouseFallback();
  }

  function setupGyroFixed(){
    if(!window.DeviceOrientationEvent){ setupFallback(); return; }
    if(typeof DeviceOrientationEvent.requestPermission === 'function'){
      document.addEventListener('touchend', function _req(){
        DeviceOrientationEvent.requestPermission()
          .then(r => { if(r==='granted') window.addEventListener('deviceorientation', onOrientation, {passive:true}); else setupTouchFallback(); })
          .catch(()=>{ setupTouchFallback(); });
        document.removeEventListener('touchend', _req);
      }, {once:true});
    } else {
      window.addEventListener('deviceorientation', onOrientation, {passive:true});
      setTimeout(()=>{ if(!_gyroActive) setupFallback(); }, 3000);
    }
  }

  setupGyroFixed();
})();

