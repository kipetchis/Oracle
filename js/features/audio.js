// ── AUDIO: Sound Menu, Ambient Engine & Planet Music ───────────────────────
// Depends on globals: state, saveState(), syncSoundUI is defined here
// ── SOUND MENU ────────────────────────────────────────────────────────────
function toggleSoundMenu(){
  const menu = document.getElementById('soundMenu');
  if(!menu) return;
  const isOpen = menu.classList.toggle('open');
  if(isOpen) updateSoundMenu();
}

function closeSoundMenu(){
  const menu = document.getElementById('soundMenu');
  if(menu) menu.classList.remove('open');
}

function updateSoundMenu(){
  const musicSt = document.getElementById('smiMusicStatus');
  const sfxSt = document.getElementById('smiSfxStatus');
  const allLabel = document.getElementById('smiAllLabel');
  const btn = document.getElementById('soundToggleBtn');
  if(musicSt) musicSt.textContent = state.mutedAmbient ? 'OFF' : 'ON';
  if(sfxSt) sfxSt.textContent = state.mutedSfx ? 'OFF' : 'ON';
  const allMuted = state.mutedAmbient && state.mutedSfx;
  if(allLabel) allLabel.textContent = allMuted ? (lang==='fr'?'Tout activer':'Enable all') : (lang==='fr'?'Tout couper':'Mute all');
  if(btn) btn.textContent = allMuted ? '🔇' : (state.mutedAmbient || state.mutedSfx) ? '🔉' : '🔊';
}

function toggleAmbientFromMenu(){
  toggleAmbientMute();
  updateSoundMenu();
}

function toggleSfxFromMenu(){
  toggleSfxMute();
  updateSoundMenu();
}

function toggleAllAudio(){
  const allMuted = state.mutedAmbient && state.mutedSfx;
  state.mutedAmbient = !allMuted;
  state.mutedSfx = !allMuted;
  saveState();
  syncSoundUI();
  if(window._syncAmbientMute) window._syncAmbientMute();
  updateSoundMenu();
  showToast(allMuted ? (lang==='fr'?'Audio activé':'Audio enabled') : (lang==='fr'?'Audio coupé':'Audio muted'));
}

// Close sound menu when tapping elsewhere
document.addEventListener('click', function(e){
  if(!e.target.closest('#soundToggleBtn') && !e.target.closest('#soundMenu')){
    closeSoundMenu();
  }
}, true);

function syncSoundUI(){
  updateSoundMenu();
}

// ── AMBIENT SOUND ENGINE ──────────────────────────────────────────────────
(function(){
  let _ctx = null;
  function ctx(){
    if(!_ctx) _ctx = new (window.AudioContext||window.webkitAudioContext)();
    if(_ctx.state==='suspended') _ctx.resume();
    return _ctx;
  }

  // Fade helper: ramp gain 0→peak over attack, then peak→0 over release
  function env(g, peak, atk, hold, rel, now){
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(peak, now + atk);
    g.gain.setValueAtTime(peak, now + atk + hold);
    g.gain.linearRampToValueAtTime(0, now + atk + hold + rel);
  }

  // Simple sine oscillator
  function osc(frequency, type, gain_node, start, dur){
    const o = ctx().createOscillator();
    o.type = type || 'sine';
    o.frequency.value = frequency;
    o.connect(gain_node);
    o.start(start);
    o.stop(start + dur + 0.1);
    return o;
  }

  // Reverb convolver (simple impulse)
  function makeReverb(duration, decay){
    const c = ctx();
    const rate = c.sampleRate;
    const len = rate * duration;
    const buf = c.createBuffer(2, len, rate);
    for(let ch=0; ch<2; ch++){
      const d = buf.getChannelData(ch);
      for(let i=0; i<len; i++) d[i] = (Math.random()*2-1) * Math.pow(1 - i/len, decay);
    }
    const conv = c.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  const CAT_SOUNDS = {

    // 🔬 Science — sinus pur, harmoniques propres, montée claire
    science: (now) => {
      const g = ctx().createGain(); g.connect(ctx().destination);
      env(g, 0.12, 0.1, 0.6, 1.2, now);
      osc(440, 'sine', g, now, 2);
      osc(880, 'sine', g, now, 2);
      const g2 = ctx().createGain(); g2.gain.value = 0.04; g2.connect(ctx().destination);
      osc(1320, 'sine', g2, now + 0.3, 1.5);
    },

    // 🌍 Monde — bourdon grave chaleureux, quinte
    world: (now) => {
      const rev = makeReverb(2, 3); rev.connect(ctx().destination);
      const g = ctx().createGain(); g.connect(rev);
      env(g, 0.22, 0.3, 0.8, 1.2, now);
      osc(130.8, 'sine', g, now, 2.5);   // Do2
      osc(196, 'sine', g, now, 2.5);     // Sol2
      osc(261.6, 'triangle', g, now, 2.5); // Do3
    },

    // 🐾 Animaux — harmoniques naturelles, organique
    animals: (now) => {
      const g = ctx().createGain(); g.connect(ctx().destination);
      env(g, 0.1, 0.2, 0.5, 1.5, now);
      osc(220, 'triangle', g, now, 2.2);
      osc(329.6, 'triangle', g, now + 0.1, 2);
      osc(440, 'triangle', g, now + 0.2, 1.8);
      // Petit modulation LFO pour vie organique
      const lfo = ctx().createOscillator(); lfo.frequency.value = 4;
      const lfoGain = ctx().createGain(); lfoGain.gain.value = 5;
      lfo.connect(lfoGain);
      const mainOsc = ctx().createOscillator(); mainOsc.type = 'sine'; mainOsc.frequency.value = 165;
      lfoGain.connect(mainOsc.frequency);
      mainOsc.connect(g); lfo.start(now); mainOsc.start(now); lfo.stop(now+2.5); mainOsc.stop(now+2.5);
    },

    // 💪 Corps humain — battement binaural doux
    body: (now) => {
      const gL = ctx().createGain(); const gR = ctx().createGain();
      const merger = ctx().createChannelMerger(2);
      gL.connect(merger, 0, 0); gR.connect(merger, 0, 1);
      merger.connect(ctx().destination);
      env(gL, 0.2, 0.3, 0.7, 1.2, now); env(gR, 0.2, 0.3, 0.7, 1.2, now);
      osc(174.6, 'sine', gL, now, 2.5);  // Fa3 oreille gauche
      osc(178.6, 'sine', gR, now, 2.5);  // +4Hz binaural oreille droite
      osc(349.2, 'sine', gL, now, 2.5);
    },

    // 🎨 Arts — accord de piano, doré
    arts: (now) => {
      const rev = makeReverb(1.5, 4); rev.connect(ctx().destination);
      const g = ctx().createGain(); g.connect(rev);
      // Accord de Mi bémol majeur : Eb-G-Bb
      [[311.1, 0], [392, 0.08], [466.2, 0.16], [622.2, 0.24]].forEach(([freq, delay]) => {
        const gg = ctx().createGain(); gg.connect(g);
        env(gg, 0.15, 0.01, 0.3, 1.5, now + delay);
        osc(freq, 'triangle', gg, now + delay, 2);
      });
    },

    // 🕰️ Histoire — grave solennel, cloche lointaine
    history: (now) => {
      const rev = makeReverb(3, 2); rev.connect(ctx().destination);
      const g = ctx().createGain(); g.connect(rev);
      env(g, 0.26, 0.01, 0.3, 2.5, now);
      osc(110, 'sine', g, now, 3);
      osc(220, 'sine', g, now, 3);
      // Inharmonicité de cloche
      const g2 = ctx().createGain(); g2.gain.value = 0.18; g2.connect(rev);
      env(g2, 0.06, 0.01, 0.1, 2, now);
      osc(261.6 * 2.756, 'sine', g2, now, 2.5); // partiel inharmonique
    },

    // 🚀 Espace — pad cosmique, longue réverbération
    space: (now) => {
      const rev = makeReverb(4, 1.5); rev.connect(ctx().destination);
      const g = ctx().createGain(); g.connect(rev);
      env(g, 0.36, 0.8, 0.5, 1.5, now);
      [80, 120, 160, 240].forEach((f, i) => osc(f, 'sine', g, now + i*0.15, 3));
      // Sweep lent
      const sweep = ctx().createOscillator(); sweep.type = 'sine';
      sweep.frequency.setValueAtTime(200, now);
      sweep.frequency.linearRampToValueAtTime(400, now + 2.5);
      const gs = ctx().createGain(); gs.gain.value = 0.18;
      env(gs, 0.18, 0.5, 0.5, 1.2, now);
      sweep.connect(gs); gs.connect(rev);
      sweep.start(now); sweep.stop(now + 3);
    },

    // 💡 Inventions — bip futuriste, clean
    inventions: (now) => {
      const g = ctx().createGain(); g.connect(ctx().destination);
      env(g, 0.12, 0.01, 0.15, 0.3, now);
      osc(880, 'square', g, now, 0.5);
      const g2 = ctx().createGain(); g2.connect(ctx().destination);
      env(g2, 0.1, 0.01, 0.1, 0.5, now + 0.25);
      osc(1320, 'square', g2, now + 0.25, 0.7);
      const g3 = ctx().createGain(); g3.connect(ctx().destination);
      env(g3, 0.08, 0.01, 0.2, 0.8, now + 0.6);
      osc(1760, 'sine', g3, now + 0.6, 1);
    },

    // 🗣️ Langage — mélodique, doux et vocal
    language: (now) => {
      const rev = makeReverb(1.5, 3); rev.connect(ctx().destination);
      // Mélodie douce évoquant les mots — gamme de Do majeur
      const notes = [261.6, 293.7, 329.6, 349.2, 392, 349.2, 329.6];
      const delays = [0, 0.2, 0.4, 0.6, 0.85, 1.1, 1.35];
      notes.forEach((freq, i) => {
        const g = ctx().createGain(); g.connect(rev);
        env(g, 0.22, 0.04, 0.1, 0.9, now + delays[i]);
        osc(freq, 'triangle', g, now + delays[i], 1.1);
      });
      // Fond doux
      const gBase = ctx().createGain(); gBase.connect(rev);
      env(gBase, 0.14, 0.3, 0.6, 1.0, now);
      osc(130.8, 'sine', gBase, now, 2.8);
      osc(196, 'sine', gBase, now + 0.1, 2.5);
    },

    // 🍕 Gastronomie — notes chaudes, rondes
    food: (now) => {
      const g = ctx().createGain(); g.connect(ctx().destination);
      env(g, 0.12, 0.15, 0.7, 1.3, now);
      osc(261.6, 'triangle', g, now, 2.3);      // Do4
      osc(329.6, 'triangle', g, now + 0.1, 2.1); // Mi4
      osc(392, 'triangle', g, now + 0.2, 1.9);  // Sol4
    },

    // ⚽ Sports — impact, énergie, percussion
    sports: (now) => {
      const g = ctx().createGain(); g.connect(ctx().destination);
      env(g, 0.18, 0.005, 0.1, 0.4, now);
      osc(80, 'sine', g, now, 0.5);  // punch grave
      // Snare-like noise
      const buf = ctx().createBuffer(1, ctx().sampleRate * 0.15, ctx().sampleRate);
      const d = buf.getChannelData(0);
      for(let i=0; i<d.length; i++) d[i] = (Math.random()*2-1) * Math.pow(1-i/d.length, 3);
      const src = ctx().createBufferSource(); src.buffer = buf;
      const gn = ctx().createGain(); gn.gain.value = 0.15;
      src.connect(gn); gn.connect(ctx().destination); src.start(now + 0.08);
      // Élan montant
      const g2 = ctx().createGain(); g2.connect(ctx().destination);
      env(g2, 0.1, 0.05, 0.3, 0.8, now + 0.2);
      osc(220, 'sawtooth', g2, now + 0.2, 1.2);
    },

    // 🌟 Célébrités — brillant, scintillant
    celebrities: (now) => {
      const rev = makeReverb(1.5, 5); rev.connect(ctx().destination);
      [[1046.5, 0], [1318.5, 0.1], [1568, 0.2], [2093, 0.3]].forEach(([freq, delay]) => {
        const g = ctx().createGain(); g.connect(rev);
        env(g, 0.06, 0.01, 0.1, 1.2, now + delay);
        osc(freq, 'sine', g, now + delay, 1.5);
      });
      const g = ctx().createGain(); g.connect(ctx().destination);
      env(g, 0.08, 0.3, 0.5, 1, now);
      osc(523.25, 'triangle', g, now, 2);
    },

    // 📚 Fictions — mystérieux et doux, boîte à musique onirique
    fiction: (now) => {
      const rev = makeReverb(2.5, 3); rev.connect(ctx().destination);
      // Notes égrénées — boîte à musique en Mi mineur pentatonique
      const notes = [329.6, 392, 440, 523.3, 587.3, 440, 392];
      const delays = [0, 0.18, 0.36, 0.54, 0.72, 1.1, 1.4];
      notes.forEach((freq, i) => {
        const g = ctx().createGain(); g.connect(rev);
        env(g, 0.25, 0.01, 0.15, 1.6, now + delays[i]);
        osc(freq, 'sine', g, now + delays[i], 1.9);
      });
      // Nappe douce en fond
      const gPad = ctx().createGain(); gPad.connect(rev);
      env(gPad, 0.18, 1.0, 0.4, 1.0, now);
      osc(164.8, 'sine', gPad, now, 3.2);
      osc(246.9, 'sine', gPad, now + 0.3, 2.8);
    },

    // 🎮 Jeux Vidéo — chiptune 8-bit
    gaming: (now) => {
      const g = ctx().createGain(); g.connect(ctx().destination);
      const notes = [
        [523.25, 0],    // Do5
        [659.25, 0.12], // Mi5
        [783.99, 0.24], // Sol5
        [1046.5, 0.36], // Do6
        [783.99, 0.5],
        [1046.5, 0.62],
      ];
      notes.forEach(([freq, delay]) => {
        const gg = ctx().createGain(); gg.connect(ctx().destination);
        env(gg, 0.1, 0.005, 0.07, 0.06, now + delay);
        osc(freq, 'square', gg, now + delay, 0.14);
      });
    },

    // 🎬 Cinéma — orchestral mini, impact dramatique
    cinema: (now) => {
      const rev = makeReverb(2.5, 2); rev.connect(ctx().destination);
      // Cordes basses
      const gb = ctx().createGain(); gb.connect(rev);
      env(gb, 0.15, 0.05, 0.5, 1.5, now);
      osc(87.3, 'sawtooth', gb, now, 2.5);   // Fa2
      osc(130.8, 'sawtooth', gb, now, 2.5);  // Do3
      // Cuivres
      const gcu = ctx().createGain(); gcu.connect(rev);
      env(gcu, 0.12, 0.1, 0.3, 1.2, now + 0.15);
      osc(261.6, 'square', gcu, now+0.15, 2);
      osc(349.2, 'square', gcu, now+0.15, 2);
      // Impact initial
      const gi = ctx().createGain(); gi.connect(ctx().destination);
      env(gi, 0.2, 0.005, 0.05, 0.3, now);
      osc(65.4, 'sine', gi, now, 0.4);
    },

    // 🎵 Musique — accord guitare/synthé plucked
    music: (now) => {
      const rev = makeReverb(1.5, 4); rev.connect(ctx().destination);
      // Accord La majeur arpeggié : A-C#-E-A
      [[220, 0], [277.2, 0.07], [329.6, 0.14], [440, 0.21], [554.4, 0.28]].forEach(([freq, delay]) => {
        const g = ctx().createGain(); g.connect(rev);
        env(g, 0.11, 0.005, 0.2, 1.6, now + delay);
        // Pluck: triangle + rapide decay
        osc(freq, 'triangle', g, now + delay, 2);
        const g2 = ctx().createGain(); g2.gain.value = 0.12; g2.connect(rev);
        env(g2, 0.04, 0.005, 0.05, 0.3, now + delay);
        osc(freq * 2, 'sine', g2, now + delay, 0.4);
      });
    },

    // 🦕 Dinosaures — grondement primitif, grave et puissant
    dinosaurs: (now) => {
      const rev = makeReverb(3, 1.5); rev.connect(ctx().destination);
      const g = ctx().createGain(); g.connect(rev);
      env(g, 0.3, 0.05, 0.6, 2, now);
      osc(55, 'sawtooth', g, now, 3);
      osc(82.4, 'sine', g, now + 0.1, 2.8);
      // Grondement noise
      const buf = ctx().createBuffer(1, ctx().sampleRate * 0.4, ctx().sampleRate);
      const d = buf.getChannelData(0);
      for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2)*0.3;
      const src = ctx().createBufferSource(); src.buffer = buf;
      const gn = ctx().createGain(); gn.gain.value = 0.12;
      src.connect(gn); gn.connect(rev); src.start(now);
    },

    // 🤪 Fun — bulle, pop, fantaisiste
    fun: (now) => {
      [[400,0],[600,0.12],[800,0.24],[1200,0.36]].forEach(([freq,delay])=>{
        const g = ctx().createGain(); g.connect(ctx().destination);
        env(g, 0.12, 0.005, 0.05, 0.15, now+delay);
        osc(freq, 'sine', g, now+delay, 0.2);
      });
      const g2 = ctx().createGain(); g2.connect(ctx().destination);
      env(g2, 0.06, 0.01, 0.05, 0.3, now+0.5);
      osc(1600, 'sine', g2, now+0.5, 0.4);
    },

    // ⚖️ Lois — coup de marteau de juge, sec et grave
    laws: (now) => {
      const g = ctx().createGain(); g.connect(ctx().destination);
      env(g, 0.2, 0.005, 0.08, 0.5, now);
      osc(110, 'sine', g, now, 0.6);
      osc(165, 'triangle', g, now, 0.5);
      const buf = ctx().createBuffer(1, ctx().sampleRate*0.08, ctx().sampleRate);
      const d = buf.getChannelData(0);
      for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,4);
      const src = ctx().createBufferSource(); src.buffer = buf;
      const gn = ctx().createGain(); gn.gain.value = 0.2;
      src.connect(gn); gn.connect(ctx().destination); src.start(now);
    },

    // 🏛️ Mythologie — chœur ancien, mystique
    mythology: (now) => {
      const rev = makeReverb(3.5, 2); rev.connect(ctx().destination);
      const g = ctx().createGain(); g.connect(rev);
      env(g, 0.18, 0.5, 0.6, 1.5, now);
      osc(146.8, 'sine', g, now, 3);
      osc(220, 'sine', g, now + 0.1, 2.8);
      osc(293.7, 'sine', g, now + 0.2, 2.6);
      osc(440, 'sine', g, now + 0.5, 2);
      const g2 = ctx().createGain(); g2.gain.value = 0.06; g2.connect(rev);
      osc(880, 'triangle', g2, now + 0.8, 1.5);
    },

    // 🌊 Océans — vagues, flux et reflux (volume augmenté)
    oceans: (now) => {
      const rev = makeReverb(3, 2); rev.connect(ctx().destination);
      // Bruit blanc filtré = vague
      const buf = ctx().createBuffer(1, ctx().sampleRate*2, ctx().sampleRate);
      const d = buf.getChannelData(0);
      for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
      const src = ctx().createBufferSource(); src.buffer = buf;
      const filt = ctx().createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 400;
      filt.frequency.setValueAtTime(200, now);
      filt.frequency.linearRampToValueAtTime(800, now+1);
      filt.frequency.linearRampToValueAtTime(250, now+2);
      const gn = ctx().createGain();
      env(gn, 0.35, 0.5, 0.6, 1.5, now);
      src.connect(filt); filt.connect(gn); gn.connect(rev); src.start(now); src.stop(now+3);
      // Fond tonal plus présent
      const g = ctx().createGain(); g.connect(rev);
      env(g, 0.2, 0.8, 0.5, 1.0, now);
      osc(110, 'sine', g, now, 2.5);
      osc(165, 'sine', g, now + 0.2, 2.2);
    },

    // 🧠 Psychologie — binaural doux, contemplatif
    psychology: (now) => {
      const gL = ctx().createGain(); const gR = ctx().createGain();
      const merger = ctx().createChannelMerger(2);
      gL.connect(merger, 0, 0); gR.connect(merger, 0, 1);
      merger.connect(ctx().destination);
      env(gL, 0.12, 0.4, 0.5, 1.3, now);
      env(gR, 0.12, 0.4, 0.5, 1.3, now);
      osc(220, 'sine', gL, now, 2.5);
      osc(226, 'sine', gR, now, 2.5);
      osc(330, 'triangle', gL, now + 0.3, 2);
    },

    // 💬 Citations — note unique suspendue, résonante
    quotes: (now) => {
      const rev = makeReverb(3, 4); rev.connect(ctx().destination);
      const g = ctx().createGain(); g.connect(rev);
      env(g, 0.2, 0.01, 0.3, 2.5, now);
      osc(261.6, 'sine', g, now, 3);
      const g2 = ctx().createGain(); g2.gain.value = 0.08; g2.connect(rev);
      osc(523.25, 'sine', g2, now + 0.5, 2.5);
      osc(784, 'sine', g2, now + 1, 2);
    },

    // 🏆 Records — fanfare courte, triomphale (volume réduit)
    records: (now) => {
      [[261.6,0],[329.6,0.1],[392,0.2],[523.25,0.35]].forEach(([freq,delay])=>{
        const g = ctx().createGain(); g.connect(ctx().destination);
        env(g, 0.06, 0.01, 0.05, 0.5, now+delay);
        osc(freq, 'square', g, now+delay, 0.6);
        const g2 = ctx().createGain(); g2.gain.value = 0.05; g2.connect(ctx().destination);
        env(g2, 0.04, 0.01, 0.04, 0.4, now+delay);
        osc(freq*2, 'sine', g2, now+delay, 0.5);
      });
    },

    // 🐉 Contes & Légendes — harpe féerique, magique
    tales: (now) => {
      const rev = makeReverb(2.5, 4); rev.connect(ctx().destination);
      const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 523.25];
      notes.forEach((freq, i) => {
        const g = ctx().createGain(); g.connect(rev);
        env(g, 0.15, 0.005, 0.12, 1.4, now + i*0.15);
        osc(freq, 'sine', g, now + i*0.15, 1.8);
        const g2 = ctx().createGain(); g2.gain.value = 0.06; g2.connect(rev);
        osc(freq*3, 'sine', g2, now + i*0.15, 0.8);
      });
    },

    // 🌺 Fallback positif
    positive: (now) => {
      const g = ctx().createGain(); g.connect(ctx().destination);
      env(g, 0.1, 0.1, 0.5, 1, now);
      osc(523.25, 'sine', g, now, 1.8);
      osc(659.25, 'sine', g, now + 0.15, 1.5);
    },
  };

  window.playCatSound = function(cat) {
    if(state && state.mutedSfx) return;
    try {
      const fn = CAT_SOUNDS[cat] || CAT_SOUNDS['positive'];
      fn(ctx().currentTime);
    } catch(e) { /* silencieux si AudioContext non supporté */ }
  };
})();

// ── MUSIQUE D'AMBIANCE PAR PLANÈTE ────────────────────────────────────────
(function(){
  const AMBIENT_BASE = '/Oracle/audio/';
  const AMBIENT_MAP = {
    earth:'ambient-earth.mp3', mars:'ambient-mars.mp3', jupiter:'ambient-jupiter.mp3',
    saturn:'ambient-saturn.mp3', neptune:'ambient-neptune.mp3', venus:'ambient-venus.mp3',
    mercury:'ambient-mercury.mp3', pluto:'ambient-pluto.mp3', sun:'ambient-sun.mp3',
    moon:'ambient-moon.mp3', nebula:'ambient-nebula.mp3', pangaea:'ambient-pangaea.mp3'
  };
  const VOL = 0.4, FADE_MS = 1500, FADE_STEP = 30;
  let _current = null, _currentPlanet = null, _started = false;

  function _createAudio(planet){
    const file = AMBIENT_MAP[planet] || AMBIENT_MAP.earth;
    const a = new Audio(AMBIENT_BASE + file);
    a.loop = true;
    a.preload = 'auto';
    a.volume = 0;
    return a;
  }

  function _fadeIn(audio, targetVol, cb){
    let v = 0;
    const step = targetVol / (FADE_MS / FADE_STEP);
    const iv = setInterval(() => {
      v = Math.min(targetVol, v + step);
      audio.volume = v;
      if(v >= targetVol){ clearInterval(iv); if(cb) cb(); }
    }, FADE_STEP);
    return iv;
  }

  function _fadeOut(audio, cb){
    if(!audio){ if(cb) cb(); return; }
    let v = audio.volume;
    const step = v / (FADE_MS / FADE_STEP);
    const iv = setInterval(() => {
      v = Math.max(0, v - step);
      audio.volume = v;
      if(v <= 0){
        clearInterval(iv);
        audio.pause();
        audio.currentTime = 0;
        if(cb) cb();
      }
    }, FADE_STEP);
    return iv;
  }

  function startAmbient(planet){
    planet = planet || state.activePlanet || 'earth';
    if(_started && _currentPlanet === planet) return;
    _started = true;
    _switchTo(planet);
  }

  function _switchTo(planet){
    if(_currentPlanet === planet && _current) return;
    const vol = state.mutedAmbient ? 0 : VOL;
    try {
      const next = _createAudio(planet);
      const p = next.play();
      if(p && p.catch) p.catch(e => console.warn('[Oracle ambient]', e));
      if(_current){
        const old = _current;
        _fadeOut(old);
        if(vol > 0) _fadeIn(next, vol); else next.volume = 0;
      } else {
        if(vol > 0) _fadeIn(next, vol); else next.volume = 0;
      }
      _current = next;
      _currentPlanet = planet;
    } catch(e){ console.warn('[Oracle ambient]', e); }
  }

  function switchAmbient(planet){
    if(!_started) return; // Will start on first gesture
    _switchTo(planet);
  }

  function syncAmbientMute(){
    if(!_current) return;
    _current.volume = state.mutedAmbient ? 0 : VOL;
  }

  // Premier geste utilisateur (nécessaire sur iOS/Android)
  function _boot(){ startAmbient(state.activePlanet || 'earth'); }
  document.addEventListener('touchstart', _boot, {once:true, passive:true, capture:true});
  document.addEventListener('click',      _boot, {once:true, capture:true});

  // Pause audio quand l'app passe en arrière-plan, reprend au retour
  document.addEventListener('visibilitychange', function(){
    if(!_current) return;
    if(document.hidden){
      _current.pause();
    } else {
      if(!state.mutedAmbient){
        const p = _current.play();
        if(p && p.catch) p.catch(e => console.warn('[Oracle ambient resume]', e));
      }
    }
  });

  // Sécurité supplémentaire : pagehide (fermeture onglet / navigation)
  window.addEventListener('pagehide', function(){
    if(_current){ _current.pause(); _current.currentTime = 0; }
  });

  window._startAmbient    = startAmbient;
  window._syncAmbientMute = syncAmbientMute;
  window._switchAmbient   = switchAmbient;
})();

function toggleAmbientMute(){
  state.mutedAmbient = !state.mutedAmbient;
  saveState();
  syncSoundUI();
  if(window._syncAmbientMute) window._syncAmbientMute();
}
function toggleSfxMute(){
  state.mutedSfx = !state.mutedSfx;
  saveState();
  syncSoundUI();
}
// Expose to window for onclick handlers
window.toggleAmbientMute = toggleAmbientMute;
window.toggleSfxMute = toggleSfxMute;
