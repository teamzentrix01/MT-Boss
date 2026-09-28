import { formatIndianPhone, toIndianPhoneTel, normalizePhoneSearch } from '../src/lib/phone-utils.js';

const testCases = [
  { input: '7307939550', expected: '+91 73079 39550', expectedTel: 'tel:+917307939550' },
  { input: '+917307939550', expected: '+91 73079 39550', expectedTel: 'tel:+917307939550' },
  { input: '917307939550', expected: '+91 73079 39550', expectedTel: 'tel:+917307939550' },
  { input: '07307939550', expected: '+91 73079 39550', expectedTel: 'tel:+917307939550' },
  { input: '73079 39550', expected: '+91 73079 39550', expectedTel: 'tel:+917307939550' },
  { input: null, expected: '—', expectedTel: '' },
  { input: undefined, expected: '—', expectedTel: '' },
  { input: '', expected: '—', expectedTel: '' },
  { input: 'N/A', expected: '—', expectedTel: '' },
  { input: '12345', expected: '12345', expectedTel: 'tel:12345' },
  { input: '+1 555 123 4567', expected: '+1 555 123 4567', expectedTel: 'tel:15551234567' },
];

console.log('=== Running Phone Formatter Unit Tests ===\n');

let failed = 0;

for (const tc of testCases) {
  const result = formatIndianPhone(tc.input);
  const tel = toIndianPhoneTel(tc.input);
  const pass = result === tc.expected && tel === tc.expectedTel;

  if (pass) {
    console.log(`✅ PASS: input: [${tc.input}] -> formatted: "${result}", tel: "${tel}"`);
  } else {
    failed++;
    console.error(`❌ FAIL: input: [${tc.input}]
      Expected formatted: "${tc.expected}", got: "${result}"
      Expected tel: "${tc.expectedTel}", got: "${tel}"`);
  }
}

console.log('\n--- Testing Search Normalization ---');
const searchCases = [
  { input: '7307939550', expected: '7307939550' },
  { input: '+91 73079 39550', expected: '7307939550' },
  { input: '07307939550', expected: '7307939550' },
  { input: '73079 39550', expected: '7307939550' },
];

for (const sc of searchCases) {
  const norm = normalizePhoneSearch(sc.input);
  if (norm === sc.expected) {
    console.log(`✅ PASS: search input [${sc.input}] normalized to "${norm}"`);
  } else {
    failed++;
    console.error(`❌ FAIL: search input [${sc.input}] expected "${sc.expected}", got "${norm}"`);
  }
}

if (failed === 0) {
  console.log('\n🎉 ALL UNIT TESTS PASSED!');
  process.exit(0);
} else {
  console.error(`\n💥 ${failed} tests failed!`);
  process.exit(1);
}
