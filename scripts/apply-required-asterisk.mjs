import fs from 'fs';
import path from 'path';

const root = path.join(process.cwd(), 'src/app');

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (/\.(jsx|tsx)$/.test(ent.name)) files.push(p);
  }
  return files;
}

function importLine(filePath) {
  const componentsDir = path.join(root, 'components');
  let rel = path.relative(path.dirname(filePath), componentsDir).replace(/\\/g, '/');
  if (!rel || rel === '.') return "import RequiredAsterisk from './RequiredAsterisk';";
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return `import RequiredAsterisk from '${rel}/RequiredAsterisk';`;
}

function injectImport(src, imp) {
  if (/import RequiredAsterisk/.test(src)) return src;
  if (/^['"]use client['"];?\r?\n/m.test(src)) {
    return src.replace(/^(['"]use client['"];?\r?\n)/m, `$1${imp}\n`);
  }
  if (/^import /m.test(src)) {
    return src.replace(/^(import .+\r?\n)/m, `${imp}\n$1`);
  }
  return `${imp}\n${src}`;
}

let updated = 0;
for (const file of walk(root)) {
  if (file.endsWith('RequiredAsterisk.jsx') || file.endsWith('FormLabel.jsx')) continue;

  let src = fs.readFileSync(file, 'utf8');
  const orig = src;

  src = src.replace(/([^\s>])(\s)\*(<\/label>)/g, '$1 <RequiredAsterisk />$3');
  src = src.replace(/([^\s>])(\s)\*(<input)/g, '$1 <RequiredAsterisk />$3');
  src = src.replace(/([^\s>])(\s)\*(<select)/g, '$1 <RequiredAsterisk />$3');
  src = src.replace(/([^\s>])(\s)\*(<\/p>)/g, '$1 <RequiredAsterisk />$3');
  src = src.replace(/([^\s>])(\s)\*(<\/div>)/g, '$1 <RequiredAsterisk />$3');
  src = src.replace(/([^\s>])(\s)\*(<\/span>)/g, '$1 <RequiredAsterisk />$3');
  src = src.replace(/\{required \? ' \*' : ''\}/g, '{required ? <> <RequiredAsterisk /></> : null}');
  src = src.replace(/\{required && <span style=\{\{ color: '#ef4444' \}\}>\*<\/span>\}/g, '{required && <RequiredAsterisk />}');
  src = src.replace(/<span className="text-red-500">\*<\/span>/g, '<RequiredAsterisk />');
  src = src.replace(/<span style=\{\{ color: '#ef4444' \}\}>\*<\/span>/g, '<RequiredAsterisk />');

  if (src === orig) continue;

  src = injectImport(src, importLine(file));
  fs.writeFileSync(file, src);
  updated += 1;
  console.log(path.relative(root, file));
}

console.log(`Updated ${updated} files`);
