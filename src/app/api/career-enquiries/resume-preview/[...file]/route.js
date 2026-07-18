import { readFile } from 'fs/promises';
import { basename, join, resolve } from 'path';
import { inflateRawSync } from 'zlib';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function readUInt16(buffer, offset) {
  return buffer.readUInt16LE(offset);
}

function readUInt32(buffer, offset) {
  return buffer.readUInt32LE(offset);
}

function findEndOfCentralDirectory(buffer) {
  for (let offset = buffer.length - 22; offset >= 0; offset -= 1) {
    if (readUInt32(buffer, offset) === 0x06054b50) return offset;
  }

  return -1;
}

function getZipEntry(buffer, entryName) {
  const eocdOffset = findEndOfCentralDirectory(buffer);
  if (eocdOffset === -1) return null;

  const centralDirSize = readUInt32(buffer, eocdOffset + 12);
  const centralDirOffset = readUInt32(buffer, eocdOffset + 16);
  let offset = centralDirOffset;
  const endOffset = centralDirOffset + centralDirSize;

  while (offset < endOffset && readUInt32(buffer, offset) === 0x02014b50) {
    const compression = readUInt16(buffer, offset + 10);
    const compressedSize = readUInt32(buffer, offset + 20);
    const fileNameLength = readUInt16(buffer, offset + 28);
    const extraLength = readUInt16(buffer, offset + 30);
    const commentLength = readUInt16(buffer, offset + 32);
    const localHeaderOffset = readUInt32(buffer, offset + 42);
    const fileName = buffer.toString('utf8', offset + 46, offset + 46 + fileNameLength);

    if (fileName === entryName) {
      const localNameLength = readUInt16(buffer, localHeaderOffset + 26);
      const localExtraLength = readUInt16(buffer, localHeaderOffset + 28);
      const dataOffset = localHeaderOffset + 30 + localNameLength + localExtraLength;
      const data = buffer.subarray(dataOffset, dataOffset + compressedSize);

      if (compression === 0) return data;
      if (compression === 8) return inflateRawSync(data);

      return null;
    }

    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  return null;
}

function decodeXmlEntities(value) {
  return value
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&');
}

function docxToHtml(buffer) {
  const documentXml = getZipEntry(buffer, 'word/document.xml');
  if (!documentXml) return null;

  const xml = documentXml.toString('utf8');
  const paragraphs = xml.match(/<w:p[\s\S]*?<\/w:p>/g) || [];
  const html = paragraphs
    .map((paragraph) => {
      const text = [...paragraph.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)]
        .map((match) => decodeXmlEntities(match[1]))
        .join('');

      return text.trim() ? `<p>${escapeHtml(text)}</p>` : '';
    })
    .filter(Boolean)
    .join('');

  return html || null;
}

async function getStoredResume(filename) {
  const result = await pool.query(
    `SELECT resume_data
     FROM career_enquiries
     WHERE resume_data IS NOT NULL
       AND RIGHT(SPLIT_PART(COALESCE(resume_url, ''), '?', 1), LENGTH($1) + 1) = '/' || $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [filename]
  );

  return result.rows[0]?.resume_data || null;
}

export async function GET(_req, context) {
  try {
    const params = await context.params;
    const requestedFile = (params.file || []).join('/');
    const filename = basename(requestedFile);

    if (!filename || filename !== requestedFile || !filename.toLowerCase().endsWith('.docx')) {
      return NextResponse.json({ success: false, error: 'Only DOCX preview is supported' }, { status: 400 });
    }

    const uploadDir = resolve(process.cwd(), 'public', 'uploads', 'resumes');
    const filePath = resolve(join(uploadDir, filename));

    if (!filePath.startsWith(uploadDir)) {
      return NextResponse.json({ success: false, error: 'Invalid file path' }, { status: 400 });
    }

    let fileBuffer;
    try {
      fileBuffer = await readFile(filePath);
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
      fileBuffer = await getStoredResume(filename);
      if (!fileBuffer) {
        return NextResponse.json({ success: false, error: 'Resume not found' }, { status: 404 });
      }
    }
    const body = docxToHtml(fileBuffer);

    if (!body) {
      return NextResponse.json({ success: false, error: 'Preview could not be generated' }, { status: 422 });
    }

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { margin: 0; background: #f3f4f6; color: #111827; font-family: Arial, sans-serif; }
      main { max-width: 820px; min-height: calc(100vh - 64px); margin: 32px auto; background: #fff; padding: 48px; box-shadow: 0 10px 35px rgba(15, 23, 42, 0.12); }
      p { margin: 0 0 12px; line-height: 1.58; font-size: 15px; white-space: pre-wrap; }
      @media (max-width: 720px) { main { margin: 0; min-height: 100vh; padding: 24px; box-shadow: none; } }
    </style>
  </head>
  <body><main>${body}</main></body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return NextResponse.json({ success: false, error: 'Resume not found' }, { status: 404 });
    }

    console.error('Resume preview error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
