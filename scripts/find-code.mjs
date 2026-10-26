import fs from 'fs';

const target = process.argv[2];
const file = process.argv[3] || 'src/app/components/PartyProjectManagement.jsx';

const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes(target)) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
