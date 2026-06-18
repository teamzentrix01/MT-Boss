const encoder = new TextEncoder();

function crc32(bytes) {
  let crc = -1;
  for (let i = 0; i < bytes.length; i += 1) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ -1) >>> 0;
}

function push16(out, value) {
  out.push(value & 255, (value >>> 8) & 255);
}

function push32(out, value) {
  out.push(value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255);
}

function xml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function colName(index) {
  let name = '';
  let n = index + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}

function sheetXml(rows) {
  const safeRows = rows.length ? rows : [['']];
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    ${safeRows.map((row, rowIndex) => `<row r="${rowIndex + 1}">
      ${row.map((cell, colIndex) => {
        const ref = `${colName(colIndex)}${rowIndex + 1}`;
        const value = cell ?? '';
        if (typeof value === 'number' && Number.isFinite(value)) {
          return `<c r="${ref}"><v>${value}</v></c>`;
        }
        return `<c r="${ref}" t="inlineStr"><is><t>${xml(value)}</t></is></c>`;
      }).join('')}
    </row>`).join('')}
  </sheetData>
</worksheet>`;
}

function zip(files) {
  const out = [];
  const central = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const dataBytes = encoder.encode(file.content);
    const crc = crc32(dataBytes);

    push32(out, 0x04034b50);
    push16(out, 20);
    push16(out, 0);
    push16(out, 0);
    push16(out, 0);
    push16(out, 0);
    push32(out, crc);
    push32(out, dataBytes.length);
    push32(out, dataBytes.length);
    push16(out, nameBytes.length);
    push16(out, 0);
    out.push(...nameBytes, ...dataBytes);

    const entry = [];
    push32(entry, 0x02014b50);
    push16(entry, 20);
    push16(entry, 20);
    push16(entry, 0);
    push16(entry, 0);
    push16(entry, 0);
    push16(entry, 0);
    push32(entry, crc);
    push32(entry, dataBytes.length);
    push32(entry, dataBytes.length);
    push16(entry, nameBytes.length);
    push16(entry, 0);
    push16(entry, 0);
    push16(entry, 0);
    push16(entry, 0);
    push32(entry, 0);
    push32(entry, offset);
    entry.push(...nameBytes);
    central.push(...entry);

    offset = out.length;
  }

  const centralOffset = out.length;
  out.push(...central);
  push32(out, 0x06054b50);
  push16(out, 0);
  push16(out, 0);
  push16(out, files.length);
  push16(out, files.length);
  push32(out, central.length);
  push32(out, centralOffset);
  push16(out, 0);

  return new Uint8Array(out);
}

export function createXlsxWorkbook(rows, sheetName = 'Sheet1') {
  const files = [
    {
      name: '[Content_Types].xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`,
    },
    {
      name: '_rels/.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
    },
    {
      name: 'xl/workbook.xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="${xml(sheetName).slice(0, 31) || 'Sheet1'}" sheetId="1" r:id="rId1"/></sheets>
</workbook>`,
    },
    {
      name: 'xl/_rels/workbook.xml.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`,
    },
    { name: 'xl/worksheets/sheet1.xml', content: sheetXml(rows) },
  ];

  return zip(files);
}

export function downloadXlsx(rows, filename, sheetName = 'Sheet1') {
  const bytes = createXlsxWorkbook(rows, sheetName);
  const blob = new Blob([bytes], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
}
