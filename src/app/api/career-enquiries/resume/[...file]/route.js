import { readFile } from 'fs/promises';
import { basename, join, resolve } from 'path';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

const CONTENT_TYPES = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

function getContentType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  return CONTENT_TYPES[ext] || 'application/octet-stream';
}

async function getStoredResume(filename) {
  const result = await pool.query(
    `SELECT resume_name, resume_content_type, resume_data
     FROM career_enquiries
     WHERE resume_data IS NOT NULL
       AND RIGHT(SPLIT_PART(COALESCE(resume_url, ''), '?', 1), LENGTH($1) + 1) = '/' || $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [filename]
  );

  return result.rows[0] || null;
}

export async function GET(req, context) {
  try {
    const params = await context.params;
    const requestedFile = (params.file || []).join('/');
    const filename = basename(requestedFile);

    if (!filename || filename !== requestedFile) {
      return NextResponse.json({ success: false, error: 'Invalid file path' }, { status: 400 });
    }

    const uploadDir = resolve(process.cwd(), 'public', 'uploads', 'resumes');
    const filePath = resolve(join(uploadDir, filename));

    if (!filePath.startsWith(uploadDir)) {
      return NextResponse.json({ success: false, error: 'Invalid file path' }, { status: 400 });
    }

    const mode = new URL(req.url).searchParams.get('mode');
    const disposition = mode === 'download' ? 'attachment' : 'inline';
    let fileBuffer;
    let downloadName = filename;
    let contentType = getContentType(filename);

    try {
      fileBuffer = await readFile(filePath);
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;

      const storedResume = await getStoredResume(filename);
      if (!storedResume?.resume_data) {
        return NextResponse.json({ success: false, error: 'Resume not found' }, { status: 404 });
      }

      fileBuffer = storedResume.resume_data;
      downloadName = storedResume.resume_name || filename;
      contentType = storedResume.resume_content_type || getContentType(downloadName);
    }

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `${disposition}; filename="${downloadName.replaceAll('"', '')}"`,
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return NextResponse.json({ success: false, error: 'Resume not found' }, { status: 404 });
    }

    console.error('Resume file error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
