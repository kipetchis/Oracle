// ── QUIZ, COMET & UFO SYSTEMS ──────────────────────────────────────────────
// Depends on globals: state, lang, T, haptic(), saveState(), showToast(),
//                     checkAchievements(), startSpaceGame(), CAT_ICONS
// ── QUIZ ──────────────────────────────────────────────────────────────────
let quizSession = { questions:[], current:0, answers:[] };

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
  const lbl = lang==='fr' ? '✦ Quiz' : '✦ Quiz';
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
  const pool = QUIZ_DB[lang] || QUIZ_DB['fr'];
  if (!pool || !pool.length) return;
  const questions = shuffle([...pool]).slice(0, Math.min(5, pool.length));
  quizSession = { questions, current:0, answers:[] };
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
  if(skipBtn) { skipBtn.style.display='block'; skipBtn.textContent = lang==='fr' ? '↪ Passer cette question' : '↪ Skip this question'; }
  if(nextBtn) nextBtn.style.display='none';
  const total = questions.length;

  // Label
  document.getElementById('quizLabel').textContent =
    lang === 'fr' ? `Question ${current+1} / ${total}` : `Question ${current+1} / ${total}`;

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
      ? (lang === 'fr' ? 'Question suivante →' : 'Next question →')
      : (lang === 'fr' ? 'Voir les résultats' : 'See results');
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
    fb.textContent = lang === 'fr' ? '✓ Bonne réponse !' : '✓ Correct!';
    fb.className = 'quiz-feedback correct';
    haptic('success');
  } else {
    fb.textContent = lang === 'fr' ? '✗ Raté !' : '✗ Wrong!';
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
    lang === 'fr' ? 'Résultats' : 'Results';
  document.getElementById('quizResultScore').textContent = `${score} / ${total}`;

  const msgs = {
    fr: ['Pas de chance… retente !', 'Pas mal, continue !', 'Bien joué !', 'Excellent !', 'Parfait — tu es l\'Oracle !'],
    en: ['Better luck next time!', 'Not bad, keep going!', 'Well done!', 'Excellent!', 'Perfect — you are the Oracle!']
  };
  const msgIdx = Math.round((score / total) * 4);
  document.getElementById('quizResultMsg').textContent = (msgs[lang] || msgs.fr)[msgIdx];
  document.getElementById('quizCloseBtn').textContent =
    lang === 'fr' ? 'Reprendre l\'Oracle' : 'Back to Oracle';

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
  const lbl = lang==='fr' ? '🛸 Jouer' : '🛸 Play';
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
  ],
  en: [
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
  ]
};






