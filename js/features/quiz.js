// ── QUIZ, COMET & UFO SYSTEMS ──────────────────────────────────────────────
// Depends on globals: state, lang, T, haptic(), saveState(), showToast(),
//                     checkAchievements(), startSpaceGame(), CAT_ICONS
// ── QUIZ ──────────────────────────────────────────────────────────────────
let quizSession = { questions:[], current:0, answers:[] };
function quizText(fr, es, en){return lang==='fr'?fr:lang==='es'?es:en;}

// ── COMET QUIZ SYSTEM ─────────────────────────────────────────────────────
const QUIZ_INTERVALS = [5, 10, 15];
let factsReadSinceQuiz = 0;
let _nextQuizInterval = QUIZ_INTERVALS[Math.floor(Math.random()*QUIZ_INTERVALS.length)];
let _cometEl = null;
let _cometTimeout = null;

function maybeShowQuiz() {
  factsReadSinceQuiz++;
  if (factsReadSinceQuiz >= _nextQuizInterval) {
    factsReadSinceQuiz = 0;
    _nextQuizInterval = QUIZ_INTERVALS[Math.floor(Math.random()*QUIZ_INTERVALS.length)];
    setTimeout(() => launchComet(), 600);
  }
}

function launchComet() {
  if (_cometEl) dismissComet();
  const W = window.innerWidth, H = window.innerHeight;
  const side = Math.floor(Math.random()*4);
  const spread = (max) => 80 + Math.random()*(max-160);
  let x0,y0,x1,y1;
  if      (side===0){x0=spread(W);y0=-30;   x1=spread(W);y1=H+30;}
  else if (side===1){x0=W+30;    y0=spread(H);x1=-100;  y1=spread(H);}
  else if (side===2){x0=spread(W);y0=H+30;  x1=spread(W);y1=-30;}
  else             {x0=-100;     y0=spread(H);x1=W+30;  y1=spread(H);}
  const angle = Math.atan2(y1-y0, x1-x0)*180/Math.PI;
  const lbl = '✦ Quiz';
  const el = document.createElement('div');
  el.className = 'comet-wrapper clickable';
  el.style.setProperty('--cx0', x0+'px');
  el.style.setProperty('--cy0', y0+'px');
  el.style.setProperty('--cx1', x1+'px');
  el.style.setProperty('--cy1', y1+'px');
  el.style.setProperty('--cangle', angle+'deg');
  el.innerHTML = `<div class="comet-body" style="transform:rotate(${angle}deg)">
    <div class="comet-tail"></div>
    <div class="comet-head"><div class="comet-label" style="transform:translateX(-50%) rotate(${-angle}deg)">${lbl}</div></div>
  </div>`;
  el.addEventListener('click', ()=>{ dismissComet(); startQuiz(); });
  document.body.appendChild(el);
  _cometEl = el;
  playCometSound();
  _cometTimeout = setTimeout(()=>dismissComet(), 15200);
}

function dismissComet() {
  if (_cometTimeout){clearTimeout(_cometTimeout);_cometTimeout=null;}
  if (_cometEl){_cometEl.remove();_cometEl=null;}
}

function playCometSound() {
  if (state && state.mutedSfx) return;
  try {
    const c = new (window.AudioContext||window.webkitAudioContext)();
    const now = c.currentTime;
    [[880,.16],[1108,.10],[1480,.07],[2200,.04]].forEach(([freq,vol],i)=>{
      const g=c.createGain();g.connect(c.destination);
      g.gain.setValueAtTime(0,now+i*.05);
      g.gain.linearRampToValueAtTime(vol,now+i*.05+.07);
      g.gain.exponentialRampToValueAtTime(.001,now+i*.05+1.3);
      const o=c.createOscillator();o.type='sine';
      o.frequency.setValueAtTime(freq,now);
      o.frequency.linearRampToValueAtTime(freq*1.2,now+1.3);
      o.connect(g);o.start(now+i*.05);o.stop(now+i*.05+1.4);
    });
    const bl=c.sampleRate*.7,buf=c.createBuffer(1,bl,c.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<bl;i++)d[i]=(Math.random()*2-1)*.012;
    const ns=c.createBufferSource();ns.buffer=buf;
    const ng=c.createGain();ng.gain.setValueAtTime(.5,now);ng.gain.exponentialRampToValueAtTime(.001,now+.7);
    const nf=c.createBiquadFilter();nf.type='bandpass';nf.frequency.value=4200;nf.Q.value=2.5;
    ns.connect(nf);nf.connect(ng);ng.connect(c.destination);ns.start(now);
  } catch(e){}
}

function startQuiz() {
  const pool = QUIZ_DB[lang] || QUIZ_DB['en'] || QUIZ_DB['fr'];
  if (!pool || !pool.length) return;

  // Init tracking if needed
  if (!state.quizAnswered) state.quizAnswered = [];

  // Separate unseen from seen questions (by index)
  const unseen = [];
  const seen = [];
  pool.forEach((q, i) => {
    if (state.quizAnswered.includes(i)) seen.push({...q, _idx: i});
    else unseen.push({...q, _idx: i});
  });

  // Prioritize unseen; if fewer than 5 unseen, fill with seen
  let picked;
  if (unseen.length >= 5) {
    picked = shuffle(unseen).slice(0, 5);
  } else {
    picked = [...shuffle(unseen), ...shuffle(seen)].slice(0, 5);
  }

  // If all questions have been seen, reset the tracker
  if (unseen.length === 0) {
    state.quizAnswered = [];
  }

  // Track these questions as answered
  picked.forEach(q => {
    if (!state.quizAnswered.includes(q._idx)) state.quizAnswered.push(q._idx);
  });
  saveState();

  quizSession = { questions: picked, current:0, answers:[] };
  renderQuizQuestion();
  document.getElementById('quizOverlay').classList.add('active');
  document.getElementById('quizQuestionView').style.display = 'flex';
  document.getElementById('quizResultView').classList.remove('active');
  haptic('medium');
}

function renderQuizQuestion() {
  const t = T[lang];
  const { questions, current } = quizSession;
  const q = questions[current];
  // Show skip button, hide next button
  const skipBtn = document.getElementById('quizSkipBtn');
  const nextBtn = document.getElementById('quizNextBtn');
  if(skipBtn) { skipBtn.style.display='block'; skipBtn.textContent = quizText('↪ Passer cette question','↪ Saltar esta pregunta','↪ Skip this question'); }
  if(nextBtn) nextBtn.style.display='none';
  const total = questions.length;

  // Label
  document.getElementById('quizLabel').textContent =
    quizText(`Question ${current+1} / ${total}`, `Pregunta ${current+1} / ${total}`, `Question ${current+1} / ${total}`);

  // Progress dots
  const prog = document.getElementById('quizProgress');
  prog.innerHTML = questions.map((_, i) => {
    let cls = 'quiz-dot';
    if (i < current) cls += quizSession.answers[i] ? ' done-correct' : ' done-wrong';
    else if (i === current) cls += ' current';
    return `<div class="${cls}"></div>`;
  }).join('');

  // Question
  document.getElementById('quizQuestion').textContent = q.question;

  // Choices
  const letters = ['A', 'B', 'C'];
  document.getElementById('quizChoices').innerHTML = q.choices.map((c, i) =>
    `<div class="quiz-choice" onclick="quizAnswer(${i})" id="qc${i}">
      <div class="quiz-choice-letter">${letters[i]}</div>
      <div class="quiz-choice-text">${c}</div>
    </div>`
  ).join('');

  document.getElementById('quizFeedback').textContent = '';
  document.getElementById('quizFeedback').className = 'quiz-feedback';
  document.getElementById('quizNextBtn').className = 'quiz-next-btn';
  document.getElementById('quizNextBtn').textContent =
    current < total - 1
      ? quizText('Question suivante →','Pregunta siguiente →','Next question →')
      : quizText('Voir les résultats','Ver resultados','See results');
}

function quizAnswer(choiceIdx) {
  // Hide skip, show next
  const skipBtn = document.getElementById('quizSkipBtn');
  const nextBtn = document.getElementById('quizNextBtn');
  if(skipBtn) skipBtn.style.display='none';
  if(nextBtn) nextBtn.style.display='block';
  const q = quizSession.questions[quizSession.current];
  const correct = choiceIdx === q.answer;
  haptic(correct ? 'celebration' : 'light');
  quizSession.answers.push(correct);
  // Track global quiz stats
  state.quizTotal = (state.quizTotal || 0) + 1;
  if (correct) state.quizCorrect = (state.quizCorrect || 0) + 1;
  saveState();

  // Color choices
  for (let i = 0; i < q.choices.length; i++) {
    const el = document.getElementById('qc' + i);
    if (i === q.answer) el.classList.add('correct');
    else if (i === choiceIdx && !correct) el.classList.add('wrong');
    el.classList.add('disabled');
  }

  // Feedback
  const fb = document.getElementById('quizFeedback');
  if (correct) {
    fb.textContent = quizText('✓ Bonne réponse !','✓ ¡Correcto!','✓ Correct!');
    fb.className = 'quiz-feedback correct';
    haptic('success');
  } else {
    fb.textContent = quizText('✗ Raté !','✗ ¡Fallaste!','✗ Wrong!');
    fb.className = 'quiz-feedback wrong';
    haptic('light');
  }

  document.getElementById('quizNextBtn').classList.add('visible');
}

function quizSkip() {
  haptic('light');
  const { questions, current } = quizSession;
  if (current < questions.length - 1) {
    quizSession.current++;
    renderQuizQuestion();
  } else {
    showQuizResult();
  }
}

function quizNext() {
  const { questions, current } = quizSession;
  if (current < questions.length - 1) {
    quizSession.current++;
    renderQuizQuestion();
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  document.getElementById('quizQuestionView').style.display = 'none';
  const result = document.getElementById('quizResultView');
  result.classList.add('active');

  const score = quizSession.answers.filter(Boolean).length;
  const total = quizSession.answers.length;

  // Bars
  document.getElementById('quizResultBars').innerHTML =
    quizSession.answers.map(a =>
      `<div class="quiz-result-bar ${a ? 'correct' : 'wrong'}"></div>`
    ).join('');

  document.getElementById('quizResultLabel').textContent =
    quizText('Résultats','Resultados','Results');
  document.getElementById('quizResultScore').textContent = `${score} / ${total}`;

  const msgs = {
    fr: ['Pas de chance… retente !', 'Pas mal, continue !', 'Bien joué !', 'Excellent !', 'Parfait — tu es l\'Oracle !'],
    es: ['¡Más suerte la próxima!', 'Nada mal, sigue así.', '¡Bien hecho!', '¡Excelente!', 'Perfecto — ¡eres el Oráculo!'],
    en: ['Better luck next time!', 'Not bad, keep going!', 'Well done!', 'Excellent!', 'Perfect — you are the Oracle!']
  };
  const msgIdx = Math.round((score / total) * 4);
  document.getElementById('quizResultMsg').textContent = (msgs[lang] || msgs.fr)[msgIdx];
  document.getElementById('quizCloseBtn').textContent =
    quizText('Reprendre l\'Oracle','Volver al Oráculo','Back to Oracle');

  if (score === total) haptic('celebration');
}

function closeQuiz() {
  document.getElementById('quizOverlay').classList.remove('active');
  dismissComet();
}

// ── UFO MINI-GAME ────────────────────────────────────────────────────────
const UFO_INTERVALS = [10, 20, 30];
let factsReadSinceUfo = 0;
let _nextUfoInterval = UFO_INTERVALS[Math.floor(Math.random()*UFO_INTERVALS.length)];
let _ufoEl = null;
let _ufoTimeout = null;

function maybeShowUfo() {
  factsReadSinceUfo++;
  if (factsReadSinceUfo >= _nextUfoInterval) {
    factsReadSinceUfo = 0;
    _nextUfoInterval = UFO_INTERVALS[Math.floor(Math.random()*UFO_INTERVALS.length)];
    setTimeout(() => launchUfo(), 1200);
  }
}

function launchUfo() {
  if (_ufoEl) dismissUfo();
  const W = window.innerWidth, H = window.innerHeight;
  const x0 = -70, y0 = 80 + Math.random()*(H*0.5);
  const x1 = W + 70, y1 = 60 + Math.random()*(H*0.4);
  const lbl = quizText('🛸 Jouer','🛸 Jugar','🛸 Play');
  const el = document.createElement('div');
  el.className = 'ufo-wrapper clickable';
  el.style.setProperty('--ux0', x0+'px');
  el.style.setProperty('--uy0', y0+'px');
  el.style.setProperty('--ux1', x1+'px');
  el.style.setProperty('--uy1', y1+'px');
  el.style.setProperty('--udur', '12s');
  el.innerHTML = `<div class="ufo-body">
    <div class="ufo-dome"></div>
    <div class="ufo-disc"></div>
    <div class="ufo-lights"><span class="ufo-light"></span><span class="ufo-light"></span><span class="ufo-light"></span><span class="ufo-light"></span><span class="ufo-light"></span></div>
    <div class="ufo-beam"></div>
    <div class="ufo-label">${lbl}</div>
  </div>`;
  el.addEventListener('click', ()=>{ dismissUfo(); startSpaceGame(); });
  document.body.appendChild(el);
  _ufoEl = el;
  playUfoSound();
  _ufoTimeout = setTimeout(()=>dismissUfo(), 12500);
}

function dismissUfo() {
  if (_ufoTimeout){clearTimeout(_ufoTimeout);_ufoTimeout=null;}
  if (_ufoEl){_ufoEl.remove();_ufoEl=null;}
}

function playUfoSound() {
  if (state && state.mutedSfx) return;
  try {
    const c = new (window.AudioContext||window.webkitAudioContext)();
    const now = c.currentTime;
    // Eerie wobble sound
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain); gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(600, now+0.3);
    osc.frequency.linearRampToValueAtTime(350, now+0.6);
    osc.frequency.linearRampToValueAtTime(550, now+0.9);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now+0.1);
    gain.gain.setValueAtTime(0.08, now+0.7);
    gain.gain.linearRampToValueAtTime(0, now+1.0);
    osc.start(now); osc.stop(now+1.0);
  } catch(e){}
}

// ── QUIZ DATABASE ─────────────────────────────────────────────────────────
const QUIZ_DB = {
  fr: [
    // ── Existants ──
    {question:"Quelle est la température approximative d'un éclair ?",choices:["Environ 6 000 °C","Environ 30 000 °C","Environ 300 °C"],answer:1},
    {question:"Quelle proportion de la masse de ton corps est de la poussière d'étoile ?",choices:["Environ 40 %","Environ 70 %","Environ 93 %"],answer:2},
    {question:"Où est produite la moitié de l'oxygène que l'on respire ?",choices:["Dans les forêts tropicales","Dans les océans","Dans les prairies"],answer:1},
    {question:"Comment s'appellent les tubes de verre formés par la foudre dans le sable ?",choices:["Fulgurites","Pyrites","Calcites"],answer:0},
    {question:"Combien d'arbres y a-t-il environ sur Terre ?",choices:["300 milliards","3 000 milliards","30 milliards"],answer:1},
    {question:"Combien de cœurs possède une pieuvre ?",choices:["Un seul","Deux","Trois"],answer:2},
    {question:"Quel est le pH de l'acide gastrique humain ?",choices:["Entre 5 et 6","Entre 1 et 2","Entre 3 et 4"],answer:1},
    {question:"Quel animal peut dormir jusqu'à 3 ans ?",choices:["L'escargot","La tortue","L'ours"],answer:0},
    {question:"De quelle couleur est l'oxygène liquide ?",choices:["Incolore","Rouge","Bleu pâle"],answer:2},
    {question:"Quelle planète du système solaire flotterait sur l'eau ?",choices:["Mars","Saturne","Neptune"],answer:1},
    {question:"À quelle vitesse Usain Bolt a-t-il établi son record du 100m ?",choices:["38,5 km/h","44,7 km/h","51,2 km/h"],answer:1},
    {question:"Quelle est la distance exacte d'un marathon ?",choices:["42,195 km","40 km","45 km"],answer:0},
    {question:"Quel sport a été pratiqué sur la Lune ?",choices:["Tennis","Golf","Frisbee"],answer:1},
    {question:"En quelle année les balles de tennis sont-elles devenues jaunes ?",choices:["1960","1972","1985"],answer:1},
    {question:"À quelle vitesse peut voyager un volant de badminton ?",choices:["320 km/h","493 km/h","250 km/h"],answer:1},
    {question:"D'où vient le mot 'robot' ?",choices:["Du russe, signifiant 'machine'","Du tchèque, signifiant 'travail forcé'","De l'anglais, signifiant 'automate'"],answer:1},
    {question:"Que signifie littéralement le mot 'salaire' en latin ?",choices:["Pièce d'or","Ration de sel","Paiement mensuel"],answer:1},
    {question:"D'où vient l'expression 'avoir le cafard' ?",choices:["Des mineurs de charbon","Des soldats français en Algérie","Des dockers du port de Marseille"],answer:1},
    {question:"Quel pourcentage du vocabulaire anglais vient du français ?",choices:["Plus de 30 %","Environ 10 %","Environ 50 %"],answer:0},
    {question:"Que signifie 'OK' à l'origine ?",choices:["'All Correct' sans faute","'Oll Korrect', une faute volontaire","Une abréviation militaire"],answer:1},
    {question:"Le miel peut-il se périmer ?",choices:["Oui, après 10 ans","Non, il ne se périme jamais","Oui, après 50 ans"],answer:1},
    {question:"D'où vient vraiment le fortune cookie ?",choices:["De Chine","Du Japon","Des États-Unis"],answer:1},
    {question:"Pourquoi les carottes sont-elles orange ?",choices:["C'est leur couleur naturelle","Les Hollandais les ont sélectionnées ainsi","Une mutation génétique spontanée"],answer:1},
    {question:"Qu'est-ce que le chocolat blanc ?",choices:["Du chocolat très dilué","Un produit sans cacao solide","Du chocolat au lait décoloré"],answer:1},
    {question:"Pourquoi les Européens croyaient-ils les tomates toxiques ?",choices:["Elles causaient des allergies","Leur acidité dissolvait le plomb des assiettes","Un médecin avait publié un faux rapport"],answer:1},
    {question:"Combien de pyramides y a-t-il au Soudan ?",choices:["Environ 50","Environ 130","Environ 200"],answer:2},
    {question:"Combien de temps a duré la guerre entre le Royaume-Uni et Zanzibar ?",choices:["38 minutes","3 heures","2 jours"],answer:0},
    {question:"Qui a construit les pyramides d'Égypte ?",choices:["Des esclaves","Des ouvriers libres payés","Des prisonniers de guerre"],answer:1},
    {question:"Quelle est la durée d'un jour sur Vénus comparé à son année ?",choices:["Un jour = la moitié d'une année","Un jour est plus long qu'une année","Un jour = un dixième d'une année"],answer:1},
    {question:"L'espace sent comme quoi selon les astronomes ?",choices:["Du soufre brûlé","La framboise brûlée et le rhum","Du métal chaud"],answer:1},
    {question:"Quel est le plus grand volcan du système solaire ?",choices:["Le volcan Mauna Kea","L'Olympus Mons sur Mars","Le Tharsis Tholus"],answer:1},
    {question:"Où a été inventé le micro-ondes par accident ?",choices:["Dans un laboratoire de cuisine","Près d'un radar","Dans une centrale nucléaire"],answer:1},
    {question:"D'où vient le Velcro ?",choices:["D'une découverte militaire","D'une observation de bardanes sur une veste","D'un brevet de la NASA"],answer:1},
    {question:"À quoi était destiné le papier bulle à l'origine ?",choices:["À emballer des œufs","À être un papier peint en 3D","À protéger les composants électroniques"],answer:1},
    {question:"Quelle technologie quotidienne vient de recherches sur les trous noirs ?",choices:["Le GPS","Le Bluetooth","Le Wi-Fi"],answer:2},
    {question:"Combien de fuseaux horaires couvre la Russie ?",choices:["7","11","14"],answer:1},
    {question:"Quel est le seul drapeau national non rectangulaire ?",choices:["Le drapeau du Bhoutan","Le drapeau du Népal","Le drapeau du Sri Lanka"],answer:1},
    {question:"Pourquoi l'Islande n'a-t-elle pas de moustiques ?",choices:["Il y fait trop froid","Le climat et la géologie ne le permettent pas","Ils ont été éradiqués"],answer:1},
    {question:"Comment Cleopâtre se situait-elle dans le temps ?",choices:["Plus près des pyramides que de nous","Aussi loin des pyramides que de nous","Plus proche de nous que des pyramides"],answer:2},
    {question:"Comment les gladiateurs romains étaient-ils principalement nourris ?",choices:["De viande rouge","D'orge et de légumineuses","De poisson"],answer:1},
    // ── Nouvelles questions ──
    {question:"Combien de neurones le cerveau humain contient-il environ ?",choices:["8 milliards","86 milliards","860 milliards"],answer:1},
    {question:"Quel pourcentage de l'ADN humain est identique à celui du chimpanzé ?",choices:["85 %","92 %","98,7 %"],answer:2},
    {question:"Combien de bactéries vivent dans le corps humain ?",choices:["Autant que de cellules humaines","10 fois moins","100 fois plus"],answer:0},
    {question:"Quel est l'os le plus solide du corps humain ?",choices:["Le crâne","Le fémur","Le tibia"],answer:1},
    {question:"Combien de fois le cœur humain bat-il en moyenne par jour ?",choices:["50 000 fois","100 000 fois","200 000 fois"],answer:1},
    {question:"Quelle fraction de l'univers observable est constituée de matière visible ?",choices:["Environ 50 %","Environ 27 %","Environ 5 %"],answer:2},
    {question:"Combien de temps met la lumière du Soleil pour atteindre la Terre ?",choices:["30 secondes","8 minutes","1 heure"],answer:1},
    {question:"Quelle est la montagne la plus haute du système solaire ?",choices:["Everest terrestre","Olympus Mons sur Mars","Maxwell Montes sur Vénus"],answer:1},
    {question:"Quel est l'endroit le plus profond de l'océan ?",choices:["La fosse de Porto Rico","La fosse des Mariannes","La fosse de Java"],answer:1},
    {question:"Combien de litres de sang le cœur pompe-t-il par jour ?",choices:["1 000 litres","7 500 litres","20 000 litres"],answer:1},
    {question:"Quelle est la durée de vie moyenne d'un globule rouge ?",choices:["30 jours","120 jours","365 jours"],answer:1},
    {question:"Quel est l'animal le plus rapide du monde ?",choices:["Le guépard","Le faucon pèlerin","Le voilier"],answer:1},
    {question:"Combien de langues sont parlées dans le monde aujourd'hui ?",choices:["Environ 2 000","Environ 7 000","Environ 12 000"],answer:1},
    {question:"Quel pays a le plus de volcans actifs ?",choices:["Le Japon","L'Indonésie","L'Islande"],answer:1},
    {question:"Quelle est la vitesse de rotation de la Terre à l'équateur ?",choices:["500 km/h","1 670 km/h","3 200 km/h"],answer:1},
    {question:"Combien d'eau y a-t-il sur Terre au total ?",choices:["140 millions de km³","1,4 milliard de km³","14 milliards de km³"],answer:1},
    {question:"Quelle proportion de l'eau terrestre est douce ?",choices:["2,5 %","10 %","25 %"],answer:0},
    {question:"Quel animal produit le son le plus fort ?",choices:["L'éléphant","La crevette-pistolet","La baleine bleue"],answer:2},
    {question:"Combien d'étoiles sont visibles à l'œil nu par nuit claire ?",choices:["Environ 500","Environ 3 000","Environ 10 000"],answer:1},
    {question:"À quelle fréquence les cellules de l'estomac se renouvellent-elles ?",choices:["Tous les 2-4 jours","Tous les 30 jours","Tous les 6 mois"],answer:0},
    {question:"Quel est l'élément chimique le plus abondant dans l'univers ?",choices:["L'oxygène","Le carbone","L'hydrogène"],answer:2},
    {question:"Combien pèse environ un nuage de taille moyenne ?",choices:["100 kg","100 tonnes","500 000 kg"],answer:2},
    {question:"Quel sens les requins utilisent-ils pour détecter les champs électriques ?",choices:["L'olfaction","L'électroréception","L'écholocation"],answer:1},
    {question:"Quelle civilisation a inventé le zéro en mathématiques ?",choices:["Les Grecs","Les Mayas","Les Indiens"],answer:2},
    {question:"Combien de muscles faut-il pour faire un sourire ?",choices:["6","12","26"],answer:1},
    {question:"Quel est le désert le plus grand du monde ?",choices:["Le Sahara","L'Antarctique","Le désert d'Arabie"],answer:1},
    {question:"Combien de temps un photon met-il pour traverser le Soleil ?",choices:["8 minutes","170 000 ans","1 million d'années"],answer:1},
    {question:"Quel pourcentage du cerveau est composé d'eau ?",choices:["50 %","60 %","75 %"],answer:2},
    {question:"Quelle est la température au centre de la Terre ?",choices:["2 000 °C","5 500 °C","10 000 °C"],answer:1},
    {question:"Quel est l'organe le plus gros du corps humain ?",choices:["Le foie","Les poumons","La peau"],answer:2},
    {question:"Combien de litres d'air respirons-nous par jour ?",choices:["5 000 litres","11 000 litres","25 000 litres"],answer:1},
    {question:"Quel insecte peut porter 50 fois son poids ?",choices:["L'abeille","La fourmi","Le scarabée rhinocéros"],answer:2},
    {question:"En combien de temps la Station spatiale fait-elle le tour de la Terre ?",choices:["45 minutes","90 minutes","3 heures"],answer:1},
    {question:"Quelle planète a les vents les plus rapides du système solaire ?",choices:["Jupiter","Saturne","Neptune"],answer:2},
    {question:"Combien d'espèces vivantes sont estimées sur Terre ?",choices:["2 millions","8,7 millions","50 millions"],answer:1},
    {question:"Quel est le matériau naturel le plus dur ?",choices:["Le diamant","Le graphène","La lonsdaleïte"],answer:2},
    {question:"Combien de fois cligne-t-on des yeux par jour ?",choices:["5 000 fois","15 000 à 20 000 fois","50 000 fois"],answer:1},
    {question:"De quoi sont principalement composés les anneaux de Saturne ?",choices:["De roches","De glace","De gaz"],answer:1},
    {question:"Quel mammifère peut voler ?",choices:["L'écureuil volant","La chauve-souris","Le colugo"],answer:1},
    {question:"Combien de tremblements de terre se produisent chaque année sur Terre ?",choices:["5 000","50 000","500 000"],answer:2},
    // ── Nouvelles questions (lot 3) ──
    {question:"Quel est le seul continent sans désert ?",choices:["L'Antarctique","L'Europe","L'Océanie"],answer:1},
    {question:"Combien d'os un bébé humain possède-t-il à la naissance ?",choices:["206","270","300"],answer:2},
    {question:"Quel est le fleuve le plus long du monde ?",choices:["L'Amazone","Le Nil","Le Yangtsé"],answer:1},
    {question:"Quelle est la seule planète qui tourne dans le sens inverse des autres ?",choices:["Uranus","Vénus","Mercure"],answer:1},
    {question:"Combien de temps un humain peut-il survivre sans dormir avant des effets graves ?",choices:["3 jours","7 jours","11 jours"],answer:2},
    {question:"Quel pourcentage de la surface terrestre est couvert par les océans ?",choices:["55 %","71 %","85 %"],answer:1},
    {question:"Quelle est la substance la plus abondante dans le corps humain ?",choices:["Les protéines","L'eau","Les graisses"],answer:1},
    {question:"Quel animal a le cerveau le plus gros par rapport à son corps ?",choices:["Le dauphin","La fourmi","L'humain"],answer:1},
    {question:"Combien de fois par minute un colibri bat-il des ailes ?",choices:["200 fois","1 200 fois","4 800 fois"],answer:2},
    {question:"Quelle est la vitesse du son dans l'air à 20°C ?",choices:["343 m/s","500 m/s","1 200 m/s"],answer:0},
    {question:"Quel métal est liquide à température ambiante ?",choices:["Le gallium","Le mercure","Le césium"],answer:1},
    {question:"Combien de planètes naines reconnues y a-t-il dans le système solaire ?",choices:["3","5","8"],answer:1},
    {question:"Quel est l'animal terrestre le plus lent du monde ?",choices:["La tortue géante","Le paresseux à trois doigts","Le koala"],answer:1},
    {question:"À quelle profondeur commence la zone abyssale de l'océan ?",choices:["1 000 m","4 000 m","8 000 m"],answer:1},
    {question:"Quelle est la durée moyenne d'un rêve ?",choices:["5 à 20 minutes","1 à 2 heures","30 secondes"],answer:0},
    {question:"Quel pays possède le plus de lacs naturels au monde ?",choices:["La Finlande","Le Canada","La Russie"],answer:1},
    {question:"Combien de muscles le corps humain possède-t-il environ ?",choices:["206","400","640"],answer:2},
    {question:"Quelle est la galaxie la plus proche de la Voie lactée ?",choices:["Andromède","Le Grand Nuage de Magellan","La galaxie du Triangle"],answer:0},
    {question:"Quel est le point le plus éloigné du centre de la Terre ?",choices:["Le sommet de l'Everest","Le sommet du Chimborazo","Le sommet du K2"],answer:1},
    {question:"Combien de temps met la Lune pour faire le tour de la Terre ?",choices:["14 jours","27,3 jours","31 jours"],answer:1},
    {question:"Quel animal peut régénérer son cœur ?",choices:["L'étoile de mer","Le poisson-zèbre","La salamandre"],answer:1},
    {question:"Quelle est la température la plus froide jamais enregistrée sur Terre ?",choices:["-71,2 °C","-89,2 °C","-104 °C"],answer:1},
    {question:"Combien de satellites artificiels orbitent autour de la Terre ?",choices:["Environ 3 000","Environ 10 000","Plus de 30 000"],answer:1},
    {question:"Quel est le plus vieil arbre vivant connu ?",choices:["Un séquoia géant","Un pin Bristlecone","Un baobab"],answer:1},
    {question:"Combien de litres de salive produit-on en moyenne dans une vie ?",choices:["5 000 litres","25 000 litres","35 000 litres"],answer:2},
    {question:"Quelle est la vitesse maximale d'un guépard ?",choices:["90 km/h","112 km/h","130 km/h"],answer:1},
    {question:"Quel pourcentage de l'ADN humain est partagé avec la banane ?",choices:["30 %","50 %","60 %"],answer:2},
    {question:"Combien de volcans actifs y a-t-il sous les océans ?",choices:["Environ 500","Environ 5 000","Plus d'un million"],answer:2},
    {question:"Quelle est la plus grande structure vivante visible depuis l'espace ?",choices:["La forêt amazonienne","La Grande Barrière de corail","Les mangroves du Sundarbans"],answer:1},
    {question:"Quel est le métal le plus léger ?",choices:["L'aluminium","Le titane","Le lithium"],answer:2},
    {question:"Combien de cellules le corps humain perd-il par seconde ?",choices:["3 000","50 000","3,8 millions"],answer:2},
    {question:"Quelle est la plus petite unité de matière chimiquement identifiable ?",choices:["Le proton","L'atome","L'électron"],answer:1},
    {question:"Quel est le seul mammifère venimeux ?",choices:["Le vampire","L'ornithorynque","La musaraigne"],answer:1},
    {question:"Combien de tonnes de poussière cosmique tombent sur Terre chaque jour ?",choices:["1 tonne","50 tonnes","100 tonnes"],answer:1},
    {question:"Quelle est la pression atmosphérique à la surface de Vénus ?",choices:["2 fois celle de la Terre","50 fois celle de la Terre","92 fois celle de la Terre"],answer:2},
    {question:"Quel pourcentage de l'océan reste inexploré ?",choices:["40 %","60 %","80 %"],answer:2},
    {question:"Combien d'atomes composent une cellule humaine en moyenne ?",choices:["1 million","100 milliards","100 000 milliards"],answer:2},
    {question:"Quel est l'animal qui a la plus longue gestation ?",choices:["La baleine bleue","L'éléphant d'Afrique","La salamandre alpine"],answer:2},
    {question:"À quelle température le fer fond-il ?",choices:["1 064 °C","1 538 °C","2 862 °C"],answer:1},
    {question:"Combien de goûts fondamentaux la langue peut-elle distinguer ?",choices:["4","5","7"],answer:1},
  ],
  en: [
    // ── Existing ──
    {question:"What is the approximate temperature of a lightning bolt?",choices:["Around 6,000 °C","Around 30,000 °C","Around 300 °C"],answer:1},
    {question:"What proportion of your body mass is stardust?",choices:["About 40%","About 70%","About 93%"],answer:2},
    {question:"Where is half the oxygen we breathe produced?",choices:["In tropical forests","In the oceans","In grasslands"],answer:1},
    {question:"What are the glass tubes formed by lightning in sand called?",choices:["Fulgurites","Pyrites","Calcites"],answer:0},
    {question:"How many trees are there approximately on Earth?",choices:["300 billion","3 trillion","30 billion"],answer:1},
    {question:"How many hearts does an octopus have?",choices:["One","Two","Three"],answer:2},
    {question:"What is the pH of human stomach acid?",choices:["Between 5 and 6","Between 1 and 2","Between 3 and 4"],answer:1},
    {question:"Which animal can sleep for up to 3 years?",choices:["The snail","The tortoise","The bear"],answer:0},
    {question:"What colour is liquid oxygen?",choices:["Colourless","Red","Pale blue"],answer:2},
    {question:"Which planet in the solar system would float on water?",choices:["Mars","Saturn","Neptune"],answer:1},
    {question:"At what top speed did Usain Bolt set his 100m record?",choices:["38.5 km/h","44.7 km/h","51.2 km/h"],answer:1},
    {question:"What is the exact marathon distance?",choices:["42.195 km","40 km","45 km"],answer:0},
    {question:"Which sport was played on the Moon?",choices:["Tennis","Golf","Frisbee"],answer:1},
    {question:"In what year did tennis balls turn yellow?",choices:["1960","1972","1985"],answer:1},
    {question:"How fast can a badminton shuttlecock travel?",choices:["320 km/h","493 km/h","250 km/h"],answer:1},
    {question:"Where does the word 'robot' come from?",choices:["Russian, meaning 'machine'","Czech, meaning 'forced labour'","English, meaning 'automaton'"],answer:1},
    {question:"What does the word 'salary' literally mean in Latin?",choices:["Gold coin","Salt ration","Monthly payment"],answer:1},
    {question:"What proportion of English vocabulary comes from French?",choices:["Over 30%","About 10%","About 50%"],answer:0},
    {question:"Where do fortune cookies actually come from?",choices:["China","Japan","The United States"],answer:1},
    {question:"Why did Dutch farmers breed orange carrots?",choices:["It was their natural colour","As a tribute to the House of Orange","A spontaneous genetic mutation"],answer:1},
    {question:"Can honey expire?",choices:["Yes, after 10 years","No, it never expires","Yes, after 50 years"],answer:1},
    {question:"What is white chocolate technically?",choices:["Very diluted chocolate","A product with no solid cocoa","Bleached milk chocolate"],answer:1},
    {question:"Why did Europeans think tomatoes were poisonous?",choices:["They caused allergies","Their acidity dissolved lead from plates","A doctor published a false report"],answer:1},
    {question:"How many pyramids are there in Sudan?",choices:["About 50","About 130","About 200"],answer:2},
    {question:"How long did the war between the UK and Zanzibar last?",choices:["38 minutes","3 hours","2 days"],answer:0},
    {question:"Who built the Egyptian pyramids?",choices:["Slaves","Free paid workers","Prisoners of war"],answer:1},
    {question:"How does a day on Venus compare to its year?",choices:["A day is half a year","A day is longer than a year","A day is a tenth of a year"],answer:1},
    {question:"What does space smell like according to astronomers?",choices:["Burning sulphur","Burnt raspberries and rum","Hot metal"],answer:1},
    {question:"What is the largest volcano in the solar system?",choices:["Mauna Kea","Olympus Mons on Mars","Tharsis Tholus"],answer:1},
    {question:"Where was the microwave accidentally invented?",choices:["In a kitchen laboratory","Near a radar device","In a nuclear plant"],answer:1},
    {question:"Where did Velcro come from?",choices:["A military discovery","Observing burdock burrs on a jacket","A NASA patent"],answer:1},
    {question:"What was bubble wrap originally designed to be?",choices:["Egg packaging","A 3D textured wallpaper","Electronics protection"],answer:1},
    {question:"Which everyday technology came from black hole research?",choices:["GPS","Bluetooth","Wi-Fi"],answer:2},
    {question:"How many time zones does Russia span?",choices:["7","11","14"],answer:1},
    {question:"Which is the only non-rectangular national flag?",choices:["Bhutan's flag","Nepal's flag","Sri Lanka's flag"],answer:1},
    {question:"Why does Iceland have no mosquitoes?",choices:["It's too cold","Climate and geology don't support them","They were eradicated"],answer:1},
    {question:"Where did Cleopatra sit in time?",choices:["Closer to the pyramids than to us","Equidistant from both","Closer to us than to the pyramids"],answer:2},
    {question:"How were Roman gladiators mainly fed?",choices:["Red meat","Barley and legumes","Fish"],answer:1},
    {question:"What did the Frisbie Pie Company inspire?",choices:["The boomerang","The Frisbee","The hula hoop"],answer:1},
    {question:"What does 'OK' originally stand for?",choices:["'All Correct' spelled correctly","'Oll Korrect', a deliberate misspelling","A military abbreviation"],answer:1},
    // ── New questions ──
    {question:"How many neurons does the human brain contain approximately?",choices:["8 billion","86 billion","860 billion"],answer:1},
    {question:"What percentage of human DNA is identical to a chimpanzee's?",choices:["85%","92%","98.7%"],answer:2},
    {question:"How many bacteria live in the human body?",choices:["About the same as human cells","10 times fewer","100 times more"],answer:0},
    {question:"What is the strongest bone in the human body?",choices:["The skull","The femur","The tibia"],answer:1},
    {question:"How many times does the human heart beat on average per day?",choices:["50,000 times","100,000 times","200,000 times"],answer:1},
    {question:"What fraction of the observable universe is made of visible matter?",choices:["About 50%","About 27%","About 5%"],answer:2},
    {question:"How long does sunlight take to reach Earth?",choices:["30 seconds","8 minutes","1 hour"],answer:1},
    {question:"What is the tallest mountain in the solar system?",choices:["Earth's Everest","Olympus Mons on Mars","Maxwell Montes on Venus"],answer:1},
    {question:"What is the deepest point in the ocean?",choices:["Puerto Rico Trench","Mariana Trench","Java Trench"],answer:1},
    {question:"How many litres of blood does the heart pump per day?",choices:["1,000 litres","7,500 litres","20,000 litres"],answer:1},
    {question:"What is the average lifespan of a red blood cell?",choices:["30 days","120 days","365 days"],answer:1},
    {question:"What is the fastest animal in the world?",choices:["The cheetah","The peregrine falcon","The sailfish"],answer:1},
    {question:"How many languages are spoken in the world today?",choices:["About 2,000","About 7,000","About 12,000"],answer:1},
    {question:"Which country has the most active volcanoes?",choices:["Japan","Indonesia","Iceland"],answer:1},
    {question:"What is Earth's rotation speed at the equator?",choices:["500 km/h","1,670 km/h","3,200 km/h"],answer:1},
    {question:"How much water is there on Earth in total?",choices:["140 million km³","1.4 billion km³","14 billion km³"],answer:1},
    {question:"What proportion of Earth's water is freshwater?",choices:["2.5%","10%","25%"],answer:0},
    {question:"Which animal produces the loudest sound?",choices:["The elephant","The pistol shrimp","The blue whale"],answer:2},
    {question:"How many stars are visible to the naked eye on a clear night?",choices:["About 500","About 3,000","About 10,000"],answer:1},
    {question:"How often do stomach cells renew themselves?",choices:["Every 2-4 days","Every 30 days","Every 6 months"],answer:0},
    {question:"What is the most abundant chemical element in the universe?",choices:["Oxygen","Carbon","Hydrogen"],answer:2},
    {question:"How much does an average cloud weigh?",choices:["100 kg","100 tonnes","500,000 kg"],answer:2},
    {question:"Which sense do sharks use to detect electric fields?",choices:["Smell","Electroreception","Echolocation"],answer:1},
    {question:"Which civilisation invented the mathematical zero?",choices:["The Greeks","The Maya","The Indians"],answer:2},
    {question:"How many muscles does it take to smile?",choices:["6","12","26"],answer:1},
    {question:"What is the largest desert in the world?",choices:["The Sahara","Antarctica","The Arabian Desert"],answer:1},
    {question:"How long does a photon take to cross the Sun?",choices:["8 minutes","170,000 years","1 million years"],answer:1},
    {question:"What percentage of the brain is water?",choices:["50%","60%","75%"],answer:2},
    {question:"What is the temperature at Earth's core?",choices:["2,000 °C","5,500 °C","10,000 °C"],answer:1},
    {question:"What is the largest organ in the human body?",choices:["The liver","The lungs","The skin"],answer:2},
    {question:"How many litres of air do we breathe per day?",choices:["5,000 litres","11,000 litres","25,000 litres"],answer:1},
    {question:"Which insect can carry 50 times its own weight?",choices:["The bee","The ant","The rhinoceros beetle"],answer:2},
    {question:"How long does the ISS take to orbit Earth?",choices:["45 minutes","90 minutes","3 hours"],answer:1},
    {question:"Which planet has the fastest winds in the solar system?",choices:["Jupiter","Saturn","Neptune"],answer:2},
    {question:"How many living species are estimated on Earth?",choices:["2 million","8.7 million","50 million"],answer:1},
    {question:"What is the hardest natural material?",choices:["Diamond","Graphene","Lonsdaleite"],answer:2},
    {question:"How many times do we blink per day?",choices:["5,000 times","15,000 to 20,000 times","50,000 times"],answer:1},
    {question:"What are Saturn's rings mainly made of?",choices:["Rock","Ice","Gas"],answer:1},
    {question:"Which mammal can fly?",choices:["The flying squirrel","The bat","The colugo"],answer:1},
    {question:"How many earthquakes occur on Earth each year?",choices:["5,000","50,000","500,000"],answer:2},
    // ── New questions (batch 3) ──
    {question:"Which is the only continent without a desert?",choices:["Antarctica","Europe","Oceania"],answer:1},
    {question:"How many bones does a newborn baby have?",choices:["206","270","300"],answer:2},
    {question:"What is the longest river in the world?",choices:["The Amazon","The Nile","The Yangtze"],answer:1},
    {question:"Which is the only planet that rotates in the opposite direction?",choices:["Uranus","Venus","Mercury"],answer:1},
    {question:"How long can a human survive without sleep before severe effects?",choices:["3 days","7 days","11 days"],answer:2},
    {question:"What percentage of Earth's surface is covered by oceans?",choices:["55%","71%","85%"],answer:1},
    {question:"What is the most abundant substance in the human body?",choices:["Proteins","Water","Fat"],answer:1},
    {question:"Which animal has the largest brain relative to its body?",choices:["The dolphin","The ant","The human"],answer:1},
    {question:"How many times per minute does a hummingbird flap its wings?",choices:["200 times","1,200 times","4,800 times"],answer:2},
    {question:"What is the speed of sound in air at 20°C?",choices:["343 m/s","500 m/s","1,200 m/s"],answer:0},
    {question:"Which metal is liquid at room temperature?",choices:["Gallium","Mercury","Caesium"],answer:1},
    {question:"How many recognised dwarf planets are there in the solar system?",choices:["3","5","8"],answer:1},
    {question:"What is the slowest land animal in the world?",choices:["The giant tortoise","The three-toed sloth","The koala"],answer:1},
    {question:"At what depth does the abyssal zone of the ocean begin?",choices:["1,000 m","4,000 m","8,000 m"],answer:1},
    {question:"What is the average duration of a dream?",choices:["5 to 20 minutes","1 to 2 hours","30 seconds"],answer:0},
    {question:"Which country has the most natural lakes in the world?",choices:["Finland","Canada","Russia"],answer:1},
    {question:"How many muscles does the human body have approximately?",choices:["206","400","640"],answer:2},
    {question:"What is the closest galaxy to the Milky Way?",choices:["Andromeda","The Large Magellanic Cloud","The Triangulum Galaxy"],answer:0},
    {question:"What is the farthest point from Earth's centre?",choices:["The summit of Everest","The summit of Chimborazo","The summit of K2"],answer:1},
    {question:"How long does it take the Moon to orbit the Earth?",choices:["14 days","27.3 days","31 days"],answer:1},
    {question:"Which animal can regenerate its heart?",choices:["The starfish","The zebrafish","The salamander"],answer:1},
    {question:"What is the coldest temperature ever recorded on Earth?",choices:["-71.2 °C","-89.2 °C","-104 °C"],answer:1},
    {question:"How many artificial satellites orbit the Earth?",choices:["About 3,000","About 10,000","More than 30,000"],answer:1},
    {question:"What is the oldest known living tree?",choices:["A giant sequoia","A Bristlecone pine","A baobab"],answer:1},
    {question:"How many litres of saliva do we produce in a lifetime on average?",choices:["5,000 litres","25,000 litres","35,000 litres"],answer:2},
    {question:"What is a cheetah's top speed?",choices:["90 km/h","112 km/h","130 km/h"],answer:1},
    {question:"What percentage of human DNA is shared with a banana?",choices:["30%","50%","60%"],answer:2},
    {question:"How many active volcanoes are there under the oceans?",choices:["About 500","About 5,000","Over one million"],answer:2},
    {question:"What is the largest living structure visible from space?",choices:["The Amazon rainforest","The Great Barrier Reef","The Sundarbans mangroves"],answer:1},
    {question:"What is the lightest metal?",choices:["Aluminium","Titanium","Lithium"],answer:2},
    {question:"How many cells does the human body lose per second?",choices:["3,000","50,000","3.8 million"],answer:2},
    {question:"What is the smallest chemically identifiable unit of matter?",choices:["The proton","The atom","The electron"],answer:1},
    {question:"What is the only venomous mammal?",choices:["The vampire bat","The platypus","The shrew"],answer:1},
    {question:"How many tonnes of cosmic dust fall on Earth each day?",choices:["1 tonne","50 tonnes","100 tonnes"],answer:1},
    {question:"What is the atmospheric pressure on Venus's surface?",choices:["2 times Earth's","50 times Earth's","92 times Earth's"],answer:2},
    {question:"What percentage of the ocean remains unexplored?",choices:["40%","60%","80%"],answer:2},
    {question:"How many atoms make up an average human cell?",choices:["1 million","100 billion","100 trillion"],answer:2},
    {question:"Which animal has the longest gestation period?",choices:["The blue whale","The African elephant","The alpine salamander"],answer:2},
    {question:"At what temperature does iron melt?",choices:["1,064 °C","1,538 °C","2,862 °C"],answer:1},
    {question:"How many fundamental tastes can the tongue distinguish?",choices:["4","5","7"],answer:1},
  ],
  es: [
    // ── Existentes ──
    {question:"¿Cuál es la temperatura aproximada de un rayo?",choices:["Unos 6 000 °C","Unos 30 000 °C","Unos 300 °C"],answer:1},
    {question:"¿Qué proporción de la masa de tu cuerpo es polvo de estrellas?",choices:["Aproximadamente el 40 %","Aproximadamente el 70 %","Aproximadamente el 93 %"],answer:2},
    {question:"¿Dónde se produce la mitad del oxígeno que respiramos?",choices:["En los bosques tropicales","En los océanos","En las praderas"],answer:1},
    {question:"¿Cómo se llaman los tubos de vidrio formados por un rayo en la arena?",choices:["Fulguritas","Piritas","Calcitas"],answer:0},
    {question:"¿Cuántos árboles hay aproximadamente en la Tierra?",choices:["300 000 millones","3 billones","30 000 millones"],answer:1},
    {question:"¿Cuántos corazones tiene un pulpo?",choices:["Uno","Dos","Tres"],answer:2},
    {question:"¿Cuál es el pH del ácido gástrico humano?",choices:["Entre 5 y 6","Entre 1 y 2","Entre 3 y 4"],answer:1},
    {question:"¿Qué animal puede dormir hasta 3 años?",choices:["El caracol","La tortuga","El oso"],answer:0},
    {question:"¿De qué color es el oxígeno líquido?",choices:["Incoloro","Rojo","Azul pálido"],answer:2},
    {question:"¿Qué planeta del sistema solar flotaría en el agua?",choices:["Marte","Saturno","Neptuno"],answer:1},
    {question:"¿A qué velocidad máxima estableció Usain Bolt su récord de los 100m?",choices:["38,5 km/h","44,7 km/h","51,2 km/h"],answer:1},
    {question:"¿Cuál es la distancia exacta de un maratón?",choices:["42,195 km","40 km","45 km"],answer:0},
    {question:"¿Qué deporte se practicó en la Luna?",choices:["Tenis","Golf","Frisbee"],answer:1},
    {question:"¿En qué año las pelotas de tenis se volvieron amarillas?",choices:["1960","1972","1985"],answer:1},
    {question:"¿A qué velocidad puede viajar un volante de bádminton?",choices:["320 km/h","493 km/h","250 km/h"],answer:1},
    {question:"¿De dónde viene la palabra 'robot'?",choices:["Del ruso, que significa 'máquina'","Del checo, que significa 'trabajo forzado'","Del inglés, que significa 'autómata'"],answer:1},
    {question:"¿Qué significa literalmente la palabra 'salario' en latín?",choices:["Moneda de oro","Ración de sal","Pago mensual"],answer:1},
    {question:"¿De dónde viene la expresión 'tener morriña'?",choices:["De los mineros de carbón","De los soldados españoles en ultramar","De los pescadores del Cantábrico"],answer:1},
    {question:"¿Qué porcentaje del vocabulario inglés proviene del francés?",choices:["Más del 30 %","Aproximadamente el 10 %","Aproximadamente el 50 %"],answer:0},
    {question:"¿Qué significa 'OK' originalmente?",choices:["'All Correct' sin faltas","'Oll Korrect', una falta deliberada","Una abreviatura militar"],answer:1},
    {question:"¿Puede caducar la miel?",choices:["Sí, después de 10 años","No, nunca caduca","Sí, después de 50 años"],answer:1},
    {question:"¿De dónde vienen realmente las galletas de la fortuna?",choices:["De China","De Japón","De Estados Unidos"],answer:1},
    {question:"¿Por qué las zanahorias son naranjas?",choices:["Es su color natural","Los holandeses las seleccionaron así","Una mutación genética espontánea"],answer:1},
    {question:"¿Qué es técnicamente el chocolate blanco?",choices:["Chocolate muy diluido","Un producto sin cacao sólido","Chocolate con leche decolorado"],answer:1},
    {question:"¿Por qué los europeos creían que los tomates eran tóxicos?",choices:["Causaban alergias","Su acidez disolvía el plomo de los platos","Un médico publicó un informe falso"],answer:1},
    {question:"¿Cuántas pirámides hay en Sudán?",choices:["Unas 50","Unas 130","Unas 200"],answer:2},
    {question:"¿Cuánto duró la guerra entre el Reino Unido y Zanzíbar?",choices:["38 minutos","3 horas","2 días"],answer:0},
    {question:"¿Quién construyó las pirámides de Egipto?",choices:["Esclavos","Obreros libres y pagados","Prisioneros de guerra"],answer:1},
    {question:"¿Cómo se compara un día en Venus con su año?",choices:["Un día = la mitad de un año","Un día es más largo que un año","Un día = una décima de un año"],answer:1},
    {question:"¿A qué huele el espacio según los astronautas?",choices:["A azufre quemado","A frambuesa quemada y ron","A metal caliente"],answer:1},
    {question:"¿Cuál es el volcán más grande del sistema solar?",choices:["El Mauna Kea","El Olympus Mons en Marte","El Tharsis Tholus"],answer:1},
    {question:"¿Dónde se inventó el microondas por accidente?",choices:["En un laboratorio de cocina","Junto a un radar","En una central nuclear"],answer:1},
    {question:"¿De dónde viene el velcro?",choices:["De un descubrimiento militar","De observar cardos enganchados a una chaqueta","De una patente de la NASA"],answer:1},
    {question:"¿Para qué fue diseñado originalmente el plástico de burbujas?",choices:["Para embalar huevos","Para ser un papel pintado 3D","Para proteger componentes electrónicos"],answer:1},
    {question:"¿Qué tecnología cotidiana nació de la investigación sobre agujeros negros?",choices:["El GPS","El Bluetooth","El Wi-Fi"],answer:2},
    {question:"¿Cuántos husos horarios abarca Rusia?",choices:["7","11","14"],answer:1},
    {question:"¿Cuál es la única bandera nacional no rectangular?",choices:["La de Bután","La de Nepal","La de Sri Lanka"],answer:1},
    {question:"¿Por qué Islandia no tiene mosquitos?",choices:["Hace demasiado frío","El clima y la geología no lo permiten","Fueron erradicados"],answer:1},
    {question:"¿Cómo se sitúa Cleopatra en el tiempo?",choices:["Más cerca de las pirámides que de nosotros","Equidistante de ambos","Más cerca de nosotros que de las pirámides"],answer:2},
    {question:"¿Cómo se alimentaban principalmente los gladiadores romanos?",choices:["Con carne roja","Con cebada y legumbres","Con pescado"],answer:1},
    // ── Nuevas preguntas ──
    {question:"¿Cuántas neuronas contiene aproximadamente el cerebro humano?",choices:["8 000 millones","86 000 millones","860 000 millones"],answer:1},
    {question:"¿Qué porcentaje del ADN humano es idéntico al del chimpancé?",choices:["85 %","92 %","98,7 %"],answer:2},
    {question:"¿Cuántas bacterias viven en el cuerpo humano?",choices:["Tantas como células humanas","10 veces menos","100 veces más"],answer:0},
    {question:"¿Cuál es el hueso más resistente del cuerpo humano?",choices:["El cráneo","El fémur","La tibia"],answer:1},
    {question:"¿Cuántas veces late el corazón humano de media al día?",choices:["50 000 veces","100 000 veces","200 000 veces"],answer:1},
    {question:"¿Qué fracción del universo observable está hecha de materia visible?",choices:["Aproximadamente el 50 %","Aproximadamente el 27 %","Aproximadamente el 5 %"],answer:2},
    {question:"¿Cuánto tarda la luz del Sol en llegar a la Tierra?",choices:["30 segundos","8 minutos","1 hora"],answer:1},
    {question:"¿Cuál es la montaña más alta del sistema solar?",choices:["El Everest terrestre","El Olympus Mons en Marte","El Maxwell Montes en Venus"],answer:1},
    {question:"¿Cuál es el punto más profundo del océano?",choices:["La fosa de Puerto Rico","La fosa de las Marianas","La fosa de Java"],answer:1},
    {question:"¿Cuántos litros de sangre bombea el corazón al día?",choices:["1 000 litros","7 500 litros","20 000 litros"],answer:1},
    {question:"¿Cuál es la vida media de un glóbulo rojo?",choices:["30 días","120 días","365 días"],answer:1},
    {question:"¿Cuál es el animal más rápido del mundo?",choices:["El guepardo","El halcón peregrino","El pez vela"],answer:1},
    {question:"¿Cuántas lenguas se hablan en el mundo hoy?",choices:["Unas 2 000","Unas 7 000","Unas 12 000"],answer:1},
    {question:"¿Qué país tiene más volcanes activos?",choices:["Japón","Indonesia","Islandia"],answer:1},
    {question:"¿Cuál es la velocidad de rotación de la Tierra en el ecuador?",choices:["500 km/h","1 670 km/h","3 200 km/h"],answer:1},
    {question:"¿Cuánta agua hay en la Tierra en total?",choices:["140 millones de km³","1 400 millones de km³","14 000 millones de km³"],answer:1},
    {question:"¿Qué proporción del agua terrestre es dulce?",choices:["2,5 %","10 %","25 %"],answer:0},
    {question:"¿Qué animal produce el sonido más fuerte?",choices:["El elefante","La gamba pistola","La ballena azul"],answer:2},
    {question:"¿Cuántas estrellas son visibles a simple vista en una noche despejada?",choices:["Unas 500","Unas 3 000","Unas 10 000"],answer:1},
    {question:"¿Con qué frecuencia se renuevan las células del estómago?",choices:["Cada 2-4 días","Cada 30 días","Cada 6 meses"],answer:0},
    {question:"¿Cuál es el elemento químico más abundante del universo?",choices:["El oxígeno","El carbono","El hidrógeno"],answer:2},
    {question:"¿Cuánto pesa aproximadamente una nube de tamaño medio?",choices:["100 kg","100 toneladas","500 000 kg"],answer:2},
    {question:"¿Qué sentido usan los tiburones para detectar campos eléctricos?",choices:["El olfato","La electrorrecepción","La ecolocalización"],answer:1},
    {question:"¿Qué civilización inventó el cero en matemáticas?",choices:["Los griegos","Los mayas","Los indios"],answer:2},
    {question:"¿Cuántos músculos se necesitan para sonreír?",choices:["6","12","26"],answer:1},
    {question:"¿Cuál es el desierto más grande del mundo?",choices:["El Sahara","La Antártida","El desierto de Arabia"],answer:1},
    {question:"¿Cuánto tarda un fotón en atravesar el Sol?",choices:["8 minutos","170 000 años","1 millón de años"],answer:1},
    {question:"¿Qué porcentaje del cerebro es agua?",choices:["50 %","60 %","75 %"],answer:2},
    {question:"¿Cuál es la temperatura en el centro de la Tierra?",choices:["2 000 °C","5 500 °C","10 000 °C"],answer:1},
    {question:"¿Cuál es el órgano más grande del cuerpo humano?",choices:["El hígado","Los pulmones","La piel"],answer:2},
    {question:"¿Cuántos litros de aire respiramos al día?",choices:["5 000 litros","11 000 litros","25 000 litros"],answer:1},
    {question:"¿Qué insecto puede cargar 50 veces su peso?",choices:["La abeja","La hormiga","El escarabajo rinoceronte"],answer:2},
    {question:"¿Cuánto tarda la Estación Espacial en dar la vuelta a la Tierra?",choices:["45 minutos","90 minutos","3 horas"],answer:1},
    {question:"¿Qué planeta tiene los vientos más rápidos del sistema solar?",choices:["Júpiter","Saturno","Neptuno"],answer:2},
    {question:"¿Cuántas especies vivas se estiman en la Tierra?",choices:["2 millones","8,7 millones","50 millones"],answer:1},
    {question:"¿Cuál es el material natural más duro?",choices:["El diamante","El grafeno","La lonsdaleíta"],answer:2},
    {question:"¿Cuántas veces parpadeamos al día?",choices:["5 000 veces","15 000 a 20 000 veces","50 000 veces"],answer:1},
    {question:"¿De qué están compuestos principalmente los anillos de Saturno?",choices:["De rocas","De hielo","De gas"],answer:1},
    {question:"¿Qué mamífero puede volar?",choices:["La ardilla voladora","El murciélago","El colugo"],answer:1},
    {question:"¿Cuántos terremotos se producen cada año en la Tierra?",choices:["5 000","50 000","500 000"],answer:2},
    // ── Nuevas preguntas (lote 3) ──
    {question:"¿Cuál es el único continente sin desierto?",choices:["La Antártida","Europa","Oceanía"],answer:1},
    {question:"¿Cuántos huesos tiene un bebé humano al nacer?",choices:["206","270","300"],answer:2},
    {question:"¿Cuál es el río más largo del mundo?",choices:["El Amazonas","El Nilo","El Yangtsé"],answer:1},
    {question:"¿Cuál es el único planeta que gira en sentido contrario a los demás?",choices:["Urano","Venus","Mercurio"],answer:1},
    {question:"¿Cuánto tiempo puede sobrevivir un humano sin dormir antes de efectos graves?",choices:["3 días","7 días","11 días"],answer:2},
    {question:"¿Qué porcentaje de la superficie terrestre está cubierto por océanos?",choices:["55 %","71 %","85 %"],answer:1},
    {question:"¿Cuál es la sustancia más abundante en el cuerpo humano?",choices:["Las proteínas","El agua","Las grasas"],answer:1},
    {question:"¿Qué animal tiene el cerebro más grande en relación con su cuerpo?",choices:["El delfín","La hormiga","El humano"],answer:1},
    {question:"¿Cuántas veces por minuto bate las alas un colibrí?",choices:["200 veces","1 200 veces","4 800 veces"],answer:2},
    {question:"¿Cuál es la velocidad del sonido en el aire a 20 °C?",choices:["343 m/s","500 m/s","1 200 m/s"],answer:0},
    {question:"¿Qué metal es líquido a temperatura ambiente?",choices:["El galio","El mercurio","El cesio"],answer:1},
    {question:"¿Cuántos planetas enanos reconocidos hay en el sistema solar?",choices:["3","5","8"],answer:1},
    {question:"¿Cuál es el animal terrestre más lento del mundo?",choices:["La tortuga gigante","El perezoso de tres dedos","El koala"],answer:1},
    {question:"¿A qué profundidad empieza la zona abisal del océano?",choices:["1 000 m","4 000 m","8 000 m"],answer:1},
    {question:"¿Cuál es la duración media de un sueño?",choices:["5 a 20 minutos","1 a 2 horas","30 segundos"],answer:0},
    {question:"¿Qué país tiene más lagos naturales del mundo?",choices:["Finlandia","Canadá","Rusia"],answer:1},
    {question:"¿Cuántos músculos tiene aproximadamente el cuerpo humano?",choices:["206","400","640"],answer:2},
    {question:"¿Cuál es la galaxia más cercana a la Vía Láctea?",choices:["Andrómeda","La Gran Nube de Magallanes","La galaxia del Triángulo"],answer:0},
    {question:"¿Cuál es el punto más alejado del centro de la Tierra?",choices:["La cima del Everest","La cima del Chimborazo","La cima del K2"],answer:1},
    {question:"¿Cuánto tarda la Luna en dar la vuelta a la Tierra?",choices:["14 días","27,3 días","31 días"],answer:1},
    {question:"¿Qué animal puede regenerar su corazón?",choices:["La estrella de mar","El pez cebra","La salamandra"],answer:1},
    {question:"¿Cuál es la temperatura más fría jamás registrada en la Tierra?",choices:["-71,2 °C","-89,2 °C","-104 °C"],answer:1},
    {question:"¿Cuántos satélites artificiales orbitan alrededor de la Tierra?",choices:["Unos 3 000","Unos 10 000","Más de 30 000"],answer:1},
    {question:"¿Cuál es el árbol vivo más antiguo conocido?",choices:["Una secuoya gigante","Un pino Bristlecone","Un baobab"],answer:1},
    {question:"¿Cuántos litros de saliva producimos de media en una vida?",choices:["5 000 litros","25 000 litros","35 000 litros"],answer:2},
    {question:"¿Cuál es la velocidad máxima de un guepardo?",choices:["90 km/h","112 km/h","130 km/h"],answer:1},
    {question:"¿Qué porcentaje de ADN humano se comparte con el plátano?",choices:["30 %","50 %","60 %"],answer:2},
    {question:"¿Cuántos volcanes activos hay bajo los océanos?",choices:["Unos 500","Unos 5 000","Más de un millón"],answer:2},
    {question:"¿Cuál es la mayor estructura viva visible desde el espacio?",choices:["La selva amazónica","La Gran Barrera de Coral","Los manglares de los Sundarbans"],answer:1},
    {question:"¿Cuál es el metal más ligero?",choices:["El aluminio","El titanio","El litio"],answer:2},
    {question:"¿Cuántas células pierde el cuerpo humano por segundo?",choices:["3 000","50 000","3,8 millones"],answer:2},
    {question:"¿Cuál es la unidad más pequeña de materia químicamente identificable?",choices:["El protón","El átomo","El electrón"],answer:1},
    {question:"¿Cuál es el único mamífero venenoso?",choices:["El murciélago vampiro","El ornitorrinco","La musaraña"],answer:1},
    {question:"¿Cuántas toneladas de polvo cósmico caen en la Tierra cada día?",choices:["1 tonelada","50 toneladas","100 toneladas"],answer:1},
    {question:"¿Cuál es la presión atmosférica en la superficie de Venus?",choices:["2 veces la de la Tierra","50 veces la de la Tierra","92 veces la de la Tierra"],answer:2},
    {question:"¿Qué porcentaje del océano queda por explorar?",choices:["40 %","60 %","80 %"],answer:2},
    {question:"¿Cuántos átomos componen una célula humana de media?",choices:["1 millón","100 000 millones","100 billones"],answer:2},
    {question:"¿Qué animal tiene la gestación más larga?",choices:["La ballena azul","El elefante africano","La salamandra alpina"],answer:2},
    {question:"¿A qué temperatura funde el hierro?",choices:["1 064 °C","1 538 °C","2 862 °C"],answer:1},
    {question:"¿Cuántos sabores fundamentales puede distinguir la lengua?",choices:["4","5","7"],answer:1},
  ]

};




