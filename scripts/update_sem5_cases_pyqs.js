const fs = require('fs');
const path = require('path');
const vm = require('vm');

const { getDraftingData } = require('./test_drafting_data_builder.js');
const { getIndustrialData } = require('./test_industrial_data_builder.js');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'js', 'data.js');

console.log('===========================================================');
console.log('🔄 SEMESTER 5: INGESTING FULL LANDMARK CASES & PYQS');
console.log('===========================================================\n');

// 1. Generate full data
const draftingData = getDraftingData();
const industrialData = getIndustrialData();

console.log(`✅ Extracted Drafting Cases: ${draftingData.cases.length}`);
console.log(`✅ Extracted Drafting PYQs: ${draftingData.pyqs.length}`);
console.log(`✅ Extracted Industrial Cases: ${industrialData.cases.length}`);
console.log(`✅ Extracted Industrial PYQs: ${industrialData.pyqs.length}`);

// 2. Load existing data.js
const dataJsRaw = fs.readFileSync(DATA_FILE, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataJsRaw, sandbox);
const portalData = sandbox.window.DU_LAW_PORTAL_DATA;

if (!portalData || !portalData.subjects) {
  throw new Error('Could not load DU_LAW_PORTAL_DATA from data.js');
}

// Check Semester 1, 2, 3 subjects before
const compBefore = portalData.subjects.company.cases.length;
const cpcBefore = portalData.subjects.cpc.cases.length;
const propBefore = portalData.subjects.property.cases.length;

// 3. Update Drafting
if (!portalData.subjects.drafting) {
  throw new Error('Subject drafting not found in data.js');
}
portalData.subjects.drafting.cases = draftingData.cases;
portalData.subjects.drafting.pyqs = draftingData.pyqs;

// 4. Update Industrial
if (!portalData.subjects.industrial) {
  throw new Error('Subject industrial not found in data.js');
}
portalData.subjects.industrial.cases = industrialData.cases;
portalData.subjects.industrial.pyqs = industrialData.pyqs;

// 5. Verify integrity of other subjects
if (portalData.subjects.company.cases.length !== compBefore) throw new Error('Company Law altered!');
if (portalData.subjects.cpc.cases.length !== cpcBefore) throw new Error('CPC altered!');
if (portalData.subjects.property.cases.length !== propBefore) throw new Error('Property Law altered!');

// 6. Write back to js/data.js
const newJsContent = `// DU Law Notes Portal — Central Data Repository
// Contains Master Syllabus, Case Briefs, Previous Year Questions (PYQs), and Revision Capsules
// Comprehensive coverage across LL.B. syllabus

window.DU_LAW_PORTAL_DATA = ${JSON.stringify(portalData, null, 2)};
`;

fs.writeFileSync(DATA_FILE, newJsContent, 'utf8');
console.log(`\n🎉 Successfully updated js/data.js!`);
console.log(`New data.js file size: ${(newJsContent.length / 1024 / 1024).toFixed(2)} MB`);
