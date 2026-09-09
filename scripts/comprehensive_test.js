const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🧪 COMPREHENSIVE LOCAL VALIDATION & INTEGRITY TEST');
console.log('====================================================\n');

let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    failed = true;
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

global.window = global;

// 1. DATA.JS INTEGRITY
try {
  const dataContent = fs.readFileSync('js/data.js', 'utf8');
  eval(dataContent);
  const portalData = window.DU_LAW_PORTAL_DATA;

  assert(!!portalData, 'DU_LAW_PORTAL_DATA is defined');
  assert(portalData.semesters.some(s => s.id === 3 && s.active), 'Semester 3 is active in registry');
  
  const company = portalData.subjects['company'];
  assert(!!company, 'Subject "company" is registered');
  assert(company.code === 'LB-303', 'Company Law code is LB-303');
  assert(company.units && company.units.length === 10, `Company Law has exactly 10 units (Found: ${company.units?.length})`);
  assert(company.cases && company.cases.length >= 70, `Company Law landmark cases count >= 70 (Found: ${company.cases?.length})`);
  assert(company.pyqs && company.pyqs.length >= 100, `Company Law PYQs with model answers >= 100 (Found: ${company.pyqs?.length})`);
  assert(company.revisions && company.revisions.length === 10, `Company Law revision capsules === 10 (Found: ${company.revisions?.length})`);

  // Verify each of the 10 units has cases, pyqs, and revision
  for (let u = 1; u <= 10; u++) {
    const uCases = company.cases.filter(c => c.unitNumber === u);
    const uPyqs = company.pyqs.filter(p => p.unitNumber === u);
    const uRev = company.revisions.filter(r => r.unitNumber === u);
    assert(uCases.length > 0, `Unit ${u} has at least 1 landmark case (Found: ${uCases.length})`);
    assert(uPyqs.length > 0, `Unit ${u} has at least 1 PYQ (Found: ${uPyqs.length})`);
    assert(uRev.length > 0, `Unit ${u} has revision capsule (Found: ${uRev.length})`);
  }

  // Verify dossier files exist on disk
  company.units.forEach(u => {
    const p = path.resolve(u.file);
    assert(fs.existsSync(p), `Dossier file exists: ${u.file}`);
  });

} catch (err) {
  assert(false, `data.js execution error: ${err.message}`);
}

// 2. BARE_ACTS.JS INTEGRITY
try {
  const bareActsContent = fs.readFileSync('js/bare_acts.js', 'utf8');
  eval(bareActsContent);
  const db = window.BARE_ACTS_DB;

  assert(!!db, 'BARE_ACTS_DB is defined');
  const caAct = db.acts.find(a => a.id === 'ca');
  assert(!!caAct, 'Companies Act, 2013 is registered in acts array');
  const caSections = db.sections.filter(s => s.actId === 'ca');
  assert(caSections.length >= 20, `Companies Act sections in DB >= 20 (Found: ${caSections.length})`);
  assert(caAct.count === caSections.length, `Companies Act count matches sections length (${caAct.count} == ${caSections.length})`);

  // Check critical sections
  const requiredSecs = ['3', '7', '9', '13', '14', '135', '149', '166', '184', '241', '242', '244', '271', '408', '410'];
  requiredSecs.forEach(sec => {
    assert(caSections.some(s => s.sec === sec), `Companies Act S. ${sec} exists`);
  });

} catch (err) {
  assert(false, `bare_acts.js execution error: ${err.message}`);
}

// 3. BNS_CONVERTER.JS INTEGRITY
try {
  const bnsContent = fs.readFileSync('js/bns_converter.js', 'utf8');
  eval(bnsContent);
  assert(!!window.BNS_CONVERTER_DB, 'BNS_CONVERTER_DB is defined');
  assert(window.BNS_CONVERTER_DB.sections.length > 0, 'BNS sections present');
} catch (err) {
  assert(false, `bns_converter.js execution error: ${err.message}`);
}

console.log('\n----------------------------------------------------');
if (failed) {
  console.error('❌ ONE OR MORE TESTS FAILED! Fix issues before deploying.');
  process.exit(1);
} else {
  console.log('🎉 ALL INTEGRITY TESTS PASSED FLAWLESSLY!');
}
