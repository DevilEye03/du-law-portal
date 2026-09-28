const fs = require('fs');

const d6 = fs.readFileSync('SEM 5/DRAFTING/Other_Miscellaneous_Pleadings_DU_LB502.html', 'utf8');
const d6_s7_idx = d6.indexOf('id="s7"');
if (d6_s7_idx !== -1) {
  console.log('=== TOPIC 6 SECTION 7 (PYQ Desk) ===');
  console.log(d6.slice(d6_s7_idx, d6_s7_idx + 2500));
}

const d7 = fs.readFileSync('SEM 5/DRAFTING/Conveyancing_Part_B_DU_LB502.html', 'utf8');
const d7_s12_idx = d7.indexOf('id="s12"');
if (d7_s12_idx !== -1) {
  console.log('=== TOPIC 7 SECTION 12 (Question Bank) ===');
  console.log(d7.slice(d7_s12_idx, d7_s12_idx + 2500));
}
