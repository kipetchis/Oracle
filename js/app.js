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
  quotes:'💬', laws:'⚖️', tales:'🐉', dinosaurs:'🦕', religion:'🕊️'
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
      quotes:'✦ Citations célèbres', laws:'✦ Lois insolites', tales:'✦ Contes & Légendes', dinosaurs:'✦ Dinosaures', religion:'✦ Religions & Spiritualité'
    },
    planets:{
      mercury:{name:'Mercure',cond:'Lire 20 faits',unlockDesc:"Rapide comme Mercure. 20 faits lus, la planète la plus proche du Soleil est à toi."},
      venus:{name:'Vénus',cond:'Lire 30 éphémérides',unlockDesc:"30 éphémérides consultées. Vénus, étoile du berger, brille pour toi."},
      earth:{name:'Terre',cond:'Par défaut',unlockDesc:'Ta planète de départ. Toujours disponible.'},
      moon:{name:'Lune',cond:'Atteindre 50 faits lus',unlockDesc:"Tu as consulté l'Oracle 50 fois. La Lune est à toi."},
      mars:{name:'Mars',cond:"7 jours de suite",unlockDesc:"7 jours de curiosité d'affilée. Mars t'appartient."},
      jupiter:{name:'Jupiter',cond:'1 fait par catégorie',unlockDesc:"Un fait dans chaque catégorie. Jupiter, roi des planètes, te couronne."},
      saturn:{name:'Saturne',cond:'Partager 5 faits',unlockDesc:"5 partages dans le cosmos. Saturne t'accueille."},
      uranus:{name:'Uranus',cond:'50 bonnes réponses au quiz',unlockDesc:"50 bonnes réponses. Uranus, la mystérieuse, révèle ses secrets."},
      neptune:{name:'Neptune',cond:'Collecter 5 fragments',unlockDesc:"Rencontre du 3ᵉ type. Neptune t'ouvre ses portes."},
      pluto:{name:'Pluton',cond:'???',unlockDesc:"Tu as trouvé le secret. Pluton, la planète oubliée, se souvient de toi."},
      pangaea:{name:'Pangée',cond:'Lire tous les faits Dinosaures',unlockDesc:"Un supercontinent oublié renaît. La Pangée, berceau des dinosaures, se dévoile."},
      earthnight:{name:'Terre de nuit',cond:'Lire 20 faits Religions',unlockDesc:"Les lumières de l'humanité brillent dans la nuit. La Terre se révèle sous un nouveau jour."},
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
      quotes_g:'✦ Citations', laws_g:'✦ Lois insolites', tales_g:'✦ Contes & Légendes', dinosaurs_g:'✦ Dinosaures', religion_g:'✦ Religions'
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
      quotes:'✦ Famous Quotes', laws:'✦ Weird Laws', tales:'✦ Tales & Legends', dinosaurs:'✦ Dinosaurs', religion:'✦ Religions & Spirituality'
    },
    planets:{
      mercury:{name:'Mercury',cond:'Read 20 facts',unlockDesc:"Swift as Mercury. 20 facts read, the closest planet to the Sun is yours."},
      venus:{name:'Venus',cond:'Read 30 daily facts',unlockDesc:"30 daily facts consulted. Venus, the morning star, shines for you."},
      earth:{name:'Earth',cond:'Default',unlockDesc:'Your starting planet. Always available.'},
      moon:{name:'Moon',cond:'Read 50 facts',unlockDesc:"You've consulted the Oracle 50 times. The Moon is yours."},
      mars:{name:'Mars',cond:'7 days in a row',unlockDesc:"7 days of curiosity in a row. Mars belongs to you."},
      jupiter:{name:'Jupiter',cond:'1 fact per category',unlockDesc:"A fact in every category. Jupiter, king of planets, crowns you."},
      saturn:{name:'Saturn',cond:'Share 5 facts',unlockDesc:"5 shares across the cosmos. Saturn welcomes you."},
      uranus:{name:'Uranus',cond:'50 correct quiz answers',unlockDesc:"50 right answers. Uranus, the mysterious, reveals its secrets."},
      neptune:{name:'Neptune',cond:'Collect 5 fragments',unlockDesc:"Close encounter of the third kind. Neptune opens its gates."},
      pluto:{name:'Pluto',cond:'???',unlockDesc:"You found the secret. Pluto, the forgotten planet, remembers you."},
      pangaea:{name:'Pangaea',cond:'Read all Dinosaur facts',unlockDesc:"A forgotten supercontinent reborn. Pangaea, cradle of dinosaurs, reveals itself."},
      earthnight:{name:'Night Earth',cond:'Read 20 Religion facts',unlockDesc:"Humanity's lights shine through the darkness. Earth reveals itself in a new light."},
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
      quotes_g:'✦ Quotes', laws_g:'✦ Weird Laws', tales_g:'✦ Tales & Legends', dinosaurs_g:'✦ Dinosaurs', religion_g:'✦ Religions'
    },
    shareTag:"✨ Discovered with Oracle — the curiosity app"
  }
};

// Data is loaded from external files in js/data/*.js before this main script.

// ── ACHIEVEMENTS DEFINITIONS ──────────────────────────────────────────────
const CAT_ACH_IDS=['sci_5','sci_10','pos_5','pos_10','fun_5','fun_10','hist_5','hist_10','space_5','space_10','anim_5','anim_10','body_5','body_10','arts_5','arts_10','inv_5','inv_10','world_5','world_10','lang_5','lang_10','food_5','food_10','sport_5','sport_10','cel_5','cel_10','fic_5','fic_10','gam_5','gam_10','cin_5','cin_10','mus_5','mus_10','myth_5','myth_10','psy_5','psy_10','ocean_5','ocean_10','rec_5','rec_10','quote_5','quote_10','law_5','law_10','tale_5','tale_10','dino_5','dino_10','rel_5','rel_10'];

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
    // ─ Religions
    {id:'rel_5',icon:'🕊️',name:lang==='fr'?'Apprenti spirituel':'Spiritual apprentice',desc:lang==='fr'?'Lire 5 faits Religions':'Read 5 Religion facts',type:'religion',target:5,group:g.religion_g},
    {id:'rel_10',icon:'🙏',name:lang==='fr'?'Érudit des croyances':'Belief scholar',desc:lang==='fr'?'Lire 10 faits Religions':'Read 10 Religion facts',type:'religion',target:10,group:g.religion_g},
    // ─ Planètes
    {id:'planet_mercury',icon:'☿️',name:lang==='fr'?'Messager de Mercure':'Mercury Messenger',desc:lang==='fr'?'Débloquer Mercure':'Unlock Mercury',type:'planet',target:'mercury',group:g.planets},
    {id:'planet_venus',icon:'♀️',name:lang==='fr'?'Étoile du berger':'Morning Star',desc:lang==='fr'?'Débloquer Vénus':'Unlock Venus',type:'planet',target:'venus',group:g.planets},
    {id:'planet_jupiter',icon:'🟠',name:lang==='fr'?'Roi de Jupiter':'King of Jupiter',desc:lang==='fr'?'Débloquer Jupiter':'Unlock Jupiter',type:'planet',target:'jupiter',group:g.planets},
    {id:'planet_uranus',icon:'🔵',name:lang==='fr'?'Sage d\'Uranus':'Sage of Uranus',desc:lang==='fr'?'Débloquer Uranus':'Unlock Uranus',type:'planet',target:'uranus',group:g.planets},
    {id:'planet_pluto',icon:'💀',name:lang==='fr'?'Fantôme de Pluton':'Ghost of Pluto',desc:lang==='fr'?'Débloquer Pluton':'Unlock Pluto',type:'planet',target:'pluto',group:g.planets},
    {id:'planet_pangaea',icon:'🦕',name:lang==='fr'?'Monde perdu':'Lost World',desc:lang==='fr'?'Débloquer la Pangée':'Unlock Pangaea',type:'planet',target:'pangaea',group:g.planets},
    {id:'planet_earthnight',icon:'🌃',name:lang==='fr'?'Veilleur nocturne':'Night Watcher',desc:lang==='fr'?'Débloquer la Terre de nuit':'Unlock Night Earth',type:'planet',target:'earthnight',group:g.planets},
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
  {id:'mercury',emoji:'☿️',cssClass:'planet-mercury',previewClass:'p-mercury',check:(s)=>(s.read.total||0)>=20,progress:(s)=>({val:Math.min(s.read.total||0,20),max:20,label:`${Math.min(s.read.total||0,20)} / 20`,fillClass:'pf-mercury'})},
  {id:'venus',emoji:'♀️',cssClass:'planet-venus',previewClass:'p-venus',check:(s)=>(s.ephemRead||0)>=30,progress:(s)=>({val:Math.min(s.ephemRead||0,30),max:30,label:`${Math.min(s.ephemRead||0,30)} / 30`,fillClass:'pf-venus'})},
  {id:'earth',emoji:'🌍',cssClass:'planet-earth',previewClass:'p-earth',check:()=>true,progress:()=>({val:1,max:1,label:''})},
  {id:'moon',emoji:'🌙',cssClass:'planet-moon',previewClass:'p-moon',check:(s)=>(s.read.total||0)>=50,progress:(s)=>({val:Math.min(s.read.total||0,50),max:50,label:`${Math.min(s.read.total||0,50)} / 50`,fillClass:'pf-moon'})},
  {id:'mars',emoji:'🔴',cssClass:'planet-mars',previewClass:'p-mars',check:(s)=>(s.streak||1)>=7,progress:(s)=>({val:Math.min(s.streak||1,7),max:7,label:`${Math.min(s.streak||1,7)} / 7`,fillClass:'pf-mars'})},
  {id:'jupiter',emoji:'🟠',cssClass:'planet-jupiter',previewClass:'p-jupiter',check:(s)=>{const cats=Object.keys(CAT_ICONS);return cats.every(c=>(s.read[c]||0)>=1);},progress:(s)=>{const cats=Object.keys(CAT_ICONS);const d=cats.filter(c=>(s.read[c]||0)>=1).length;return{val:d,max:cats.length,label:`${d} / ${cats.length}`,fillClass:'pf-jupiter'};}},
  {id:'saturn',emoji:'🪐',cssClass:'planet-saturn',previewClass:'p-saturn',check:(s)=>(s.shares||0)>=5,progress:(s)=>({val:Math.min(s.shares||0,5),max:5,label:`${Math.min(s.shares||0,5)} / 5`,fillClass:'pf-saturn'})},
  {id:'uranus',emoji:'🔵',cssClass:'planet-uranus',previewClass:'p-uranus',check:(s)=>(s.quizCorrect||0)>=50,progress:(s)=>({val:Math.min(s.quizCorrect||0,50),max:50,label:`${Math.min(s.quizCorrect||0,50)} / 50`,fillClass:'pf-uranus'})},
  {id:'neptune',emoji:'🛸',cssClass:'planet-neptune',previewClass:'p-neptune',check:(s)=>(s.planetFragments||0)>=5,progress:(s)=>({val:Math.min(s.planetFragments||0,5),max:5,label:`${Math.min(s.planetFragments||0,5)} / 5 🧩`,fillClass:'pf-neptune'})},
  {id:'pluto',emoji:'💀',cssClass:'planet-pluto',previewClass:'p-pluto',check:(s)=>(s.secretTaps||0)>=10,progress:(s)=>({val:Math.min(s.secretTaps||0,10),max:10,label:(s.secretTaps||0)>=10?'???':'???',fillClass:'pf-pluto'})},
  {id:'pangaea',emoji:'🦕',cssClass:'planet-pangaea',previewClass:'p-pangaea',check:(s)=>(s.read.dinosaurs||0)>=20,progress:(s)=>({val:Math.min(s.read.dinosaurs||0,20),max:20,label:`${Math.min(s.read.dinosaurs||0,20)} / 20`,fillClass:'pf-pangaea'})},
  {id:'earthnight',emoji:'🌃',cssClass:'planet-earthnight',previewClass:'p-earthnight',check:(s)=>(s.read.religion||0)>=20,progress:(s)=>({val:Math.min(s.read.religion||0,20),max:20,label:`${Math.min(s.read.religion||0,20)} / 20`,fillClass:'pf-earthnight'})},
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

function switchLang(l){
    lang=l; state.lang=l; saveState();
    FACTS=l==='fr'?FACTS_FR:FACTS_EN;
    ACH_DEF=buildAchDef(l);
    PLANETS=buildPlanets(l);
    deck=[];deckIdx=0;
    // Met à jour le fait affiché
    if(currentFact){
        var f=FACTS.find(function(x){return x.id===currentFact.id;});
        if(f){currentFact.text=f.text;var ct=document.querySelector('.card-text');if(ct)ct.textContent=f.text;}
    }
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
  const allPlanetClasses=['planet-earth','planet-mercury','planet-venus','planet-moon','planet-mars','planet-jupiter','planet-saturn','planet-neptune','planet-uranus','planet-pluto','planet-pangaea','planet-earthnight','planet-sun'];
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
        <span class="counter">${t.counter(state.read.total||0,FACTS.length)}</span>
      </div>
      ${DEEP_DIVES[currentFact.id] ? `<button class="deep-dive-btn" id="deepDiveBtn" onclick="showDeepDive()"><span class="dd-icon">🔎</span> ${lang==='fr'?'Creuser le sujet':'Dig deeper'}</button>` : ''}
      <div class="deep-dive-container" id="deepDiveContainer" style="display:none;"></div>`;
    card.classList.add('visible');
    setTimeout(()=>card.scrollIntoView({behavior:'smooth',block:'nearest'}),200);
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
  cats.sort((a,b)=>t.catLabels[a].localeCompare(t.catLabels[b], lang));
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
if(card) { card.classList.add('dd-open'); card.style.maxHeight='70vh'; card.style.overflowY='auto'; }  container.style.display = 'block';
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
  cats.sort((a,b)=>(catLabels[a]||a).localeCompare(catLabels[b]||b, lang));
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

function closePanel(type){
  const id = type==='favs' ? 'panelFavs' : type==='history' ? 'panelHistory' : 'panelAchievements';
  document.getElementById(id).classList.remove('open');
}
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
    { cats:['religion','mythology','quotes'], emoji:'🕊️', fr:'Le Chercheur de Sens',      en:'The Seeker of Meaning',     descFr:'Tu explores les grandes questions de l\'humanité. Foi, mythes et sagesse éclairent ton chemin.', descEn:'You explore humanity\'s great questions. Faith, myths and wisdom light your path.' },
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

    <!-- Language -->
    <div class="stats-section-title" style="margin-top:24px">${lang==='fr'?'Langue':'Language'}</div>
    <div class="stats-numbers">
      <div class="stat-card" onclick="haptic();switchLang('fr');renderStats();applyI18n()" style="cursor:pointer;${lang==='fr'?'border:1px solid var(--accent);':''}">
        <div class="stat-val">🇫🇷</div>
        <div class="stat-lbl">Français</div>
      </div>
      <div class="stat-card" onclick="haptic();switchLang('en');renderStats();applyI18n()" style="cursor:pointer;${lang==='en'?'border:1px solid var(--accent);':''}">
        <div class="stat-val">🇬🇧</div>
        <div class="stat-lbl">English</div>
      </div>
    </div>
  `;
}




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

// ── WINDOW EXPORTS (required for onclick= in HTML) ────────────────────────
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
