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
  },
  es:{
    headerSub:"El mundo tiene algo que decirte",
    orbPress:"Toca", orbAgain:"Otra vez",
    exploreBtn:"Explorar", explorePanelTitle:"🧭 Explorar una categoría", exploreProgress:function(n){return n+' / 20 leídos';},
    hint:"toca el orbe para revelar",
    cardEmpty:"El oráculo espera tu pregunta silenciosa…",
    favTitle:"♡ Favoritos", achTitle:"⬡ Logros",
    favEmpty:"Aún no tienes favoritos.\nToca ♡ debajo de un dato para guardarlo aquí.",
    favBtn:"Favorito", shareBtn:"Compartir",
    shareTitle:"Compartir este dato", copyLabel:"Copiar texto", copiedLabel:"¡Copiado!",
    shareClose:"Cerrar",
    toastCopied:"✓ Copiado al portapapeles",
    celebLabel:"Logro desbloqueado", celebBtn:"Continuar",
    unlockLabel:"¡Nuevo planeta desbloqueado!", unlockBtn:"Explorar",
    planetPanelTitle:"⬡ Skins de planeta",
    planetActive:"Activo", planetUnlocked:"✓ Desbloqueado", planetDefault:"Por defecto",
    perk1:"Sin anuncios, para siempre",
    perk2:"Planetas Luna y Marte desbloqueados de inmediato",
    perk3:"Apoya el desarrollo de Oracle",
    counter:(i,t)=>`${i} / ${t}`,
    catLabels:{
      science:'✦ Ciencia y Naturaleza', positive:'✦ Buenas noticias', fun:'✦ Saber inútil',
      history:'✦ Historia y Civilizaciones', space:'✦ Espacio y Astronomía', animals:'✦ Animales asombrosos',
      body:'✦ Cuerpo humano y Medicina', arts:'✦ Arte y Cultura', inventions:'✦ Inventos y ¡Eureka!',
      world:'✦ Mundo y Curiosidades', language:'✦ Palabras e Idiomas', food:'✦ Cocina y Sabores', sports:'✦ Deportes y Desafíos',
      celebrities:'✦ Celebridades', fiction:'✦ Ficción y Literatura', gaming:'✦ Videojuegos', cinema:'✦ Cine', music:'✦ Música',
      mythology:'✦ Mitología', psychology:'✦ Psicología', oceans:'✦ Océanos y Abismos', records:'✦ Récords y Extremos',
      quotes:'✦ Citas célebres', laws:'✦ Leyes insólitas', tales:'✦ Cuentos y Leyendas', dinosaurs:'✦ Dinosaurios',
      religion:'✦ Religiones y Espiritualidad'
    },
    planets:{
      mercury:{name:'Mercurio',cond:'Leer 20 datos',unlockDesc:"Rápido como Mercurio. 20 datos leídos, el planeta más cercano al Sol es tuyo."},
      venus:{name:'Venus',cond:'Leer 30 efemérides',unlockDesc:"30 efemérides consultadas. Venus, la estrella del pastor, brilla para ti."},
      earth:{name:'Tierra',cond:'Por defecto',unlockDesc:'Tu planeta de inicio. Siempre disponible.'},
      moon:{name:'Luna',cond:'Leer 50 datos',unlockDesc:"Has consultado el Oráculo 50 veces. La Luna es tuya."},
      mars:{name:'Marte',cond:'7 días seguidos',unlockDesc:"7 días de curiosidad seguidos. Marte te pertenece."},
      jupiter:{name:'Júpiter',cond:'1 dato por categoría',unlockDesc:"Un dato en cada categoría. Júpiter, rey de los planetas, te corona."},
      saturn:{name:'Saturno',cond:'Compartir 5 datos',unlockDesc:"5 compartidos en el cosmos. Saturno te da la bienvenida."},
      uranus:{name:'Urano',cond:'50 respuestas correctas en el quiz',unlockDesc:"50 respuestas correctas. Urano, el misterioso, revela sus secretos."},
      neptune:{name:'Neptuno',cond:'Coleccionar 5 fragmentos',unlockDesc:"Encuentro del tercer tipo. Neptuno te abre sus puertas."},
      pluto:{name:'Plutón',cond:'???',unlockDesc:"Has encontrado el secreto. Plutón, el planeta olvidado, te recuerda."},
      pangaea:{name:'Pangea',cond:'Leer todos los datos de Dinosaurios',unlockDesc:"Un supercontinente olvidado renace. Pangea, cuna de los dinosaurios, se revela."},
      earthnight:{name:'Tierra de noche',cond:'Leer 20 datos de Religión',unlockDesc:"Las luces de la humanidad brillan en la oscuridad. La Tierra de noche es tuya."},
      sun:{name:'Sol',cond:'Todos los logros de categoría',unlockDesc:"Te has convertido en el Oráculo mismo."}
    },
    achGroups:{
      curiosity:'✦ Curiosidad', science:'✦ Ciencia y Naturaleza', positive:'✦ Buenas noticias',
      fun:'✦ Saber inútil', history:'✦ Historia', space:'✦ Espacio',
      animals:'✦ Animales asombrosos', body:'✦ Cuerpo humano', arts:'✦ Arte y Cultura',
      inventions:'✦ Inventos', world:'✦ Curiosidades del mundo',
      language:'✦ Palabras e Idiomas', food:'✦ Cocina y Sabores', sports:'✦ Deportes',
      collection:'✦ Colección', sharing:'✦ Compartir', fidelity:'✦ Fidelidad', planets:'✦ Planetas',
      celebrities:'✦ Celebridades', fiction:'✦ Ficción', gaming:'✦ Videojuegos', cinema_g:'✦ Cine', music_g:'✦ Música',
      mythology_g:'✦ Mitología', psychology_g:'✦ Psicología', oceans_g:'✦ Océanos', records_g:'✦ Récords',
      quotes_g:'✦ Citas', laws_g:'✦ Leyes insólitas', tales_g:'✦ Cuentos y Leyendas', dinosaurs_g:'✦ Dinosaurios',
      religion_g:'✦ Religiones'
    },
    shareTag:"✨ Descubierto con Oracle — la app de las curiosidades del mundo"
  }
};

// Data is loaded from external files in js/data/*.js before this main script.

// ── ACHIEVEMENTS DEFINITIONS ──────────────────────────────────────────────
const CAT_ACH_IDS=['sci_5','sci_10','pos_5','pos_10','fun_5','fun_10','hist_5','hist_10','space_5','space_10','anim_5','anim_10','body_5','body_10','arts_5','arts_10','inv_5','inv_10','world_5','world_10','lang_5','lang_10','food_5','food_10','sport_5','sport_10','cel_5','cel_10','fic_5','fic_10','gam_5','gam_10','cin_5','cin_10','mus_5','mus_10','myth_5','myth_10','psy_5','psy_10','ocean_5','ocean_10','rec_5','rec_10','quote_5','quote_10','law_5','law_10','tale_5','tale_10','dino_5','dino_10','rel_5','rel_10'];

function _t(fr,es,en){return lang==='fr'?fr:lang==='es'?es:en;}
const buildAchDef=(lang)=>{
  const L=T[lang];
  const g=L.achGroups;
  return[
    {id:'total_5',icon:'🔭',name:_t('Curieux débutant','Curioso principiante','Curious beginner'),desc:_t('Lire 5 faits au total','Leer 5 datos en total','Read 5 facts total'),type:'total',target:5,group:g.curiosity},
    {id:'total_50',icon:'🌌',name:_t('Esprit ouvert','Mente abierta','Open mind'),desc:_t('Lire 50 faits au total','Leer 50 datos en total','Read 50 facts total'),type:'total',target:50,group:g.curiosity},
    {id:'total_all',icon:'🪐',name:_t("L'Oracle complet",'El Oráculo completo','The complete Oracle'),desc:_t('Lire tous les faits','Leer todos los datos','Read all facts'),type:'total',target:FACTS_FR.length,group:g.curiosity},
    {id:'sci_5',icon:'🔬',name:_t('Apprenti scientifique','Aprendiz de científico','Science apprentice'),desc:_t('Lire 5 faits Science','Leer 5 datos de Ciencia','Read 5 Science facts'),type:'science',target:5,group:g.science},
    {id:'sci_10',icon:'⚗️',name:_t('Esprit scientifique','Mente científica','Scientific mind'),desc:_t('Lire 10 faits Science','Leer 10 datos de Ciencia','Read 10 Science facts'),type:'science',target:10,group:g.science},
    {id:'pos_5',icon:'🌱',name:_t('Optimiste','Optimista','Optimist'),desc:_t('Lire 5 bonnes nouvelles','Leer 5 buenas noticias','Read 5 good news'),type:'positive',target:5,group:g.positive},
    {id:'pos_10',icon:'🌍',name:_t('Citoyen du monde','Ciudadano del mundo','World citizen'),desc:_t('Lire 10 bonnes nouvelles','Leer 10 buenas noticias','Read 10 good news'),type:'positive',target:10,group:g.positive},
    {id:'fun_5',icon:'🎲',name:_t('Inutilement savant','Inútilmente sabio','Usefully useless'),desc:_t('Lire 5 savoirs inutiles','Leer 5 saberes inútiles','Read 5 useless facts'),type:'fun',target:5,group:g.fun},
    {id:'fun_10',icon:'🦑',name:_t('Maître du trivial','Maestro de lo trivial','Trivia master'),desc:_t('Lire 10 savoirs inutiles','Leer 10 saberes inútiles','Read 10 useless facts'),type:'fun',target:10,group:g.fun},
    {id:'hist_5',icon:'🏛️',name:_t('Apprenti historien','Aprendiz de historiador','History apprentice'),desc:_t('Lire 5 faits Histoire','Leer 5 datos de Historia','Read 5 History facts'),type:'history',target:5,group:g.history},
    {id:'hist_10',icon:'📜',name:_t('Chroniqueur','Cronista','Chronicler'),desc:_t('Lire 10 faits Histoire','Leer 10 datos de Historia','Read 10 History facts'),type:'history',target:10,group:g.history},
    {id:'space_5',icon:'🚀',name:_t('Apprenti cosmonaute','Aprendiz de cosmonauta','Space cadet'),desc:_t('Lire 5 faits Espace','Leer 5 datos de Espacio','Read 5 Space facts'),type:'space',target:5,group:g.space},
    {id:'space_10',icon:'🌠',name:_t('Explorateur stellaire','Explorador estelar','Stellar explorer'),desc:_t('Lire 10 faits Espace','Leer 10 datos de Espacio','Read 10 Space facts'),type:'space',target:10,group:g.space},
    {id:'anim_5',icon:'🐙',name:_t('Ami des bêtes','Amigo de los animales','Animal friend'),desc:_t('Lire 5 faits Animaux','Leer 5 datos de Animales','Read 5 Animal facts'),type:'animals',target:5,group:g.animals},
    {id:'anim_10',icon:'🦋',name:_t('Naturaliste','Naturalista','Naturalist'),desc:_t('Lire 10 faits Animaux','Leer 10 datos de Animales','Read 10 Animal facts'),type:'animals',target:10,group:g.animals},
    {id:'body_5',icon:'🧬',name:_t('Apprenti anatomiste','Aprendiz de anatomía','Body apprentice'),desc:_t('Lire 5 faits Corps humain','Leer 5 datos del Cuerpo','Read 5 Body facts'),type:'body',target:5,group:g.body},
    {id:'body_10',icon:'🫀',name:_t('Médecin de soi-même','Doctor de uno mismo','Self doctor'),desc:_t('Lire 10 faits Corps humain','Leer 10 datos del Cuerpo','Read 10 Body facts'),type:'body',target:10,group:g.body},
    {id:'arts_5',icon:'🎨',name:_t('Apprenti mécène','Aprendiz de mecenas','Arts apprentice'),desc:_t('Lire 5 faits Arts','Leer 5 datos de Arte','Read 5 Arts facts'),type:'arts',target:5,group:g.arts},
    {id:'arts_10',icon:'🎭',name:_t('Homme de culture','Persona culta','Cultured person'),desc:_t('Lire 10 faits Arts','Leer 10 datos de Arte','Read 10 Arts facts'),type:'arts',target:10,group:g.arts},
    {id:'inv_5',icon:'💡',name:_t('Apprenti inventeur','Aprendiz de inventor','Inventor apprentice'),desc:_t('Lire 5 faits Inventions','Leer 5 datos de Inventos','Read 5 Inventions facts'),type:'inventions',target:5,group:g.inventions},
    {id:'inv_10',icon:'⚙️',name:_t('Génie incompris','Genio incomprendido','Misunderstood genius'),desc:_t('Lire 10 faits Inventions','Leer 10 datos de Inventos','Read 10 Inventions facts'),type:'inventions',target:10,group:g.inventions},
    {id:'world_5',icon:'🗺️',name:_t('Explorateur','Explorador','Explorer'),desc:_t('Lire 5 faits Monde','Leer 5 datos del Mundo','Read 5 World facts'),type:'world',target:5,group:g.world},
    {id:'world_10',icon:'🌐',name:_t('Citoyen universel','Ciudadano universal','Universal citizen'),desc:_t('Lire 10 faits Monde','Leer 10 datos del Mundo','Read 10 World facts'),type:'world',target:10,group:g.world},
    {id:'lang_5',icon:'📖',name:_t('Apprenti linguiste','Aprendiz de lingüista','Language apprentice'),desc:_t('Lire 5 faits Langages','Leer 5 datos de Idiomas','Read 5 Language facts'),type:'language',target:5,group:g.language},
    {id:'lang_10',icon:'🗣️',name:_t('Polyglotte du savoir','Políglota del saber','Knowledge polyglot'),desc:_t('Lire 10 faits Langages','Leer 10 datos de Idiomas','Read 10 Language facts'),type:'language',target:10,group:g.language},
    {id:'food_5',icon:'🍽️',name:_t('Apprenti gourmet','Aprendiz gourmet','Food apprentice'),desc:_t('Lire 5 faits Cuisine','Leer 5 datos de Cocina','Read 5 Food facts'),type:'food',target:5,group:g.food},
    {id:'food_10',icon:'👨‍🍳',name:_t('Chef étoilé du savoir','Chef estrellado del saber','Knowledge chef'),desc:_t('Lire 10 faits Cuisine','Leer 10 datos de Cocina','Read 10 Food facts'),type:'food',target:10,group:g.food},
    {id:'sport_5',icon:'🏅',name:_t('Apprenti champion','Aprendiz de campeón','Sports apprentice'),desc:_t('Lire 5 faits Sports','Leer 5 datos de Deportes','Read 5 Sports facts'),type:'sports',target:5,group:g.sports},
    {id:'sport_10',icon:'🏆',name:_t('Champion du savoir','Campeón del saber','Knowledge champion'),desc:_t('Lire 10 faits Sports','Leer 10 datos de Deportes','Read 10 Sports facts'),type:'sports',target:10,group:g.sports},
    {id:'fav_1',icon:'⭐',name:_t('Premier coup de cœur','Primer favorito','First favourite'),desc:_t('Sauvegarder 1 favori','Guardar 1 favorito','Save 1 favourite'),type:'fav',target:1,group:g.collection},
    {id:'fav_5',icon:'💫',name:_t('Collectionneur','Coleccionista','Collector'),desc:_t('Sauvegarder 5 favoris','Guardar 5 favoritos','Save 5 favourites'),type:'fav',target:5,group:g.collection},
    {id:'fav_10',icon:'✨',name:_t('Trésorier de curiosités','Tesorero de curiosidades','Curiosity keeper'),desc:_t('Sauvegarder 10 favoris','Guardar 10 favoritos','Save 10 favourites'),type:'fav',target:10,group:g.collection},
    {id:'share_1',icon:'📤',name:_t('Première diffusion','Primera difusión','First share'),desc:_t('Partager 1 fait','Compartir 1 dato','Share 1 fact'),type:'shares',target:1,group:g.sharing},
    {id:'share_10',icon:'📡',name:_t("Ambassadeur de l'Oracle",'Embajador del Oráculo','Oracle ambassador'),desc:_t('Partager 10 faits','Compartir 10 datos','Share 10 facts'),type:'shares',target:10,group:g.sharing},
    {id:'streak_3',icon:'🔥',name:_t('Rituel de 3 jours','Ritual de 3 días','3-day ritual'),desc:_t('Revenir 3 jours de suite','Volver 3 días seguidos','Return 3 days in a row'),type:'streak',target:3,group:g.fidelity},
    {id:'streak_7',icon:'🌟',name:_t('Rituel hebdomadaire','Ritual semanal','Weekly ritual'),desc:_t('Revenir 7 jours de suite','Volver 7 días seguidos','Return 7 days in a row'),type:'streak',target:7,group:g.fidelity},
    {id:'cel_5',icon:'🌟',name:_t('Fan de potins','Fan de los chismes','Gossip fan'),desc:_t('Lire 5 faits Célébrités','Leer 5 datos de Celebridades','Read 5 Celebrity facts'),type:'celebrities',target:5,group:g.celebrities},
    {id:'cel_10',icon:'🎬',name:_t('Ami des stars','Amigo de las estrellas','Star follower'),desc:_t('Lire 10 faits Célébrités','Leer 10 datos de Celebridades','Read 10 Celebrity facts'),type:'celebrities',target:10,group:g.celebrities},
    {id:'cel_all',icon:'🏆',name:_t('Paparazzi','Paparazzi','Paparazzi'),desc:_t('Lire tous les faits Célébrités','Leer todos los datos de Celebridades','Read all Celebrity facts'),type:'celebrities',target:20,group:g.celebrities},
    {id:'fic_5',icon:'📚',name:_t('Apprenti lecteur','Aprendiz de lector','Bookworm beginner'),desc:_t('Lire 5 faits Fiction','Leer 5 datos de Ficción','Read 5 Fiction facts'),type:'fiction',target:5,group:g.fiction},
    {id:'fic_10',icon:'🔖',name:_t('Bibliophile','Bibliófilo','Bibliophile'),desc:_t('Lire 10 faits Fiction','Leer 10 datos de Ficción','Read 10 Fiction facts'),type:'fiction',target:10,group:g.fiction},
    {id:'gam_5',icon:'🎮',name:_t('Casual gamer','Jugador casual','Casual gamer'),desc:_t('Lire 5 faits Jeux Vidéo','Leer 5 datos de Videojuegos','Read 5 Gaming facts'),type:'gaming',target:5,group:g.gaming},
    {id:'gam_10',icon:'🕹️',name:_t('Hardcore gamer','Jugador hardcore','Hardcore gamer'),desc:_t('Lire 10 faits Jeux Vidéo','Leer 10 datos de Videojuegos','Read 10 Gaming facts'),type:'gaming',target:10,group:g.gaming},
    {id:'gam_all',icon:'👾',name:_t('Game Master','Maestro del juego','Game Master'),desc:_t('Lire tous les faits Jeux Vidéo','Leer todos los datos de Videojuegos','Read all Gaming facts'),type:'gaming',target:20,group:g.gaming},
    {id:'cin_5',icon:'🎬',name:_t('Cinéphile débutant','Cinéfilo principiante','Film beginner'),desc:_t('Lire 5 faits Cinéma','Leer 5 datos de Cine','Read 5 Cinema facts'),type:'cinema',target:5,group:g.cinema_g},
    {id:'cin_10',icon:'🎞️',name:_t('Cinéaste','Cineasta','Film buff'),desc:_t('Lire 10 faits Cinéma','Leer 10 datos de Cine','Read 10 Cinema facts'),type:'cinema',target:10,group:g.cinema_g},
    {id:'mus_5',icon:'🎵',name:_t('Mélomane','Melómano','Music lover'),desc:_t('Lire 5 faits Musique','Leer 5 datos de Música','Read 5 Music facts'),type:'music',target:5,group:g.music_g},
    {id:'mus_10',icon:'🎸',name:_t('Rockstar du savoir','Rockstar del saber','Knowledge rockstar'),desc:_t('Lire 10 faits Musique','Leer 10 datos de Música','Read 10 Music facts'),type:'music',target:10,group:g.music_g},
    {id:'mus_all',icon:'🎤',name:_t('Légende musicale','Leyenda musical','Musical legend'),desc:_t('Lire tous les faits Musique','Leer todos los datos de Música','Read all Music facts'),type:'music',target:18,group:g.music_g},
    {id:'myth_5',icon:'🏛️',name:_t('Apprenti mythologue','Aprendiz de mitología','Myth apprentice'),desc:_t('Lire 5 faits Mythologie','Leer 5 datos de Mitología','Read 5 Mythology facts'),type:'mythology',target:5,group:g.mythology_g},
    {id:'myth_10',icon:'⚡',name:_t('Conteur des dieux','Narrador de dioses','Storyteller of gods'),desc:_t('Lire 10 faits Mythologie','Leer 10 datos de Mitología','Read 10 Mythology facts'),type:'mythology',target:10,group:g.mythology_g},
    {id:'psy_5',icon:'🧠',name:_t('Apprenti psy','Aprendiz de psicología','Psych apprentice'),desc:_t('Lire 5 faits Psychologie','Leer 5 datos de Psicología','Read 5 Psychology facts'),type:'psychology',target:5,group:g.psychology_g},
    {id:'psy_10',icon:'🔮',name:_t('Mentaliste','Mentalista','Mentalist'),desc:_t('Lire 10 faits Psychologie','Leer 10 datos de Psicología','Read 10 Psychology facts'),type:'psychology',target:10,group:g.psychology_g},
    {id:'ocean_5',icon:'🌊',name:_t("Marin d'eau douce",'Marinero de agua dulce','Freshwater sailor'),desc:_t('Lire 5 faits Océans','Leer 5 datos de Océanos','Read 5 Ocean facts'),type:'oceans',target:5,group:g.oceans_g},
    {id:'ocean_10',icon:'🐙',name:_t('Explorateur des abysses','Explorador de abismos','Abyss explorer'),desc:_t('Lire 10 faits Océans','Leer 10 datos de Océanos','Read 10 Ocean facts'),type:'oceans',target:10,group:g.oceans_g},
    {id:'rec_5',icon:'🏅',name:_t('Chasseur de records','Cazador de récords','Record hunter'),desc:_t('Lire 5 faits Records','Leer 5 datos de Récords','Read 5 Record facts'),type:'records',target:5,group:g.records_g},
    {id:'rec_10',icon:'🥇',name:_t('Recordman du savoir','Récordman del saber','Knowledge recordman'),desc:_t('Lire 10 faits Records','Leer 10 datos de Récords','Read 10 Record facts'),type:'records',target:10,group:g.records_g},
    {id:'quote_5',icon:'💬',name:_t('Apprenti philosophe','Aprendiz de filósofo','Apprentice philosopher'),desc:_t('Lire 5 citations','Leer 5 citas','Read 5 quotes'),type:'quotes',target:5,group:g.quotes_g},
    {id:'quote_10',icon:'📜',name:_t('Sage parmi les sages','Sabio entre sabios','Wisest of the wise'),desc:_t('Lire 10 citations','Leer 10 citas','Read 10 quotes'),type:'quotes',target:10,group:g.quotes_g},
    {id:'law_5',icon:'⚖️',name:_t('Apprenti juriste','Aprendiz de jurista','Law apprentice'),desc:_t('Lire 5 lois insolites','Leer 5 leyes insólitas','Read 5 weird laws'),type:'laws',target:5,group:g.laws_g},
    {id:'law_10',icon:'🔨',name:_t('Juge insolite','Juez insólito','Quirky judge'),desc:_t('Lire 10 lois insolites','Leer 10 leyes insólitas','Read 10 weird laws'),type:'laws',target:10,group:g.laws_g},
    {id:'tale_5',icon:'🐉',name:_t('Apprenti conteur','Aprendiz de cuentacuentos','Tale apprentice'),desc:_t('Lire 5 contes & légendes','Leer 5 cuentos y leyendas','Read 5 tales & legends'),type:'tales',target:5,group:g.tales_g},
    {id:'tale_10',icon:'📖',name:_t('Gardien des légendes','Guardián de leyendas','Legend keeper'),desc:_t('Lire 10 contes & légendes','Leer 10 cuentos y leyendas','Read 10 tales & legends'),type:'tales',target:10,group:g.tales_g},
    {id:'dino_5',icon:'🦕',name:_t('Apprenti paléontologue','Aprendiz de paleontólogo','Dino apprentice'),desc:_t('Lire 5 faits Dinosaures','Leer 5 datos de Dinosaurios','Read 5 Dinosaur facts'),type:'dinosaurs',target:5,group:g.dinosaurs_g},
    {id:'dino_10',icon:'🦖',name:_t('Roi du Jurassique','Rey del Jurásico','Jurassic king'),desc:_t('Lire 10 faits Dinosaures','Leer 10 datos de Dinosaurios','Read 10 Dinosaur facts'),type:'dinosaurs',target:10,group:g.dinosaurs_g},
    // ─ Religion
    {id:'rel_5',icon:'🕊️',name:_t('Apprenti spirituel','Aprendiz espiritual','Spiritual apprentice'),desc:_t('Lire 5 faits Religion','Leer 5 datos de Religión','Read 5 Religion facts'),type:'religion',target:5,group:g.religion_g},
    {id:'rel_10',icon:'🙏',name:_t('Érudit des croyances','Erudito de creencias','Belief scholar'),desc:_t('Lire 10 faits Religion','Leer 10 datos de Religión','Read 10 Religion facts'),type:'religion',target:10,group:g.religion_g},
    // ─ Planètes
    {id:'planet_mercury',icon:'☿️',name:_t('Messager de Mercure','Mensajero de Mercurio','Mercury Messenger'),desc:_t('Débloquer Mercure','Desbloquear Mercurio','Unlock Mercury'),type:'planet',target:'mercury',group:g.planets},
    {id:'planet_venus',icon:'♀️',name:_t('Étoile du berger','Estrella del pastor','Morning Star'),desc:_t('Débloquer Vénus','Desbloquear Venus','Unlock Venus'),type:'planet',target:'venus',group:g.planets},
    {id:'planet_jupiter',icon:'🟠',name:_t('Roi de Jupiter','Rey de Júpiter','King of Jupiter'),desc:_t('Débloquer Jupiter','Desbloquear Júpiter','Unlock Jupiter'),type:'planet',target:'jupiter',group:g.planets},
    {id:'planet_uranus',icon:'🔵',name:_t("Sage d'Uranus",'Sabio de Urano','Sage of Uranus'),desc:_t('Débloquer Uranus','Desbloquear Urano','Unlock Uranus'),type:'planet',target:'uranus',group:g.planets},
    {id:'planet_pluto',icon:'💀',name:_t('Fantôme de Pluton','Fantasma de Plutón','Ghost of Pluto'),desc:_t('Débloquer Pluton','Desbloquear Plutón','Unlock Pluto'),type:'planet',target:'pluto',group:g.planets},
    {id:'planet_pangaea',icon:'🦕',name:_t('Monde perdu','Mundo perdido','Lost World'),desc:_t('Débloquer la Pangée','Desbloquear Pangea','Unlock Pangaea'),type:'planet',target:'pangaea',group:g.planets},
    {id:'planet_earthnight',icon:'🌃',name:_t('Veilleur nocturne','Vigilante nocturno','Night Watcher'),desc:_t('Débloquer la Terre de nuit','Desbloquear la Tierra de noche','Unlock Night Earth'),type:'planet',target:'earthnight',group:g.planets},
    {id:'planet_moon',icon:'🌙',name:_t('Habitant de la Lune','Habitante de la Luna','Moon dweller'),desc:_t('Débloquer la Lune','Desbloquear la Luna','Unlock the Moon'),type:'planet',target:'moon',group:g.planets},
    {id:'planet_mars',icon:'🔴',name:_t('Conquistador de Mars','Conquistador de Marte','Mars conquistador'),desc:_t('Débloquer Mars','Desbloquear Marte','Unlock Mars'),type:'planet',target:'mars',group:g.planets},
    {id:'planet_saturn',icon:'🪐',name:_t('Seigneur de Saturne','Señor de Saturno','Lord of Saturn'),desc:_t('Débloquer Saturne','Desbloquear Saturno','Unlock Saturn'),type:'planet',target:'saturn',group:g.planets},
    {id:'planet_neptune',icon:'🛸',name:_t('Rencontre du 3ᵉ type','Encuentro del tercer tipo','Close Encounter'),desc:_t('Collecter 5 fragments de planète','Coleccionar 5 fragmentos de planeta','Collect 5 planet fragments'),type:'planet',target:'neptune',group:g.planets},
    {id:'planet_sun',icon:'☀️',name:_t("L'Oracle Solaire",'El Oráculo Solar','The Solar Oracle'),desc:_t('Débloquer le Soleil','Desbloquear el Sol','Unlock the Sun'),type:'planet',target:'sun',group:g.planets},
    {id:'ephem_1',icon:'📅',name:_t('Premier Éphéméride','Primera efeméride','First Ephemeris'),desc:_t('Lire ton premier fait du jour','Leer tu primer dato del día','Read your first daily fact'),type:'ephem',target:1,group:g.planets},
    {id:'ephem_7',icon:'🗓️',name:_t("Semaine d'Oracle",'Semana del Oráculo','Oracle Week'),desc:_t('Lire 7 éphémérides','Leer 7 efemérides','Read 7 daily facts'),type:'ephem',target:7,group:g.planets},
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
      if(el) el.textContent=_t('✓ Données synchronisées','✓ Datos sincronizados','✓ Data synced');
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
      showToast(_t('Autorise les popups pour te connecter','Permite los popups para iniciar sesión','Allow popups to sign in'));
    } else {
      showToast(_t('Erreur de connexion','Error de conexión','Sign-in error'));
    }
  });
}

function signOutUser(){
  if(!fbAuth) return;
  fbAuth.signOut().then(()=>{
    _fbUser = null;
    updateAuthUI();
    showToast(_t('Déconnecté','Desconectado','Signed out'));
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
  const y2=new Date();y2.setDate(y2.getDate()-2);
  state.streak=(state.lastDate===y.toDateString())?(state.streak||1)+1
              :(state.lastDate===y2.toDateString())?(state.streak||1)
              :1;
  state.lastDate=today;saveState();
})();

let lang='fr', FACTS=FACTS_FR, ACH_DEF=[], PLANETS=[];

// ── LANGUAGE ──────────────────────────────────────────────────────────────
function setLang(l){
  lang=l; state.lang=l; saveState();
  FACTS=l==='fr'?FACTS_FR:l==='es'?FACTS_ES:FACTS_EN;
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
    FACTS=l==='fr'?FACTS_FR:l==='es'?FACTS_ES:FACTS_EN;
    ACH_DEF=buildAchDef(l);
    PLANETS=buildPlanets(l);
    deck=[];deckIdx=0;
    // Met à jour le fait affiché
    if(currentFact){
        var f=FACTS.find(function(x){return x.id===currentFact.id;});
        if(f){currentFact.text=f.text;var ct=document.querySelector('.card-text');if(ct)ct.textContent=f.text;}
    }
    // Refresh all UI labels
    applyI18n();
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
  ],
  es:[
    {title:"Bienvenido a Oracle",desc:"Cada día, el Oráculo te revela datos fascinantes sobre el mundo — ciencia, historia, naturaleza y mucho más."},
    {title:"Explora los planetas",desc:"Desbloquea nuevos planetas leyendo, compartiendo y explorando. Cada uno transforma tu experiencia."},
    {title:"Un universo por descubrir",desc:"Decenas de categorías, cientos de datos y una efeméride diaria — siempre hay algo nuevo que aprender."},
    {title:"¿Listo para empezar?",desc:"Toca el orbe para revelar tu primer dato. El universo del conocimiento se abre ante ti."}
  ]
};

let _obIdx = 0;

function showOnboarding(){
  const slides = OB_SLIDES[lang]||OB_SLIDES.en;
  const emojis = ['🔮','🪐','🧭','✨'];
  const skipLabel = _t('Passer','Omitir','Skip');
  const nextLabel = _t('Suivant →','Siguiente →','Next →');

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
  document.getElementById('obNext').textContent=isLast?(_t("C'est parti 🚀","¡Vamos! 🚀","Let's go 🚀")):(_t('Suivant →','Siguiente →','Next →'));
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
} else if(window._pendingLang){
  // User clicked language before app.js loaded — process now
  setLang(window._pendingLang);
  window._pendingLang=null;
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
  document.getElementById('peTitle').textContent=_t('Tu as tout découvert !','¡Lo has descubierto todo!',"You've seen it all!");
  document.getElementById('peMsg').textContent=_t(
    `Bravo ! Tu as découvert les ${FACTS.length} faits de l'Oracle. Recommencer depuis le début ?`,
    `¡Enhorabuena! Has descubierto los ${FACTS.length} datos del Oráculo. ¿Empezar de nuevo?`,
    `Congrats! You've discovered all ${FACTS.length} Oracle facts. Start again from the beginning?`);
  document.getElementById('peBtn').textContent=_t('Recommencer','Empezar de nuevo','Start over');
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
    state.history.unshift({id:currentFact.id,cat:currentFact.cat,label:(T[lang].catLabels||{})[currentFact.cat]||currentFact.cat,text:currentFact.text,date:new Date().toLocaleDateString(lang==='fr'?'fr-FR':lang==='es'?'es-ES':'en-US')});
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
    // Image optionnelle (éphémérides avec champ img)
    const _mm=String(new Date().getMonth()+1).padStart(2,'0');
    const _dd=String(new Date().getDate()).padStart(2,'0');
    const _epEntry=typeof EPHEMERIS!=='undefined'?EPHEMERIS[_mm+'-'+_dd]:null;
    const factImg=(_epEntry&&_epEntry.id===currentFact.id&&_epEntry.img)?_epEntry.img:null;
    const imgHtml=factImg?`<img class="card-img" src="${factImg}" alt="" onload="this.classList.add('loaded')" onerror="this.style.display='none'">`:'';
    card.innerHTML=`
      <span class="card-cat-icon">${icon}</span>
      <div class="card-badge badge-${currentFact.cat}"><span class="badge-dot"></span>${catLabel}</div>
      ${imgHtml}
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
      ${DEEP_DIVES[currentFact.id] ? `<button class="deep-dive-btn" id="deepDiveBtn" onclick="showDeepDive()"><span class="dd-icon">🔎</span> ${_t('Creuser le sujet','Profundizar','Dig deeper')}</button>` : ''}
      <div class="deep-dive-container" id="deepDiveContainer" style="display:none;"></div>`;
    card.classList.add('visible');
    setTimeout(()=>card.scrollIntoView({behavior:'smooth',block:'nearest'}),200);
    // Show remaining facts for today
    if(!state.premium){
      const rem = Math.max(0, DAILY_LIMIT - (state.dailyCount||0));
      label.textContent = rem > 0
        ? (lang==='fr' ? `Encore (${rem})` : lang==='es' ? `Otra vez (${rem})` : `Again (${rem})`)
        : (lang==='fr' ? 'Terminé' : lang==='es' ? 'Terminado' : 'Done');
    } else {
      label.textContent = lang==='fr' ? '∞ Illimité' : lang==='es' ? '∞ Ilimitado' : '∞ Unlimited';
    }
    setTimeout(()=>runPostFactChecks(deferPostFactChecks),400);
  },120);
}

// ── EXPLORE MODE ──────────────────────────────────────────────────────────

function toggleExplore(){
  if(exploreCat){
    resetExploreBtn();
    showToast(_t('🎲 Retour en aléatoire','🎲 Volver a aleatorio','🎲 Back to random'));
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
  showToast(_t(`🧭 Prochain fait : ${name}`,`🧭 Próximo dato: ${name}`,`🧭 Next fact: ${name}`));
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
  const items = lang==='fr' ? data.fr : lang==='es' ? data.es : data.en;
  if(!items || !items.length) return;
  const container = document.getElementById('deepDiveContainer');
  const btn = document.getElementById('deepDiveBtn');
  if(!container) return;
  if(btn) btn.style.display = 'none';
  const card = container.closest('.card');
if(card) { card.classList.add('dd-open'); card.style.maxHeight='70vh'; card.style.overflowY='auto'; }  container.style.display = 'block';
  container.innerHTML = `
    <div class="dd-header">${_t('🔎 Pour aller plus loin…','🔎 Para saber más…','🔎 Dig deeper…')}</div>
    ${items.map((item,i) => `<div class="dd-item" style="animation-delay:${i*0.15}s"><span class="dd-bullet">✦</span><span class="dd-text">${item}</span></div>`).join('')}
  `;
  setTimeout(()=>{if(card)card.scrollTop=card.scrollHeight;},100);
}

function showInlineDeepDive(btn, factId){
  const data = DEEP_DIVES[factId];
  if(!data) return;
  const items = lang==='fr' ? data.fr : lang==='es' ? data.es : data.en;
  if(!items || !items.length) return;
  const container = btn.nextElementSibling;
  if(!container) return;
  btn.style.display = 'none';
  container.style.display = 'block';
  container.innerHTML = `
    <div class="dd-header">${_t('🔎 Pour aller plus loin…','🔎 Para saber más…','🔎 Dig deeper…')}</div>
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
    el.innerHTML=`<p class="fav-empty">${_t('Aucun fait lu pour le moment.','Ningún dato leído por ahora.','No facts read yet.')}</p>`;
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
    <button class="cat-back-btn" onclick="renderCatView('${mode}')">← ${_t('Catégories','Categorías','Categories')}</button>
    <div style="margin-bottom:10px;font-family:'Space Mono',monospace;font-size:.52rem;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted)">${icon} ${label}</div>
    ${filtered.map((f,i)=>{
      const origIdx = items.indexOf(f);
      const safeText=f.text.replace(/'/g,"\\'").replace(/"/g,'&quot;');
      const isFav=state.favs.some(fv=>fv.id===f.id);
      return`<div class="fav-item">
        ${isFavMode?'':`<div class="fav-item-badge badge-${f.cat}"><span class="badge-dot"></span><span style="margin-left:auto;font-size:.6rem;opacity:.4">${f.date||''}</span></div>`}
        <p class="fav-item-text">${f.text}</p>
        ${DEEP_DIVES[f.id]?`<button class="deep-dive-btn" onclick="haptic('light');showInlineDeepDive(this,'${f.id}')"><span class="dd-icon">🔎</span> ${_t('Creuser le sujet','Profundizar','Dig deeper')}</button><div class="deep-dive-container" style="display:none;"></div>`:''}
        <div class="fav-item-actions">
          ${!isFavMode?`<button class="hist-fav-btn ${isFav?'is-fav':''}" onclick="haptic();toggleHistFav('${f.id}','${f.cat}','${safeText}');openCatFacts('${cat}','${mode}')">${isFav?'♥':'♡'}</button>`:''}
          <button class="fav-share-btn" onclick="haptic();shareFav('${safeText}','${f.cat}')">↗ ${_t('Partager','Compartir','Share')}</button>
          ${isFavMode?`<button class="fav-remove" onclick="removeFavAndRefresh(${origIdx},'${cat}')">✕</button>`:''}
        </div>
      </div>`;
    }).join('')}`;
}

function renderCatView(mode){
  if(mode==='favs') renderFavs();
  else renderHistory();
}

// ── RECHERCHE DANS FAVORIS/HISTORIQUE/ÉPHÉMÉRIDES ────────────────────────
 
var _favSearchActive = false;
 
function injectSearchBar(){
  var panel = document.getElementById('panelFavs');
  if(!panel || document.getElementById('favSearchBar')) return;
  var tabs = panel.querySelector('.fav-tabs');
  if(!tabs) return;
  var bar = document.createElement('div');
  bar.id = 'favSearchBar';
  bar.style.cssText = 'padding:10px 16px 6px;';
  bar.innerHTML = '<div style="display:flex;align-items:center;background:var(--card-bg,#0d1b2a);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:8px 12px;gap:8px;">'
    + '<span style="opacity:.5;font-size:.9rem;">🔍</span>'
    + '<input id="favSearchInput" type="text" placeholder="' + (lang==='fr'?'Rechercher un fait…':lang==='es'?'Buscar un dato…':'Search a fact…') + '" style="flex:1;background:none;border:none;outline:none;color:var(--text);font-size:.85rem;font-family:inherit;" oninput="onFavSearch(this.value)">'
    + '<span id="favSearchClear" onclick="clearFavSearch()" style="cursor:pointer;opacity:.4;font-size:.8rem;display:none;">✕</span>'
    + '</div>';
  tabs.parentNode.insertBefore(bar, tabs.nextSibling);
}
 
function onFavSearch(query){
  var clear = document.getElementById('favSearchClear');
  if(clear) clear.style.display = query.length > 0 ? 'block' : 'none';
  if(query.length < 2){
    // Trop court → affichage normal
    exitFavSearch();
    return;
  }
  _favSearchActive = true;
  var q = query.toLowerCase();
  // Chercher dans favoris + historique + éphémérides
  var results = [];
  var seen = {};
  var allItems = [].concat(
    (state.favs||[]).map(function(f){return {id:f.id,cat:f.cat,text:f.text,date:f.date,src:'fav'};}),
    (state.history||[]).map(function(f){return {id:f.id,cat:f.cat,text:f.text,date:f.date,src:'history'};}),
    (state.ephemHistory||[]).map(function(f){return {id:f.id,cat:f.cat||'positive',text:f.text,date:f.date,src:'ephem'};})
  );
  allItems.forEach(function(f){
    if(!seen[f.id] && f.text && f.text.toLowerCase().indexOf(q) >= 0){
      seen[f.id] = true;
      results.push(f);
    }
  });
  renderSearchResults(results, query);
}
 
function renderSearchResults(results, query){
  // Masquer les tabs et listes normales
  var tabs = document.querySelector('#panelFavs .fav-tabs');
  if(tabs) tabs.style.display = 'none';
  ['favsList','historyListInline','ephemListInline'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.style.display = 'none';
  });
  // Conteneur résultats
  var container = document.getElementById('favSearchResults');
  if(!container){
    container = document.createElement('div');
    container.id = 'favSearchResults';
    var bar = document.getElementById('favSearchBar');
    if(bar) bar.parentNode.insertBefore(container, bar.nextSibling);
  }
  if(!results.length){
    container.innerHTML = '<p class="fav-empty">' + (lang==='fr'?'Aucun résultat pour « '+query+' »':lang==='es'?'Sin resultados para "'+query+'"':'No results for "'+query+'"') + '</p>';
    return;
  }
  var catLabels = T[lang].catLabels||{};
  container.innerHTML = '<div style="padding:6px 16px 4px;font-family:\'Space Mono\',monospace;font-size:.5rem;letter-spacing:.12em;text-transform:uppercase;color:var(--text-muted)">'
    + results.length + (lang==='fr'?' résultat(s)':lang==='es'?' resultado(s)':' result(s)') + '</div>'
    + results.map(function(f){
      var icon = CAT_ICONS[f.cat]||'✦';
      var label = (catLabels[f.cat]||'').replace('✦ ','');
      var isFav = state.favs.some(function(fv){return fv.id===f.id;});
      var safeText = f.text.replace(/'/g,"\\'").replace(/"/g,'&quot;');
      return '<div class="fav-item">'
        + '<div class="fav-item-badge badge-'+f.cat+'"><span class="badge-dot"></span><span style="margin-left:4px;font-size:.6rem;opacity:.6">'+icon+' '+label+'</span><span style="margin-left:auto;font-size:.6rem;opacity:.4">'+(f.date||'')+'</span></div>'
        + '<p class="fav-item-text">'+f.text+'</p>'
        + (DEEP_DIVES[f.id]?'<button class="deep-dive-btn" onclick="haptic(\'light\');showInlineDeepDive(this,\''+f.id+'\')"><span class="dd-icon">🔎</span> '+(_t('Creuser le sujet','Profundizar','Dig deeper'))+'</button><div class="deep-dive-container" style="display:none;"></div>':'')
        + '<div class="fav-item-actions">'
        + '<button class="hist-fav-btn '+(isFav?'is-fav':'')+'" onclick="haptic();toggleHistFav(\''+f.id+'\',\''+f.cat+'\',\''+safeText+'\')">'+( isFav?'♥':'♡')+'</button>'
        + '<button class="fav-share-btn" onclick="haptic();shareFav(\''+safeText+'\',\''+f.cat+'\')">↗ '+(_t('Partager','Compartir','Share'))+'</button>'
        + '</div></div>';
    }).join('');
}
 
function clearFavSearch(){
  var input = document.getElementById('favSearchInput');
  if(input) input.value = '';
  var clear = document.getElementById('favSearchClear');
  if(clear) clear.style.display = 'none';
  exitFavSearch();
}
 
function exitFavSearch(){
  _favSearchActive = false;
  var container = document.getElementById('favSearchResults');
  if(container) container.remove();
  // Réafficher les tabs
  var tabs = document.querySelector('#panelFavs .fav-tabs');
  if(tabs) tabs.style.display = '';
  // Réafficher le bon onglet
  var tabFavs = document.getElementById('tabFavs');
  var tabHist = document.getElementById('tabHistory');
  var tabEphem = document.getElementById('tabEphem');
  if(tabEphem && tabEphem.classList.contains('active')) switchFavTab('ephem');
  else if(tabHist && tabHist.classList.contains('active')) switchFavTab('history');
  else switchFavTab('favs');
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
    el.innerHTML=`<p class="fav-empty">${_t('Aucune éphéméride lue pour le moment.<br>Ouvre le fait du jour chaque matin !','Ninguna efeméride leída aún.<br>¡Abre el dato del día cada mañana!','No daily facts read yet.<br>Open the fact of the day each morning!')}</p>`;
    return;
  }
  el.innerHTML=state.ephemHistory.map(f=>{
    const isFav=state.favs.some(fv=>fv.id===f.id);
    const safeText=f.text.replace(/'/g,"\\'").replace(/"/g,'&quot;');
    return`<div class="fav-item">
      <div class="fav-item-badge"><span class="badge-dot"></span><span style="margin-left:auto;font-size:.6rem;opacity:.4">${f.date||''}</span></div>
      <p class="fav-item-text">${f.text}</p>
      ${DEEP_DIVES[f.id]?`<button class="deep-dive-btn" onclick="haptic('light');showInlineDeepDive(this,'${f.id}')"><span class="dd-icon">🔎</span> ${_t('Creuser le sujet','Profundizar','Dig deeper')}</button><div class="deep-dive-container" style="display:none;"></div>`:''}
      <div class="fav-item-actions">
        <button class="hist-fav-btn ${isFav?'is-fav':''}" onclick="haptic();toggleHistFav('${f.id}','${f.cat||'positive'}','${safeText}');renderEphemHistory()">${isFav?'♥':'♡'}</button>
        <button class="fav-share-btn" onclick="haptic();shareFav('${safeText}','${f.cat||'positive'}')">↗ ${_t('Partager','Compartir','Share')}</button>
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
  if(type==='favs'){renderFavs();document.getElementById('panelFavs').classList.add('open');injectSearchBar();}
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
    <div class="dl-stat-item dl-stat-link" onclick="haptic();closeDailyLimit();openPanel('favs');switchFavTab('history')"><div class="dl-stat-val">${total}</div><div class="dl-stat-label">${_t('FAITS LUS','DATOS LEÍDOS','FACTS READ')}</div></div>
    <div class="dl-stat-item"><div class="dl-stat-val">${streak}</div><div class="dl-stat-label">${_t("JOURS D'AFFILÉE",'DÍAS SEGUIDOS','DAY STREAK')}</div></div>
    <div class="dl-stat-item"><div class="dl-stat-val">${pct}%</div><div class="dl-stat-label">${_t('AU QUIZ','EN EL QUIZ','QUIZ SCORE')}</div></div>
    <div class="dl-stat-item dl-stat-link" onclick="haptic();closeDailyLimit();openPanel('favs');switchFavTab('favs')"><div class="dl-stat-val">${favCount}</div><div class="dl-stat-label">${_t('FAVORIS','FAVORITOS','FAVORITES')}</div></div>
    <div class="dl-stat-item dl-stat-link" onclick="haptic();closeDailyLimit();openPlanetPanel()"><div class="dl-stat-val">${planetsCount}</div><div class="dl-stat-label">${_t('PLANÈTES','PLANETAS','PLANETS')}</div></div>
    <div class="dl-stat-item"><div class="dl-stat-val">${state.shares||0}</div><div class="dl-stat-label">${_t('PARTAGES','COMPARTIDOS','SHARES')}</div></div>
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
  document.getElementById('dlTitle').textContent = _t('À demain !','¡Hasta mañana!','See you tomorrow!');
  document.getElementById('dlSub').textContent = _t(
    `Tu as découvert tes ${DAILY_LIMIT} curiosités du jour...`,
    `Has descubierto tus ${DAILY_LIMIT} curiosidades del día...`,
    `You've discovered your ${DAILY_LIMIT} curiosities for today...`
  );
  document.getElementById('dlFavsBtn').textContent = _t('♡ Relire mes favoris','♡ Releer mis favoritos','♡ Review my favourites');
  document.getElementById('dlTimerLabel').textContent = _t('avant le prochain lot','hasta el próximo lote','until the next batch');
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
  const text = lang==='fr' ? entry.fr : lang==='es' ? (entry.es||entry.en) : entry.en;
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
  const bannerLabel = fact._thematic ? fact._thematic.label : (lang==='fr' ? '✦ Fait du jour' : lang==='es' ? '✦ Dato del día' : '✦ Fact of the day');
  document.getElementById('dailyBannerText').textContent = bannerText;
  document.getElementById('dailyBannerLabel').textContent = bannerLabel;
  document.getElementById('dailyBannerDate').textContent =
    new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-GB', {day:'numeric', month:'short'});
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
      state.ephemHistory.unshift({id:fact.id, cat, label, icon, text:displayText, date:new Date().toLocaleDateString(lang==='fr'?'fr-FR':lang==='es'?'es-ES':'en-US')});
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
    lang === 'fr' ? '✦ Fait du jour' : lang === 'es' ? '✦ Dato del día' : '✦ Fact of the day';
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

  // Image éphéméride optionnelle
  let dailyImgEl=document.getElementById('dailyFactImg');
  const _ek=String(new Date().getMonth()+1).padStart(2,'0')+'-'+String(new Date().getDate()).padStart(2,'0');
  const _ee=typeof EPHEMERIS!=='undefined'?EPHEMERIS[_ek]:null;
  const _di=_ee&&_ee.img?_ee.img:null;
  if(!dailyImgEl){
    dailyImgEl=document.createElement('img');
    dailyImgEl.id='dailyFactImg';dailyImgEl.className='daily-img';dailyImgEl.alt='';
    dailyImgEl.onerror=function(){this.style.display='none';};
    dailyImgEl.onload=function(){this.classList.add('loaded');};
    document.getElementById('dailyFactText').insertAdjacentElement('beforebegin',dailyImgEl);
  }
  if(_di){dailyImgEl.src=_di;dailyImgEl.style.display='block';dailyImgEl.classList.remove('loaded');}
  else{dailyImgEl.style.display='none';}

  document.getElementById('dailyShareBtn').textContent = lang === 'fr' ? '↗ Partager' : lang === 'es' ? '↗ Compartir' : '↗ Share';

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
  if(ddData && ((lang==='fr'?ddData.fr:lang==='es'?(ddData.es||ddData.en):ddData.en)||[]).length){
    ddBtn.style.display = 'inline-block';
    ddBtn.innerHTML = `🔎 <span id="dailyDdLabel">${_t('Creuser le sujet','Profundizar','Dig deeper')}</span>`;
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
  const items = lang==='fr' ? data.fr : lang==='es' ? data.es : data.en;
  if(!items || !items.length) return;
  btn.style.display = 'none';
  const container = document.getElementById('dailyDdContainer');
  container.style.display = 'block';
  container.innerHTML = `
    <div class="dd-header">${_t('🔎 Pour aller plus loin…','🔎 Para saber más…','🔎 Dig deeper…')}</div>
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
  btn.title = isFav ? (_t('Retirer des favoris','Quitar de favoritos','Remove from favourites')) : (_t('Ajouter aux favoris','Añadir a favoritos','Add to favourites'));
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
    quotes:'#fbbf24',laws:'#94a3b8',tales:'#a78bfa',dinosaurs:'#84cc16',religion:'#b39ddb'
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
    { cats:['space','science'],       emoji:'🔭', fr:'Explorateur de l\'Infini',   en:'Explorer of the Infinite', es:'Explorador del Infinito',  descFr:'Tu regardes les étoiles et questionnes l\'univers. La curiosité scientifique est ta boussole.', descEn:'You gaze at the stars and question the universe. Scientific curiosity is your compass.', descEs:'Miras las estrellas y cuestionas el universo. La curiosidad científica es tu brújula.' },
    { cats:['science','body','inventions'], emoji:'🧬', fr:'L\'Esprit Scientifique', en:'The Scientific Mind', es:'La Mente Científica',      descFr:'Tu dissèques le monde pour mieux le comprendre. Les mécanismes cachés te fascinent.', descEn:'You dissect the world to understand it better. Hidden mechanisms fascinate you.', descEs:'Diseccionas el mundo para comprenderlo mejor. Los mecanismos ocultos te fascinan.' },
    { cats:['arts','cinema','music'],  emoji:'🎭', fr:'L\'Âme Artistique',          en:'The Artistic Soul', es:'El Alma Artística',        descFr:'Tu ressens avant de réfléchir. La beauté sous toutes ses formes est ton territoire.', descEn:'You feel before you think. Beauty in all its forms is your territory.', descEs:'Sientes antes de pensar. La belleza en todas sus formas es tu territorio.' },
    { cats:['mythology','tales','history'], emoji:'📜', fr:'Le Chroniqueur Éternel',   en:'The Eternal Chronicler', es:'El Cronista Eterno',  descFr:'Les mythes et légendes sont ta toile. Tu tisses le fil entre passé et imaginaire.', descEn:'Myths and legends are your canvas. You weave the thread between past and imagination.', descEs:'Los mitos y leyendas son tu lienzo. Tejes el hilo entre pasado e imaginación.' },
    { cats:['psychology','body'],            emoji:'🧠', fr:'L\'Architecte de l\'Esprit', en:'The Mind Architect', es:'El Arquitecto de la Mente',       descFr:'Tu scrutes les mécanismes cachés de la pensée. Le cerveau humain est ton terrain de jeu.', descEn:'You probe the hidden mechanisms of thought. The human brain is your playground.', descEs:'Escrutas los mecanismos ocultos del pensamiento. El cerebro humano es tu terreno de juego.' },
    { cats:['oceans','animals','science'],   emoji:'🌊', fr:'Le Gardien des Profondeurs',  en:'The Guardian of the Deep', es:'El Guardián de las Profundidades',  descFr:'Les abysses t\'appellent. Tu plonges là où personne ne va.', descEn:'The abyss calls you. You dive where no one else goes.', descEs:'Los abismos te llaman. Te sumerges allí donde nadie más va.' },
    { cats:['dinosaurs','science','space'],  emoji:'🦕', fr:'Le Voyageur du Temps',        en:'The Time Traveler', es:'El Viajero del Tiempo',         descFr:'Du Big Bang aux dinosaures, tu explores les ères révolues avec une curiosité sans limites.', descEn:'From the Big Bang to dinosaurs, you explore bygone eras with boundless curiosity.', descEs:'Del Big Bang a los dinosaurios, exploras eras pasadas con una curiosidad sin límites.' },
    { cats:['quotes','psychology'],          emoji:'💬', fr:'Le Sage Moderne',             en:'The Modern Sage', es:'El Sabio Moderno',           descFr:'Les mots des grands esprits guident ta réflexion. Tu cherches la sagesse partout.', descEn:'The words of great minds guide your thinking. You seek wisdom everywhere.', descEs:'Las palabras de las grandes mentes guían tu reflexión. Buscas la sabiduría en todas partes.' },
    { cats:['laws','fun'],                   emoji:'⚖️', fr:'L\'Avocat du Diable',         en:'The Devil\'s Advocate', es:'El Abogado del Diablo',    descFr:'L\'absurde te fascine autant que la logique. Tu trouves de l\'or dans l\'insolite.', descEn:'The absurd fascinates you as much as logic. You find gold in the unusual.', descEs:'Lo absurdo te fascina tanto como la lógica. Encuentras oro en lo insólito.' },
    { cats:['records','sports'],             emoji:'🏅', fr:'Le Chasseur d\'Extrêmes',     en:'The Extreme Hunter', es:'El Cazador de Extremos',        descFr:'Plus haut, plus fort, plus fou. Les limites humaines sont ton obsession.', descEn:'Higher, stronger, crazier. Human limits are your obsession.', descEs:'Más alto, más fuerte, más loco. Los límites humanos son tu obsesión.' },
    { cats:['world','language','history'], emoji:'🌍', fr:'Citoyen du Monde',       en:'Citizen of the World', es:'Ciudadano del Mundo',      descFr:'Les frontières n\'existent pas pour toi. Les cultures et l\'Histoire sont tes passions.', descEn:'Borders don\'t exist for you. Cultures and History are your passions.', descEs:'Las fronteras no existen para ti. Las culturas y la historia son tus pasiones.' },
    { cats:['animals','body'],         emoji:'🐾', fr:'L\'Ami des Bêtes',           en:'Friend of All Creatures', es:'Amigo de los Animales',   descFr:'Le vivant te touche profondément. Tu vois le monde avec bienveillance et émerveillement.', descEn:'Living things move you deeply. You see the world with kindness and wonder.', descEs:'Lo viviente te conmueve profundamente. Ves el mundo con benevolencia y asombro.' },
    { cats:['gaming','fiction','cinema'], emoji:'🎮', fr:'Le Geek Érudit',          en:'The Cultured Geek', es:'El Geek Erudito',         descFr:'Tu habites autant les mondes imaginaires que le réel. La culture pop est une porte vers la réflexion.', descEn:'You inhabit imaginary worlds as much as the real one. Pop culture is a gateway to deeper thinking.', descEs:'Habitas mundos imaginarios tanto como el real. La cultura pop es una puerta hacia la reflexión.' },
    { cats:['food','world'],           emoji:'🍽️', fr:'Le Gastronome',             en:'The Connoisseur', es:'El Gastrónomo',           descFr:'Tu sais que chaque plat raconte une histoire. La table est un lieu de connaissance autant que de plaisir.', descEn:'You know every dish tells a story. The table is a place of knowledge as much as pleasure.', descEs:'Sabes que cada plato cuenta una historia. La mesa es un lugar de conocimiento y placer.' },
    { cats:['sports','celebrities'],   emoji:'🏆', fr:'L\'Esprit de Champion',      en:'The Champion Spirit', es:'Espíritu de Campeón',       descFr:'Tu vibres pour les exploits humains. La performance et le dépassement de soi t\'inspirent.', descEn:'You thrive on human achievements. Performance and self-surpassing inspire you.', descEs:'Vibras por las hazañas humanas. El rendimiento y la superación te inspiran.' },
    { cats:['positive','fun'],         emoji:'✨', fr:'Le Rayon de Soleil',         en:'The Ray of Sunshine', es:'El Rayo de Sol',       descFr:'Tu choisis la lumière. Les anecdotes joyeuses et les surprises positives sont ta marque de fabrique.', descEn:'You choose the light. Joyful anecdotes and positive surprises are your signature.', descEs:'Eliges la luz. Las anécdotas alegres y las sorpresas positivas son tu sello.' },
    { cats:['religion','mythology','quotes'], emoji:'🕊️', fr:'Le Chercheur de Sens',      en:'The Seeker of Meaning', es:'El Buscador de Sentido',     descFr:'Tu explores les grandes questions de l\'humanité. Foi, mythes et sagesse éclairent ton chemin.', descEn:'You explore humanity\'s great questions. Faith, myths and wisdom light your path.', descEs:'Exploras las grandes preguntas de la humanidad. Fe, mitos y sabiduría iluminan tu camino.' },
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
    bestProfile = { emoji:'🌌', fr:'L\'Oracle Universel', en:'The Universal Oracle', es:'El Oráculo Universal',
  descFr:'Tout t\'intéresse...', descEn:'Everything interests you...', descEs:'Todo te interesa, nada se te escapa. Eres la encarnación misma de la curiosidad sin fronteras.' };
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
    lang === 'fr' ? '📊 Statistiques' : lang === 'es' ? '📊 Estadísticas' : '📊 Statistics';

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

  const labels = lang==='fr'
          ? {facts:'Faits lus', favs:'Favoris', shares:'Partages', achiev:'Succès', streak:'Série actuelle', jours:'jours', quizLbl:'Quiz', quizSub:'réponses correctes', catLbl:'Par catégorie', noQuiz:'Aucun quiz joué encore', ephemLbl:'Éphémérides lus', profileLbl:'Profil de curiosité', profileLocked:'Lis encore pour débloquer ton profil', profileTop:'Top catégories'}
          : lang==='es'
          ? {facts:'Datos leídos', favs:'Favoritos', shares:'Compartidos', achiev:'Logros', streak:'Racha actual', jours:'días', quizLbl:'Quiz', quizSub:'respuestas correctas', catLbl:'Por categoría', noQuiz:'Ningún quiz jugado aún', ephemLbl:'Efemérides leídas', profileLbl:'Perfil de curiosidad', profileLocked:'Lee más para desbloquear tu perfil', profileTop:'Top categorías'}
          : {facts:'Facts read', favs:'Favourites', shares:'Shares', achiev:'Achievements', streak:'Current streak', jours:'days', quizLbl:'Quiz', quizSub:'correct answers', catLbl:'By category', noQuiz:'No quiz played yet', ephemLbl:'Daily facts read', profileLbl:'Curiosity profile', profileLocked:'Read more to unlock your profile', profileTop:'Top categories'};

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
    const profileName = lang==='fr'?profile.fr:lang==='es'?profile.es:profile.en;
    const profileDesc = lang==='fr'?profile.descFr:lang==='es'?profile.descEs:profile.descEn;
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
    <div class="stats-section-title" style="margin-top:24px">${lang==='fr'?'Langue':lang==='es'?'Idioma':'Language'}</div>
    <div class="stats-numbers">
      <div class="stat-card" onclick="haptic();switchLang('fr');renderStats();applyI18n()" style="cursor:pointer;${lang==='fr'?'border:1px solid var(--accent);':''}">
        <div class="stat-val">🇫🇷</div>
        <div class="stat-lbl">Français</div>
      </div>
      <div class="stat-card" onclick="haptic();switchLang('es');renderStats();applyI18n()" style="cursor:pointer;${lang==='es'?'border:1px solid var(--accent);':''}">
        <div class="stat-val">🇪🇸</div>
        <div class="stat-lbl">Español</div>
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
  document.getElementById('authSub').innerHTML=lang==='fr'
    ?'Crée un compte pour sauvegarder ta progression<br>et retrouver tes curiosités sur tous tes appareils.'
    :lang==='es'?'Crea una cuenta para guardar tu progreso<br>y encontrar tus curiosidades en todos tus dispositivos.'
    :'Create an account to save your progress<br>and find your curiosities on all your devices.';
  document.getElementById('authEmail').placeholder='Email';
  document.getElementById('authPassword').placeholder=_t('Mot de passe','Contraseña','Password');
  if(document.getElementById('authForgot')) (document.getElementById('authForgot')||{}).textContent=_t('Mot de passe oublié ?','¿Contraseña olvidada?','Forgot password?');
  if(document.getElementById('authMainBtn')) (document.getElementById('authMainBtn')||{}).textContent=_authMode==='register'
    ?(_t('Créer un compte','Crear cuenta','Create account')):(_t('Se connecter','Iniciar sesión','Sign in'));
  document.getElementById('authToggle').innerHTML=_authMode==='register'
    ?(_t('Déjà un compte ? <span>Se connecter</span>','¿Ya tienes cuenta? <span>Iniciar sesión</span>','Already have an account? <span>Sign in</span>'))
    :(_t('Pas encore de compte ? <span>Créer un compte</span>','¿No tienes cuenta? <span>Crear cuenta</span>',"Don't have an account? <span>Sign up</span>"));
  if(document.getElementById('authDivider')) (document.getElementById('authDivider')||{}).textContent=_t('ou','o','or');
  if(document.querySelector('.auth-skip')) (document.querySelector('.auth-skip')||{}).textContent=_t('Continuer sans compte →','Continuar sin cuenta →','Continue without account →');}

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
  if(!email||!password){setAuthError(_t('Remplis tous les champs.','Rellena todos los campos.','Please fill in all fields.'));return;}
  if(password.length<6){setAuthError(_t('Mot de passe trop court (min. 6 caractères).','Contraseña muy corta (mín. 6 caracteres).','Password too short (min. 6 characters).'));return;}
  if(!window._fbSignIn){setAuthError(_t('Service indisponible, réessaie.','Servicio no disponible, reintenta.','Service unavailable, please retry.'));return;}
  try{
    if(_authMode==='register'){await window._fbRegister(email,password);}
    else{await window._fbSignIn(email,password);}
  }catch(err){
    const fr2=lang==='fr';
    const msgs={
      'auth/email-already-in-use':_t('Email déjà utilisé.','Email ya en uso.','Email already in use.'),
      'auth/user-not-found':_t('Compte introuvable.','Cuenta no encontrada.','Account not found.'),
      'auth/wrong-password':_t('Mot de passe incorrect.','Contraseña incorrecta.','Wrong password.'),
      'auth/invalid-email':_t('Email invalide.','Email inválido.','Invalid email.'),
      'auth/too-many-requests':_t('Trop de tentatives. Réessaie plus tard.','Demasiados intentos. Inténtalo más tarde.','Too many attempts. Try again later.'),
      'auth/network-request-failed':_t('Erreur réseau.','Error de red.','Network error.'),
      'auth/invalid-credential':_t('Identifiants incorrects.','Credenciales incorrectas.','Invalid credentials.'),
    };
    console.error('Auth error:', err);
    setAuthError(msgs[err.code]||(_t('Erreur : ','Error: ','Error: ')+(err.message||err.code||_t('inconnue','desconocido','unknown'))));
  }
}

async function handleGoogleSignIn(){
  haptic('light');
  if(document.getElementById('authError')) (document.getElementById('authError')||{}).textContent='';
  try{
    if(!window._fbGoogleAuth){setAuthError(_t('Service indisponible.','Servicio no disponible.','Service unavailable.'));return;}
    await window._fbGoogleAuth();
  }
  catch(err){if(err.code!=='auth/popup-closed-by-user')setAuthError(_t('Connexion Google échouée.','Error en la conexión de Google.','Google sign-in failed.'));}
}

async function handleForgot(){
  haptic('light');
  const email=document.getElementById('authEmail').value.trim();
  const fr=lang==='fr';
  if(!email){setAuthError(_t("Entre ton email d'abord.","Introduce tu email primero.",'Enter your email first.'));return;}
  try{await window._fbResetPwd(email);showToast(_t('✓ Email de réinitialisation envoyé','✓ Email de restablecimiento enviado','✓ Reset email sent'));}
  catch(e){setAuthError(_t('Email introuvable.','Email no encontrado.','Email not found.'));}
}

async function handleSignOut(){
  haptic('light');
  try{await fbAuth.signOut();closeAccountPanel();showToast(_t('Déconnecté','Desconectado','Signed out'));}
  catch(e){}
}

async function forceSyncNow(){
  haptic('light');
  if(!_fbCurrentUser){showToast(_t('Non connecté','No conectado','Not signed in'));return;}
  const s=document.getElementById('accountSyncStatus');
  s.className='account-sync-status pending';
  s.textContent=_t('↑ Synchronisation...','↑ Sincronizando...','↑ Syncing...');
  await syncToCloud();
  s.className='account-sync-status ok';
  s.textContent=_t('✓ Progression sauvegardée','✓ Progreso guardado','✓ Progress saved');
  showToast(_t('✓ Synchronisé','✓ Sincronizado','✓ Synced'));
}

function openAccountPanel(){
  if(!document.getElementById('accountPanel')) return;
  if(!_fbCurrentUser){showAuthScreen();return;}
  const user=_fbCurrentUser;
  const name=user.displayName||user.email||'?';
  const apt=document.getElementById('accountPanelTitle'); if(apt) apt.textContent=_t('⬡ Mon compte','⬡ Mi cuenta','⬡ My account');
  const aab=document.getElementById('accountAvatarBig'); if(aab) aab.textContent=name[0].toUpperCase();
  const aed=document.getElementById('accountEmailDisplay'); if(aed) aed.textContent=user.email;
  const asb=document.getElementById('accountSyncBtn'); if(asb) asb.textContent=_t('↑ Synchroniser maintenant','↑ Sincronizar ahora','↑ Sync now');
  const aso=document.getElementById('accountSignOutBtn'); if(aso) aso.textContent=_t('Déconnexion','Cerrar sesión','Sign out');
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
    if(confirm(_t('Quitter Oracle ?','¿Salir de Oracle?','Leave Oracle?'))){
      window.history.back();
      return;
    }
  }
  // First back — show toast and re-push
  showToast(_t('↩ Glisse encore pour quitter','↩ Desliza de nuevo para salir','↩ Swipe again to exit'));
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
        showToast(_t('💀 Pluton se souvient…','💀 Plutón recuerda…','💀 Pluto remembers…'));
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
