const fs = require('fs');
const path = require('path');
global.window = {};
require('../js/data.js');

const subs = window.DU_LAW_PORTAL_DATA.subjects;

function cleanExtractedHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .trim();
}

function extractRevision(subKey, unitNum, filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');

  // Strip anything before </nav> or <div class="wrap"> to avoid TOC false positives
  let bodyStart = 0;
  const navEnd = content.indexOf('</nav>');
  if (navEnd !== -1) bodyStart = navEnd + 6;
  const wrapIdx = content.indexOf('class="wrap"');
  if (wrapIdx !== -1 && wrapIdx > bodyStart) bodyStart = wrapIdx;

  const bodyContent = content.slice(bodyStart);

  let revRelIndex = -1;

  // 1. Specific subKey / unitNum anchors
  if (subKey === 'it_laws') {
    const itPats = [
      /<section[^>]*id="(?:s13|u2s16|u3s16|u4s21|u5s19|u6s13|u7s11|u9s16)"[^>]*>/i,
      /<div class="sec-head"[^>]*>[\s\S]*?Revision summary[\s\S]*?<\/div>/i,
      /<h[1-3][^>]*>[\s\S]*?Revision summary[\s\S]*?<\/h[1-3]>/i
    ];
    for (const p of itPats) {
      const m = bodyContent.match(p);
      if (m) { revRelIndex = m.index; break; }
    }
  } else if (subKey === 'drafting') {
    if (unitNum === 3) {
      const m = bodyContent.match(/<section[^>]*id="s12"[^>]*>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 4) {
      const m = bodyContent.match(/<section[^>]*id="s10"[^>]*>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 5) {
      const m = bodyContent.match(/<(?:h[1-4]|div class="[^"]*band[^"]*")[^>]*>[\s\S]*?60-Second Definitions[\s\S]*?<\/(?:h[1-4]|div)>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 6) {
      const m = bodyContent.match(/<(?:h[1-4]|div class="[^"]*band[^"]*")[^>]*>[\s\S]*?The Last Sweep[\s\S]*?<\/(?:h[1-4]|div)>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 7) {
      const m = bodyContent.match(/<(?:h[1-4]|div class="[^"]*band[^"]*")[^>]*>[\s\S]*?60-Second Revision[\s\S]*?<\/(?:h[1-4]|div)>/i);
      if (m) revRelIndex = m.index;
    }
  } else if (subKey === 'media') {
    if (unitNum === 1) {
      const m = bodyContent.match(/<(?:section|div)[^>]*id="part10"[^>]*>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 2) {
      const m = bodyContent.match(/<h1[^>]*id="revise"[^>]*>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 3) {
      const m = bodyContent.match(/<(?:h[1-3]|div class="[^"]*band[^"]*")[^>]*>[\s\S]*?PART J · REVISION BANK[\s\S]*?<\/(?:h[1-3]|div)>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 4) {
      const m = bodyContent.match(/<section[^>]*id="J"[^>]*>|<h2[^>]*>[\s\S]*?J · Flashcards[\s\S]*?<\/h2>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 5) {
      const m = bodyContent.match(/<section[^>]*id="K1"[^>]*>|<h2[^>]*>[\s\S]*?K1 · Revision[\s\S]*?<\/h2>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 6) {
      const m = bodyContent.match(/<section[^>]*id="J1"[^>]*>|<h2[^>]*>[\s\S]*?J1 · Revision[\s\S]*?<\/h2>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 7) {
      const m = bodyContent.match(/<section[^>]*id="O2"[^>]*>|<h2[^>]*>[\s\S]*?O2 · Revision kit[\s\S]*?<\/h2>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 8) {
      const m = bodyContent.match(/<section[^>]*id="K1"[^>]*>|<h2[^>]*>[\s\S]*?K1 · Twenty-four flashcards[\s\S]*?<\/h2>/i);
      if (m) revRelIndex = m.index;
    }
  } else if (subKey === 'bsa') {
    if (unitNum === 1) {
      const m = bodyContent.match(/<h2[^>]*id="app-corr"[^>]*>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 2) {
      const m = bodyContent.match(/<h2[^>]*id="app-corr"[^>]*>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum >= 3) {
      const m = bodyContent.match(/<(?:h[1-3]|div)[^>]*id="revision"[^>]*>/i);
      if (m) revRelIndex = m.index;
    }
  } else if (subKey === 'pil') {
    if (unitNum === 1) {
      const m = bodyContent.match(/<h2[^>]*id="appendix"[^>]*>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 2) {
      const m = bodyContent.match(/<h2[^>]*id="appendix"[^>]*>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 3) {
      const m = bodyContent.match(/<h3[^>]*>[\s\S]*?A\. The eight prescribed cases at a glance[\s\S]*?<\/h3>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 4) {
      const m = bodyContent.match(/<h4[^>]*>[\s\S]*?Appendix A · One-page revision checklist[\s\S]*?<\/h4>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 5) {
      const m = bodyContent.match(/<h2[^>]*>[\s\S]*?F\. The Zones on One Page[\s\S]*?<\/h2>|<h3[^>]*>[\s\S]*?Appendix C · Master grid of the maritime zones[\s\S]*?<\/h3>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 6 || unitNum === 7) {
      const m = bodyContent.match(/<h2[^>]*id="appD"[^>]*>/i);
      if (m) revRelIndex = m.index;
    }
  } else if (subKey === 'wcc') {
    if (unitNum === 1) {
      const m = bodyContent.match(/<div[^>]*id="revision"[^>]*>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 2) {
      const m = bodyContent.match(/<div[^>]*id="diagrams"[^>]*>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 4) {
      const m = bodyContent.match(/<h2[^>]*>[\s\S]*?3\.\s*Revision matrix[\s\S]*?<\/h2>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 5) {
      const m = bodyContent.match(/<section[^>]*id="penalties"[^>]*>/i);
      if (m) revRelIndex = m.index;
    }
  } else if (subKey === 'company') {
    if (unitNum === 4) {
      const m = bodyContent.match(/<section[^>]*id="ready"[^>]*>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 8) {
      const m = bodyContent.match(/<h[1-3][^>]*>[\s\S]*?16 · High-value revision[\s\S]*?<\/h[1-3]>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 9) {
      const m = bodyContent.match(/<h[1-3][^>]*>[\s\S]*?16 · Last-day revision[\s\S]*?<\/h[1-3]>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 10) {
      const m = bodyContent.match(/<h[1-3][^>]*>[\s\S]*?22 · Revision dashboard[\s\S]*?<\/h[1-3]>/i);
      if (m) revRelIndex = m.index;
    }
  } else if (subKey === 'family') {
    if (unitNum === 6) {
      const m = bodyContent.match(/<h4[^>]*>[\s\S]*?Inter-religious marriages — the matrix[\s\S]*?<\/h4>/i);
      if (m) revRelIndex = m.index;
    } else if (unitNum === 8 || unitNum === 7) {
      const m = bodyContent.match(/<section[^>]*id="s9"[^>]*>/i);
      if (m) revRelIndex = m.index;
    }
  } else if (subKey === 'criminology' && unitNum === 2) {
    const m = bodyContent.match(/<h3[^>]*>[\s\S]*?44\.3 Rapid revision[\s\S]*?<\/h3>/i);
    if (m) revRelIndex = m.index;
  }

  // 2. Generic matches in bodyContent if not yet found
  if (revRelIndex === -1) {
    const genericPats = [
      /<div class="part-band"[^>]*id="(?:partE|partH|partG|partJ|part10|revision|rev|revise|s-rev|s-review)"/i,
      /<section[^>]*id="(?:partE|partH|partG|partJ|part10|revision|rev|revise|s-rev|s-review|s9|s10|s11|s12|s13|ready|diagrams)"/i,
      /<div[^>]*id="(?:partE|partH|partG|partJ|part10|revision|rev|revise|s-rev|s-review|ready|diagrams)"/i,
      /<h[1-3][^>]*id="(?:strategy|revision|rev|revise|ready|appD|appendix)"[^>]*>/i,
      /<(?:h[1-3]|div class="[^"]*band[^"]*")[^>]*>[\s\S]*?(?:Rapid Revision|Revision Kit|Quick Revision|Last-Minute|Revision Summary|Revision Sheet|Revision Capsule|The Revision Kit|One-Page Rapid Revision|One-page revision|One-page memory kit|One-Page Revision Matrix|One-Page Cheat Sheet|One-page master table|Exam-ready one-pagers|One-Page Last-Minute|One-Page Memory Sheet|Night-Before-the-Exam|Exam Strategy, Master Table|QUICK REVISION SUMMARY|One-Page Revision|Rapid-Revision Pack|Rapid Revision Vault)[\s\S]*?<\/(?:h[1-3]|div)>/i,
      /<h[1-3][^>]*>[\s\S]*?(?:Rapid revision &amp; mnemonics|Mnemonics &amp; rapid revision|Mnemonics and rapid revision|Quick Revision Flowchart|Revision — Capsules|Revision kit — the unit|Revision — Doctrines|Rapid Revision Vault|Case One-liners, Glossary &amp; Exam Tips)[\s\S]*?<\/h[1-3]>/i
    ];
    for (const pat of genericPats) {
      const m = bodyContent.match(pat);
      if (m) {
        revRelIndex = m.index;
        break;
      }
    }
  }

  if (revRelIndex === -1) return null;

  let section = bodyContent.slice(revRelIndex);

  // Stop safely at footer, site-footer, or closing body tag
  const stopMatch = section.match(/(?:<footer\b|<div class="site-footer"|<\/body>)/i);
  if (stopMatch) {
    section = section.slice(0, stopMatch.index);
  }

  return cleanExtractedHtml(section);
}

console.log('Testing CLEAN extraction across ALL 18 subjects:');
let totalUnits = 0;
let extractedUnits = 0;

Object.keys(subs).forEach(subKey => {
  const s = subs[subKey];
  let subFound = 0;
  s.units.forEach(u => {
    totalUnits++;
    const p = path.resolve(u.file);
    const html = extractRevision(subKey, u.number, p);
    if (html && html.length > 50) {
      subFound++;
      extractedUnits++;
    } else {
      console.log(`  MISSING: ${subKey} U${u.number} (${path.basename(u.file)})`);
    }
  });
  console.log(`${subKey.padEnd(18)} : ${subFound}/${s.units.length} units extracted`);
});

console.log(`\n======================================================`);
console.log(`GRAND TOTAL: ${extractedUnits}/${totalUnits} units extracted!`);
console.log(`======================================================`);
