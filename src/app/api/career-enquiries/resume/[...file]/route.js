import { readFile } from 'fs/promises';
import { basename, join, resolve } from 'path';
import { NextResponse } from 'next/server';

const CONTENT_TYPES = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

function getContentType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  return CONTENT_TYPES[ext] || 'application/octet-stream';
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
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': getContentType(filename),
        'Content-Disposition': `${disposition}; filename="${filename.replaceAll('"', '')}"`,
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
