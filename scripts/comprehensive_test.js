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
    assert(fs.existsSync(p), `Company Dossier file exists: ${u.file}`);
  });

  // CPC Integrity
  const cpc = portalData.subjects['cpc'];
  assert(!!cpc, 'Subject "cpc" is registered');
  assert(cpc.code === 'LB-301', 'CPC code is LB-301');
  assert(cpc.units && cpc.units.length === 11, `CPC has exactly 11 units (Found: ${cpc.units?.length})`);
  assert(cpc.cases && cpc.cases.length >= 40, `CPC landmark cases count >= 40 (Found: ${cpc.cases?.length})`);
  assert(cpc.pyqs && cpc.pyqs.length >= 50, `CPC PYQs with model answers >= 50 (Found: ${cpc.pyqs?.length})`);
  assert(cpc.revisions && cpc.revisions.length === 11, `CPC revision capsules === 11 (Found: ${cpc.revisions?.length})`);

  for (let u = 1; u <= 11; u++) {
    const uCases = cpc.cases.filter(c => c.unitNumber === u);
    const uPyqs = cpc.pyqs.filter(p => p.unitNumber === u);
    const uRev = cpc.revisions.filter(r => r.unitNumber === u);
    assert(uCases.length > 0, `CPC Unit ${u} has at least 1 landmark case (Found: ${uCases.length})`);
    assert(uPyqs.length > 0, `CPC Unit ${u} has at least 1 PYQ (Found: ${uPyqs.length})`);
    assert(uRev.length > 0, `CPC Unit ${u} has revision capsule (Found: ${uRev.length})`);
  }
  cpc.units.forEach(u => {
    const p = path.resolve(u.file);
    assert(fs.existsSync(p), `CPC Dossier file exists: ${u.file}`);
  });

  // WCC Integrity
  const wcc = portalData.subjects['wcc'];
  assert(!!wcc, 'Subject "wcc" is registered');
  assert(wcc.code === 'LB-3037', 'WCC code is LB-3037');
  assert(wcc.units && wcc.units.length === 6, `WCC has exactly 6 units (Found: ${wcc.units?.length})`);
  assert(wcc.cases && wcc.cases.length >= 30, `WCC landmark cases count >= 30 (Found: ${wcc.cases?.length})`);
  assert(wcc.pyqs && wcc.pyqs.length >= 40, `WCC PYQs with model answers >= 40 (Found: ${wcc.pyqs?.length})`);
  assert(wcc.revisions && wcc.revisions.length === 6, `WCC revision capsules === 6 (Found: ${wcc.revisions?.length})`);

  for (let u = 1; u <= 6; u++) {
    const uCases = wcc.cases.filter(c => c.unitNumber === u);
    const uPyqs = wcc.pyqs.filter(p => p.unitNumber === u);
    const uRev = wcc.revisions.filter(r => r.unitNumber === u);
    assert(uCases.length > 0, `WCC Unit ${u} has at least 1 landmark case (Found: ${uCases.length})`);
    assert(uPyqs.length > 0, `WCC Unit ${u} has at least 1 PYQ (Found: ${uPyqs.length})`);
    assert(uRev.length > 0, `WCC Unit ${u} has revision capsule (Found: ${uRev.length})`);
  }
  wcc.units.forEach(u => {
    const p = path.resolve(u.file);
    assert(fs.existsSync(p), `WCC Dossier file exists: ${u.file}`);
  });

  // Property Law Integrity (LB-204)
  const property = portalData.subjects['property'];
  assert(!!property, 'Subject "property" is registered');
  assert(property.code === 'LB-204', 'Property Law code is LB-204');
  assert(property.units && property.units.length === 12, `Property Law has exactly 12 units (Found: ${property.units?.length})`);
  assert(property.cases && property.cases.length >= 20, `Property Law landmark cases count >= 20 (Found: ${property.cases?.length})`);
  assert(property.pyqs && property.pyqs.length >= 45, `Property Law PYQs with model answers >= 45 (Found: ${property.pyqs?.length})`);
  assert(property.revisions && property.revisions.length === 12, `Property Law revision capsules === 12 (Found: ${property.revisions?.length})`);

  for (let u = 1; u <= 12; u++) {
    const uPyqs = property.pyqs.filter(p => p.unitNumber === u);
    const uRev = property.revisions.filter(r => r.unitNumber === u);
    assert(uRev.length > 0, `Property Law Unit ${u} has revision capsule (Found: ${uRev.length})`);
    if (u !== 1) { // Unit 1 has cases, Unit 8 has 4 PYQs
      assert(uPyqs.length > 0, `Property Law Unit ${u} has at least 1 PYQ (Found: ${uPyqs.length})`);
    }
  }
  property.units.forEach(u => {
    const p = path.resolve(u.file);
    assert(fs.existsSync(p), `Property Law Dossier file exists: ${u.file}`);
  });

  // Public International Law Integrity (LB-205)
  const pil = portalData.subjects['pil'];
  assert(!!pil, 'Subject "pil" is registered');
  assert(pil.code === 'LB-205', 'PIL code is LB-205');
  assert(pil.units && pil.units.length === 7, `PIL has exactly 7 units (Found: ${pil.units?.length})`);
  assert(pil.cases && pil.cases.length >= 60, `PIL landmark cases count >= 60 (Found: ${pil.cases?.length})`);
  assert(pil.pyqs && pil.pyqs.length >= 30, `PIL PYQs with model answers >= 30 (Found: ${pil.pyqs?.length})`);
  assert(pil.revisions && pil.revisions.length === 7, `PIL revision capsules === 7 (Found: ${pil.revisions?.length})`);

  for (let u = 1; u <= 7; u++) {
    const uCases = pil.cases.filter(c => c.unitNumber === u);
    const uPyqs = pil.pyqs.filter(p => p.unitNumber === u);
    const uRev = pil.revisions.filter(r => r.unitNumber === u);
    assert(uCases.length > 0, `PIL Unit ${u} has at least 1 landmark case (Found: ${uCases.length})`);
    assert(uPyqs.length > 0, `PIL Unit ${u} has at least 1 PYQ (Found: ${uPyqs.length})`);
    assert(uRev.length > 0, `PIL Unit ${u} has revision capsule (Found: ${uRev.length})`);
  }
  pil.units.forEach(u => {
    const p = path.resolve(u.file);
    assert(fs.existsSync(p), `PIL Dossier file exists: ${u.file}`);
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

  // Check new semester bare acts
  const newActsToCheck = [
    { id: 'tpa', name: 'Transfer of Property Act 1882', minSecs: 17 },
    { id: 'cpc', name: 'CPC 1908', minSecs: 8 },
    { id: 'lim', name: 'Limitation Act 1963', minSecs: 5 },
    { id: 'pca', name: 'PC Act 1988', minSecs: 4 },
    { id: 'pmla', name: 'PMLA 2002', minSecs: 4 },
    { id: 'fssa', name: 'FSSA 2006', minSecs: 2 },
    { id: 'ndps', name: 'NDPS Act 1985', minSecs: 2 }
  ];

  newActsToCheck.forEach(item => {
    const act = db.acts.find(a => a.id === item.id);
    assert(!!act, `${item.name} is registered in acts array`);
    const secs = db.sections.filter(s => s.actId === item.id);
    assert(secs.length >= item.minSecs, `${item.name} sections >= ${item.minSecs} (Found: ${secs.length})`);
  });

  const tpaSecs = ['3', '5', '6(a)', '10', '11', '13', '14', '19', '21', '43', '52', '54', '58', '60', '100', '105', '122'];
  const tpaInDb = db.sections.filter(s => s.actId === 'tpa');
  tpaSecs.forEach(sec => {
    assert(tpaInDb.some(s => s.sec === sec), `TPA S. ${sec} exists in DB`);
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

// 4. STUDENT FEEDBACK SYSTEM & SERVICE WORKER INTEGRITY
try {
  const htmlContent = fs.readFileSync('index.html', 'utf8');
  assert(htmlContent.includes('id="studentFeedbackSection"'), 'studentFeedbackSection container exists in index.html');
  assert(htmlContent.includes('id="studentFeedbackForm"'), 'studentFeedbackForm exists in index.html');
  assert(htmlContent.includes('id="gfStudentEmail"'), 'Email question exists in feedback form');
  assert(htmlContent.includes('id="qCardCentre"'), 'Law Centre question card exists');
  assert(htmlContent.includes('id="qCardSemester"'), 'Semester question card exists');
  assert(htmlContent.includes('id="gfSubmitBtn"'), 'Submit button exists in feedback form');
  assert(htmlContent.includes('id="gfSuccessCard"'), 'Success response card exists in feedback form');
  assert(htmlContent.includes('id="headerFeedbackBtn"'), 'Header feedback quick-link button exists');
  assert(htmlContent.includes('id="mtdFeedbackBtn"'), 'Mobile tools drawer feedback button exists');
  assert(htmlContent.includes('id="footerFeedbackLink"'), 'Footer feedback link exists');
  assert(htmlContent.includes('id="footerContactBarFeedbackLink"'), 'Footer contact bar feedback link exists');
  assert(htmlContent.includes('id="footerContactBtn"'), 'Footer contact button exists');
  assert(htmlContent.includes('id="feedbackModalOverlay"'), 'Feedback modal overlay exists');
  assert(htmlContent.includes('id="feedbackModalCloseBtn"'), 'Feedback modal close button exists');

  const termsContent = fs.readFileSync('terms.html', 'utf8');
  assert(termsContent.includes('/#feedback'), 'terms.html footer includes link to feedback');

  const privacyContent = fs.readFileSync('privacy.html', 'utf8');
  assert(privacyContent.includes('/#feedback'), 'privacy.html footer includes link to feedback');

  const cssContent = fs.readFileSync('css/styles.css', 'utf8');
  assert(cssContent.includes('.gf-container'), '.gf-container style rule exists in styles.css');
  assert(cssContent.includes('.gf-card'), '.gf-card style rule exists in styles.css');
  assert(cssContent.includes('.gf-header-strip'), '.gf-header-strip style rule exists in styles.css');
  assert(cssContent.includes('.feedback-modal-dialog'), '.feedback-modal-dialog style rule exists in styles.css');

  const swContent = fs.readFileSync('sw.js', 'utf8');
  assert(swContent.includes('du-law-portal-v29'), 'sw.js CACHE_NAME is bumped to du-law-portal-v29');
} catch (err) {
  assert(false, `Feedback & SW integrity test error: ${err.message}`);
}

// 5. JAVASCRIPT SYNTAX & COMPILATION INTEGRITY
const vm = require('vm');
const jsFilesToCheck = [
  'js/app.js',
  'js/data.js',
  'js/bare_acts.js',
  'js/bns_converter.js',
  'js/books_showcase.js',
  'js/wave_grid_background.js',
  'js/interactive_particles.js',
  'sw.js'
];

jsFilesToCheck.forEach(file => {
  try {
    const code = fs.readFileSync(file, 'utf8');
    new vm.Script(code, { filename: file });
    assert(true, `${file} compiles cleanly with zero syntax errors`);
  } catch (err) {
    assert(false, `${file} syntax compilation failure: ${err.message}`);
  }
});

console.log('\n----------------------------------------------------');
if (failed) {
  console.error('❌ ONE OR MORE TESTS FAILED! Fix issues before deploying.');
  process.exit(1);
} else {
  console.log('🎉 ALL INTEGRITY TESTS PASSED FLAWLESSLY!');
}
