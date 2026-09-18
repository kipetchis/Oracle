#!/usr/bin/env node
/*
 * inject-deepdives.js — Injection automatique des deep dives Oracle
 *
 * UTILISATION :
 *   1. Placer ce fichier + new-deepdives.json à la RACINE du dépôt Oracle
 *   2. Ouvrir un terminal dans ce dossier (barre d'adresse -> taper cmd)
 *   3. Lancer :  node inject-deepdives.js
 *
 * Le script insère chaque entrée avant l'accolade finale de DEEP_DIVES,
 * ignore les ids déjà présents, sauvegarde en .bak et vérifie la syntaxe.
 * En cas d'erreur, le fichier est restauré automatiquement.
 *
 * Relançable autant de fois que voulu : les lots déjà injectés sont sautés.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const TARGET = path.join('js', 'data', 'deep-dives.js');
const SOURCE = 'new-deepdives.json';

function fail(msg) {
  console.error('\n❌ ' + msg + '\n');
  process.exit(1);
}

if (!fs.existsSync(SOURCE)) fail(`${SOURCE} introuvable. Place-le à côté de ce script.`);
if (!fs.existsSync(TARGET)) fail(`${TARGET} introuvable. Lance le script depuis la RACINE du dépôt Oracle.`);

let dives;
try {
  dives = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
} catch (e) {
  fail(SOURCE + ' est illisible : ' + e.message);
}

const ids = Object.keys(dives);
if (!ids.length) fail(SOURCE + ' ne contient aucune entrée.');
console.log(`\n📖 ${ids.length} deep dives à traiter.\n`);

let content = fs.readFileSync(TARGET, 'utf8');

// Échappement pour chaînes entre guillemets doubles
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const blocks = [];
const skipped = [];

for (const id of ids) {
  if (new RegExp(`['"]${id}['"]\\s*:\\s*\\{`).test(content)) {
    skipped.push(id);
    continue;
  }
  const d = dives[id];
  for (const lang of ['fr', 'en', 'es']) {
    if (!Array.isArray(d[lang]) || d[lang].length === 0) {
      fail(`L'entrée ${id} n'a pas de tableau "${lang}" valide.`);
    }
  }
  const line = (lang) => d[lang].map((x) => `"${esc(x)}"`).join(',');
  blocks.push(
    `  '${id}': {\n` +
    `    fr:[${line('fr')}],\n` +
    `    en:[${line('en')}],\n` +
    `    es:[${line('es')}]\n` +
    `  },`
  );
}

if (skipped.length) console.log(`⏭️  ${skipped.length} déjà présents, ignorés.\n`);
if (!blocks.length) {
  console.log('✅ Rien à faire : tous les deep dives sont déjà en place.\n');
  process.exit(0);
}

// Insertion avant l'accolade fermante finale de l'objet
const close = content.lastIndexOf('};');
if (close === -1) fail("Impossible de trouver la fin de l'objet DEEP_DIVES.");
content = content.slice(0, close) + blocks.join('\n') + '\n' + content.slice(close);

fs.copyFileSync(TARGET, TARGET + '.bak');
fs.writeFileSync(TARGET, content, 'utf8');

try {
  execFileSync(process.execPath, ['--check', TARGET], { stdio: 'pipe' });
  console.log(`✓ ${TARGET} — syntaxe valide`);
} catch (e) {
  fs.copyFileSync(TARGET + '.bak', TARGET);
  console.error(String(e.stderr || e.message).split('\n').slice(0, 6).join('\n'));
  fail('Erreur de syntaxe : le fichier a été RESTAURÉ. Rien n\'a été modifié.');
}

console.log(`\n✅ ${blocks.length} deep dives ajoutés.`);
console.log(`   Sauvegarde conservée en ${TARGET}.bak`);
console.log(`\n👉 Vérifie dans GitHub Desktop, puis commit (+ bump sw.js).\n`);
