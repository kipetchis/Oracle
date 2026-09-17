#!/usr/bin/env node
/*
 * inject-facts.js — Injection automatique des nouveaux faits Oracle
 *
 * UTILISATION :
 *   1. Placer ce fichier + new-facts.json à la RACINE du dépôt Oracle
 *   2. Ouvrir un terminal dans ce dossier
 *   3. Lancer :  node inject-facts.js
 *
 * Le script :
 *   - lit new-facts.json
 *   - insère chaque fait avant le marqueur "// <<< CATEGORIE" de sa catégorie
 *     dans js/data/facts-fr.js, facts-en.js, facts-es.js
 *   - ajoute la source dans js/data/sources.js
 *   - IGNORE tout id déjà présent (pas de doublon possible)
 *   - fait une sauvegarde .bak de chaque fichier avant modification
 *   - vérifie la syntaxe de chaque fichier après écriture ; en cas d'erreur,
 *     restaure automatiquement la sauvegarde
 *
 * Aucune modification n'est écrite si une erreur est détectée.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DATA_DIR = path.join('js', 'data');
const FILES = {
  fr: path.join(DATA_DIR, 'facts-fr.js'),
  en: path.join(DATA_DIR, 'facts-en.js'),
  es: path.join(DATA_DIR, 'facts-es.js'),
  src: path.join(DATA_DIR, 'sources.js'),
};

function fail(msg) {
  console.error('\n❌ ' + msg + '\n');
  process.exit(1);
}

// ── 1. Vérifications préalables ────────────────────────────────────────────
if (!fs.existsSync('new-facts.json')) {
  fail("new-facts.json introuvable. Place-le à côté de ce script, à la racine du dépôt.");
}
for (const [k, f] of Object.entries(FILES)) {
  if (!fs.existsSync(f)) {
    fail(`${f} introuvable. Lance le script depuis la RACINE du dépôt Oracle.`);
  }
}

let facts;
try {
  facts = JSON.parse(fs.readFileSync('new-facts.json', 'utf8'));
} catch (e) {
  fail('new-facts.json est illisible : ' + e.message);
}
if (!Array.isArray(facts) || !facts.length) fail('new-facts.json ne contient aucun fait.');

console.log(`\n📖 ${facts.length} faits à traiter.\n`);

// ── 2. Lecture des fichiers ────────────────────────────────────────────────
const content = {};
for (const [k, f] of Object.entries(FILES)) content[k] = fs.readFileSync(f, 'utf8');

// ── 3. Échappement pour insertion dans une chaîne JS ───────────────────────
// Les textes sont placés entre guillemets doubles : on échappe " et \
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

// ── 4. Construction des insertions ─────────────────────────────────────────
const toInsert = { fr: {}, en: {}, es: {} };   // marker -> [lignes]
const srcLines = [];
const skipped = [];
let added = 0;

for (const f of facts) {
  for (const key of ['id', 'cat', 'marker', 'fr', 'en', 'es', 'src']) {
    if (!f[key]) fail(`Le fait ${f.id || '(sans id)'} n'a pas de champ "${key}".`);
  }

  // Doublon ? On vérifie dans le fichier FR (référence)
  const idPattern = new RegExp(`id\\s*:\\s*['"]${f.id}['"]`);
  if (idPattern.test(content.fr)) {
    skipped.push(f.id);
    continue;
  }

  for (const lang of ['fr', 'en', 'es']) {
    (toInsert[lang][f.marker] = toInsert[lang][f.marker] || []).push(
      `  {id:'${f.id}',cat:'${f.cat}',text:"${esc(f[lang])}"},`
    );
  }
  // Source : format identique à l'existant  's51': {n:'Wikipedia', u:'...'},
  if (!new RegExp(`['"]${f.id}['"]\\s*:`).test(content.src)) {
    srcLines.push(`  '${f.id}': {n:'Wikipedia', u:'${f.src}'},`);
  }
  added++;
}

if (skipped.length) {
  console.log(`⏭️  ${skipped.length} déjà présents, ignorés : ${skipped.join(', ')}\n`);
}
if (added === 0) {
  console.log('✅ Rien à faire : tous les faits sont déjà en place.\n');
  process.exit(0);
}

// ── 5. Insertion avant chaque marqueur de fin de catégorie ─────────────────
for (const lang of ['fr', 'en', 'es']) {
  for (const [marker, lines] of Object.entries(toInsert[lang])) {
    const needle = `  // <<< ${marker}`;
    const idx = content[lang].indexOf(needle);
    if (idx === -1) {
      fail(`Marqueur "${needle.trim()}" introuvable dans ${FILES[lang]}. Aucune modification écrite.`);
    }
    content[lang] = content[lang].slice(0, idx) + lines.join('\n') + '\n' + content[lang].slice(idx);
  }
}

// Sources : insertion juste avant l'accolade fermante finale
if (srcLines.length) {
  const close = content.src.lastIndexOf('};');
  if (close === -1) fail("Impossible de trouver la fin de l'objet SOURCES dans sources.js.");
  content.src = content.src.slice(0, close) + srcLines.join('\n') + '\n' + content.src.slice(close);
}

// ── 6. Sauvegarde, écriture, vérification syntaxique ───────────────────────
const written = [];
for (const [k, f] of Object.entries(FILES)) {
  fs.copyFileSync(f, f + '.bak');
  fs.writeFileSync(f, content[k], 'utf8');
  written.push(f);
}

let ok = true;
for (const f of written) {
  try {
    execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' });
    console.log(`✓ ${f} — syntaxe valide`);
  } catch (e) {
    console.error(`✗ ${f} — ERREUR DE SYNTAXE :`);
    console.error(String(e.stderr || e.message).split('\n').slice(0, 6).join('\n'));
    ok = false;
  }
}

if (!ok) {
  for (const f of written) fs.copyFileSync(f + '.bak', f);
  fail('Erreur détectée : tous les fichiers ont été RESTAURÉS depuis leur sauvegarde. Rien n\'a été modifié.');
}

console.log(`\n✅ ${added} faits ajoutés dans les 4 fichiers.`);
console.log(`   Sauvegardes conservées en .bak (tu peux les supprimer une fois vérifié).`);
console.log(`\n👉 Vérifie les changements dans GitHub Desktop, puis commit.\n`);
