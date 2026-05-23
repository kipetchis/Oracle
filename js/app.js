// Main Oracle application logic. Data files are loaded before this file.
// ── HAPTIC ────────────────────────────────────────────────────────────────
function haptic(s='light'){if(!navigator.vibrate)return;const p={light:[10],medium:[20],celebration:[20,30,20,30,40]};navigator.vibrate(p[s]||[10]);}

// ── CATEGORY ICONS ────────────────────────────────────────────────────────
const CAT_ICONS={
  science:'🔬', positive:'🌱', fun:'🎲',
  history:'🏛️', space:'🚀', animals:'🐾',
  body:'🫀', arts:'🎨', inventions:'💡',
  world:'🗺️', language:'📖', food:'🍽️', sports:'🏆',
  celebrities:'🌟', fiction:'📚', gaming:'🎮', cinema:'🎬', music:'🎵',
  mythology:'🏛️', psychology:'🧠', oceans:'🌊', records:'🏅',
  quotes:'💬', laws:'⚖️', tales:'🐉', dinosaurs:'🦕'
};

// ── I18N ──────────────────────────────────────────────────────────────────
const T={
  fr:{
    headerSub:"Le monde a quelque chose à te dire",
    orbPress:"Appuie", orbAgain:"Encore",
    exploreBtn:"Explorer", explorePanelTitle:"🧭 Explorer une catégorie", exploreProgress:function(n){return n+' / 20 lus';},
    hint:"touche l'orbe pour révéler",
    cardEmpty:"L'oracle attend ta question silencieuse…",
    favTitle:"♡ Favoris", achTitle:"⬡ Succès",
    favEmpty:"Aucun favori pour l'instant.\nAppuie sur ♡ sous un fait pour le conserver ici.",
    favBtn:"Favori", shareBtn:"Partager",
    shareTitle:"Partager ce fait", copyLabel:"Copier le texte", copiedLabel:"Copié !",
    shareClose:"Fermer",
    toastCopied:"✓ Copié dans le presse-papiers",
    celebLabel:"Succès débloqué", celebBtn:"Continuer",
    unlockLabel:"Nouvelle planète débloquée !", unlockBtn:"Explorer",
    planetPanelTitle:"⬡ Skins de planète",
    planetActive:"Active", planetUnlocked:"✓ Débloquée", planetDefault:"Par défaut",
    perk1:"Zéro publicité, pour toujours",
    perk2:"Planètes Lune et Mars débloquées d'emblée",
    perk3:"Soutiens le développement d'Oracle",
    counter:(i,t)=>`${i} / ${t}`,
    catLabels:{
      science:'✦ Science & Nature', positive:'✦ Bonne nouvelle', fun:'✦ Savoir inutile',
      history:'✦ Histoire & Civilisations', space:'✦ Espace & Astronomie', animals:'✦ Animaux étonnants',
      body:'✦ Corps humain & Médecine', arts:'✦ Arts & Culture', inventions:'✦ Inventions & Euréka',
      world:'✦ Monde & Curiosités', language:'✦ Mots & Langages', food:'✦ Cuisine & Saveurs', sports:'✦ Sports & Défis',
      celebrities:'✦ Célébrités', fiction:'✦ Fictions & Littérature', gaming:'✦ Jeux Vidéo', cinema:'✦ Cinéma', music:'✦ Musique',
      mythology:'✦ Mythologie', psychology:'✦ Psychologie', oceans:'✦ Océans & Abysses', records:'✦ Records & Extrêmes',
      quotes:'✦ Citations célèbres', laws:'✦ Lois insolites', tales:'✦ Contes & Légendes', dinosaurs:'✦ Dinosaures'
    },
    planets:{
      earth:{name:'Terre',cond:'Par défaut',unlockDesc:'Ta planète de départ. Toujours disponible.'},
      moon:{name:'Lune',cond:'Atteindre 50 faits lus',unlockDesc:"Tu as consulté l'Oracle 50 fois. La Lune est à toi."},
      mars:{name:'Mars',cond:"7 jours de suite",unlockDesc:"7 jours de curiosité d'affilée. Mars t'appartient."},
      saturn:{name:'Saturne',cond:'Partager 5 faits',unlockDesc:"5 partages dans le cosmos. Saturne t'accueille."},
      mercury:{name:'Mercure',cond:'Lire 20 faits',unlockDesc:"Rapide comme Mercure. 20 faits lus, la planète la plus proche du Soleil est à toi."},
      venus:{name:'Vénus',cond:'Lire 30 éphémérides',unlockDesc:"30 éphémérides consultées. Vénus, étoile du berger, brille pour toi."},
      neptune:{name:'Neptune',cond:'Collecter 5 fragments',unlockDesc:"Rencontre du 3ᵉ type. Neptune t'ouvre ses portes."},
      jupiter:{name:'Jupiter',cond:'1 fait par catégorie',unlockDesc:"Un fait dans chaque catégorie. Jupiter, roi des planètes, te couronne."},
      uranus:{name:'Uranus',cond:'50 bonnes réponses au quiz',unlockDesc:"50 bonnes réponses. Uranus, la mystérieuse, révèle ses secrets."},
      pluto:{name:'Pluton',cond:'???',unlockDesc:"Tu as trouvé le secret. Pluton, la planète oubliée, se souvient de toi."},
      pangaea:{name:'Pangée',cond:'Lire tous les faits Dinosaures',unlockDesc:"Un supercontinent oublié renaît. La Pangée, berceau des dinosaures, se dévoile."},
      sun:{name:'Soleil',cond:'Tous les succès de catégorie',unlockDesc:"Tu es devenu l'Oracle lui-même."}
    },
    achGroups:{
      curiosity:'✦ Curiosité', science:'✦ Science & Nature', positive:'✦ Bonnes nouvelles',
      fun:'✦ Savoir inutile', history:'✦ Histoire', space:'✦ Espace',
      animals:'✦ Animaux étonnants', body:'✦ Corps humain', arts:'✦ Arts & Culture',
      inventions:'✦ Inventions & Euréka', world:'✦ Monde & Curiosités',
      language:'✦ Mots & Langages', food:'✦ Cuisine & Saveurs', sports:'✦ Sports & Défis',
      collection:'✦ Collection', sharing:'✦ Partage', fidelity:'✦ Fidélité', planets:'✦ Planètes',
      celebrities:'✦ Célébrités', fiction:'✦ Fictions', gaming:'✦ Jeux Vidéo', cinema_g:'✦ Cinéma', music_g:'✦ Musique',
      mythology_g:'✦ Mythologie', psychology_g:'✦ Psychologie', oceans_g:'✦ Océans', records_g:'✦ Records',
      quotes_g:'✦ Citations', laws_g:'✦ Lois insolites', tales_g:'✦ Contes & Légendes', dinosaurs_g:'✦ Dinosaures'
    },
    shareTag:"✨ Découvert avec Oracle — l'app des curiosités du monde"
  },
  en:{
    headerSub:"The world has something to tell you",
    orbPress:"Tap", orbAgain:"Again",
    exploreBtn:"Explore", explorePanelTitle:"🧭 Explore a category", exploreProgress:function(n){return n+' / 20 read';},
    hint:"touch the orb to reveal",
    cardEmpty:"The oracle awaits your silent question…",
    favTitle:"♡ Favorites", achTitle:"⬡ Achievements",
    favEmpty:"No favorites yet.\nTap ♡ under any fact to save it here.",
    favBtn:"Favorite", shareBtn:"Share",
    shareTitle:"Share this fact", copyLabel:"Copy text", copiedLabel:"Copied!",
    shareClose:"Close",
    toastCopied:"✓ Copied to clipboard",
    celebLabel:"Achievement unlocked", celebBtn:"Continue",
    unlockLabel:"New planet unlocked!", unlockBtn:"Explore",
    planetPanelTitle:"⬡ Planet skins",
    planetActive:"Active", planetUnlocked:"✓ Unlocked", planetDefault:"Default",
    perk1:"Zero ads, forever",
    perk2:"Moon and Mars planets unlocked immediately",
    perk3:"Support Oracle's development",
    counter:(i,t)=>`${i} / ${t}`,
    catLabels:{
      science:'✦ Science & Nature', positive:'✦ Good news', fun:'✦ Useless knowledge',
      history:'✦ History & Civilizations', space:'✦ Space & Astronomy', animals:'✦ Amazing animals',
      body:'✦ Human body & Medicine', arts:'✦ Arts & Culture', inventions:'✦ Inventions & Eureka',
      world:'✦ World & Curiosities', language:'✦ Words & Languages', food:'✦ Food & Flavors', sports:'✦ Sports & Challenges',
      celebrities:'✦ Celebrities', fiction:'✦ Fiction & Literature', gaming:'✦ Video Games', cinema:'✦ Cinema', music:'✦ Music',
      mythology:'✦ Mythology', psychology:'✦ Psychology', oceans:'✦ Oceans & Abyss', records:'✦ Records & Extremes',
      quotes:'✦ Famous Quotes', laws:'✦ Weird Laws', tales:'✦ Tales & Legends', dinosaurs:'✦ Dinosaurs'
    },
    planets:{
      earth:{name:'Earth',cond:'Default',unlockDesc:'Your starting planet. Always available.'},
      moon:{name:'Moon',cond:'Read 50 facts',unlockDesc:"You've consulted the Oracle 50 times. The Moon is yours."},
      mars:{name:'Mars',cond:'7 days in a row',unlockDesc:"7 days of curiosity in a row. Mars belongs to you."},
      saturn:{name:'Saturn',cond:'Share 5 facts',unlockDesc:"5 shares across the cosmos. Saturn welcomes you."},
      mercury:{name:'Mercury',cond:'Read 20 facts',unlockDesc:"Swift as Mercury. 20 facts read, the closest planet to the Sun is yours."},
      venus:{name:'Venus',cond:'Read 30 daily facts',unlockDesc:"30 daily facts consulted. Venus, the morning star, shines for you."},
      neptune:{name:'Neptune',cond:'Collect 5 fragments',unlockDesc:"Close encounter of the third kind. Neptune opens its gates."},
      jupiter:{name:'Jupiter',cond:'1 fact per category',unlockDesc:"A fact in every category. Jupiter, king of planets, crowns you."},
      uranus:{name:'Uranus',cond:'50 correct quiz answers',unlockDesc:"50 right answers. Uranus, the mysterious, reveals its secrets."},
      pluto:{name:'Pluto',cond:'???',unlockDesc:"You found the secret. Pluto, the forgotten planet, remembers you."},
      pangaea:{name:'Pangaea',cond:'Read all Dinosaur facts',unlockDesc:"A forgotten supercontinent reborn. Pangaea, cradle of dinosaurs, reveals itself."},
      sun:{name:'Sun',cond:'All category achievements',unlockDesc:"You have become the Oracle itself."}
    },
    achGroups:{
      curiosity:'✦ Curiosity', science:'✦ Science & Nature', positive:'✦ Good news',
      fun:'✦ Useless knowledge', history:'✦ History', space:'✦ Space',
      animals:'✦ Amazing animals', body:'✦ Human body', arts:'✦ Arts & Culture',
      inventions:'✦ Inventions', world:'✦ World curiosities',
      language:'✦ Words & Languages', food:'✦ Food & Flavors', sports:'✦ Sports',
      collection:'✦ Collection', sharing:'✦ Sharing', fidelity:'✦ Loyalty', planets:'✦ Planets',
      celebrities:'✦ Celebrities', fiction:'✦ Fiction', gaming:'✦ Gaming', cinema_g:'✦ Cinema', music_g:'✦ Music',
      mythology_g:'✦ Mythology', psychology_g:'✦ Psychology', oceans_g:'✦ Oceans', records_g:'✦ Records',
      quotes_g:'✦ Quotes', laws_g:'✦ Weird Laws', tales_g:'✦ Tales & Legends', dinosaurs_g:'✦ Dinosaurs'
    },
    shareTag:"✨ Discovered with Oracle — the curiosity app"
  }
};

// Data is loaded from external files in js/data/*.js before this main script.

// ── ACHIEVEMENTS DEFINITIONS ──────────────────────────────────────────────
const CAT_ACH_IDS=['sci_5','sci_10','pos_5','pos_10','fun_5','fun_10','hist_5','hist_10','space_5','space_10','anim_5','anim_10','body_5','body_10','arts_5','arts_10','inv_5','inv_10','world_5','world_10','lang_5','lang_10','food_5','food_10','sport_5','sport_10','cel_5','cel_10','fic_5','fic_10','gam_5','gam_10','cin_5','cin_10','mus_5','mus_10','myth_5','myth_10','psy_5','psy_10','ocean_5','ocean_10','rec_5','rec_10','quote_5','quote_10','law_5','law_10','tale_5','tale_10','dino_5','dino_10'];

const buildAchDef=(lang)=>{
  const L=T[lang];
  const g=L.achGroups;
  return[
    {id:'total_5',icon:'🔭',name:lang==='fr'?'Curieux débutant':'Curious beginner',desc:lang==='fr'?'Lire 5 faits au total':'Read 5 facts total',type:'total',target:5,group:g.curiosity},
    {id:'total_50',icon:'🌌',name:lang==='fr'?"Esprit ouvert":'Open mind',desc:lang==='fr'?'Lire 50 faits au total':'Read 50 facts total',type:'total',target:50,group:g.curiosity},
    {id:'total_all',icon:'🪐',name:lang==='fr'?"L'Oracle complet":'The complete Oracle',desc:lang==='fr'?'Lire tous les faits':'Read all facts',type:'total',target:FACTS_FR.length,group:g.curiosity},
    {id:'sci_5',icon:'🔬',name:lang==='fr'?'Apprenti scientifique':'Science apprentice',desc:lang==='fr'?'Lire 5 faits Science':'Read 5 Science facts',type:'science',target:5,group:g.science},
    {id:'sci_10',icon:'⚗️',name:lang==='fr'?'Esprit scientifique':'Scientific mind',desc:lang==='fr'?'Lire 10 faits Science':'Read 10 Science facts',type:'science',target:10,group:g.science},
    {id:'pos_5',icon:'🌱',name:lang==='fr'?'Optimiste':'Optimist',desc:lang==='fr'?'Lire 5 bonnes nouvelles':'Read 5 good news',type:'positive',target:5,group:g.positive},
    {id:'pos_10',icon:'🌍',name:lang==='fr'?'Citoyen du monde':'World citizen',desc:lang==='fr'?'Lire 10 bonnes nouvelles':'Read 10 good news',type:'positive',target:10,group:g.positive},
    {id:'fun_5',icon:'🎲',name:lang==='fr'?'Inutilement savant':'Usefully useless',desc:lang==='fr'?'Lire 5 savoirs inutiles':'Read 5 useless facts',type:'fun',target:5,group:g.fun},
    {id:'fun_10',icon:'🦑',name:lang==='fr'?'Maître du trivial':'Trivia master',desc:lang==='fr'?'Lire 10 savoirs inutiles':'Read 10 useless facts',type:'fun',target:10,group:g.fun},
    {id:'hist_5',icon:'🏛️',name:lang==='fr'?'Apprenti historien':'History apprentice',desc:lang==='fr'?'Lire 5 faits Histoire':'Read 5 History facts',type:'history',target:5,group:g.history},
    {id:'hist_10',icon:'📜',name:lang==='fr'?'Chroniqueur':'Chronicler',desc:lang==='fr'?'Lire 10 faits Histoire':'Read 10 History facts',type:'history',target:10,group:g.history},
    {id:'space_5',icon:'🚀',name:lang==='fr'?'Apprenti cosmonaute':'Space cadet',desc:lang==='fr'?'Lire 5 faits Espace':'Read 5 Space facts',type:'space',target:5,group:g.space},
    {id:'space_10',icon:'🌠',name:lang==='fr'?'Explorateur stellaire':'Stellar explorer',desc:lang==='fr'?'Lire 10 faits Espace':'Read 10 Space facts',type:'space',target:10,group:g.space},
    {id:'anim_5',icon:'🐙',name:lang==='fr'?'Ami des bêtes':'Animal friend',desc:lang==='fr'?'Lire 5 faits Animaux':'Read 5 Animal facts',type:'animals',target:5,group:g.animals},
    {id:'anim_10',icon:'🦋',name:lang==='fr'?'Naturaliste':'Naturalist',desc:lang==='fr'?'Lire 10 faits Animaux':'Read 10 Animal facts',type:'animals',target:10,group:g.animals},
    {id:'body_5',icon:'🧬',name:lang==='fr'?'Apprenti anatomiste':'Body apprentice',desc:lang==='fr'?'Lire 5 faits Corps humain':'Read 5 Body facts',type:'body',target:5,group:g.body},
    {id:'body_10',icon:'🫀',name:lang==='fr'?'Médecin de soi-même':'Self doctor',desc:lang==='fr'?'Lire 10 faits Corps humain':'Read 10 Body facts',type:'body',target:10,group:g.body},
    {id:'arts_5',icon:'🎨',name:lang==='fr'?'Apprenti mécène':'Arts apprentice',desc:lang==='fr'?'Lire 5 faits Arts':'Read 5 Arts facts',type:'arts',target:5,group:g.arts},
    {id:'arts_10',icon:'🎭',name:lang==='fr'?'Homme de culture':'Cultured person',desc:lang==='fr'?'Lire 10 faits Arts':'Read 10 Arts facts',type:'arts',target:10,group:g.arts},
    {id:'inv_5',icon:'💡',name:lang==='fr'?'Apprenti inventeur':'Inventor apprentice',desc:lang==='fr'?'Lire 5 faits Inventions':'Read 5 Inventions facts',type:'inventions',target:5,group:g.inventions},
    {id:'inv_10',icon:'⚙️',name:lang==='fr'?'Génie incompris':'Misunderstood genius',desc:lang==='fr'?'Lire 10 faits Inventions':'Read 10 Inventions facts',type:'inventions',target:10,group:g.inventions},
    {id:'world_5',icon:'🗺️',name:lang==='fr'?'Explorateur':'Explorer',desc:lang==='fr'?'Lire 5 faits Monde':'Read 5 World facts',type:'world',target:5,group:g.world},
    {id:'world_10',icon:'🌐',name:lang==='fr'?'Citoyen universel':'Universal citizen',desc:lang==='fr'?'Lire 10 faits Monde':'Read 10 World facts',type:'world',target:10,group:g.world},
    {id:'lang_5',icon:'📖',name:lang==='fr'?'Apprenti linguiste':'Language apprentice',desc:lang==='fr'?'Lire 5 faits Langages':'Read 5 Language facts',type:'language',target:5,group:g.language},
    {id:'lang_10',icon:'🗣️',name:lang==='fr'?'Polyglotte du savoir':'Knowledge polyglot',desc:lang==='fr'?'Lire 10 faits Langages':'Read 10 Language facts',type:'language',target:10,group:g.language},
    {id:'food_5',icon:'🍽️',name:lang==='fr'?'Apprenti gourmet':'Food apprentice',desc:lang==='fr'?'Lire 5 faits Cuisine':'Read 5 Food facts',type:'food',target:5,group:g.food},
    {id:'food_10',icon:'👨‍🍳',name:lang==='fr'?'Chef étoilé du savoir':'Knowledge chef',desc:lang==='fr'?'Lire 10 faits Cuisine':'Read 10 Food facts',type:'food',target:10,group:g.food},
    {id:'sport_5',icon:'🏅',name:lang==='fr'?'Apprenti champion':'Sports apprentice',desc:lang==='fr'?'Lire 5 faits Sports':'Read 5 Sports facts',type:'sports',target:5,group:g.sports},
    {id:'sport_10',icon:'🏆',name:lang==='fr'?'Champion du savoir':'Knowledge champion',desc:lang==='fr'?'Lire 10 faits Sports':'Read 10 Sports facts',type:'sports',target:10,group:g.sports},
    {id:'fav_1',icon:'⭐',name:lang==='fr'?'Premier coup de cœur':'First favourite',desc:lang==='fr'?'Sauvegarder 1 favori':'Save 1 favourite',type:'fav',target:1,group:g.collection},
    {id:'fav_5',icon:'💫',name:lang==='fr'?'Collectionneur':'Collector',desc:lang==='fr'?'Sauvegarder 5 favoris':'Save 5 favourites',type:'fav',target:5,group:g.collection},
    {id:'fav_10',icon:'✨',name:lang==='fr'?'Trésorier de curiosités':'Curiosity keeper',desc:lang==='fr'?'Sauvegarder 10 favoris':'Save 10 favourites',type:'fav',target:10,group:g.collection},
    {id:'share_1',icon:'📤',name:lang==='fr'?'Première diffusion':'First share',desc:lang==='fr'?'Partager 1 fait':'Share 1 fact',type:'shares',target:1,group:g.sharing},
    {id:'share_10',icon:'📡',name:lang==='fr'?"Ambassadeur de l'Oracle":'Oracle ambassador',desc:lang==='fr'?'Partager 10 faits':'Share 10 facts',type:'shares',target:10,group:g.sharing},
    {id:'streak_3',icon:'🔥',name:lang==='fr'?'Rituel de 3 jours':'3-day ritual',desc:lang==='fr'?'Revenir 3 jours de suite':'Return 3 days in a row',type:'streak',target:3,group:g.fidelity},
    {id:'streak_7',icon:'🌟',name:lang==='fr'?'Rituel hebdomadaire':'Weekly ritual',desc:lang==='fr'?'Revenir 7 jours de suite':'Return 7 days in a row',type:'streak',target:7,group:g.fidelity},
    // ─ Célébrités
    {id:'cel_5',icon:'🌟',name:lang==='fr'?'Fan de potins':'Gossip fan',desc:lang==='fr'?'Lire 5 faits Célébrités':'Read 5 Celebrity facts',type:'celebrities',target:5,group:g.celebrities},
    {id:'cel_10',icon:'🎬',name:lang==='fr'?'Ami des stars':'Star follower',desc:lang==='fr'?'Lire 10 faits Célébrités':'Read 10 Celebrity facts',type:'celebrities',target:10,group:g.celebrities},
    {id:'cel_all',icon:'🏆',name:lang==='fr'?'Paparazzi':'Paparazzi',desc:lang==='fr'?'Lire tous les faits Célébrités':'Read all Celebrity facts',type:'celebrities',target:20,group:g.celebrities},
    // ─ Fictions
    {id:'fic_5',icon:'📚',name:lang==='fr'?'Apprenti lecteur':'Bookworm beginner',desc:lang==='fr'?'Lire 5 faits Fiction':'Read 5 Fiction facts',type:'fiction',target:5,group:g.fiction},
    {id:'fic_10',icon:'🔖',name:lang==='fr'?'Bibliophile':'Bibliophile',desc:lang==='fr'?'Lire 10 faits Fiction':'Read 10 Fiction facts',type:'fiction',target:10,group:g.fiction},
    // ─ Jeux Vidéo
    {id:'gam_5',icon:'🎮',name:lang==='fr'?'Casual gamer':'Casual gamer',desc:lang==='fr'?'Lire 5 faits Jeux Vidéo':'Read 5 Gaming facts',type:'gaming',target:5,group:g.gaming},
    {id:'gam_10',icon:'🕹️',name:lang==='fr'?'Hardcore gamer':'Hardcore gamer',desc:lang==='fr'?'Lire 10 faits Jeux Vidéo':'Read 10 Gaming facts',type:'gaming',target:10,group:g.gaming},
    {id:'gam_all',icon:'👾',name:lang==='fr'?'Game Master':'Game Master',desc:lang==='fr'?'Lire tous les faits Jeux Vidéo':'Read all Gaming facts',type:'gaming',target:20,group:g.gaming},
    // ─ Cinéma
    {id:'cin_5',icon:'🎬',name:lang==='fr'?'Cinéphile débutant':'Film beginner',desc:lang==='fr'?'Lire 5 faits Cinéma':'Read 5 Cinema facts',type:'cinema',target:5,group:g.cinema_g},
    {id:'cin_10',icon:'🎞️',name:lang==='fr'?'Cinéaste':'Film buff',desc:lang==='fr'?'Lire 10 faits Cinéma':'Read 10 Cinema facts',type:'cinema',target:10,group:g.cinema_g},
    // ─ Musique
    {id:'mus_5',icon:'🎵',name:lang==='fr'?'Mélomane':'Music lover',desc:lang==='fr'?'Lire 5 faits Musique':'Read 5 Music facts',type:'music',target:5,group:g.music_g},
    {id:'mus_10',icon:'🎸',name:lang==='fr'?'Rockstar du savoir':'Knowledge rockstar',desc:lang==='fr'?'Lire 10 faits Musique':'Read 10 Music facts',type:'music',target:10,group:g.music_g},
    {id:'mus_all',icon:'🎤',name:lang==='fr'?'Légende musicale':'Musical legend',desc:lang==='fr'?'Lire tous les faits Musique':'Read all Music facts',type:'music',target:18,group:g.music_g},

    // ─ Mythologie
    {id:'myth_5',icon:'🏛️',name:lang==='fr'?'Apprenti mythologue':'Myth apprentice',desc:lang==='fr'?'Lire 5 faits Mythologie':'Read 5 Mythology facts',type:'mythology',target:5,group:g.mythology_g},
    {id:'myth_10',icon:'⚡',name:lang==='fr'?'Conteur des dieux':'Storyteller of gods',desc:lang==='fr'?'Lire 10 faits Mythologie':'Read 10 Mythology facts',type:'mythology',target:10,group:g.mythology_g},
    // ─ Psychologie
    {id:'psy_5',icon:'🧠',name:lang==='fr'?'Apprenti psy':'Psych apprentice',desc:lang==='fr'?'Lire 5 faits Psychologie':'Read 5 Psychology facts',type:'psychology',target:5,group:g.psychology_g},
    {id:'psy_10',icon:'🔮',name:lang==='fr'?'Mentaliste':'Mentalist',desc:lang==='fr'?'Lire 10 faits Psychologie':'Read 10 Psychology facts',type:'psychology',target:10,group:g.psychology_g},
    // ─ Océans
    {id:'ocean_5',icon:'🌊',name:lang==='fr'?'Marin d\'eau douce':'Freshwater sailor',desc:lang==='fr'?'Lire 5 faits Océans':'Read 5 Ocean facts',type:'oceans',target:5,group:g.oceans_g},
    {id:'ocean_10',icon:'🐙',name:lang==='fr'?'Explorateur des abysses':'Abyss explorer',desc:lang==='fr'?'Lire 10 faits Océans':'Read 10 Ocean facts',type:'oceans',target:10,group:g.oceans_g},
    // ─ Records
    {id:'rec_5',icon:'🏅',name:lang==='fr'?'Chasseur de records':'Record hunter',desc:lang==='fr'?'Lire 5 faits Records':'Read 5 Record facts',type:'records',target:5,group:g.records_g},
    {id:'rec_10',icon:'🥇',name:lang==='fr'?'Recordman du savoir':'Knowledge recordman',desc:lang==='fr'?'Lire 10 faits Records':'Read 10 Record facts',type:'records',target:10,group:g.records_g},
    // ─ Citations
    {id:'quote_5',icon:'💬',name:lang==='fr'?'Apprenti philosophe':'Apprentice philosopher',desc:lang==='fr'?'Lire 5 citations':'Read 5 quotes',type:'quotes',target:5,group:g.quotes_g},
    {id:'quote_10',icon:'📜',name:lang==='fr'?'Sage parmi les sages':'Wisest of the wise',desc:lang==='fr'?'Lire 10 citations':'Read 10 quotes',type:'quotes',target:10,group:g.quotes_g},
    // ─ Lois insolites
    {id:'law_5',icon:'⚖️',name:lang==='fr'?'Apprenti juriste':'Law apprentice',desc:lang==='fr'?'Lire 5 lois insolites':'Read 5 weird laws',type:'laws',target:5,group:g.laws_g},
    {id:'law_10',icon:'🔨',name:lang==='fr'?'Juge insolite':'Quirky judge',desc:lang==='fr'?'Lire 10 lois insolites':'Read 10 weird laws',type:'laws',target:10,group:g.laws_g},
    // ─ Contes & Légendes
    {id:'tale_5',icon:'🐉',name:lang==='fr'?'Apprenti conteur':'Tale apprentice',desc:lang==='fr'?'Lire 5 contes & légendes':'Read 5 tales & legends',type:'tales',target:5,group:g.tales_g},
    {id:'tale_10',icon:'📖',name:lang==='fr'?'Gardien des légendes':'Legend keeper',desc:lang==='fr'?'Lire 10 contes & légendes':'Read 10 tales & legends',type:'tales',target:10,group:g.tales_g},
    // ─ Dinosaures
    {id:'dino_5',icon:'🦕',name:lang==='fr'?'Apprenti paléontologue':'Dino apprentice',desc:lang==='fr'?'Lire 5 faits Dinosaures':'Read 5 Dinosaur facts',type:'dinosaurs',target:5,group:g.dinosaurs_g},
    {id:'dino_10',icon:'🦖',name:lang==='fr'?'Roi du Jurassique':'Jurassic king',desc:lang==='fr'?'Lire 10 faits Dinosaures':'Read 10 Dinosaur facts',type:'dinosaurs',target:10,group:g.dinosaurs_g},
    // ─ Planètes
    {id:'planet_mercury',icon:'☿️',name:lang==='fr'?'Messager de Mercure':'Mercury Messenger',desc:lang==='fr'?'Débloquer Mercure':'Unlock Mercury',type:'planet',target:'mercury',group:g.planets},
    {id:'planet_venus',icon:'♀️',name:lang==='fr'?'Étoile du berger':'Morning Star',desc:lang==='fr'?'Débloquer Vénus':'Unlock Venus',type:'planet',target:'venus',group:g.planets},
    {id:'planet_jupiter',icon:'🟠',name:lang==='fr'?'Roi de Jupiter':'King of Jupiter',desc:lang==='fr'?'Débloquer Jupiter':'Unlock Jupiter',type:'planet',target:'jupiter',group:g.planets},
    {id:'planet_uranus',icon:'🔵',name:lang==='fr'?'Sage d\'Uranus':'Sage of Uranus',desc:lang==='fr'?'Débloquer Uranus':'Unlock Uranus',type:'planet',target:'uranus',group:g.planets},
    {id:'planet_pluto',icon:'💀',name:lang==='fr'?'Fantôme de Pluton':'Ghost of Pluto',desc:lang==='fr'?'Débloquer Pluton':'Unlock Pluto',type:'planet',target:'pluto',group:g.planets},
    {id:'planet_pangaea',icon:'🦕',name:lang==='fr'?'Monde perdu':'Lost World',desc:lang==='fr'?'Débloquer la Pangée':'Unlock Pangaea',type:'planet',target:'pangaea',group:g.planets},
    {id:'planet_moon',icon:'🌙',name:lang==='fr'?'Habitant de la Lune':'Moon dweller',desc:lang==='fr'?'Débloquer la Lune':'Unlock the Moon',type:'planet',target:'moon',group:g.planets},
    {id:'planet_mars',icon:'🔴',name:lang==='fr'?'Conquistador de Mars':'Mars conquistador',desc:lang==='fr'?'Débloquer Mars':'Unlock Mars',type:'planet',target:'mars',group:g.planets},
    {id:'planet_saturn',icon:'🪐',name:lang==='fr'?'Seigneur de Saturne':'Lord of Saturn',desc:lang==='fr'?'Débloquer Saturne':'Unlock Saturn',type:'planet',target:'saturn',group:g.planets},
    {id:'planet_neptune',icon:'🛸',name:lang==='fr'?'Rencontre du 3ᵉ type':'Close Encounter',desc:lang==='fr'?'Collecter 5 fragments de planète':'Collect 5 planet fragments',type:'planet',target:'neptune',group:g.planets},
    {id:'planet_sun',icon:'☀️',name:lang==='fr'?"L'Oracle Solaire":'The Solar Oracle',desc:lang==='fr'?'Débloquer le Soleil':'Unlock the Sun',type:'planet',target:'sun',group:g.planets},
    {id:'ephem_1',icon:'📅',name:lang==='fr'?'Premier Éphéméride':'First Ephemeris',desc:lang==='fr'?'Lire ton premier fait du jour':'Read your first daily fact',type:'ephem',target:1,group:g.planets},
    {id:'ephem_7',icon:'🗓️',name:lang==='fr'?"Semaine d'Oracle":'Oracle Week',desc:lang==='fr'?'Lire 7 éphémérides':'Read 7 daily facts',type:'ephem',target:7,group:g.planets},
  ];
};

// ── PLANETS ───────────────────────────────────────────────────────────────
const buildPlanets=(lang)=>[
  {id:'earth',emoji:'🌍',cssClass:'planet-earth',previewClass:'p-earth',check:()=>true,progress:()=>({val:1,max:1,label:''})},
  {id:'mercury',emoji:'☿️',cssClass:'planet-mercury',previewClass:'p-mercury',check:(s)=>(s.read.total||0)>=20,progress:(s)=>({val:Math.min(s.read.total||0,20),max:20,label:`${Math.min(s.read.total||0,20)} / 20`,fillClass:'pf-mercury'})},
  {id:'venus',emoji:'♀️',cssClass:'planet-venus',previewClass:'p-venus',check:(s)=>(s.ephemRead||0)>=30,progress:(s)=>({val:Math.min(s.ephemRead||0,30),max:30,label:`${Math.min(s.ephemRead||0,30)} / 30`,fillClass:'pf-venus'})},
  {id:'moon',emoji:'🌙',cssClass:'planet-moon',previewClass:'p-moon',check:(s)=>(s.read.total||0)>=50,progress:(s)=>({val:Math.min(s.read.total||0,50),max:50,label:`${Math.min(s.read.total||0,50)} / 50`,fillClass:'pf-moon'})},
  {id:'mars',emoji:'🔴',cssClass:'planet-mars',previewClass:'p-mars',check:(s)=>(s.streak||1)>=7,progress:(s)=>({val:Math.min(s.streak||1,7),max:7,label:`${Math.min(s.streak||1,7)} / 7`,fillClass:'pf-mars'})},
  {id:'saturn',emoji:'🪐',cssClass:'planet-saturn',previewClass:'p-saturn',check:(s)=>(s.shares||0)>=5,progress:(s)=>({val:Math.min(s.shares||0,5),max:5,label:`${Math.min(s.shares||0,5)} / 5`,fillClass:'pf-saturn'})},
  {id:'jupiter',emoji:'🟠',cssClass:'planet-jupiter',previewClass:'p-jupiter',check:(s)=>{const cats=Object.keys(CAT_ICONS);return cats.every(c=>(s.read[c]||0)>=1);},progress:(s)=>{const cats=Object.keys(CAT_ICONS);const d=cats.filter(c=>(s.read[c]||0)>=1).length;return{val:d,max:cats.length,label:`${d} / ${cats.length}`,fillClass:'pf-jupiter'};}},
  {id:'neptune',emoji:'🛸',cssClass:'planet-neptune',previewClass:'p-neptune',check:(s)=>(s.planetFragments||0)>=5,progress:(s)=>({val:Math.min(s.planetFragments||0,5),max:5,label:`${Math.min(s.planetFragments||0,5)} / 5 🧩`,fillClass:'pf-neptune'})},
  {id:'uranus',emoji:'🔵',cssClass:'planet-uranus',previewClass:'p-uranus',check:(s)=>(s.quizCorrect||0)>=50,progress:(s)=>({val:Math.min(s.quizCorrect||0,50),max:50,label:`${Math.min(s.quizCorrect||0,50)} / 50`,fillClass:'pf-uranus'})},
  {id:'pluto',emoji:'💀',cssClass:'planet-pluto',previewClass:'p-pluto',check:(s)=>(s.secretTaps||0)>=10,progress:(s)=>({val:Math.min(s.secretTaps||0,10),max:10,label:(s.secretTaps||0)>=10?'???':'???',fillClass:'pf-pluto'})},
  {id:'pangaea',emoji:'🦕',cssClass:'planet-pangaea',previewClass:'p-pangaea',check:(s)=>(s.read.dinosaurs||0)>=20,progress:(s)=>({val:Math.min(s.read.dinosaurs||0,20),max:20,label:`${Math.min(s.read.dinosaurs||0,20)} / 20`,fillClass:'pf-pangaea'})},
  {id:'sun',emoji:'☀️',cssClass:'planet-sun',previewClass:'p-sun',check:(s)=>CAT_ACH_IDS.every(id=>s.unlocked.includes(id)),progress:(s)=>{const d=CAT_ACH_IDS.filter(id=>s.unlocked.includes(id)).length;return{val:d,max:CAT_ACH_IDS.length,label:`${d} / ${CAT_ACH_IDS.length}`,fillClass:'pf-sun'};}},
];

// ── STATE ─────────────────────────────────────────────────────────────────
function loadState(){
  try{const s=localStorage.getItem('oracle_v7');if(s)return JSON.parse(s);}catch(e){}
  return{favs:[],read:{},history:[],unlocked:[],streak:1,lastDate:null,shares:0,activePlanet:'earth',unlockedPlanets:['earth'],lang:null,lastDailyDate:null,quizTotal:0,quizCorrect:0,muted:false,mutedAmbient:false,mutedSfx:false,dailyCount:0,dailyCountDate:null,planetFragments:0,ephemRead:0,secretTaps:0,ephemHistory:[]};
}
function saveState(){
  try{localStorage.setItem('oracle_v7',JSON.stringify(state));}catch(e){}
  syncToFirestore();
}

// ── FIREBASE INIT ────────────────────────────────────────────────────────
let fbAuth = null, fbDb = null, _syncTimer = null, _fbUser = null;

// ── FIRESTORE SYNC ───────────────────────────────────────────────────────
function syncToFirestore(){
  if(!_fbUser || !fbDb) return;
  if(_syncTimer) clearTimeout(_syncTimer);
  _syncTimer = setTimeout(()=>{
    fbDb.collection('users').doc(_fbUser.uid).set({
      state: JSON.stringify(state),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      email: _fbUser.email||'',
      displayName: _fbUser.displayName||''
    },{merge:true}).then(()=>{
      const el=document.getElementById('authSyncStatus');
      if(el) el.textContent='✓ Données synchronisées';
    }).catch(e=>console.warn('Firestore sync error:',e));
  }, 2000);
}

function loadFromFirestore(){
  if(!_fbUser || !fbDb) return Promise.resolve(null);
  return fbDb.collection('users').doc(_fbUser.uid).get().then(doc=>{
    if(doc.exists && doc.data().state){
      return JSON.parse(doc.data().state);
    }
    return null;
  }).catch(e=>{console.warn('Firestore load error:',e);return null;});
}

function mergeStates(local, cloud){
  if(!cloud) return local;
  if(!local) return cloud;
  const merged = JSON.parse(JSON.stringify(cloud));
  const favIds = new Set((merged.favs||[]).map(f=>f.id));
  (local.favs||[]).forEach(f=>{if(!favIds.has(f.id)){merged.favs.push(f);}});
  if(local.read && merged.read){
    Object.keys(local.read).forEach(k=>{
      merged.read[k] = Math.max(merged.read[k]||0, local.read[k]||0);
    });
  }
  const histIds = new Set((merged.history||[]).map(h=>h.id));
  (local.history||[]).forEach(h=>{if(!histIds.has(h.id)){merged.history.push(h);}});
  const ephIds = new Set((merged.ephemHistory||[]).map(h=>h.id));
  (local.ephemHistory||[]).forEach(h=>{if(!ephIds.has(h.id)){merged.ephemHistory.push(h);}});
  merged.unlocked = [...new Set([...(merged.unlocked||[]),...(local.unlocked||[])])];
  merged.unlockedPlanets = [...new Set([...(merged.unlockedPlanets||[]),...(local.unlockedPlanets||[])])];
  merged.streak = Math.max(merged.streak||1, local.streak||1);
  merged.shares = Math.max(merged.shares||0, local.shares||0);
  merged.quizTotal = Math.max(merged.quizTotal||0, local.quizTotal||0);
  merged.quizCorrect = Math.max(merged.quizCorrect||0, local.quizCorrect||0);
  merged.dailyCount = Math.max(merged.dailyCount||0, local.dailyCount||0);
  merged.planetFragments = Math.max(merged.planetFragments||0, local.planetFragments||0);
  merged.ephemRead = Math.max(merged.ephemRead||0, local.ephemRead||0);
  merged.secretTaps = Math.max(merged.secretTaps||0, local.secretTaps||0);
  merged.activePlanet = local.activePlanet || merged.activePlanet;
  merged.muted = local.muted;
  merged.lang = local.lang || merged.lang;
  merged.lastDate = local.lastDate || merged.lastDate;
  merged.lastDailyDate = local.lastDailyDate || merged.lastDailyDate;
  return merged;
}

// ── AUTH FUNCTIONS ────────────────────────────────────────────────────────
function signInWithGoogle(){
  if(!fbAuth) return;
  var provider = new firebase.auth.GoogleAuthProvider();
  fbAuth.signInWithPopup(provider).catch(function(e){
    console.warn('Google sign-in error:', e.code, e.message);
    if(e.code === 'auth/popup-blocked'){
      showToast(lang==='fr'?'Autorise les popups pour te connecter':'Allow popups to sign in');
    } else {
      showToast(lang==='fr'?'Erreur de connexion':'Sign-in error');
    }
  });
}

function signOutUser(){
  if(!fbAuth) return;
  fbAuth.signOut().then(()=>{
    _fbUser = null;
    updateAuthUI();
    showToast(lang==='fr'?'Déconnecté':'Signed out');
    closeAuthPanel();
  });
}

function updateAuthUI(){
  const avatarImg = document.getElementById('userAvatarImg');
  const avatarDefault = document.getElementById('userAvatarDefault');
  const loggedOut = document.getElementById('authLoggedOut');
  const loggedIn = document.getElementById('authLoggedIn');
  if(_fbUser){
    if(_fbUser.photoURL && avatarImg){
      avatarImg.src = _fbUser.photoURL;
      avatarImg.style.display = 'block';
      if(avatarDefault) avatarDefault.style.display = 'none';
    }
    if(loggedOut) loggedOut.style.display = 'none';
    if(loggedIn) loggedIn.style.display = 'block';
    const nameEl = document.getElementById('authUserName');
    const emailEl = document.getElementById('authUserEmail');
    const photoEl = document.getElementById('authUserPhoto');
    if(nameEl) nameEl.textContent = _fbUser.displayName || '';
    if(emailEl) emailEl.textContent = _fbUser.email || '';
    if(photoEl && _fbUser.photoURL) photoEl.src = _fbUser.photoURL;
  } else {
    if(avatarImg){avatarImg.style.display='none';}
    if(avatarDefault){avatarDefault.style.display='block';}
    if(loggedOut) loggedOut.style.display = 'block';
    if(loggedIn) loggedIn.style.display = 'none';
  }
}

function openAuthPanel(){
  document.getElementById('authOverlay').classList.add('open');
}
function closeAuthPanel(){
  document.getElementById('authOverlay').classList.remove('open');
}

function updatePremiumBadge(){
  const badge = document.getElementById('premiumBadge');
  if(badge) badge.style.display = state.premium ? 'inline-flex' : 'none';
  const label = document.getElementById('premiumLabel');
  if(label) label.style.display = state.premium ? 'block' : 'none';
}
let state=loadState();
if(!state.unlockedPlanets)state.unlockedPlanets=['earth'];
if(!state.activePlanet)state.activePlanet='earth';

(function(){
  const today=new Date().toDateString();
  if(!state.lastDate){state.lastDate=today;saveState();return;}
  if(state.lastDate===today)return;
  const y=new Date();y.setDate(y.getDate()-1);
  state.streak=(state.lastDate===y.toDateString())?(state.streak||1)+1:1;
  state.lastDate=today;saveState();
})();

let lang='fr', FACTS=FACTS_FR, ACH_DEF=[], PLANETS=[];

// ── LANGUAGE ──────────────────────────────────────────────────────────────
function setLang(l){
  lang=l; state.lang=l; saveState();
  FACTS=l==='fr'?FACTS_FR:FACTS_EN;
  ACH_DEF=buildAchDef(l);
  PLANETS=buildPlanets(l);
  document.getElementById('langScreen').classList.add('hidden');

  // First launch → show onboarding
  if(!state.onboarded){
    showOnboarding();
    return;
  }

  _finishLangSetup();
}

function _finishLangSetup(){
  document.getElementById('mainApp').style.display='flex';
  applyI18n();
  applyPlanetSkin(state.activePlanet);
  updateFavBadge();
  setTimeout(() => { initDailyBanner(); 

    // Show login button by default; Firebase will update it once loaded
    const _lb = document.getElementById('loginBtn');
    if(_lb) _lb.style.display='flex';
    if(typeof loadFirebase==='function' && !window._fbInitDone){
      window._fbInitDone=true; loadFirebase();
    }
  }, 100);
}

// ── ONBOARDING ─────────────────────────────────────────────────────────
const OB_SLIDES = {
  fr:[
    {title:"Bienvenue sur Oracle",desc:"Chaque jour, l'Oracle te révèle des faits fascinants sur le monde — science, histoire, nature et bien plus."},
    {title:"Explore les planètes",desc:"Débloque de nouvelles planètes en lisant, partageant et explorant. Chacune transforme ton expérience."},
    {title:"Un univers à découvrir",desc:"Des dizaines de catégories, des centaines de faits et une éphéméride quotidienne — il y a toujours quelque chose à apprendre."},
    {title:"Prêt à commencer ?",desc:"Touche l'orbe pour révéler ton premier fait. L'univers de la connaissance s'ouvre à toi."}
  ],
  en:[
    {title:"Welcome to Oracle",desc:"Every day, Oracle reveals fascinating facts about the world — science, history, nature and more."},
    {title:"Explore the planets",desc:"Unlock new planets by reading, sharing and exploring. Each one transforms your experience."},
    {title:"A universe to discover",desc:"Dozens of categories, hundreds of facts and a daily ephemeris — there's always something to learn."},
    {title:"Ready to begin?",desc:"Touch the orb to reveal your first fact. The universe of knowledge awaits."}
  ]
};

let _obIdx = 0;

function showOnboarding(){
  const slides = OB_SLIDES[lang]||OB_SLIDES.en;
  const emojis = ['🔮','🪐','🧭','✨'];
  const skipLabel = lang==='fr'?'Passer':'Skip';
  const nextLabel = lang==='fr'?'Suivant →':'Next →';

  // Build onboarding DOM
  const ob = document.createElement('div');
  ob.className = 'onboarding';
  ob.id = 'onboarding';
  ob.innerHTML = `
    <button class="onboarding-skip" id="obSkip" onclick="finishOnboarding()">${skipLabel}</button>
    <div class="onboarding-slides" id="obSlides">
      ${slides.map((s,i)=>`
        <div class="onboarding-slide ${i===0?'active':''}" data-ob="${i}">
          <div class="onboarding-emoji">${emojis[i]}</div>
          <div class="onboarding-title">${s.title}</div>
          <div class="onboarding-desc">${s.desc}</div>
        </div>
      `).join('')}
    </div>
    <div class="onboarding-dots" id="obDots">
      ${slides.map((_,i)=>`<div class="onboarding-dot ${i===0?'active':''}" data-dot="${i}"></div>`).join('')}
    </div>
    <div class="onboarding-nav">
      <button class="onboarding-btn" id="obPrev" onclick="obNav(-1)" style="visibility:hidden">←</button>
      <button class="onboarding-btn primary" id="obNext" onclick="obNav(1)">${nextLabel}</button>
    </div>
  `;
  document.body.appendChild(ob);

  // Swipe support
  let _sx=0,_sy=0;
  ob.addEventListener('touchstart',e=>{_sx=e.touches[0].clientX;_sy=e.touches[0].clientY;},{passive:true});
  ob.addEventListener('touchend',e=>{
    const dx=e.changedTouches[0].clientX-_sx;
    const dy=e.changedTouches[0].clientY-_sy;
    if(Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)){
      if(dx<0) obNav(1); else obNav(-1);
    }
  },{passive:true});

  _obIdx=0;
}

function obNav(dir){
  haptic();
  const slides=OB_SLIDES[lang]||OB_SLIDES.en;
  if(dir===1 && _obIdx>=slides.length-1){ finishOnboarding(); return; }
  const old=_obIdx;
  _obIdx=Math.max(0,Math.min(slides.length-1,_obIdx+dir));
  if(old===_obIdx) return;
  // Animate out old slide
  const oldSlide=document.querySelector(`.onboarding-slide[data-ob="${old}"]`);
  const newSlide=document.querySelector(`.onboarding-slide[data-ob="${_obIdx}"]`);
  if(dir>0){
    oldSlide.classList.remove('active');oldSlide.classList.add('exit-left');
    newSlide.classList.remove('exit-left');
    setTimeout(()=>newSlide.classList.add('active'),30);
  } else {
    oldSlide.classList.remove('active');
    oldSlide.style.transform='translateX(60px)';oldSlide.style.opacity='0';
    newSlide.classList.remove('exit-left');
    newSlide.style.transform='';newSlide.style.opacity='';
    setTimeout(()=>newSlide.classList.add('active'),30);
    setTimeout(()=>{oldSlide.style.transform='';oldSlide.style.opacity='';},500);
  }
  _obUpdateSlide();
}

function _obUpdateSlide(){
  const slides=OB_SLIDES[lang]||OB_SLIDES.en;
  // Dots
  document.querySelectorAll('.onboarding-dot').forEach((d,i)=>{
    d.classList.toggle('active',i===_obIdx);
  });
  // Prev button
  document.getElementById('obPrev').style.visibility=_obIdx===0?'hidden':'visible';
  // Next button label
  const isLast=_obIdx>=slides.length-1;
  document.getElementById('obNext').textContent=isLast?(lang==='fr'?"C'est parti 🚀":'Let\'s go 🚀'):(lang==='fr'?'Suivant →':'Next →');
}

function finishOnboarding(){
  haptic();
  state.onboarded=true; saveState();
  const ob=document.getElementById('onboarding');
  ob.style.transition='opacity .4s';
  ob.style.opacity='0';
  ob.style.pointerEvents='none';
  setTimeout(()=>{ob.remove(); _finishLangSetup();},450);
}

function applyI18n(){
  const t=T[lang];
  document.getElementById('headerSub').textContent=t.headerSub;
  document.getElementById('orbLabel').textContent=t.orbPress;
  document.getElementById('hintText').textContent=t.hint;
  document.getElementById('cardEmpty').textContent=t.cardEmpty;
  document.getElementById('exploreBtnLabel').textContent=t.exploreBtn;
  document.getElementById('explorePanelTitle').textContent=t.explorePanelTitle;
  document.getElementById('favPanelTitle').textContent=t.favTitle;
  document.getElementById('achPanelTitle').textContent=t.achTitle;
  document.getElementById('shareTitle').textContent=t.shareTitle;
  document.getElementById('copyLabel').textContent=t.copyLabel;
  document.getElementById('shareCloseBtn').textContent=t.shareClose;
  document.getElementById('celebLabel').textContent=t.celebLabel;
  document.getElementById('celebBtn').textContent=t.celebBtn;
  document.getElementById('unlockLabel').textContent=t.unlockLabel;
  document.getElementById('unlockBtn').textContent=t.unlockBtn;
  document.getElementById('planetPanelTitle').textContent=t.planetPanelTitle;
  if(document.getElementById('perk1')) document.getElementById('perk1').textContent=t.perk1;
  if(document.getElementById('perk2')) document.getElementById('perk2').textContent=t.perk2;
  if(document.getElementById('perk3')) document.getElementById('perk3').textContent=t.perk3;
}

// Check if lang already chosen
if(state.lang){
  // Existing users: mark as onboarded if not already
  if(!state.onboarded){ state.onboarded=true; saveState(); }
  setLang(state.lang);
}

// ── PLANET SYSTEM ─────────────────────────────────────────────────────────
function applyPlanetSkin(planetId, animate){
  const orb=document.getElementById('orb');
  const wrapper=orb.closest('.orb-wrapper')||orb.parentElement;
  const allPlanetClasses=['planet-earth','planet-mercury','planet-venus','planet-moon','planet-mars','planet-jupiter','planet-saturn','planet-neptune','planet-uranus','planet-pluto','planet-pangaea','planet-sun'];
  function doSwap(){
    allPlanetClasses.forEach(c=>orb.classList.remove(c));
    const p=PLANETS.find(x=>x.id===planetId);
    if(p)orb.classList.add(p.cssClass);
    const pt=T[lang].planets[planetId];
    document.getElementById('planetIndicatorEmoji').textContent=p?p.emoji:'🌍';
    document.getElementById('planetIndicatorName').textContent=pt?pt.name:'';
  }
  if(animate){
    wrapper.classList.remove('planet-enter');
    wrapper.classList.add('planet-exit');
    setTimeout(()=>{
      doSwap();
      wrapper.classList.remove('planet-exit');
      wrapper.classList.add('planet-enter');
      setTimeout(()=>wrapper.classList.remove('planet-enter'),420);
    },420);
  } else {
    doSwap();
  }
}

function checkPlanetUnlocks(){
  const nu=[];
  PLANETS.forEach(p=>{
    if(state.unlockedPlanets.includes(p.id))return;
    if(p.check(state)){state.unlockedPlanets.push(p.id);nu.push(p);}
  });
  if(nu.length>0){
    nu.forEach(p=>{const aid='planet_'+p.id;if(!state.unlocked.includes(aid))state.unlocked.push(aid);});
    saveState();showUnlockOverlay(nu[0]);
  }
}

function showUnlockOverlay(planet){
  haptic('celebration');
  const orb=document.getElementById('unlockOrb');
  orb.className='unlock-planet-orb '+planet.previewClass;
  const pt=T[lang].planets[planet.id];
  document.getElementById('unlockName').textContent=planet.emoji+' '+pt.name;
  document.getElementById('unlockDesc').textContent=pt.unlockDesc;
  document.getElementById('unlockOverlay').classList.add('active');
  spawnConfetti(document.getElementById('unlockOverlay'));
}
function closeUnlockOverlay(){document.getElementById('unlockOverlay').classList.remove('active');document.querySelectorAll('#unlockOverlay .confetti-piece').forEach(e=>e.remove());}

function openPlanetPanel(){renderPlanetPanel();document.getElementById('planetPanel').classList.add('open');}
function closePlanetPanel(){document.getElementById('planetPanel').classList.remove('open');}

function renderPlanetPanel(){
  const el=document.getElementById('planetPanelBody');
  const t=T[lang];
  el.innerHTML='<div class="planet-grid">'+PLANETS.map(p=>{
    const unlocked=state.unlockedPlanets.includes(p.id);
    const active=state.activePlanet===p.id;
    const prog=p.progress(state);
    const pct=Math.round((prog.val/prog.max)*100);
    const pt=t.planets[p.id];
    return`<div class="planet-card ${active?'active':''} ${unlocked?'':'locked'}" onclick="${unlocked?`selectPlanet('${p.id}')`:''}" >
      <div class="planet-orb-preview ${p.previewClass}"></div>
      <div class="planet-info">
        <div class="planet-name">${p.emoji} ${pt.name}</div>
        <div class="planet-cond">${pt.cond}</div>
        ${unlocked
          ?`<div class="planet-status-ok">✓ ${t.planetUnlocked.replace('✓ ','')}</div>`
          :`<div class="planet-progress-wrap"><div class="planet-progress-label">${prog.label}</div><div class="planet-progress-bar"><div class="planet-progress-fill ${prog.fillClass||''}" style="width:${pct}%"></div></div></div>`
        }
      </div>
      ${active?`<div class="planet-active-badge">${t.planetActive}</div>`:''}
      ${!unlocked?'<div style="position:absolute;top:11px;right:12px;font-size:15px;opacity:.35">🔒</div>':''}
    </div>`;
  }).join('')+'</div>';
}

function selectPlanet(id){
  haptic('medium');state.activePlanet=id;saveState();applyPlanetSkin(id,true);renderPlanetPanel();
  if(window._switchAmbient) window._switchAmbient(id);
  const orb=document.getElementById('orb');orb.style.transform='scale(.92)';setTimeout(()=>{orb.style.transform='';},150);
}


// ── DECK ──────────────────────────────────────────────────────────────────
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
let deck=[], deckIdx=0, currentFact=null;

function getSeenIds(){
  const ids = new Set(state.seenIds || []);
  // Backward compat: also mark history & favs as seen
  if(state.history) state.history.forEach(h => ids.add(h.id));
  if(state.favs) state.favs.forEach(f => ids.add(f.id));
  return ids;
}

function buildUnseenDeck(){
  const seen=getSeenIds();
  const unseen=FACTS.filter(f=>!seen.has(f.id));
  return shuffle(unseen.length>0 ? unseen : FACTS);
}

function initDeck(){deck=buildUnseenDeck();deckIdx=0;}

function showPoolExhausted(){
  const isFr=lang==='fr';
  document.getElementById('peTitle').textContent=isFr?'Tu as tout découvert !':'You\'ve seen it all!';
  document.getElementById('peMsg').textContent=isFr
    ?`Bravo ! Tu as découvert les ${FACTS.length} faits de l'Oracle. Recommencer depuis le début ?`
    :`Congrats! You've discovered all ${FACTS.length} Oracle facts. Start again from the beginning?`;
  document.getElementById('peBtn').textContent=isFr?'Recommencer':'Start over';
  document.getElementById('poolExhaustedScreen').classList.add('active');
}

function confirmPoolReset(){
  document.getElementById('poolExhaustedScreen').classList.remove('active');
  // Vider l'historique pour réinitialiser le pool, garder les favs
  state.history=[];
  state.seenIds=[];
  saveState();
  deck=shuffle(FACTS);deckIdx=0;
  showFact();
}

// ── SHOW FACT ─────────────────────────────────────────────────────────────
let exploreCat = null; // temporary category filter, reset after each fact
let _pendingEndOfDayChecks = false;
function runPostFactChecks(deferForEndOfDay){
  if(deferForEndOfDay){
    _pendingEndOfDayChecks = true;
    return;
  }
  checkAchievements();checkPlanetUnlocks();maybeShowQuiz();maybeShowUfo();
}
function flushPendingEndOfDayChecks(){
  if(!_pendingEndOfDayChecks) return;
  _pendingEndOfDayChecks = false;
  checkAchievements();checkPlanetUnlocks();maybeShowQuiz();maybeShowUfo();
}
function showFact(){
  haptic('medium');
  const ddCard=document.querySelector('.card.dd-open');if(ddCard)ddCard.classList.remove('dd-open');
  // ── Daily limit check (skip for premium users) ──
  if(!state.premium){
    const today=getTodayStr();
    if(state.dailyCountDate!==today){state.dailyCount=0;state.dailyCountDate=today;saveState();}
    const LIMIT=5;
    if(state.dailyCount>=LIMIT){showDailyLimit();return;}
  }
  // ── Rebuild unseen deck if needed ──
  if(exploreCat){
    // Explore mode: pick from chosen category, unseen first
    const seen=getSeenIds();
    let pool=FACTS.filter(f=>f.cat===exploreCat&&!seen.has(f.id));
    if(pool.length===0) pool=FACTS.filter(f=>f.cat===exploreCat); // all seen → allow repeats
    if(pool.length===0){resetExploreBtn();return;}
    currentFact=shuffle(pool)[0];
  } else {
    // Normal mode: always pick from unseen facts
    const seen=getSeenIds();
    const unseen=FACTS.filter(f=>!seen.has(f.id));
    if(unseen.length===0){
      showPoolExhausted();
      return;
    }
    if(!deck.length || deckIdx>=deck.length){
      // Rebuild deck from unseen only
      deck=shuffle(unseen);
      deckIdx=0;
    }
    // Double-check current pick isn't already seen (deck might be stale)
    while(deckIdx < deck.length && seen.has(deck[deckIdx].id)){
      deckIdx++;
    }
    if(deckIdx >= deck.length){
      // All remaining in deck were seen, rebuild
      const freshUnseen=FACTS.filter(f=>!getSeenIds().has(f.id));
      if(freshUnseen.length===0){ showPoolExhausted(); return; }
      deck=shuffle(freshUnseen); deckIdx=0;
    }
    currentFact=deck[deckIdx++];
  }
  const t=T[lang];
  const orb=document.getElementById('orb'),card=document.getElementById('card'),label=document.getElementById('orbLabel');
  const r=document.createElement('div');r.className='ripple';orb.appendChild(r);setTimeout(()=>r.remove(),850);
  ['lit','cat-science','cat-positive','cat-fun','cat-history','cat-space','cat-animals','cat-body','cat-arts','cat-inventions','cat-world','cat-language','cat-food','cat-sports','cat-celebrities','cat-fiction','cat-gaming','cat-cinema','cat-music','cat-mythology','cat-psychology','cat-oceans','cat-records','cat-quotes','cat-laws','cat-tales','cat-dinosaurs']
    .forEach(c=>orb.classList.remove(c));
  card.classList.remove('visible');
  state.read[currentFact.cat]=(state.read[currentFact.cat]||0)+1;state.read.total=(state.read.total||0)+1;state.dailyCount=(state.dailyCount||0)+1;
  const deferPostFactChecks = !state.premium && (state.dailyCount||0) >= DAILY_LIMIT;
  if(!state.history) state.history=[];
  if(!state.seenIds) state.seenIds=[];
  if(!state.seenIds.includes(currentFact.id)){
    state.seenIds.push(currentFact.id);
  }
  if(!state.history.some(h=>h.id===currentFact.id)){
    state.history.unshift({id:currentFact.id,cat:currentFact.cat,label:(T[lang].catLabels||{})[currentFact.cat]||currentFact.cat,text:currentFact.text,date:new Date().toLocaleDateString(lang==='fr'?'fr-FR':'en-US')});
    if(state.history.length>50) state.history.pop();
  }
  saveState();
  const isFav=state.favs.some(f=>f.id===currentFact.id);
  const icon=CAT_ICONS[currentFact.cat]||'✦';
  const catLabel=t.catLabels[currentFact.cat]||'';
  setTimeout(()=>{
    orb.classList.add('lit','cat-'+currentFact.cat);
    if(window.playCatSound) playCatSound(currentFact.cat);
    // Build source HTML
    const srcData = SOURCES[currentFact.id];
    const srcHtml = srcData
      ? `<div class="card-source">
          <span class="card-source-label">src</span>
          <a class="card-source-link" href="${srcData.u}" target="_blank" rel="noopener">${srcData.n}</a>
         </div>`
      : '';
    card.innerHTML=`
      <span class="card-cat-icon">${icon}</span>
      <div class="card-badge badge-${currentFact.cat}"><span class="badge-dot"></span>${catLabel}</div>
      <p class="card-text">${currentFact.text}</p>
      ${srcHtml}
      <div class="card-actions">
        <button class="action-btn ${isFav?'fav-active':''}" id="favToggle" onclick="toggleFav()">
          <span class="a-icon">${isFav?'♥':'♡'}</span><span class="a-label">${t.favBtn}</span>
        </button>
        <button class="action-btn" onclick="shareNative()">
          <span class="a-icon">↗</span><span class="a-label">${t.shareBtn}</span>
        </button>
        <span class="counter">${t.counter(deckIdx,FACTS.length)}</span>
      </div>
      ${DEEP_DIVES[currentFact.id] ? `<button class="deep-dive-btn" id="deepDiveBtn" onclick="showDeepDive()"><span class="dd-icon">🔎</span> ${lang==='fr'?'Creuser le sujet':'Dig deeper'}</button>` : ''}
      <div class="deep-dive-container" id="deepDiveContainer" style="display:none;"></div>`;
    card.classList.add('visible');
    // Show remaining facts for today
    if(!state.premium){
      const rem = Math.max(0, DAILY_LIMIT - (state.dailyCount||0));
      label.textContent = rem > 0
        ? (lang==='fr' ? `Encore (${rem})` : `Again (${rem})`)
        : (lang==='fr' ? 'Terminé' : 'Done');
    } else {
      label.textContent = lang==='fr' ? '∞ Illimité' : '∞ Unlimited';
    }
    setTimeout(()=>runPostFactChecks(deferPostFactChecks),400);
  },120);
}

// ── EXPLORE MODE ──────────────────────────────────────────────────────────

function toggleExplore(){
  if(exploreCat){
    resetExploreBtn();
    showToast(lang==='fr'?'🎲 Retour en aléatoire':'🎲 Back to random');
  } else {
    openExplorePanel();
  }
}

function openExplorePanel(){
  renderExploreGrid();
  document.getElementById('explorePanel').classList.add('open');
}
function closeExplorePanel(){
  document.getElementById('explorePanel').classList.remove('open');
}

function renderExploreGrid(){
  const t=T[lang];
  const cats=Object.keys(t.catLabels);
  const grid=document.getElementById('exploreGrid');
  grid.innerHTML=cats.map(cat=>{
    const icon=CAT_ICONS[cat]||'✦';
    const name=t.catLabels[cat];
    const readCount=Math.min(state.read[cat]||0,20);
    const pct=Math.round(readCount/20*100);
    return `<div class="explore-cat-card" onclick="haptic('medium');pickExplore('${cat}')">
      <span class="ecc-icon">${icon}</span>
      <span class="ecc-name">${name}</span>
      <span class="ecc-progress">${t.exploreProgress(readCount)}</span>
      <div class="ecc-bar"><div class="ecc-bar-fill" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');
}

function pickExplore(cat){
  exploreCat=cat;
  closeExplorePanel();
  // Update button to show selected category
  const btn=document.getElementById('exploreBtn');
  const icon=CAT_ICONS[cat]||'✦';
  const name=T[lang].catLabels[cat];
  btn.innerHTML=`${icon} <span id="exploreBtnLabel">${name}</span>`;
  btn.classList.add('cat-active');
  showToast(lang==='fr'?`🧭 Prochain fait : ${name}`:`🧭 Next fact: ${name}`);
}

function resetExploreBtn(){
  exploreCat=null;
  const btn=document.getElementById('exploreBtn');
  btn.innerHTML=`🧭 <span id="exploreBtnLabel">${T[lang].exploreBtn}</span>`;
  btn.classList.remove('cat-active');
}

// ── SHARE ─────────────────────────────────────────────────────────────────
function buildShareText(){if(window._shareText){const t=window._shareText;return t;}if(!currentFact)return'';return`${currentFact.text}\n\n${T[lang].shareTag}`;}
function openShare(){
  if(!currentFact)return;haptic('light');
  window._shareRaw = currentFact.text;
  window._shareCat = currentFact.cat;
  document.getElementById('sharePreview').textContent=currentFact.text;
  const btn=document.getElementById('copyBtn');
  btn.classList.remove('copied');btn.innerHTML=`<span>📋</span><span id="copyLabel">${T[lang].copyLabel}</span>`;
  const imgLbl=document.getElementById('shareImgLabel');
  if(imgLbl) imgLbl.textContent = lang==='fr' ? 'Partager' : 'Share';
  document.getElementById('shareTitle').textContent = lang==='fr' ? 'Partager ce fait' : 'Share this fact';
  document.getElementById('shareCloseBtn').textContent = lang==='fr' ? 'Fermer' : 'Close';
  document.getElementById('shareOverlay').classList.add('open');
  document.getElementById('shareSheet').classList.add('open');
}
const _shareLogoImg = new Image();
_shareLogoImg.src = 'data:image/png;base64,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rRn+0fMHosSkRfPqD33wif/o537OO9tQ+DfTcOQRcX//NofyOy9du3LEq5WoWm5V+cINXH0zzSrnOuzeUJHUR18FQOmOL2F7vdQjJkFXIXsAhg0Q6dCkXwD75fErpHOM+xJnAolQu64XFXAGaDGlNiUDjaJtm6KomKpKn+cvRJIopv7iXv3YU09ev37UNS0SKigg9H2Tp9iLUIiqIamqDZqFpqJt28YkXZ9WTbNex6SwbvsuapvwuRdf+/kvfv/Lr147OFkH78w0q66ydxkT2UzVZVp63pfApkqM6Iqjw+NueejZTbZ2t3b2YhLV1CxnbbNgF7ZS7GPXI2ZpfPHOW95JhMhEhXPeOc8cnBeVwoeose06IIgSwXAyGouIqo6qum+bP/+nfuDgYPbLv/617Z1dVfHOgyGCiiZEZpdbFYTACJJUACR4GtWhKtzO9rgsuAx+XJd1HTzj1vbuz/zsj5zdCc+/eHU2X877+la/e7SUppWuV+hPHt7zJw1YOztX9+Odc8ey/doB3Trq+l5V0ve9afrzX/z493/803mTx9DNRCMMV66//trrty5du3n1zuKr375+eV+P5yk3o/quTSkhwnq+0BSlj6lLKqqSxwYl9tGFwtG6vfONOl1x8Wa3vNYursj6hnYHKEsiBipBozavI3lZvgqr56w/FE296rpvzHDdt0AQYzKBFC12KU+RAYGISi+q1kvqY+pSaqMmNQ92fm/09Nve8urlm916nSV6vAu5ejc1HtgnTMSilpJKlD6lpovrpuujdmLrpl+3fdt2iHDnaImafuQH3vt7X32WOJxmiga5fYxVUUwn9XK9rsvKDM6dPbduVkkSs3OMq8U+QEIEif18dhJji3kRHRFzOSVE1QSGecCz9JneBUxIAFujMYMFR3UoCHGxXrddW1UVM6rknRGWh9Pni+V733rfJz/0jv/ub/6GK8emgkBlwSGYKBAyOx4GRhGQBhpxXZZF4esy1JX3DuqyqHNrufTTrelP/dRndrbc9166upjN153dkXOHq9S2uu41za/fFw4ePFO/dqBN04nZldX02mGKvUgfgXhE8w+/7eLHPvZDg2IbFYS8XBwte/nV3/ra3/jHv/ubX33p9/741T989sr+LMaomaGdUspll8TULpap68g5YofM5DwgsePtM3vBt1X33IPTfrY4WDTLPsU+Nt36IK1u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';
let _shareLogoReady = false;
_shareLogoImg.onload = function(){ _shareLogoReady = true; };

function generateShareCard(text, catKey) {
  const SIZE = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE; canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  // --- Background : deep space gradient ---
  const bg = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  bg.addColorStop(0, '#030610');
  bg.addColorStop(0.35, '#070d1e');
  bg.addColorStop(0.65, '#0a0f22');
  bg.addColorStop(1, '#040710');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // --- Stars (dense field) ---
  const rng = (s) => { let x = Math.sin(s) * 43758.5453; return x - Math.floor(x); };
  for (let i = 0; i < 300; i++) {
    const x = rng(i * 7.3) * SIZE;
    const y = rng(i * 13.7) * SIZE;
    const r = rng(i * 3.1) * 1.6 + 0.2;
    const a = rng(i * 5.9) * 0.6 + 0.1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,' + a + ')';
    ctx.fill();
  }

  // --- Category colors ---
  const catColors = {
    science:'#00c2ff',positive:'#39ff8f',fun:'#ff9f3f',history:'#e0a060',
    space:'#c084fc',animals:'#f472b6',body:'#fb7185',arts:'#f59e0b',
    inventions:'#34d399',world:'#22d3ee',language:'#a78bfa',food:'#f87171',
    sports:'#86efac',celebrities:'#ffd700',fiction:'#a0c4ff',gaming:'#ff6b9d',
    cinema:'#e879f9',music:'#4ade80',
    mythology:'#d4a574',psychology:'#818cf8',oceans:'#06b6d4',records:'#ef4444',
    quotes:'#fbbf24',laws:'#94a3b8',tales:'#a78bfa',dinosaurs:'#84cc16'
  };
  const glowColor = catColors[catKey] || '#c084fc';

  // --- Central orb glow behind text ---
  const glow = ctx.createRadialGradient(SIZE/2, SIZE*0.52, 0, SIZE/2, SIZE*0.52, SIZE*0.42);
  glow.addColorStop(0, glowColor + '20');
  glow.addColorStop(0.4, glowColor + '0c');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // --- Logo image (centered top) ---
  if (_shareLogoReady) {
    const logoSize = 160;
    const logoX = (SIZE - logoSize) / 2;
    const logoY = 50;
    // Circular clip with glow
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE/2, logoY + logoSize/2, logoSize/2 + 4, 0, Math.PI * 2);
    ctx.strokeStyle = glowColor + '55';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(SIZE/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(_shareLogoImg, logoX, logoY, logoSize, logoSize);
    ctx.restore();
  }

  // --- ORACLE text ---
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '500 42px Montserrat, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('O R A C L E', SIZE / 2, 270);

  // --- Thin separator line ---
  ctx.strokeStyle = glowColor + '44';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(SIZE*0.25, 295); ctx.lineTo(SIZE*0.75, 295); ctx.stroke();

  // --- Category label ---
  const catIcon = (typeof CAT_ICONS !== 'undefined' && CAT_ICONS[catKey]) ? CAT_ICONS[catKey] : '';
  const catName = (typeof T !== 'undefined' && T[lang] && T[lang].catLabels && T[lang].catLabels[catKey]) ? T[lang].catLabels[catKey].replace(/✦\s*/g,'') : '';
  if (catName) {
    ctx.fillStyle = glowColor + 'cc';
    ctx.font = '400 28px Montserrat, sans-serif';
    ctx.fillText(catIcon + '  ' + catName, SIZE / 2, 340);
  }

  // --- Fact text (wrapped, centered vertically) ---
  const maxWidth = SIZE - 180;
  const lineHeight = 68;
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.font = 'italic 400 42px Montserrat, sans-serif';
  ctx.textAlign = 'center';

  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const w of words) {
    const test = current ? current + ' ' + w : w;
    if (ctx.measureText(test).width > maxWidth) {
      if (current) lines.push(current);
      current = w;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  if (lines.length > 8) { lines.splice(8); lines[7] = lines[7].replace(/\s\S+$/, '\u2026'); }

  const textZoneTop = 370;
  const textZoneBottom = SIZE - 150;
  const textZoneH = textZoneBottom - textZoneTop;
  const totalTextH = lines.length * lineHeight;
  const textStartY = textZoneTop + (textZoneH - totalTextH) / 2 + lineHeight * 0.7;

  // Subtle quote marks
  ctx.fillStyle = glowColor + '22';
  ctx.font = 'italic 120px Georgia, serif';
  ctx.fillText('\u201C', SIZE*0.12, textStartY - 10);
  ctx.fillText('\u201D', SIZE*0.88, textStartY + totalTextH + 10);

  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.font = 'italic 400 42px Montserrat, sans-serif';
  lines.forEach(function(line, i) {
    ctx.fillText(line, SIZE / 2, textStartY + i * lineHeight);
  });

  // --- Bottom separator ---
  ctx.strokeStyle = glowColor + '44';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(SIZE*0.25, SIZE - 130); ctx.lineTo(SIZE*0.75, SIZE - 130); ctx.stroke();

  // --- URL + branding ---
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '400 26px Montserrat, sans-serif';
  ctx.fillText('kipetchis.github.io/Oracle', SIZE / 2, SIZE - 90);

  ctx.fillStyle = glowColor + '66';
  ctx.font = 'italic 300 24px Montserrat, sans-serif';
  ctx.fillText(lang === 'fr' ? '\u2728 Le monde a quelque chose \u00e0 te dire' : '\u2728 The world has something to tell you', SIZE / 2, SIZE - 52);

  return canvas;
}


async function shareAsImage() {
  const text = (window._shareRaw) || (currentFact ? currentFact.text : '');
  const catKey = (window._shareCat) || (currentFact ? currentFact.cat : '');
  if (!text) return;
  haptic('light');

  const canvas = generateShareCard(text, catKey);
  const lbl = document.getElementById('shareImgLabel');
  if (lbl) lbl.textContent = lang === 'fr' ? '⏳ Génération…' : '⏳ Generating…';

  try {
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(b => b ? resolve(b) : reject('no blob'), 'image/png');
    });

    const file = new File([blob], 'oracle-fact.png', { type: 'image/png' });
    let shared = false;

    // 1) Try native share with file
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Oracle' });
        shared = true;
      } catch(e) {
        if (e.name === 'AbortError') { _resetShareBtn(); return; }
      }
    }

    // 2) If file share failed, try share with just text (keeps share sheet open for user)
    if (!shared && navigator.share) {
      try {
        // Download the image first so user has it
        _downloadBlob(blob);
        const tag = lang === 'fr'
          ? '✨ Découvert avec Oracle — l\'app des curiosités du monde\nkipetchis.github.io/Oracle/oracle.html'
          : '✨ Discovered with Oracle — the world curiosity app\nkipetchis.github.io/Oracle/oracle.html';
        await navigator.share({ title: 'Oracle', text: text + '\n\n' + tag });
        shared = true;
      } catch(e) {
        if (e.name === 'AbortError') { _resetShareBtn(); return; }
      }
    }

    // 3) Final fallback: download only
    if (!shared) {
      _downloadBlob(blob);
    }

    // Count share
    state.shares = (state.shares || 0) + 1; saveState();
    setTimeout(() => { checkAchievements(); checkPlanetUnlocks(); }, 200);

    if (lbl) { lbl.textContent = lang === 'fr' ? '✓ Partagé' : '✓ Shared'; }
    setTimeout(() => { _resetShareBtn(); }, 2500);

  } catch(e) {
    showToast(lang === 'fr' ? 'Erreur lors de la génération' : 'Error generating image');
    _resetShareBtn();
  }
}

function _downloadBlob(blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'oracle-fact.png';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  showToast(lang === 'fr' ? '📥 Image sauvegardée' : '📥 Image saved');
}

function _resetShareBtn() {
  const lbl = document.getElementById('shareImgLabel');
  if (lbl) lbl.textContent = lang === 'fr' ? 'Partager' : 'Share';
}

function closeShare(){document.getElementById('shareOverlay').classList.remove('open');document.getElementById('shareSheet').classList.remove('open');window._shareText=null;window._shareRaw=null;window._shareCat=null;}
async function copyToClipboard(text){
  // Method 1: execCommand FIRST (synchronous, works best on Android WebView/TWA)
  try{
    const ta=document.createElement('textarea');
    ta.value=text;
    ta.style.cssText='position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:none;outline:none;box-shadow:none;opacity:0.01';
    document.body.appendChild(ta);
    ta.focus();
    ta.setSelectionRange(0,text.length);
    const ok=document.execCommand('copy');
    document.body.removeChild(ta);
    if(ok) return true;
  }catch(e){}
  // Method 2: Clipboard API (async, may fail in TWA)
  if(navigator.clipboard&&navigator.clipboard.writeText){
    try{await navigator.clipboard.writeText(text);return true;}catch(e){}
  }
  return false;
}
async function copyFact(){
  haptic('light');const text=buildShareText();
  let ok=await copyToClipboard(text);
  if(!ok){try{window.prompt(lang==='fr'?'Copie ce texte :':'Copy this text:',text);ok=true;}catch(e){}}
  const btn=document.getElementById('copyBtn');
  if(ok){btn.classList.add('copied');btn.innerHTML=`<span>✓</span><span>${T[lang].copiedLabel}</span>`;showToast(T[lang].toastCopied);}
  else{showToast(lang==='fr'?'Maintiens le texte pour copier':'Long-press text to copy');}
}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400);}
function shareTo(platform){
  haptic('light');
  const text=encodeURIComponent(buildShareText()),raw=buildShareText();
  state.shares=(state.shares||0)+1;saveState();setTimeout(()=>{checkAchievements();checkPlanetUnlocks();},200);
  const urls={whatsapp:`https://wa.me/?text=${text}`,facebook:`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Foracle-app.com&quote=${text}`,twitter:`https://twitter.com/intent/tweet?text=${text}`,telegram:`https://t.me/share/url?url=https%3A%2F%2Foracle-app.com&text=${text}`};
  if(platform==='instagram'||platform==='tiktok'||platform==='snapchat'){copyToClipboard(raw);showToast(T[lang].toastCopied);closeShare();return;}
  if(platform==='messenger'){window.location.href=`fb-messenger://share?link=https%3A%2F%2Foracle-app.com`;setTimeout(()=>window.open(`https://www.facebook.com/dialog/send?link=https%3A%2F%2Foracle-app.com&app_id=966242223397117&redirect_uri=https%3A%2F%2Foracle-app.com`,'_blank'),1500);closeShare();return;}
  if(urls[platform]){window.open(urls[platform],'_blank');closeShare();}
}
async function shareNative(){
  haptic('light');if(!currentFact)return;
  openShare();
}

// ── DEEP DIVE ────────────────────────────────────────────────────────────
function showDeepDive(){
  if(!currentFact) return;
  haptic('light');
  const data = DEEP_DIVES[currentFact.id];
  if(!data) return;
  const items = lang==='fr' ? data.fr : data.en;
  if(!items || !items.length) return;
  const container = document.getElementById('deepDiveContainer');
  const btn = document.getElementById('deepDiveBtn');
  if(!container) return;
  if(btn) btn.style.display = 'none';
  const card = container.closest('.card');
  if(card) card.classList.add('dd-open');
  container.style.display = 'block';
  container.innerHTML = `
    <div class="dd-header">${lang==='fr'?'🔎 Pour aller plus loin…':'🔎 Dig deeper…'}</div>
    ${items.map((item,i) => `<div class="dd-item" style="animation-delay:${i*0.15}s"><span class="dd-bullet">✦</span><span class="dd-text">${item}</span></div>`).join('')}
  `;
  setTimeout(()=>{if(card)card.scrollTop=card.scrollHeight;},100);
}

function showInlineDeepDive(btn, factId){
  const data = DEEP_DIVES[factId];
  if(!data) return;
  const items = lang==='fr' ? data.fr : data.en;
  if(!items || !items.length) return;
  const container = btn.nextElementSibling;
  if(!container) return;
  btn.style.display = 'none';
  container.style.display = 'block';
  container.innerHTML = `
    <div class="dd-header">${lang==='fr'?'🔎 Pour aller plus loin…':'🔎 Dig deeper…'}</div>
    ${items.map((item,i) => `<div class="dd-item" style="animation-delay:${i*0.15}s"><span class="dd-bullet">✦</span><span class="dd-text">${item}</span></div>`).join('')}
  `;
  setTimeout(()=>container.scrollIntoView({behavior:'smooth',block:'nearest'}),100);
}

// ── FAVS ──────────────────────────────────────────────────────────────────
function toggleFav(){
  haptic('light');if(!currentFact)return;
  const idx=state.favs.findIndex(f=>f.id===currentFact.id),btn=document.getElementById('favToggle');
  const t=T[lang];
  if(idx>=0){state.favs.splice(idx,1);if(btn){btn.innerHTML=`<span class="a-icon">♡</span><span class="a-label">${t.favBtn}</span>`;btn.classList.remove('fav-active');}}
  else{state.favs.push({id:currentFact.id,cat:currentFact.cat,label:T[lang].catLabels[currentFact.cat],text:currentFact.text});if(btn){btn.innerHTML=`<span class="a-icon">♥</span><span class="a-label">${t.favBtn}</span>`;btn.classList.add('fav-active');}setTimeout(()=>checkAchievements(),200);}
  saveState();updateFavBadge();
}
function updateFavBadge(){}

function updateAllUI(){
  try{
    updateFavBadge();
    if(typeof applyPlanetSkin==='function') applyPlanetSkin(state.activePlanet||'earth');
    if(typeof checkPlanetUnlocks==='function') checkPlanetUnlocks();
    if(typeof checkAchievements==='function') checkAchievements();
  }catch(e){console.warn('updateAllUI error:',e);}
}

function shareFav(text, cat) {
  // Temporarily set currentFact to this fav for sharing
  const _prev = currentFact;
  currentFact = {text, cat, source: ''};
  window._shareRaw = text;
  window._shareCat = cat;
  openShare();
  currentFact = _prev;
}

function renderHistory(){
  const elOld=document.getElementById('historyList');
  const el=document.getElementById('historyListInline')||elOld;
  if(!el) return;
  if(!state.history||!state.history.length){
    el.innerHTML=`<p class="fav-empty">${lang==='fr'?'Aucun fait lu pour le moment.':'No facts read yet.'}</p>`;
    return;
  }
  renderCatGrid(el, state.history, 'history');
}

function renderCatGrid(el, items, mode){
  // Grouper par catégorie
  const groups={};
  items.forEach(f=>{
    if(!groups[f.cat]) groups[f.cat]=[];
    groups[f.cat].push(f);
  });
  const cats=Object.keys(groups);
  const catLabels=T[lang].catLabels||{};
  el.innerHTML=`<div class="cat-grid">${cats.map(cat=>{
    const count=groups[cat].length;
    const icon=CAT_ICONS[cat]||'✦';
    const rawLabel=catLabels[cat]||cat;
    const label=rawLabel.replace('✦ ','');
    return`<div class="cat-card" onclick="openCatFacts('${cat}','${mode}')">
      <div class="cat-card-icon">${icon}</div>
      <div class="cat-card-name">${label}</div>
      <div class="cat-card-count">${count}</div>
    </div>`;
  }).join('')}</div>`;
}

function openCatFacts(cat, mode){
  const items = mode==='favs' ? state.favs : (state.history||[]);
  const filtered = items.filter(f=>f.cat===cat);
  const catLabels=T[lang].catLabels||{};
  const label=(catLabels[cat]||cat).replace('✦ ','');
  const icon=CAT_ICONS[cat]||'✦';
  const isFavMode = mode==='favs';

  // Quel conteneur afficher ?
  const elId = mode==='favs' ? 'favsList' : 'historyListInline';
  const el = document.getElementById(elId);
  if(!el) return;

  el.innerHTML=`
    <button class="cat-back-btn" onclick="renderCatView('${mode}')">← ${lang==='fr'?'Catégories':'Categories'}</button>
    <div style="margin-bottom:10px;font-family:'Space Mono',monospace;font-size:.52rem;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted)">${icon} ${label}</div>
    ${filtered.map((f,i)=>{
      const origIdx = items.indexOf(f);
      const safeText=f.text.replace(/'/g,"\\'").replace(/"/g,'&quot;');
      const isFav=state.favs.some(fv=>fv.id===f.id);
      return`<div class="fav-item">
        ${isFavMode?'':`<div class="fav-item-badge badge-${f.cat}"><span class="badge-dot"></span><span style="margin-left:auto;font-size:.6rem;opacity:.4">${f.date||''}</span></div>`}
        <p class="fav-item-text">${f.text}</p>
        ${DEEP_DIVES[f.id]?`<button class="deep-dive-btn" onclick="haptic('light');showInlineDeepDive(this,'${f.id}')"><span class="dd-icon">🔎</span> ${lang==='fr'?'Creuser le sujet':'Dig deeper'}</button><div class="deep-dive-container" style="display:none;"></div>`:''}
        <div class="fav-item-actions">
          ${!isFavMode?`<button class="hist-fav-btn ${isFav?'is-fav':''}" onclick="haptic();toggleHistFav('${f.id}','${f.cat}','${safeText}');openCatFacts('${cat}','${mode}')">${isFav?'♥':'♡'}</button>`:''}
          <button class="fav-share-btn" onclick="haptic();shareFav('${safeText}','${f.cat}')">↗ ${lang==='fr'?'Partager':'Share'}</button>
          ${isFavMode?`<button class="fav-remove" onclick="removeFavAndRefresh(${origIdx},'${cat}')">✕</button>`:''}
        </div>
      </div>`;
    }).join('')}`;
}

function renderCatView(mode){
  if(mode==='favs') renderFavs();
  else renderHistory();
}

function switchFavTab(tab){
  const tabFavs = document.getElementById('tabFavs');
  const tabHist = document.getElementById('tabHistory');
  const tabEphem = document.getElementById('tabEphem');
  const favsList = document.getElementById('favsList');
  const histList = document.getElementById('historyListInline');
  const ephemList = document.getElementById('ephemListInline');
  // Reset all tabs
  if(tabFavs) tabFavs.classList.remove('active');
  if(tabHist) tabHist.classList.remove('active');
  if(tabEphem) tabEphem.classList.remove('active');
  if(favsList) favsList.style.display='none';
  if(histList) histList.style.display='none';
  if(ephemList) ephemList.style.display='none';
  if(tab==='favs'){
    if(tabFavs) tabFavs.classList.add('active');
    if(favsList) favsList.style.display='';
    renderFavs();
  } else if(tab==='history'){
    if(tabHist) tabHist.classList.add('active');
    if(histList) histList.style.display='';
    renderHistory();
  } else if(tab==='ephem'){
    if(tabEphem) tabEphem.classList.add('active');
    if(ephemList) ephemList.style.display='';
    renderEphemHistory();
  }
}

function renderFavs(){
  const el=document.getElementById('favsList');
  if(!el) return;
  if(!state.favs.length){el.innerHTML=`<p class="fav-empty">${T[lang].favEmpty.replace('\n','<br>')}</p>`;return;}
  renderCatGrid(el, state.favs, 'favs');
}
function removeFav(i){haptic('light');state.favs.splice(i,1);saveState();updateFavBadge();renderFavs();}
function removeFavAndRefresh(i, cat){
  haptic('light');
  state.favs.splice(i,1);
  saveState();
  updateFavBadge();
  // Rester dans la vue catégorie si elle a encore des faits, sinon retour grille
  const remaining=state.favs.filter(f=>f.cat===cat);
  if(remaining.length>0) openCatFacts(cat,'favs');
  else renderFavs();
}

// ── EPHEMERIDES HISTORY ──────────────────────────────────────────────────
function renderEphemHistory(){
  const el=document.getElementById('ephemListInline');
  if(!el) return;
  if(!state.ephemHistory) state.ephemHistory=[];
  if(!state.ephemHistory.length){
    el.innerHTML=`<p class="fav-empty">${lang==='fr'?'Aucune éphéméride lue pour le moment.<br>Ouvre le fait du jour chaque matin !':'No daily facts read yet.<br>Open the fact of the day each morning!'}</p>`;
    return;
  }
  el.innerHTML=state.ephemHistory.map(f=>{
    const isFav=state.favs.some(fv=>fv.id===f.id);
    const safeText=f.text.replace(/'/g,"\\'").replace(/"/g,'&quot;');
    return`<div class="fav-item">
      <div class="fav-item-badge"><span class="badge-dot"></span><span style="margin-left:auto;font-size:.6rem;opacity:.4">${f.date||''}</span></div>
      <p class="fav-item-text">${f.text}</p>
      ${DEEP_DIVES[f.id]?`<button class="deep-dive-btn" onclick="haptic('light');showInlineDeepDive(this,'${f.id}')"><span class="dd-icon">🔎</span> ${lang==='fr'?'Creuser le sujet':'Dig deeper'}</button><div class="deep-dive-container" style="display:none;"></div>`:''}
      <div class="fav-item-actions">
        <button class="hist-fav-btn ${isFav?'is-fav':''}" onclick="haptic();toggleHistFav('${f.id}','${f.cat||'positive'}','${safeText}');renderEphemHistory()">${isFav?'♥':'♡'}</button>
        <button class="fav-share-btn" onclick="haptic();shareFav('${safeText}','${f.cat||'positive'}')">↗ ${lang==='fr'?'Partager':'Share'}</button>
      </div>
    </div>`;
  }).join('');
}

// ── TOGGLE FAV FROM HISTORY ──────────────────────────────────────────────
function toggleHistFav(id, cat, text){
  const idx=state.favs.findIndex(f=>f.id===id);
  if(idx>=0){
    state.favs.splice(idx,1);
  } else {
    const label=(T[lang].catLabels||{})[cat]||cat;
    state.favs.push({id, cat, label, text});
    setTimeout(()=>checkAchievements(),200);
  }
  saveState();
  updateFavBadge();
}

// ── ACHIEVEMENTS ──────────────────────────────────────────────────────────
function getProgress(ach){
  if(ach.type==='planet')return state.unlockedPlanets.includes(ach.target)?1:0;
  const cats=['total','science','positive','fun','history','space','animals','body','arts','inventions','world','language','food','sports','celebrities','fiction','gaming','cinema','music','mythology','psychology','oceans','records','quotes','laws','tales','dinosaurs'];
  if(cats.includes(ach.type))return state.read[ach.type]||0;
  if(ach.type==='fav')return state.favs.length;
  if(ach.type==='streak')return state.streak||1;
  if(ach.type==='shares')return state.shares||0;
  if(ach.type==='ephem')return state.ephemRead||0;
  return 0;
}
function checkAchievements(){
  const nu=[];
  for(const ach of ACH_DEF){
    if(state.unlocked.includes(ach.id))continue;
    const target=ach.type==='planet'?1:ach.target;
    if(getProgress(ach)>=target){state.unlocked.push(ach.id);nu.push(ach);}
  }
  saveState();if(nu.length>0){haptic('celebration');showCelebration(nu[0]);}
}
function renderAchievements(){
  const el=document.getElementById('achievementsList');
  if(!ACH_DEF.length)return;
  const groups=[...new Set(ACH_DEF.map(a=>a.group))];
  el.innerHTML=groups.map(g=>{
    const items=ACH_DEF.filter(a=>a.group===g);
    return`<div class="ach-section-title">${g}</div><div class="achievements-grid">`+items.map(ach=>{
      const target=ach.type==='planet'?1:ach.target;
      const prog=Math.min(getProgress(ach),target),pct=Math.round(prog/target*100),unlocked=state.unlocked.includes(ach.id);
      return`<div class="ach-item ${unlocked?'unlocked':''}"><div class="ach-icon">${ach.icon}</div><div class="ach-info"><div class="ach-name">${ach.name}</div><div class="ach-desc">${ach.desc}</div><div class="ach-prog-label">${prog} / ${target}</div><div class="ach-bar"><div class="ach-bar-fill" style="width:${pct}%"></div></div></div></div>`;
    }).join('')+'</div>';
  }).join('');
}

// ── CELEBRATION ───────────────────────────────────────────────────────────
function showCelebration(ach){document.getElementById('celebIcon').textContent=ach.icon;document.getElementById('celebName').textContent=ach.name;document.getElementById('celebDesc').textContent=ach.desc;document.getElementById('celebration').classList.add('active');spawnConfetti(document.getElementById('celebration'));}
function closeCelebration(){document.getElementById('celebration').classList.remove('active');document.querySelectorAll('#celebration .confetti-piece').forEach(e=>e.remove());}
function spawnConfetti(container){
  const colors=['#00c2ff','#39ff8f','#ff9f3f','#e0a060','#c084fc','#f472b6','#fb7185','#f59e0b','#34d399','#22d3ee','#a78bfa','#86efac','#fff'];
  for(let i=0;i<70;i++){const p=document.createElement('div');p.className='confetti-piece';p.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*30-10}%;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${1.2+Math.random()*1.8}s;animation-delay:${Math.random()*.6}s;width:${5+Math.random()*6}px;height:${5+Math.random()*6}px;border-radius:${Math.random()>.5?'50%':'2px'};`;container.appendChild(p);setTimeout(()=>p.remove(),3000);}
}

function openPanel(type){
  if(type==='favs'){renderFavs();document.getElementById('panelFavs').classList.add('open');}
  else if(type==='history'){renderHistory();document.getElementById('panelHistory').classList.add('open');}
  else{renderAchievements();document.getElementById('panelAchievements').classList.add('open');}
}
// ── LIMITE QUOTIDIENNE ────────────────────────────────────────────────────
const DAILY_LIMIT = 5;
let _dlTimerInterval = null;


function renderDailyLimitStats() {
  const t = T[lang];
  const total = state.read.total || 0;
  const streak = state.streak || 0;
  const qCorrect = state.quizCorrect || 0;
  const qTotal = state.quizTotal || 0;
  const pct = qTotal > 0 ? Math.round(qCorrect/qTotal*100) : 0;
  const favCount = (state.favs||[]).length;
  const planetsCount = (state.unlockedPlanets||['earth']).length;

  // Stats grid
  const sg = document.getElementById('dlStatsGrid');
  if(sg) sg.innerHTML = `
    <div class="dl-stat-item dl-stat-link" onclick="haptic();closeDailyLimit();openPanel('favs');switchFavTab('history')"><div class="dl-stat-val">${total}</div><div class="dl-stat-label">${lang==='fr'?'FAITS LUS':'FACTS READ'}</div></div>
    <div class="dl-stat-item"><div class="dl-stat-val">${streak}</div><div class="dl-stat-label">${lang==='fr'?'JOURS D\'AFFILÉE':'DAY STREAK'}</div></div>
    <div class="dl-stat-item"><div class="dl-stat-val">${pct}%</div><div class="dl-stat-label">${lang==='fr'?'AU QUIZ':'QUIZ SCORE'}</div></div>
    <div class="dl-stat-item dl-stat-link" onclick="haptic();closeDailyLimit();openPanel('favs');switchFavTab('favs')"><div class="dl-stat-val">${favCount}</div><div class="dl-stat-label">${lang==='fr'?'FAVORIS':'FAVORITES'}</div></div>
    <div class="dl-stat-item dl-stat-link" onclick="haptic();closeDailyLimit();openPlanetPanel()"><div class="dl-stat-val">${planetsCount}</div><div class="dl-stat-label">${lang==='fr'?'PLANÈTES':'PLANETS'}</div></div>
    <div class="dl-stat-item"><div class="dl-stat-val">${state.shares||0}</div><div class="dl-stat-label">${lang==='fr'?'PARTAGES':'SHARES'}</div></div>
  `;

  // Achievements
  const ag = document.getElementById('dlAchGrid');
  if(ag) {
    const achDefs = buildAchDef(lang);
    const items = achDefs.slice(0,18).map(a=>{
      const unlocked = (state.unlocked||[]).includes(a.id);
      return `<span class="dl-ach-item${unlocked?' unlocked':''}" title="${a.name}">${a.icon||'⬡'}</span>`;
    }).join('');
    ag.innerHTML = items;
  }
}

function showDailyLimit(){
  history.pushState({screen:'dailyLimit'}, '');
  renderDailyLimitStats();
  haptic('heavy');
  const t = T[lang];
  document.getElementById('dlTitle').textContent = lang==='fr' ? 'À demain !' : 'See you tomorrow!';
  document.getElementById('dlSub').textContent = lang==='fr'
    ? `Tu as découvert tes ${DAILY_LIMIT} curiosités du jour. L'Oracle se repose… et revient demain avec de nouvelles merveilles.`
    : `You've discovered your ${DAILY_LIMIT} facts for today. The Oracle is resting… and returns tomorrow with new wonders.`;
  document.getElementById('dlFavsBtn').textContent = lang==='fr' ? '♡ Relire mes favoris' : '♡ Review my favourites';
  document.getElementById('dlTimerLabel').textContent = lang==='fr' ? 'avant le prochain lot' : 'until the next batch';
  document.getElementById('dailyLimitScreen').classList.add('active');
  startDlTimer();
  setTimeout(flushPendingEndOfDayChecks, 450);
}

function closeDailyLimit(){
  document.getElementById('dailyLimitScreen').classList.remove('active');
  if(_dlTimerInterval){clearInterval(_dlTimerInterval);_dlTimerInterval=null;}
}

function startDlTimer(){
  if(_dlTimerInterval) clearInterval(_dlTimerInterval);
  function update(){
    const now=new Date();
    const midnight=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,0,0,0);
    const diff=midnight-now;
    const h=Math.floor(diff/3600000);
    const m=Math.floor((diff%3600000)/60000);
    const s=Math.floor((diff%60000)/1000);
    document.getElementById('dlTimer').textContent=
      `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
  update();
  _dlTimerInterval=setInterval(update,1000);
}

function closePanel(type){document.getElementById(type==='favs'?'panelFavs':'panelAchievements').classList.remove('open');}

// ── FAIT DU JOUR ──────────────────────────────────────────────────────────
// Pick a deterministic daily fact based on today's date
function getDailyFact() {
  const today = new Date();
  // 1. Journée thématique (priorité absolue)
  const thematic = getThematicFact(today);
  if (thematic) return { id: 'thematic_' + today.toISOString().slice(0,10), cat: 'thematic', _thematic: thematic };
  // 2. Éphéméride du jour (toujours un éphéméride, jamais un fait de l'orbe)
  const mm = String(today.getMonth()+1).padStart(2,'0');
  const dd = String(today.getDate()).padStart(2,'0');
  const entry = EPHEMERIS[mm + '-' + dd] || EPHEMERIS['01-01'];
  const text = lang === 'fr' ? entry.fr : entry.en;
  return { id: entry.id, cat: entry.cat, text: text, _ephemeris: true, _ephem_src: entry.src };
}

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

function isDailyNew() {
  return state.lastDailyDate !== getTodayStr();
}

function initDailyBanner() {
  const banner = document.getElementById('dailyBanner');
  if (!banner) return;
  // Si déjà lu aujourd'hui, on masque la bannière
  if (!isDailyNew()) { banner.style.display = 'none'; return; }
  const fact = getDailyFact();
  const t = T[lang];
  const bannerText = fact._thematic ? fact._thematic.text : fact.text;
  const bannerIcon = fact._thematic ? fact._thematic.icon : (CAT_ICONS[fact.cat] || '📅');
  const bannerLabel = fact._thematic ? fact._thematic.label : (lang==='fr' ? '✦ Fait du jour' : '✦ Fact of the day');
  document.getElementById('dailyBannerText').textContent = bannerText;
  document.getElementById('dailyBannerLabel').textContent = bannerLabel;
  document.getElementById('dailyBannerDate').textContent =
    new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {day:'numeric', month:'short'});
  const dot = document.getElementById('dailyNewDot');
  if (dot) dot.style.display = 'block';
  banner.style.display = 'flex';
}

function openDailyOverlay() {
  haptic('light');
  const fact = getDailyFact();
  const t = T[lang];
  // Track ephemeris reads for Venus planet (only once per day)
  if(state.lastDailyDate !== getTodayStr()){
    state.ephemRead = (state.ephemRead || 0) + 1;
    // Track ephemeris in history
    if(!state.ephemHistory) state.ephemHistory = [];
    const displayText = fact._thematic ? fact._thematic.text : fact.text;
    const cat = fact._thematic ? 'thematic' : fact.cat;
    const label = fact._thematic ? fact._thematic.label : (t.catLabels[fact.cat]||'');
    const icon = fact._thematic ? fact._thematic.icon : (CAT_ICONS[fact.cat]||'📅');
    if(!state.ephemHistory.some(h=>h.id===fact.id)){
      state.ephemHistory.unshift({id:fact.id, cat, label, icon, text:displayText, date:new Date().toLocaleDateString(lang==='fr'?'fr-FR':'en-US')});
      if(state.ephemHistory.length>100) state.ephemHistory.pop();
    }
  }
  state.lastDailyDate = getTodayStr();
  saveState();
  setTimeout(()=>{checkAchievements();checkPlanetUnlocks();},300);
  // Hide new dot
  const dot = document.getElementById('dailyNewDot');
  if (dot) dot.style.display = 'none';

  document.getElementById('dailyPanelTitle').textContent =
    lang === 'fr' ? '✦ Fait du jour' : '✦ Fact of the day';
  // Handle thematic day
  const isThematic = !!fact._thematic;
  const displayIcon = isThematic ? fact._thematic.icon : (CAT_ICONS[fact.cat] || '📅');
  const displayText = isThematic ? fact._thematic.text : fact.text;
  const displayLabel = isThematic ? fact._thematic.label : (t.catLabels[fact.cat]||'');
  const displaySrc   = isThematic ? fact._thematic.src : fact._ephemeris ? (()=>{const u=fact._ephem_src||'';try{return{n:new URL(u).hostname.replace('www.',''),u};}catch(e){return{n:'Source',u};}})() : SOURCES[fact.id];
  document.getElementById('dailyCatIcon').textContent = displayIcon;
  const badge = document.getElementById('dailyCatBadge');
  const badgeColor = isThematic ? '#c084fc' : `var(--glow-${fact.cat})`;
  badge.innerHTML = `<span class="badge-dot" style="background:${badgeColor}"></span><span style="color:${badgeColor};font-family:'Space Mono',monospace;font-size:.56rem;letter-spacing:.14em;text-transform:uppercase">${displayLabel}</span>`;
  document.getElementById('dailyFactText').textContent = displayText;
  document.getElementById('dailyShareBtn').textContent = lang === 'fr' ? '↗ Partager' : '↗ Share';

  // Source du fait du jour
  const dailySrc = displaySrc;
  let dailySrcEl = document.getElementById('dailySourceRow');
  if (!dailySrcEl) {
    dailySrcEl = document.createElement('div');
    dailySrcEl.id = 'dailySourceRow';
    dailySrcEl.className = 'card-source';
    dailySrcEl.style.cssText = 'justify-content:center;margin-top:12px;';
    document.getElementById('dailyFactText').insertAdjacentElement('afterend', dailySrcEl);
  }
  if (dailySrc) {
    dailySrcEl.innerHTML = `<span class="card-source-label">src</span><a class="card-source-link" href="${dailySrc.u}" target="_blank" rel="noopener">${dailySrc.n}</a>`;
    dailySrcEl.style.display = 'flex';
  } else {
    dailySrcEl.style.display = 'none';
  }

  // Bouton favori
  _updateDailyFavBtn(fact);

  // Deep dive button
  const ddBtn = document.getElementById('dailyDdBtn');
  const ddContainer = document.getElementById('dailyDdContainer');
  ddContainer.style.display = 'none';
  ddContainer.innerHTML = '';
  ddBtn.style.display = 'inline-block';
  const ddData = DEEP_DIVES[fact.id];
  if(ddData && ((lang==='fr'?ddData.fr:ddData.en)||[]).length){
    ddBtn.style.display = 'inline-block';
    ddBtn.innerHTML = `🔎 <span id="dailyDdLabel">${lang==='fr'?'Creuser le sujet':'Dig deeper'}</span>`;
  } else {
    ddBtn.style.display = 'none';
  }

  document.getElementById('dailyOverlay').classList.add('open');
  // Store fact for sharing
  window._dailyFactForShare = fact;
}

function showDailyDeepDive(btn){
  haptic('light');
  const fact = window._dailyFactForShare;
  if(!fact) return;
  const data = DEEP_DIVES[fact.id];
  if(!data) return;
  const items = lang==='fr' ? data.fr : data.en;
  if(!items || !items.length) return;
  btn.style.display = 'none';
  const container = document.getElementById('dailyDdContainer');
  container.style.display = 'block';
  container.innerHTML = `
    <div class="dd-header">${lang==='fr'?'🔎 Pour aller plus loin…':'🔎 Dig deeper…'}</div>
    ${items.map((item,i) => `<div class="dd-item" style="animation-delay:${i*0.15}s"><span class="dd-bullet">✦</span><span class="dd-text">${item}</span></div>`).join('')}
  `;
  setTimeout(()=>container.scrollIntoView({behavior:'smooth',block:'nearest'}),100);
}

function closeDailyOverlay() {
  document.getElementById('dailyOverlay').classList.remove('open');
  // Masquer la bannière puisque le fait a été lu
  const banner = document.getElementById('dailyBanner');
  if (banner) {
    banner.style.transition = 'opacity .4s ease, max-height .4s ease';
    banner.style.opacity = '0';
    setTimeout(() => { banner.style.display = 'none'; banner.style.opacity = ''; }, 400);
  }
}

function _updateDailyFavBtn(fact) {
  const btn = document.getElementById('dailyFavBtn');
  if (!btn || !fact) return;
  const isFav = state.favs.some(f => f.id === fact.id);
  btn.innerHTML = isFav ? '♥' : '♡';
  btn.classList.toggle('active', isFav);
  btn.title = isFav ? (lang==='fr'?'Retirer des favoris':'Remove from favourites') : (lang==='fr'?'Ajouter aux favoris':'Add to favourites');
}

function toggleDailyFav() {
  haptic('light');
  const fact = window._dailyFactForShare;
  if (!fact) return;
  const idx = state.favs.findIndex(f => f.id === fact.id);
  if (idx >= 0) {
    state.favs.splice(idx, 1);
  } else {
    const displayText = fact._thematic ? fact._thematic.text : fact.text;
    const cat = fact._thematic ? 'positive' : fact.cat;
    const label = fact._thematic ? fact._thematic.label : (T[lang].catLabels[fact.cat]||'');
    state.favs.push({ id: fact.id, cat, label, text: displayText });
    setTimeout(() => checkAchievements(), 200);
  }
  saveState();
  updateFavBadge();
  _updateDailyFavBtn(fact);
}

function shareDailyFact() {
  haptic('light');
  const fact = window._dailyFactForShare;
  if (!fact) return;
  // Populate the main share sheet with the daily fact
  const raw = fact.text;
  const tag = T[lang] && T[lang].shareTag ? T[lang].shareTag : '#Oracle';
  document.getElementById('sharePreview').textContent = raw;
  // Update copy button
  const btn = document.getElementById('copyBtn');
  if(btn){
    btn.classList.remove('copied');
    const lbl = T[lang] && T[lang].copyLabel ? T[lang].copyLabel : 'Copier le texte';
    btn.innerHTML = `<span>📋</span><span id="copyLabel">${lbl}</span>`;
  }
  // Override copyFact & shareTo to use daily fact text
  window._shareText = raw + '\n\n' + tag;
  window._shareRaw  = raw;
  window._shareCat  = fact.cat || 'positive';
  // Close daily overlay then open share sheet
  closeDailyOverlay();
  setTimeout(() => {
    document.getElementById('shareOverlay').classList.add('open');
    document.getElementById('shareSheet').classList.add('open');
  }, 200);
}

// ── STATS ─────────────────────────────────────────────────────────────────
// ── CURIOSITY PROFILE ─────────────────────────────────────────────────────
function getCuriosityProfile() {
  const catColors = {
    science:'#00c2ff',positive:'#39ff8f',fun:'#ff9f3f',history:'#e0a060',
    space:'#c084fc',animals:'#f472b6',body:'#fb7185',arts:'#f59e0b',
    inventions:'#34d399',world:'#22d3ee',language:'#a78bfa',food:'#f87171',
    sports:'#86efac',celebrities:'#ffd700',fiction:'#a0c4ff',gaming:'#ff6b9d',
    cinema:'#e879f9',music:'#4ade80',
    mythology:'#d4a574',psychology:'#818cf8',oceans:'#06b6d4',records:'#ef4444',
    quotes:'#fbbf24',laws:'#94a3b8',tales:'#a78bfa',dinosaurs:'#84cc16'
  };
  // Score = faits lus × 1 + favoris × 2
  const scores = {};
  const catKeys = Object.keys(CAT_ICONS);
  catKeys.forEach(k => {
    const readScore = state.read[k] || 0;
    const favScore = (state.favs || []).filter(f => f.cat === k).length * 2;
    scores[k] = readScore + favScore;
  });
  const total = Object.values(scores).reduce((a,b) => a+b, 0);
  // Top 3 catégories
  const sorted = catKeys.filter(k => scores[k] > 0).sort((a,b) => scores[b]-scores[a]);
  const top3 = sorted.slice(0, 3);

  // Profils : [catégories dominantes, emoji, nomFR, nomEN, descFR, descEN]
  const PROFILES = [
    { cats:['space','science'],       emoji:'🔭', fr:'Explorateur de l\'Infini',   en:'Explorer of the Infinite',  descFr:'Tu regardes les étoiles et questionnes l\'univers. La curiosité scientifique est ta boussole.', descEn:'You gaze at the stars and question the universe. Scientific curiosity is your compass.' },
    { cats:['science','body','inventions'], emoji:'🧬', fr:'L\'Esprit Scientifique', en:'The Scientific Mind',      descFr:'Tu dissèques le monde pour mieux le comprendre. Les mécanismes cachés te fascinent.', descEn:'You dissect the world to understand it better. Hidden mechanisms fascinate you.' },
    { cats:['arts','cinema','music'],  emoji:'🎭', fr:'L\'Âme Artistique',          en:'The Artistic Soul',         descFr:'Tu ressens avant de réfléchir. La beauté sous toutes ses formes est ton territoire.', descEn:'You feel before you think. Beauty in all its forms is your territory.' },
    { cats:['mythology','tales','history'], emoji:'📜', fr:'Le Chroniqueur Éternel',   en:'The Eternal Chronicler',  descFr:'Les mythes et légendes sont ta toile. Tu tisses le fil entre passé et imaginaire.', descEn:'Myths and legends are your canvas. You weave the thread between past and imagination.' },
    { cats:['psychology','body'],            emoji:'🧠', fr:'L\'Architecte de l\'Esprit', en:'The Mind Architect',       descFr:'Tu scrutes les mécanismes cachés de la pensée. Le cerveau humain est ton terrain de jeu.', descEn:'You probe the hidden mechanisms of thought. The human brain is your playground.' },
    { cats:['oceans','animals','science'],   emoji:'🌊', fr:'Le Gardien des Profondeurs',  en:'The Guardian of the Deep',  descFr:'Les abysses t\'appellent. Tu plonges là où personne ne va.', descEn:'The abyss calls you. You dive where no one else goes.' },
    { cats:['dinosaurs','science','space'],  emoji:'🦕', fr:'Le Voyageur du Temps',        en:'The Time Traveler',         descFr:'Du Big Bang aux dinosaures, tu explores les ères révolues avec une curiosité sans limites.', descEn:'From the Big Bang to dinosaurs, you explore bygone eras with boundless curiosity.' },
    { cats:['quotes','psychology'],          emoji:'💬', fr:'Le Sage Moderne',             en:'The Modern Sage',           descFr:'Les mots des grands esprits guident ta réflexion. Tu cherches la sagesse partout.', descEn:'The words of great minds guide your thinking. You seek wisdom everywhere.' },
    { cats:['laws','fun'],                   emoji:'⚖️', fr:'L\'Avocat du Diable',         en:'The Devil\'s Advocate',    descFr:'L\'absurde te fascine autant que la logique. Tu trouves de l\'or dans l\'insolite.', descEn:'The absurd fascinates you as much as logic. You find gold in the unusual.' },
    { cats:['records','sports'],             emoji:'🏅', fr:'Le Chasseur d\'Extrêmes',     en:'The Extreme Hunter',        descFr:'Plus haut, plus fort, plus fou. Les limites humaines sont ton obsession.', descEn:'Higher, stronger, crazier. Human limits are your obsession.' },
    { cats:['world','language','history'], emoji:'🌍', fr:'Citoyen du Monde',       en:'Citizen of the World',      descFr:'Les frontières n\'existent pas pour toi. Les cultures et l\'Histoire sont tes passions.', descEn:'Borders don\'t exist for you. Cultures and History are your passions.' },
    { cats:['animals','body'],         emoji:'🐾', fr:'L\'Ami des Bêtes',           en:'Friend of All Creatures',   descFr:'Le vivant te touche profondément. Tu vois le monde avec bienveillance et émerveillement.', descEn:'Living things move you deeply. You see the world with kindness and wonder.' },
    { cats:['gaming','fiction','cinema'], emoji:'🎮', fr:'Le Geek Érudit',          en:'The Cultured Geek',         descFr:'Tu habites autant les mondes imaginaires que le réel. La culture pop est une porte vers la réflexion.', descEn:'You inhabit imaginary worlds as much as the real one. Pop culture is a gateway to deeper thinking.' },
    { cats:['food','world'],           emoji:'🍽️', fr:'Le Gastronome',             en:'The Connoisseur',           descFr:'Tu sais que chaque plat raconte une histoire. La table est un lieu de connaissance autant que de plaisir.', descEn:'You know every dish tells a story. The table is a place of knowledge as much as pleasure.' },
    { cats:['sports','celebrities'],   emoji:'🏆', fr:'L\'Esprit de Champion',      en:'The Champion Spirit',       descFr:'Tu vibres pour les exploits humains. La performance et le dépassement de soi t\'inspirent.', descEn:'You thrive on human achievements. Performance and self-surpassing inspire you.' },
    { cats:['positive','fun'],         emoji:'✨', fr:'Le Rayon de Soleil',         en:'The Ray of Sunshine',       descFr:'Tu choisis la lumière. Les anecdotes joyeuses et les surprises positives sont ta marque de fabrique.', descEn:'You choose the light. Joyful anecdotes and positive surprises are your signature.' },
  ];

  // Calcul du profil le plus proche via overlap du top3
  let bestProfile = null;
  let bestScore = -1;
  PROFILES.forEach(p => {
    let overlap = 0;
    top3.forEach((cat, idx) => {
      if (p.cats.includes(cat)) overlap += (3 - idx); // pondération rang
    });
    if (overlap > bestScore) { bestScore = overlap; bestProfile = p; }
  });

  // Fallback : Oracle Universel si tout équilibré ou aucun match
  if (!bestProfile || bestScore === 0) {
    bestProfile = { emoji:'🌌', fr:'L\'Oracle Universel', en:'The Universal Oracle',
      descFr:'Tout t\'intéresse, rien ne t\'échappe. Tu es l\'incarnation même de la curiosité sans frontières.',
      descEn:'Everything interests you, nothing escapes you. You are the very embodiment of boundless curiosity.' };
  }

  return { profile: bestProfile, top3, scores, catColors };
}

function openStats() {
  renderStats();
  document.getElementById('statsOverlay').classList.add('open');
}
function closeStats() {
  document.getElementById('statsOverlay').classList.remove('open');
}

function renderStats() {
  const el = document.getElementById('statsBody');
  const t = T[lang];
  const total = state.read.total || 0;
  const favCount = state.favs.length;
  const shareCount = state.shares || 0;
  const streak = state.streak || 1;
  const unlockCount = state.unlocked.length;
  const quizTotal = state.quizTotal || 0;
  const quizCorrect = state.quizCorrect || 0;

  document.getElementById('statsPanelTitle').textContent =
    lang === 'fr' ? '📊 Statistiques' : '📊 Statistics';

  const catColors = {
    science:'#00c2ff',positive:'#39ff8f',fun:'#ff9f3f',history:'#e0a060',
    space:'#c084fc',animals:'#f472b6',body:'#fb7185',arts:'#f59e0b',
    inventions:'#34d399',world:'#22d3ee',language:'#a78bfa',food:'#f87171',sports:'#86efac',
    celebrities:'#ffd700',fiction:'#a0c4ff',gaming:'#ff6b9d',cinema:'#e879f9',music:'#4ade80',
    mythology:'#d4a574',psychology:'#818cf8',oceans:'#06b6d4',records:'#ef4444',
    quotes:'#fbbf24',laws:'#94a3b8',tales:'#a78bfa',dinosaurs:'#84cc16'
  };
  const catKeys = Object.keys(CAT_ICONS);
  const maxCat = Math.max(1, ...catKeys.map(k => state.read[k] || 0));

  const labels = lang === 'fr'
    ? {facts:'Faits lus', favs:'Favoris', shares:'Partages', achiev:'Succès', streak:'Série actuelle', jours:'jours', quizLbl:'Quiz', quizSub:'réponses correctes', catLbl:'Par catégorie', noQuiz:'Aucun quiz joué encore', ephemLbl:'Éphémérides lus',
       profileLbl:'Ton profil de curiosité', profileLocked:'Lis 10 faits pour découvrir ton profil', profileTop:'Tes univers favoris'}
    : {facts:'Facts read', favs:'Favourites', shares:'Shares', achiev:'Achievements', streak:'Current streak', jours:'days', quizLbl:'Quiz', quizSub:'correct answers', catLbl:'By category', noQuiz:'No quiz played yet', ephemLbl:'Daily facts read',
       profileLbl:'Your curiosity profile', profileLocked:'Read 10 facts to reveal your profile', profileTop:'Your favourite worlds'};

  // Profile block
  let profileHtml = '';
  if (total < 10) {
    profileHtml = `
    <div class="profile-section-title">${labels.profileLbl}</div>
    <div class="profile-card">
      <div class="profile-locked">
        <div class="profile-locked-icon">🔮</div>
        <div class="profile-locked-lbl">${labels.profileLocked}<br/>(${total}/10)</div>
      </div>
    </div>`;
  } else {
    const { profile, top3, catColors } = getCuriosityProfile();
    const profileName = lang === 'fr' ? profile.fr : profile.en;
    const profileDesc = lang === 'fr' ? profile.descFr : profile.descEn;
    const chipsHtml = top3.map(k => `
      <div class="profile-cat-chip" style="border-color:${catColors[k]}33">
        <span class="profile-cat-chip-icon">${CAT_ICONS[k]}</span>
        <span class="profile-cat-chip-name" style="color:${catColors[k]}">${(t.catLabels[k]||'').replace('✦ ','')}</span>
      </div>`).join('');
    const glowColor = top3[0] ? catColors[top3[0]] : '#c084fc';
    profileHtml = `
    <div class="profile-section-title">${labels.profileLbl}</div>
    <div class="profile-card" style="border-color:${glowColor}33;box-shadow:0 0 28px ${glowColor}0d">
      <div class="profile-header">
        <div class="profile-emoji">${profile.emoji}</div>
        <div class="profile-title-block">
          <div class="profile-label">${labels.profileLbl}</div>
          <div class="profile-name" style="color:${glowColor}">${profileName}</div>
        </div>
      </div>
      <div class="profile-desc">${profileDesc}</div>
      ${top3.length ? `<div class="profile-label" style="margin-bottom:8px">${labels.profileTop}</div><div class="profile-top-cats">${chipsHtml}</div>` : ''}
    </div>`;
  }

  el.innerHTML = `
    ${profileHtml}
    <!-- Streak highlight -->
    <div class="stats-streak">
      <div class="stats-streak-flame">🔥</div>
      <div>
        <div class="stats-streak-val">${streak}</div>
        <div class="stats-streak-lbl">${labels.streak} — ${streak} ${labels.jours}</div>
      </div>
    </div>

    <!-- Big numbers -->
    <div class="stats-numbers">
      <div class="stat-card stat-link" onclick="haptic();closeStats();openPanel('favs');switchFavTab('history')">
        <div class="stat-val">${total}</div>
        <div class="stat-lbl">${labels.facts}</div>
      </div>
      <div class="stat-card stat-link" onclick="haptic();closeStats();openPanel('favs');switchFavTab('favs')">
        <div class="stat-val">${favCount}</div>
        <div class="stat-lbl">${labels.favs}</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${shareCount}</div>
        <div class="stat-lbl">${labels.shares}</div>
      </div>
    </div>
    <div class="stats-numbers" style="margin-top:-8px">
      <div class="stat-card stat-link" onclick="haptic();closeStats();openPanel('achievements')">
        <div class="stat-val">${unlockCount}</div>
        <div class="stat-lbl">${labels.achiev}</div>
      </div>
      <div class="stat-card stat-link" onclick="haptic();closeStats();openPanel('favs');switchFavTab('ephem')">
        <div class="stat-val">📅 ${state.ephemRead||0}</div>
        <div class="stat-lbl">${labels.ephemLbl}</div>
      </div>
      <div class="stat-card">
        <div class="stat-val" style="font-size:clamp(1.2rem,4vw,1.6rem)">${quizTotal > 0 ? `${quizCorrect}/${quizTotal}` : '—'}</div>
        <div class="stat-lbl">${labels.quizLbl} · ${quizTotal > 0 ? labels.quizSub : labels.noQuiz}</div>
      </div>
    </div>

    <!-- Category bars -->
    <div class="stats-section-title">${labels.catLbl}</div>
    <div class="cat-bars">
      ${catKeys.map(k => {
        const count = state.read[k] || 0;
        const pct = Math.round((count / maxCat) * 100);
        const fullLabel = (t.catLabels[k]||'').replace('✦ ','');
        return `<div class="cat-bar-row">
          <div class="cat-bar-header">
            <div class="cat-bar-left">
              <div class="cat-bar-icon">${CAT_ICONS[k]}</div>
              <div class="cat-bar-name">${fullLabel}</div>
            </div>
            <div class="cat-bar-count">${count}</div>
          </div>
          <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${pct}%;background:${catColors[k]||'#fff'}"></div></div>
        </div>`;
      }).join('')}
    </div>
  `;
}




// ── JOURNÉES THÉMATIQUES ──────────────────────────────────────────────────
// Format : 'MM-DD' pour dates fixes, calcul Pâques pour dates mobiles
// Sources : ONU (un.org/fr/observances), Église catholique, traditions populaires

const THEMATIC_DAYS = {
  "01-01": {
    fr: { label:"✦ Jour de l'An", icon:"🎆",
      text:"Le 1er janvier est devenu le premier jour de l'année dans le monde occidental grâce au calendrier grégorien, adopté progressivement depuis 1582 à la demande du pape Grégoire XIII pour corriger la dérive du calendrier julien.",
      src:{n:"Encyclopædia Britannica — Gregorian calendar", u:"https://www.britannica.com/science/Gregorian-calendar"}},
    en: { label:"✦ New Year's Day", icon:"🎆",
      text:"January 1st became the start of the year in the Western world thanks to the Gregorian calendar, gradually adopted from 1582 onwards at Pope Gregory XIII's request to correct the drift of the Julian calendar.",
      src:{n:"Encyclopædia Britannica — Gregorian calendar", u:"https://www.britannica.com/science/Gregorian-calendar"}}
  },
  "01-27": {
    fr: { label:"✦ Journée Mémoire Holocauste", icon:"🕯️",
      text:"Le 27 janvier est la Journée internationale dédiée à la mémoire des victimes de l'Holocauste, date choisie par l'ONU en 2005 car c'est le jour de la libération d'Auschwitz-Birkenau par l'Armée Rouge en 1945.",
      src:{n:"ONU — Résolution A/RES/60/7", u:"https://www.un.org/fr/observances/holocaust-remembrance"}},
    en: { label:"✦ Holocaust Remembrance Day", icon:"🕯️",
      text:"January 27th is the International Day in Memory of the Victims of the Holocaust, chosen by the UN in 2005 as it marks the liberation of Auschwitz-Birkenau by the Red Army in 1945.",
      src:{n:"UN — Resolution A/RES/60/7", u:"https://www.un.org/en/observances/holocaust-remembrance"}}
  },
  "02-02": {
    fr: { label:"✦ Journée mondiale des zones humides", icon:"🦢",
      text:"Le 2 février commémore la signature de la Convention de Ramsar en 1971, premier traité intergouvernemental dédié à la conservation des zones humides. Aujourd'hui, 2 400 sites Ramsar couvrent 254 millions d'hectares dans 172 pays.",
      src:{n:"Convention de Ramsar / ONU", u:"https://www.ramsar.org/"}},
    en: { label:"✦ World Wetlands Day", icon:"🦢",
      text:"February 2nd marks the signing of the Ramsar Convention in 1971, the first intergovernmental treaty dedicated to wetland conservation. Today, 2,400 Ramsar sites cover 254 million hectares across 172 countries.",
      src:{n:"Ramsar Convention / UN", u:"https://www.ramsar.org/"}}
  },
  "02-14": {
    fr: { label:"✦ Saint-Valentin", icon:"❤️",
      text:"La Saint-Valentin comme fête des amoureux apparaît pour la première fois sous la plume de Geoffrey Chaucer en 1382, dans son poème « Parlement des oyseaux ». L'association entre le 14 février et les oiseaux qui s'accouplent au printemps a popularisé cette date romantique.",
      src:{n:"Journal of the History of Ideas — Kelly 1986", u:"https://www.jstor.org/stable/2709260"}},
    en: { label:"✦ Valentine's Day", icon:"❤️",
      text:"Valentine's Day as a celebration of love first appears in Geoffrey Chaucer's 1382 poem 'Parlement of Foules'. The association between February 14th and birds mating in spring helped popularise this romantic date.",
      src:{n:"Journal of the History of Ideas — Kelly 1986", u:"https://www.jstor.org/stable/2709260"}}
  },
  "03-08": {
    fr: { label:"✦ Journée internationale de la femme", icon:"♀️",
      text:"La Journée internationale de la femme a été officialisée par l'ONU en 1977, mais ses racines remontent aux grèves de 1908 à New York, quand 15 000 femmes ont marché pour réclamer le droit de vote, de meilleures conditions de travail et la réduction du temps de travail.",
      src:{n:"ONU — Résolution A/RES/32/142", u:"https://www.un.org/fr/observances/womens-day"}},
    en: { label:"✦ International Women's Day", icon:"♀️",
      text:"International Women's Day was officially recognised by the UN in 1977, but its roots trace back to the 1908 strikes in New York, when 15,000 women marched demanding the right to vote, better working conditions and shorter hours.",
      src:{n:"UN — Resolution A/RES/32/142", u:"https://www.un.org/en/observances/womens-day"}}
  },
  "03-20": {
    fr: { label:"✦ Journée internationale du bonheur", icon:"😊",
      text:"La Journée internationale du bonheur, instaurée par l'ONU en 2012, coïncide avec l'équinoxe de printemps. Le Bhoutan, pays précurseur du Bonheur National Brut depuis les années 1970, est à l'origine de cette initiative mondiale.",
      src:{n:"ONU — Résolution A/RES/66/281", u:"https://www.un.org/fr/observances/happiness-day"}},
    en: { label:"✦ International Day of Happiness", icon:"😊",
      text:"The International Day of Happiness, established by the UN in 2012, coincides with the spring equinox. Bhutan, pioneer of Gross National Happiness since the 1970s, was behind this global initiative.",
      src:{n:"UN — Resolution A/RES/66/281", u:"https://www.un.org/en/observances/happiness-day"}}
  },
  "03-21": {
    fr: { label:"✦ Journée mondiale de la forêt", icon:"🌲",
      text:"Le 21 mars, journée mondiale de la forêt, marque l'équinoxe de printemps dans l'hémisphère nord. Les forêts couvrent 31 % des terres émergées et abritent plus de 80 % de la biodiversité terrestre, selon la FAO.",
      src:{n:"FAO — État des forêts mondiales 2022", u:"https://www.fao.org/state-of-forests/"}},
    en: { label:"✦ World Forest Day", icon:"🌲",
      text:"March 21st, World Forest Day, marks the spring equinox in the northern hemisphere. Forests cover 31% of the land area and host more than 80% of terrestrial biodiversity, according to the FAO.",
      src:{n:"FAO — The State of the World's Forests 2022", u:"https://www.fao.org/state-of-forests/"}}
  },
  "03-22": {
    fr: { label:"✦ Journée mondiale de l'eau", icon:"💧",
      text:"La Journée mondiale de l'eau, créée par l'ONU en 1993, rappelle qu'un humain sur trois n'a pas accès à de l'eau potable sûre. L'eau douce ne représente que 2,5 % de l'eau de la planète, et les deux tiers sont emprisonnés dans les glaciers.",
      src:{n:"ONU-Eau / WHO — Water facts 2023", u:"https://www.unwater.org/world-water-day"}},
    en: { label:"✦ World Water Day", icon:"💧",
      text:"World Water Day, created by the UN in 1993, highlights that one in three people lacks access to safe drinking water. Fresh water makes up just 2.5% of Earth's water, and two thirds of it is locked in glaciers.",
      src:{n:"UN-Water / WHO — Water facts 2023", u:"https://www.unwater.org/world-water-day"}}
  },
  "04-01": {
    fr: { label:"✦ Poisson d'avril", icon:"🐟",
      text:"L'origine du Poisson d'avril reste débattue. La théorie la plus répandue le lie au passage au calendrier grégorien en 1564 : les gens qui fêtaient encore le Nouvel An en avril étaient moqués et recevaient de faux cadeaux.",
      src:{n:"Dictionnaire historique de la langue française — Alain Rey", u:"https://www.lerobert.com/"}},
    en: { label:"✦ April Fools' Day", icon:"🐟",
      text:"The origin of April Fools' Day remains debated. The most common theory links it to the switch to the Gregorian calendar in 1564: people who still celebrated New Year's in April were mocked and sent fake gifts.",
      src:{n:"Historical Dictionary of the French Language — Alain Rey", u:"https://www.lerobert.com/"}}
  },
  "04-22": {
    fr: { label:"✦ Journée de la Terre", icon:"🌍",
      text:"La première Journée de la Terre a eu lieu le 22 avril 1970, initiée par le sénateur américain Gaylord Nelson après avoir été choqué par la marée noire de Santa Barbara en 1969. Elle a réuni 20 millions d'Américains et conduit à la création de l'EPA.",
      src:{n:"Earth Day Network — Official history", u:"https://www.earthday.org/history/"}},
    en: { label:"✦ Earth Day", icon:"🌍",
      text:"The first Earth Day took place on April 22, 1970, initiated by US Senator Gaylord Nelson after witnessing the 1969 Santa Barbara oil spill. It brought together 20 million Americans and led to the creation of the EPA.",
      src:{n:"Earth Day Network — Official history", u:"https://www.earthday.org/history/"}}
  },
  "05-04": {
    fr: { label:"✦ Star Wars Day", icon:"⭐",
      text:"Le 4 mai est célébré comme la journée Star Wars grâce au jeu de mots anglais « May the Fourth be with you ». La première mention publique remonte au 4 mai 1979, quand le parti conservateur britannique a publié une annonce pour féliciter Margaret Thatcher.",
      src:{n:"The Times — 4 mai 1979 / Lucasfilm", u:"https://www.starwars.com/"}},
    en: { label:"✦ Star Wars Day", icon:"⭐",
      text:"May 4th is celebrated as Star Wars Day thanks to the pun 'May the Fourth be with you'. Its first public mention dates to May 4, 1979, when the British Conservative Party published an ad congratulating Margaret Thatcher.",
      src:{n:"The Times — 4 May 1979 / Lucasfilm", u:"https://www.starwars.com/"}}
  },
  "05-15": {
    fr: { label:"✦ Journée internationale des familles", icon:"👨‍👩‍👧",
      text:"La Journée internationale des familles, proclamée par l'ONU en 1993, souligne que la famille reste l'unité fondamentale de la société dans toutes les cultures. On dénombre aujourd'hui plus de 2 milliards de foyers dans le monde.",
      src:{n:"ONU — Résolution A/RES/47/237", u:"https://www.un.org/fr/observances/international-day-of-families"}},
    en: { label:"✦ International Day of Families", icon:"👨‍👩‍👧",
      text:"International Day of Families, proclaimed by the UN in 1993, underlines that the family remains the fundamental unit of society across all cultures. There are today more than 2 billion households worldwide.",
      src:{n:"UN — Resolution A/RES/47/237", u:"https://www.un.org/en/observances/international-day-of-families"}}
  },
  "05-25": {
    fr: { label:"✦ Journée de l'Afrique", icon:"🌍",
      text:"Le 25 mai commémore la fondation de l'Organisation de l'Unité Africaine en 1963, devenue Union Africaine en 2002. L'Afrique est le continent le plus jeune du monde : l'âge médian y est de 19 ans, contre 42 ans en Europe.",
      src:{n:"Union Africaine — Histoire officielle", u:"https://au.int/"}},
    en: { label:"✦ Africa Day", icon:"🌍",
      text:"May 25th marks the founding of the Organisation of African Unity in 1963, which became the African Union in 2002. Africa is the world's youngest continent: the median age is 19, compared to 42 in Europe.",
      src:{n:"African Union — Official history", u:"https://au.int/"}}
  },
  "06-05": {
    fr: { label:"✦ Journée mondiale de l'environnement", icon:"🌿",
      text:"La Journée mondiale de l'environnement est la plus grande célébration mondiale pour la nature, créée par l'ONU en 1972 lors de la Conférence de Stockholm. Elle mobilise chaque année des millions de personnes dans plus de 143 pays.",
      src:{n:"PNUE — Histoire officielle", u:"https://www.unep.org/events/un-day/world-environment-day"}},
    en: { label:"✦ World Environment Day", icon:"🌿",
      text:"World Environment Day is the largest global celebration for positive environmental action, created by the UN in 1972 at the Stockholm Conference. It mobilises millions of people in more than 143 countries every year.",
      src:{n:"UNEP — Official history", u:"https://www.unep.org/events/un-day/world-environment-day"}}
  },
  "06-21": {
    fr: { label:"✦ Fête de la Musique", icon:"🎵",
      text:"La Fête de la Musique a été créée en France en 1982 par Jack Lang et Maurice Fleuret pour mettre la musique à la portée de tous le jour du solstice d'été. Aujourd'hui, elle est célébrée dans plus de 120 pays.",
      src:{n:"Ministère de la Culture français — Archives", u:"https://www.fetedelamusique.culture.gouv.fr/"}},
    en: { label:"✦ World Music Day", icon:"🎵",
      text:"Fête de la Musique was created in France in 1982 by Jack Lang and Maurice Fleuret to make music accessible to everyone on the summer solstice. Today it is celebrated in more than 120 countries.",
      src:{n:"French Ministry of Culture — Archives", u:"https://www.fetedelamusique.culture.gouv.fr/"}}
  },
  "07-04": {
    fr: { label:"✦ Fête nationale américaine", icon:"🇺🇸",
      text:"Le 4 juillet 1776, les 13 colonies américaines ont officiellement adopté la Déclaration d'indépendance rédigée principalement par Thomas Jefferson. Deux de ses principaux auteurs, John Adams et Thomas Jefferson, sont tous deux morts le 4 juillet 1826 — exactement 50 ans plus tard.",
      src:{n:"National Archives US — Declaration of Independence", u:"https://www.archives.gov/founding-docs/declaration"}},
    en: { label:"✦ American Independence Day", icon:"🇺🇸",
      text:"On July 4, 1776, the 13 American colonies officially adopted the Declaration of Independence. A little-known fact: two of its main authors, John Adams and Thomas Jefferson, both died on July 4, 1826 — exactly 50 years later.",
      src:{n:"US National Archives — Declaration of Independence", u:"https://www.archives.gov/founding-docs/declaration"}}
  },
  "08-12": {
    fr: { label:"✦ Journée internationale de la jeunesse", icon:"🧡",
      text:"La Journée internationale de la jeunesse, célébrée le 12 août depuis 2000, rappelle que 1,2 milliard de personnes dans le monde ont entre 15 et 24 ans — soit la plus grande génération de jeunes de l'histoire humaine.",
      src:{n:"ONU — Résolution A/RES/54/120", u:"https://www.un.org/fr/observances/world-youth-day"}},
    en: { label:"✦ International Youth Day", icon:"🧡",
      text:"International Youth Day, celebrated on August 12th since 2000, highlights that 1.2 billion people worldwide are aged 15 to 24 — the largest generation of young people in human history.",
      src:{n:"UN — Resolution A/RES/54/120", u:"https://www.un.org/en/observances/world-youth-day"}}
  },
  "09-21": {
    fr: { label:"✦ Journée internationale de la paix", icon:"☮️",
      text:"La Journée internationale de la paix, établie par l'ONU en 1981 et célébrée chaque 21 septembre depuis 2001, est marquée par une minute de silence à midi. Elle a pour symbole la cloche de la paix offerte au siège de l'ONU par le Japon en 1954.",
      src:{n:"ONU — Résolution A/RES/55/282", u:"https://www.un.org/fr/observances/international-day-peace"}},
    en: { label:"✦ International Day of Peace", icon:"☮️",
      text:"The International Day of Peace, established by the UN in 1981 and observed every September 21st since 2001, features a minute of silence at noon local time. Its symbol is the Peace Bell donated to UN headquarters by Japan in 1954.",
      src:{n:"UN — Resolution A/RES/55/282", u:"https://www.un.org/en/observances/international-day-peace"}}
  },
  "10-02": {
    fr: { label:"✦ Journée mondiale de la non-violence", icon:"🕊️",
      text:"Le 2 octobre, anniversaire de la naissance de Gandhi en 1869, a été proclamé Journée mondiale de la non-violence par l'ONU en 2007. Gandhi a lui-même déclaré que la non-violence était la plus grande force à la disposition de l'humanité.",
      src:{n:"ONU — Résolution A/RES/61/271", u:"https://www.un.org/fr/observances/non-violence-day"}},
    en: { label:"✦ World Non-Violence Day", icon:"🕊️",
      text:"October 2nd, Gandhi's birthday in 1869, was proclaimed World Day of Non-Violence by the UN in 2007. Gandhi himself declared that non-violence was the greatest force at the disposal of mankind.",
      src:{n:"UN — Resolution A/RES/61/271", u:"https://www.un.org/en/observances/non-violence-day"}}
  },
  "10-10": {
    fr: { label:"✦ Journée mondiale de la santé mentale", icon:"🧠",
      text:"La Journée mondiale de la santé mentale, organisée par la Fédération mondiale pour la santé mentale depuis 1992, rappelle qu'une personne sur huit dans le monde souffre d'un trouble mental. 75 % des personnes affectées dans les pays à faible revenu ne reçoivent aucun traitement.",
      src:{n:"OMS — Rapport sur la santé mentale 2022", u:"https://www.who.int/fr/campaigns/world-mental-health-day"}},
    en: { label:"✦ World Mental Health Day", icon:"🧠",
      text:"World Mental Health Day, organised by the World Federation for Mental Health since 1992, highlights that 1 in 8 people globally lives with a mental disorder. 75% of those affected in low-income countries receive no treatment at all.",
      src:{n:"WHO — World Mental Health Report 2022", u:"https://www.who.int/campaigns/world-mental-health-day"}}
  },
  "10-31": {
    fr: { label:"✦ Halloween", icon:"🎃",
      text:"Halloween est issu de la fête celtique de Samhain, célébrée le 1er novembre pour marquer la fin de la saison des récoltes. Les Celtes croyaient que la frontière entre le monde des vivants et des morts s'effaçait cette nuit-là — d'où les costumes pour se fondre parmi les esprits.",
      src:{n:"Encyclopædia Britannica — Samhain / Halloween", u:"https://www.britannica.com/topic/Halloween"}},
    en: { label:"✦ Halloween", icon:"🎃",
      text:"Halloween originated from the Celtic festival of Samhain, celebrated on November 1st to mark the end of the harvest season. The Celts believed the boundary between the living and the dead dissolved that night — hence costumes worn to blend in among the spirits.",
      src:{n:"Encyclopædia Britannica — Samhain / Halloween", u:"https://www.britannica.com/topic/Halloween"}}
  },
  "11-11": {
    fr: { label:"✦ Jour du Souvenir", icon:"🌺",
      text:"Le 11 novembre à 11h11 marque l'armistice de la Première Guerre mondiale en 1918. Le coquelicot rouge, symbole du souvenir, est inspiré du poème « In Flanders Fields » de John McCrae (1915) qui décrivait les coquelicots poussant sur les champs de bataille de Belgique.",
      src:{n:"Imperial War Museum / Commonwealth War Graves", u:"https://www.iwm.org.uk/"}},
    en: { label:"✦ Remembrance Day", icon:"🌺",
      text:"November 11th at 11:11am marks the 1918 World War I armistice. The red poppy symbol was inspired by John McCrae's 1915 poem 'In Flanders Fields', which described poppies growing over the battlefields of Belgium.",
      src:{n:"Imperial War Museum / Commonwealth War Graves", u:"https://www.iwm.org.uk/"}}
  },
  "11-20": {
    fr: { label:"✦ Journée mondiale de l'enfance", icon:"👶",
      text:"Le 20 novembre 1989, l'Assemblée générale de l'ONU a adopté la Convention relative aux droits de l'enfant — le traité des droits de l'homme le plus ratifié de l'histoire, signé par 196 pays. Seuls les États-Unis ne l'ont pas ratifié.",
      src:{n:"UNICEF / ONU — Convention des droits de l'enfant", u:"https://www.unicef.org/child-rights-convention"}},
    en: { label:"✦ World Children's Day", icon:"👶",
      text:"On November 20, 1989, the UN General Assembly adopted the Convention on the Rights of the Child — the most widely ratified human rights treaty in history, signed by 196 countries. Only the United States has not ratified it.",
      src:{n:"UNICEF / UN — Convention on the Rights of the Child", u:"https://www.unicef.org/child-rights-convention"}}
  },
  "12-01": {
    fr: { label:"✦ Journée mondiale contre le SIDA", icon:"🎗️",
      text:"La Journée mondiale contre le SIDA, instaurée en 1988, est la première journée mondiale de santé proclamée par l'OMS. Le ruban rouge, symbole universel de la lutte contre le VIH, a été créé en 1991 par le collectif artistique Visual AIDS à New York.",
      src:{n:"OMS / ONUSIDA", u:"https://www.who.int/fr/campaigns/world-aids-day"}},
    en: { label:"✦ World AIDS Day", icon:"🎗️",
      text:"World AIDS Day, established in 1988, is the first global health day proclaimed by the WHO. The red ribbon, universal symbol of the fight against HIV, was created in 1991 by the New York art collective Visual AIDS.",
      src:{n:"WHO / UNAIDS", u:"https://www.who.int/campaigns/world-aids-day"}}
  },
  "12-10": {
    fr: { label:"✦ Journée des droits de l'Homme", icon:"✊",
      text:"Le 10 décembre 1948, l'ONU a adopté la Déclaration universelle des droits de l'homme à Paris, au Palais de Chaillot. Eleanor Roosevelt, qui a présidé la commission de rédaction, la considérait comme la « Magna Carta internationale de l'humanité ».",
      src:{n:"ONU — DUDH 1948", u:"https://www.un.org/fr/about-us/universal-declaration-of-human-rights"}},
    en: { label:"✦ Human Rights Day", icon:"✊",
      text:"On December 10, 1948, the UN adopted the Universal Declaration of Human Rights in Paris. Eleanor Roosevelt, who chaired the drafting committee, called it the 'international Magna Carta of all mankind.'",
      src:{n:"UN — UDHR 1948", u:"https://www.un.org/en/about-us/universal-declaration-of-human-rights"}}
  },
  "12-25": {
    fr: { label:"✦ Noël", icon:"🎄",
      text:"La date du 25 décembre pour Noël n'est pas mentionnée dans la Bible. Elle a été fixée au IVe siècle pour coïncider avec des fêtes romaines du solstice d'hiver. Le sapin de Noël est une tradition venue d'Alsace et popularisée en Europe au XVIe siècle.",
      src:{n:"Encyclopædia Britannica — Christmas history", u:"https://www.britannica.com/topic/Christmas"}},
    en: { label:"✦ Christmas", icon:"🎄",
      text:"The December 25th date for Christmas is not mentioned in the Bible. It was set in the 4th century to coincide with Roman winter solstice festivities. The Christmas tree itself is a tradition from Alsace, popularised across Europe in the 16th century.",
      src:{n:"Encyclopædia Britannica — Christmas history", u:"https://www.britannica.com/topic/Christmas"}}
  },
  "12-31": {
    fr: { label:"✦ Réveillon du Nouvel An", icon:"🥂",
      text:"Le réveillon du 31 décembre célèbre la Saint-Sylvestre, du nom du pape Sylvestre Ier mort le 31 décembre 335. La tradition des feux d'artifice de minuit est née à Édimbourg au XVIIe siècle, avant de se répandre dans le monde entier.",
      src:{n:"Encyclopædia Britannica — New Year's Eve", u:"https://www.britannica.com/topic/New-Years-Day"}},
    en: { label:"✦ New Year's Eve", icon:"🥂",
      text:"New Year's Eve celebrates the feast of Saint Sylvester, named after Pope Sylvester I who died on December 31, 335. The tradition of midnight fireworks originated in Edinburgh in the 17th century, before spreading worldwide.",
      src:{n:"Encyclopædia Britannica — New Year's Eve", u:"https://www.britannica.com/topic/New-Years-Day"}}
  },
};
// Easter-relative dates — computed at runtime
function getEasterDate(year) {
  const a=year%19,b=Math.floor(year/100),c=year%100;
  const d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25);
  const g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30;
  const i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7;
  const m=Math.floor((a+11*h+22*l)/451);
  const month=Math.floor((h+l-7*m+114)/31);
  const day=((h+l-7*m+114)%31)+1;
  return new Date(year,month-1,day);
}

function getThematicFact(date) {
  const mm = String(date.getMonth()+1).padStart(2,'0');
  const dd = String(date.getDate()).padStart(2,'0');
  const key = `${mm}-${dd}`;

  // Fixed dates
  if (THEMATIC_DAYS[key]) return THEMATIC_DAYS[key][lang] || THEMATIC_DAYS[key]['fr'];

  // Easter-relative dates
  const year = date.getFullYear();
  const easter = getEasterDate(year);
  const diffDays = Math.round((date - easter) / 86400000);

  const easterRelative = {
    '-2': {
      fr: { label:'✦ Vendredi Saint', icon:'✝️',
        text:"Le Vendredi Saint commémore la crucifixion de Jésus. C'est l'un des rares jours fériés communs à la plupart des chrétiens. Dans certains pays comme le Danemark et les Antilles, il marque aussi le début de la saison des brasseries de bière de Pâques.",
        src:{n:'Encyclopædia Britannica — Good Friday', u:'https://www.britannica.com/topic/Good-Friday'}},
      en: { label:'✦ Good Friday', icon:'✝️',
        text:"Good Friday commemorates the crucifixion of Jesus. It is one of the rare public holidays shared by most Christians. In some countries like Denmark and the Caribbean, it also marks the start of the Easter beer brewing season.",
        src:{n:'Encyclopædia Britannica — Good Friday', u:'https://www.britannica.com/topic/Good-Friday'}}
    },
    '0': {
      fr: { label:'✦ Pâques', icon:'🐣',
        text:"Pâques est la fête chrétienne la plus ancienne et la plus importante. Sa date varie chaque année car elle suit le calendrier lunaire : c'est le premier dimanche après la pleine lune suivant l'équinoxe de printemps. La tradition des œufs de Pâques vient des communautés chrétiennes de Mésopotamie au IIe siècle.",
        src:{n:'Encyclopædia Britannica — Easter', u:'https://www.britannica.com/topic/Easter-holiday'}},
      en: { label:'✦ Easter', icon:'🐣',
        text:"Easter is the oldest and most important Christian feast. Its date changes every year as it follows the lunar calendar: it falls on the first Sunday after the full moon following the spring equinox. The tradition of Easter eggs originated in 2nd-century Mesopotamian Christian communities.",
        src:{n:'Encyclopædia Britannica — Easter', u:'https://www.britannica.com/topic/Easter-holiday'}}
    },
    '1': {
      fr: { label:'✦ Lundi de Pâques', icon:'🐰',
        text:"Le lundi de Pâques prolonge la célébration de la résurrection du Christ. La tradition du lapin de Pâques — qui n'a aucune origine biblique — vient d'Allemagne au XVIe siècle. Le lièvre y symbolisait la fertilité printanière bien avant l'ère chrétienne.",
        src:{n:'Encyclopedia of Religion — Easter customs', u:'https://www.britannica.com/'}},
      en: { label:'✦ Easter Monday', icon:'🐰',
        text:"Easter Monday extends the celebration of Christ's resurrection. The Easter bunny tradition — which has no biblical origin — comes from 16th-century Germany. The hare symbolised spring fertility long before the Christian era.",
        src:{n:'Encyclopedia of Religion — Easter customs', u:'https://www.britannica.com/'}}
    },
    '-46': {
      fr: { label:'✦ Mercredi des Cendres', icon:'⛪',
        text:"Le Mercredi des Cendres marque le début du Carême, 46 jours avant Pâques. La coutume de tracer une croix de cendres sur le front symbolise le memento mori (« souviens-toi que tu mourras »). Les cendres proviennent des palmes bénites de l'année précédente.",
        src:{n:'Encyclopædia Britannica — Ash Wednesday', u:'https://www.britannica.com/topic/Ash-Wednesday'}},
      en: { label:'✦ Ash Wednesday', icon:'⛪',
        text:"Ash Wednesday marks the beginning of Lent, 46 days before Easter. The custom of marking a cross of ashes on the forehead symbolises memento mori ('remember that you will die'). The ashes come from the palms blessed the previous year.",
        src:{n:'Encyclopædia Britannica — Ash Wednesday', u:'https://www.britannica.com/topic/Ash-Wednesday'}}
    },
  };

  const relKey = String(diffDays);
  if (easterRelative[relKey]) return easterRelative[relKey][lang] || easterRelative[relKey]['fr'];

  return null;
}

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

// ── SPACE GAME ENGINE ──
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
  setTimeout(() => { if (_game) _game.difficulty = 2.2; }, 35000);

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
  const spawnRate = 0.45 / _game.difficulty;
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
  const earnedFragment = score >= 50 && (state.planetFragments || 0) < 5;
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
    ? (lang==='fr' ? '🛸 Mission accomplie !' : '🛸 Mission complete!')
    : (lang==='fr' ? '💥 Collision !' : '💥 Collision!');
  ctx.fillText(title, W/2, H*0.28);

  ctx.fillStyle = '#ffd700';
  ctx.font = '600 48px Montserrat, sans-serif';
  ctx.fillText('⭐ ' + score, W/2, H*0.40);

  // Fragment feedback
  const frags = state.planetFragments || 0;
  if (earnedFragment) {
    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 22px Montserrat, sans-serif';
    ctx.fillText(lang==='fr' ? '🧩 +1 Fragment de planète !' : '🧩 +1 Planet fragment!', W/2, H*0.50);
    ctx.fillStyle = 'rgba(192,132,252,.7)';
    ctx.font = '400 16px Montserrat, sans-serif';
    ctx.fillText(frags + ' / 5 ' + (lang==='fr' ? 'fragments' : 'fragments'), W/2, H*0.55);
  } else if (frags >= 5) {
    ctx.fillStyle = '#6bff6b';
    ctx.font = '400 18px Montserrat, sans-serif';
    ctx.fillText(lang==='fr' ? '🪐 Neptune déjà débloquée !' : '🪐 Neptune already unlocked!', W/2, H*0.52);
  } else {
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    ctx.font = '400 16px Montserrat, sans-serif';
    const needed = lang==='fr'
      ? `🧩 ${frags}/5 fragments — 50⭐ pour le prochain`
      : `🧩 ${frags}/5 fragments — 50⭐ for the next one`;
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
  ctx.fillText(lang==='fr' ? 'Continuer' : 'Continue', W/2, H*0.65 + 30);

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






// ── THEME TOGGLE ──────────────────────────────────────────────────────────
function toggleTheme(){
  haptic();
  const isLight = document.documentElement.classList.toggle('light-theme');
  state.lightTheme = isLight; saveState();
  document.getElementById('themeToggle').textContent = isLight ? '☀️' : '🌙';
  // Update meta theme-color
  document.querySelectorAll('meta[name="theme-color"]').forEach(m=>{
    m.setAttribute('content', isLight ? '#1a3a5c' : '#050a12');
  });
}

// Apply saved theme on load
(function(){
  if(state.lightTheme){
    document.documentElement.classList.add('light-theme');
    const btn = document.getElementById('themeToggle');
    if(btn) btn.textContent = '☀️';
    document.querySelectorAll('meta[name="theme-color"]').forEach(m=>{
      m.setAttribute('content','#1a3a5c');
    });
  }
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


// ── AUTH UI FUNCTIONS ──────────────────────────────────────────────────────
function updateUserBadge(user){
  const badge=document.getElementById('userBadge');
  const loginBtn=document.getElementById('loginBtn');
  if(!_isFirebaseConfigured) return;
  if(user){
    badge.style.display='flex';
    loginBtn.style.display='none';
    const name=user.displayName||user.email||'?';
    const uba=document.getElementById('userBadgeAvatar'); if(uba) uba.textContent=name[0].toUpperCase();
    const ubn=document.getElementById('userBadgeName'); if(ubn) ubn.textContent=name.split('@')[0].substring(0,12);
  } else {
    badge.style.display='none';
    loginBtn.style.display='flex';
  }
}

function showAuthScreen(){
  const s=document.getElementById('authScreen');
  if(s) { s.classList.remove('hidden'); applyAuthI18n(); }
}
function hideAuthScreen(){ document.getElementById('authScreen').classList.add('hidden'); }
function skipAuth(){ haptic('light'); hideAuthScreen(); }

function applyAuthI18n(){
  if(!document.getElementById('authScreen')) return;
  const fr=lang==='fr';
  document.getElementById('authSub').innerHTML=fr
    ?'Crée un compte pour sauvegarder ta progression<br>et retrouver tes curiosités sur tous tes appareils.'
    :'Create an account to save your progress<br>and find your curiosities on all your devices.';
  document.getElementById('authEmail').placeholder='Email';
  document.getElementById('authPassword').placeholder=fr?'Mot de passe':'Password';
  if(document.getElementById('authForgot')) (document.getElementById('authForgot')||{}).textContent=fr?'Mot de passe oublié ?':'Forgot password?';
  if(document.getElementById('authMainBtn')) (document.getElementById('authMainBtn')||{}).textContent=_authMode==='register'
    ?(fr?'Créer un compte':'Create account'):(fr?'Se connecter':'Sign in');
  document.getElementById('authToggle').innerHTML=_authMode==='register'
    ?(fr?'Déjà un compte ? <span>Se connecter</span>':'Already have an account? <span>Sign in</span>')
    :(fr?'Pas encore de compte ? <span>Créer un compte</span>':"Don't have an account? <span>Sign up</span>");
  if(document.getElementById('authDivider')) (document.getElementById('authDivider')||{}).textContent=fr?'ou':'or';
  if(document.querySelector('.auth-skip')) (document.querySelector('.auth-skip')||{}).textContent=fr?'Continuer sans compte →':'Continue without account →';}

function toggleAuthMode(){
  haptic('light');
  _authMode=_authMode==='register'?'login':'register';
  applyAuthI18n();
  if(document.getElementById('authError')) (document.getElementById('authError')||{}).textContent='';
}

function setAuthError(msg){ const ae=document.getElementById('authError'); if(ae) ae.textContent=msg; }

async function handleAuthSubmit(){
  haptic('light');
  if(document.getElementById('authError')) (document.getElementById('authError')||{}).textContent='';
  const email=document.getElementById('authEmail').value.trim();
  const password=document.getElementById('authPassword').value;
  const fr=lang==='fr';
  if(!email||!password){setAuthError(fr?'Remplis tous les champs.':'Please fill in all fields.');return;}
  if(password.length<6){setAuthError(fr?'Mot de passe trop court (min. 6 caractères).':'Password too short (min. 6 characters).');return;}
  if(!window._fbSignIn){setAuthError(lang==='fr'?'Service indisponible, réessaie.':'Service unavailable, please retry.');return;}
  try{
    if(_authMode==='register'){await window._fbRegister(email,password);}
    else{await window._fbSignIn(email,password);}
  }catch(err){
    const fr2=lang==='fr';
    const msgs={
      'auth/email-already-in-use':fr2?'Email déjà utilisé.':'Email already in use.',
      'auth/user-not-found':fr2?'Compte introuvable.':'Account not found.',
      'auth/wrong-password':fr2?'Mot de passe incorrect.':'Wrong password.',
      'auth/invalid-email':fr2?'Email invalide.':'Invalid email.',
      'auth/too-many-requests':fr2?'Trop de tentatives. Réessaie plus tard.':'Too many attempts. Try again later.',
      'auth/network-request-failed':fr2?'Erreur réseau.':'Network error.',
      'auth/invalid-credential':fr2?'Identifiants incorrects.':'Invalid credentials.',
    };
    console.error('Auth error:', err);
    setAuthError(msgs[err.code]||(fr2?'Erreur : '+(err.message||err.code||'inconnue'):'Error: '+(err.message||err.code||'unknown')));
  }
}

async function handleGoogleSignIn(){
  haptic('light');
  if(document.getElementById('authError')) (document.getElementById('authError')||{}).textContent='';
  try{
    if(!window._fbGoogleAuth){setAuthError(lang==='fr'?'Service indisponible.':'Service unavailable.');return;}
    await window._fbGoogleAuth();
  }
  catch(err){if(err.code!=='auth/popup-closed-by-user')setAuthError(lang==='fr'?'Connexion Google échouée.':'Google sign-in failed.');}
}

async function handleForgot(){
  haptic('light');
  const email=document.getElementById('authEmail').value.trim();
  const fr=lang==='fr';
  if(!email){setAuthError(fr?"Entre ton email d'abord.":'Enter your email first.');return;}
  try{await window._fbResetPwd(email);showToast(fr?'✓ Email de réinitialisation envoyé':'✓ Reset email sent');}
  catch(e){setAuthError(fr?'Email introuvable.':'Email not found.');}
}

async function handleSignOut(){
  haptic('light');
  try{await fbAuth.signOut();closeAccountPanel();showToast(lang==='fr'?'Déconnecté':'Signed out');}
  catch(e){}
}

async function forceSyncNow(){
  haptic('light');
  if(!_fbCurrentUser){showToast(lang==='fr'?'Non connecté':'Not signed in');return;}
  const s=document.getElementById('accountSyncStatus');
  s.className='account-sync-status pending';
  s.textContent=lang==='fr'?'↑ Synchronisation...':'↑ Syncing...';
  await syncToCloud();
  s.className='account-sync-status ok';
  s.textContent=lang==='fr'?'✓ Progression sauvegardée':'✓ Progress saved';
  showToast(lang==='fr'?'✓ Synchronisé':'✓ Synced');
}

function openAccountPanel(){
  if(!document.getElementById('accountPanel')) return;
  if(!_fbCurrentUser){showAuthScreen();return;}
  const user=_fbCurrentUser;
  const name=user.displayName||user.email||'?';
  const apt=document.getElementById('accountPanelTitle'); if(apt) apt.textContent=lang==='fr'?'⬡ Mon compte':'⬡ My account';
  const aab=document.getElementById('accountAvatarBig'); if(aab) aab.textContent=name[0].toUpperCase();
  const aed=document.getElementById('accountEmailDisplay'); if(aed) aed.textContent=user.email;
  const asb=document.getElementById('accountSyncBtn'); if(asb) asb.textContent=lang==='fr'?'↑ Synchroniser maintenant':'↑ Sync now';
  const aso=document.getElementById('accountSignOutBtn'); if(aso) aso.textContent=lang==='fr'?'Déconnexion':'Sign out';
  document.getElementById('accountPanel').classList.add('open');
}
function closeAccountPanel(){ document.getElementById('accountPanel').classList.remove('open'); }

// ── EXPOSE TO WINDOW (required for onclick= in type=module scripts) ────────
// ── AUTH STATE ────────────────────────────────────────────────────────────
// Auth state vars declared at top of script

function checkFirebaseConfig(){
  return _isFirebaseConfigured;
}



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

  function setupGyro(){
    if(!window.DeviceOrientationEvent){ setupMouseFallback(); return; }
    if(typeof DeviceOrientationEvent.requestPermission === 'function'){
      // iOS 13+ : permission requise, on attache au premier tap
      document.addEventListener('touchend', function _req(){
        DeviceOrientationEvent.requestPermission()
          .then(r => { if(r==='granted') window.addEventListener('deviceorientation', onOrientation, {passive:true}); })
          .catch(()=>{});
        document.removeEventListener('touchend', _req);
      }, {once:true});
    } else {
      // Android / desktop Chrome : pas de permission requise
      window.addEventListener('deviceorientation', onOrientation, {passive:true});
      // Diagnostic : si après 3s toujours pas de données, fallback souris
      setTimeout(()=>{ if(!_gyroActive) setupMouseFallback(); }, 3000);
    }
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

window.showAuthScreen=showAuthScreen;
window.openExplorePanel=openExplorePanel;
window.closeExplorePanel=closeExplorePanel;
window.pickExplore=pickExplore;
window.resetExploreBtn=resetExploreBtn;
window.toggleExplore=toggleExplore;
window.hideAuthScreen=hideAuthScreen;
window.skipAuth=skipAuth;
window.toggleAuthMode=toggleAuthMode;
window.handleAuthSubmit=handleAuthSubmit;
window.handleGoogleSignIn=handleGoogleSignIn;
window.handleForgot=handleForgot;
window.handleSignOut=handleSignOut;
window.openAccountPanel=openAccountPanel;
window.closeAccountPanel=closeAccountPanel;
window.forceSyncNow=forceSyncNow;
window.updateUserBadge=updateUserBadge;


// Sound toggles defined above
window.toggleAmbientMute = toggleAmbientMute;
window.toggleSfxMute = toggleSfxMute;


// ── CLOUD SYNC ────────────────────────────────────────────────────────────
async function saveToCloud(uid) {
  if(!fbDb || !uid) return;
  try {
    await fbDb.collection('users').doc(uid).set({
      state: JSON.stringify(state),
      updatedAt: new Date().toISOString()
    });
  } catch(e) { console.warn('Save cloud error:', e.message); }
}

async function loadFromCloud(uid) {
  if(!fbDb || !uid) return;
  try {
    const doc = await fbDb.collection('users').doc(uid).get();
    if(doc.exists) {
      const data = doc.data();
      if(data.state) {
        const cloudState = JSON.parse(data.state);
        // Merge: keep local favs + unlocked + read combined with cloud
        state = Object.assign({}, state, cloudState);
        saveState();
      }
    }
  } catch(e) { console.warn('Load cloud error:', e.message); }
}

// Debounced auto-save (3s after any state change)
let _cloudSaveTimer = null;
function scheduleCloudSave() {
  if(!_fbCurrentUser) return;
  clearTimeout(_cloudSaveTimer);
  _cloudSaveTimer = setTimeout(() => saveToCloud(_fbCurrentUser.uid), 3000);
}

// ── BACK BUTTON HANDLER ─────────────────────────────────────────
var _backPressCount = 0;
var _backPressTimer = null;

window.addEventListener('popstate', function(e) {
  // Si comète visible, la rejeter
  if (_cometEl) { dismissComet(); _backPressCount=0; history.pushState({screen:'app'}, ''); return; }
  // Auth overlay
  const ao = document.getElementById('authOverlay');
  if (ao && ao.classList.contains('open')) { closeAuthPanel(); _backPressCount=0; history.pushState({screen:'app'}, ''); return; }
  // Quiz overlay
  const qo = document.getElementById('quizOverlay');
  if (qo && qo.classList.contains('active')) { qo.classList.remove('active'); _backPressCount=0; history.pushState({screen:'app'}, ''); return; }
  // Daily overlay
  const dov = document.getElementById('dailyOverlay');
  if (dov && dov.classList.contains('active')) { dov.classList.remove('active'); _backPressCount=0; history.pushState({screen:'app'}, ''); return; }
  // Si pool épuisé affiché, le fermer
  const pe = document.getElementById('poolExhaustedScreen');
  if (pe && pe.classList.contains('active')) { pe.classList.remove('active'); _backPressCount=0; history.pushState({screen:'app'}, ''); return; }
  // If daily limit screen is active, close it instead of quitting
  const dl = document.getElementById('dailyLimitScreen');
  if (dl && dl.classList.contains('active')) { closeDailyLimit(); _backPressCount=0; history.pushState({screen:'app'}, ''); return; }
  // If any panel is open, close it
  const panels = ['explorePanel','panelFavs','panelHistory','panelAchievements','statsPanel','sharePanel','planetPanel'];
  for (const id of panels) {
    const el = document.getElementById(id);
    if (el && (el.classList.contains('open') || el.classList.contains('active') || el.style.display === 'flex')) {
      el.classList.remove('open');
      el.classList.remove('active');
      el.style.display = 'none';
      _backPressCount=0;
      history.pushState({screen:'app'}, '');
      return;
    }
  }
  // Nothing to close — double back to exit
  _backPressCount++;
  if(_backPressCount >= 2){
    // Let the user leave
    _backPressCount = 0;
    if(confirm(lang==='fr'?'Quitter Oracle ?':'Leave Oracle?')){
      window.history.back();
      return;
    }
  }
  // First back — show toast and re-push
  showToast(lang==='fr'?'↩ Glisse encore pour quitter':'↩ Swipe again to exit');
  history.pushState({screen:'app'}, '');
  if(_backPressTimer) clearTimeout(_backPressTimer);
  _backPressTimer = setTimeout(function(){ _backPressCount = 0; }, 2500);
});

// Initial history entry to prevent first back gesture from exiting
history.pushState({screen:'app'}, '');

// ── PLUTO EASTER EGG (tap header 10 times) ──────────────────────────
(function(){
  let _plutTaps=0, _plutTimer=null;
  const hdr=document.getElementById('headerTitle');
  if(!hdr) return;
  hdr.addEventListener('click',function(){
    _plutTaps++;
    if(_plutTimer) clearTimeout(_plutTimer);
    _plutTimer=setTimeout(()=>{_plutTaps=0;},5000);
    if(_plutTaps>=10){
      _plutTaps=0;
      if((state.secretTaps||0)<10){
        state.secretTaps=(state.secretTaps||0)+10;
        saveState();
        showToast(lang==='fr'?'💀 Pluton se souvient…':'💀 Pluto remembers…');
        setTimeout(()=>{checkAchievements();checkPlanetUnlocks();},500);
      }
    }
  });
})();
