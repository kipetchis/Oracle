// ── JOURNÉES THÉMATIQUES ─────────────────────────────────────────────────
// Pure data + helper functions for themed daily facts
// Depends on globals: lang
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

