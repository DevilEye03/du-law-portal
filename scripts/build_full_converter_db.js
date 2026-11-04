const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Fetching datasets from Hugging Face...');
  const baseUrl = 'https://huggingface.co/datasets/GSMS-B/ipc-bns-crpc-bnss-iea-bsa-respective-old-new-sections-mapping/raw/main/';

  const [
    ipcToBns,
    crpcToBnss,
    ieaToBsa,
    bnsToIpc,
    bnssToCrpc,
    bsaToIea
  ] = await Promise.all([
    fetch(baseUrl + 'ipc_to_bns.json').then(r => r.json()),
    fetch(baseUrl + 'crpc_to_bnss.json').then(r => r.json()),
    fetch(baseUrl + 'iea_to_bsa.json').then(r => r.json()),
    fetch(baseUrl + 'bns_to_ipc.json').then(r => r.json()),
    fetch(baseUrl + 'bnss_to_crpc.json').then(r => r.json()),
    fetch(baseUrl + 'bsa_to_iea.json').then(r => r.json())
  ]);

  console.log(`Fetched counts:
  - IPC -> BNS: ${ipcToBns.length}
  - CrPC -> BNSS: ${crpcToBnss.length}
  - IEA -> BSA: ${ieaToBsa.length}
  - BNS -> IPC: ${bnsToIpc.length}
  - BNSS -> CrPC: ${bnssToCrpc.length}
  - BSA -> IEA: ${bsaToIea.length}
  `);

  // Load existing curated provisions from js/bns_converter.js
  const bnsConverterPath = path.join(__dirname, '..', 'js', 'bns_converter.js');
  const existingCode = fs.readFileSync(bnsConverterPath, 'utf8');
  global.window = {};
  eval(existingCode);
  const existingDb = global.window.BNS_CONVERTER_DB;
  console.log(`Found ${existingDb.sections.length} existing curated provisions.`);

  // Create lookup maps of curated provisions by key
  const curatedMap = new Map();
  for (const s of existingDb.sections) {
    // Key by actPair + oldSecNum and actPair + newSecNum
    if (s.actPair && s.oldSecNum) {
      curatedMap.set(`${s.actPair}:old:${s.oldSecNum.toLowerCase().replace(/[^a-z0-9]/g, '')}`, s);
    }
    if (s.actPair && s.newSecNum) {
      curatedMap.set(`${s.actPair}:new:${s.newSecNum.toLowerCase().replace(/[^a-z0-9]/g, '')}`, s);
    }
  }

  function cleanChapter(chap) {
    if (!chap) return '';
    return chap.replace(/^CHAPTER\s+[IVXLCDM0-9]+\s*(OF\s+)?/i, '')
               .replace(/^PART\s+[IVXLCDM0-9]+\s*/i, '')
               .replace(/_/g, ' ')
               .toLowerCase()
               .replace(/\b\w/g, c => c.toUpperCase())
               .trim();
  }

  const allSections = [];
  const processedKeys = new Set();

  function processPair(data, actPair, actType, oldAct, newAct, isReverse = false) {
    for (const item of data) {
      const src = item.source;
      const tgt = item.target;

      let oldSec = '';
      let newSec = '';
      let oldSecNum = '';
      let newSecNum = '';
      let offense = '';
      let chapter = '';
      let status = item.status;

      if (!isReverse) {
        // Forward: Old -> New
        oldSec = src ? `Section ${src.section}${src.sub_section ? ' (' + src.sub_section + ')' : ''}` : '';
        oldSecNum = src ? String(src.section).trim() : '';
        offense = (src && src.title) ? src.title.trim() : ((tgt && tgt.title) ? tgt.title.trim() : 'Legal Provision');
        chapter = src ? cleanChapter(src.chapter) : (tgt ? cleanChapter(tgt.chapter) : '');

        if (tgt) {
          newSec = `Section ${tgt.section}${tgt.sub_section ? ' (' + tgt.sub_section + ')' : ''}`;
          newSecNum = String(tgt.section).trim();
          if (tgt.title && (!offense || offense === 'Legal Provision')) offense = tgt.title.trim();
        } else {
          newSec = 'Repealed / Omitted';
          newSecNum = '';
        }
      } else {
        // Reverse: New -> Old (for new sections with no old counterpart)
        if (tgt) continue; // Skip if it already has an old counterpart (handled in forward)
        newSec = src ? `Section ${src.section}${src.sub_section ? ' (' + src.sub_section + ')' : ''}` : '';
        newSecNum = src ? String(src.section).trim() : '';
        oldSec = 'Newly Introduced (No Old Sec)';
        oldSecNum = '';
        offense = (src && src.title) ? src.title.trim() : 'Newly Introduced Offence';
        chapter = src ? cleanChapter(src.chapter) : '';
      }

      // De-duplicate
      const dedupKey = `${actPair}:${oldSecNum}:${newSecNum}:${offense.toLowerCase()}`;
      if (processedKeys.has(dedupKey)) continue;
      processedKeys.add(dedupKey);

      // Check if we have curated data for this
      const oldCuratedKey = oldSecNum ? `${actPair}:old:${oldSecNum.toLowerCase().replace(/[^a-z0-9]/g, '')}` : null;
      const newCuratedKey = newSecNum ? `${actPair}:new:${newSecNum.toLowerCase().replace(/[^a-z0-9]/g, '')}` : null;
      const curated = (oldCuratedKey && curatedMap.get(oldCuratedKey)) || (newCuratedKey && curatedMap.get(newCuratedKey));

      let badge = 'Section Correlated';
      if (status === 'Deleted') badge = 'Repealed / Omitted';
      else if (status === 'New Section' || status === 'New Sub-Section') badge = 'Newly Introduced';
      else if (status === 'Change') badge = 'Substantively Modified';

      let changesText = '';
      if (status === 'Deleted') {
        changesText = `Repealed and omitted under ${newAct}. This provision from ${oldAct} does not exist in the new statutory framework.`;
      } else if (status === 'New Section' || status === 'New Sub-Section') {
        changesText = `Newly enacted under ${newAct}. This provision was introduced to modernize criminal justice and had no direct equivalent in ${oldAct}.`;
      } else if (status === 'Change') {
        changesText = `Substantively modified in ${newAct} with amended procedural or penal scope, updated terminology, or structural renumbering compared to ${oldAct}.`;
      } else {
        changesText = `Corresponding provision retained and transferred from ${oldAct} ${oldSec} to ${newAct} ${newSec} under ${chapter || 'statutory codes'}.`;
      }

      const entry = {
        id: `${actPair.toLowerCase()}-${(oldSecNum || newSecNum || Math.random().toString(36).substring(7)).replace(/[^a-zA-Z0-9]/g, '-')}`,
        actPair: actPair,
        actType: actType,
        oldAct: oldAct,
        newAct: newAct,
        oldSec: curated && curated.oldSec ? curated.oldSec : oldSec,
        newSec: curated && curated.newSec ? curated.newSec : newSec,
        oldSecNum: curated && curated.oldSecNum ? curated.oldSecNum : oldSecNum,
        newSecNum: curated && curated.newSecNum ? curated.newSecNum : newSecNum,
        ipc: curated && curated.ipc ? curated.ipc : oldSec,
        bns: curated && curated.bns ? curated.bns : newSec,
        ipcNum: curated && curated.ipcNum ? curated.ipcNum : oldSecNum,
        bnsNum: curated && curated.bnsNum ? curated.bnsNum : newSecNum,
        offense: curated && curated.offense ? curated.offense : offense,
        chapter: curated && curated.chapter ? curated.chapter : (chapter || 'General'),
        badge: curated && curated.badge ? curated.badge : badge,
        summary: curated && curated.summary ? curated.summary : (item.mapping_statement || `${oldAct} ${oldSec} corresponds to ${newAct} ${newSec}.`),
        changes: curated && curated.changes ? curated.changes : changesText,
        cases: curated && curated.cases ? curated.cases : [],
        duExamTip: curated && curated.duExamTip ? curated.duExamTip : ''
      };

      allSections.push(entry);
    }
  }

  // 1. IPC <-> BNS
  processPair(ipcToBns, 'IPC_BNS', 'Penal Law (IPC ↔ BNS)', 'IPC 1860', 'BNS 2023', false);
  processPair(bnsToIpc, 'IPC_BNS', 'Penal Law (IPC ↔ BNS)', 'IPC 1860', 'BNS 2023', true);

  // 2. CrPC <-> BNSS
  processPair(crpcToBnss, 'CRPC_BNSS', 'Criminal Procedure (CrPC ↔ BNSS)', 'CrPC 1973', 'BNSS 2023', false);
  processPair(bnssToCrpc, 'CRPC_BNSS', 'Criminal Procedure (CrPC ↔ BNSS)', 'CrPC 1973', 'BNSS 2023', true);

  // 3. IEA <-> BSA
  processPair(ieaToBsa, 'IEA_BSA', 'Law of Evidence (IEA ↔ BSA)', 'IEA 1872', 'BSA 2023', false);
  processPair(bsaToIea, 'IEA_BSA', 'Law of Evidence (IEA ↔ BSA)', 'IEA 1872', 'BSA 2023', true);

  console.log(`Total assembled sections across all 3 acts: ${allSections.length}`);

  // Test lookup for section 191
  const test191 = allSections.filter(s => s.oldSecNum === '191' || s.newSecNum === '191' || (s.oldSec && s.oldSec.includes('191')));
  console.log('Test lookup for Section 191:', JSON.stringify(test191, null, 2));

  // Build new bns_converter.js content
  const newDb = {
    title: existingDb.title,
    subtitle: existingDb.subtitle,
    actPairs: existingDb.actPairs,
    sections: allSections
  };

  const outputCode = `/**
 * Delhi University Law Notes Portal — Criminal Major Acts Triad Live Converter Engine
 * IPC 1860 ↔ BNS 2023 • CrPC 1973 ↔ BNSS 2023 • IEA 1872 ↔ BSA 2023
 * Comprehensive Cross-Reference, Statutory Differences, Landmark Precedents & DU Tips
 * Total Provisions: ${allSections.length} (Full Act Coverage)
 */
window.BNS_CONVERTER_DB = ${JSON.stringify(newDb, null, 2)};

// Backward Compatibility Aliases
window.CRIMINAL_LAWS_CONVERTER_DB = window.BNS_CONVERTER_DB;
`;

  fs.writeFileSync(bnsConverterPath, outputCode, 'utf8');
  console.log(`Successfully wrote ${allSections.length} provisions to ${bnsConverterPath}`);
}

main().catch(err => {
  console.error('Build script failed:', err);
  process.exit(1);
});
