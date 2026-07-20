const MAX_IMAGE_DIMENSION = 1600;
const JPEG_QUALITY = 0.78;
const UPLOAD_CONCURRENCY = 3;
const UPLOAD_TIMEOUT_MS = 60000;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Could not read ${file.name}`));
    };
    image.src = objectUrl;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('Image compression failed')),
      type,
      quality
    );
  });
}

export async function optimizePropertyImage(file) {
  if (!file?.type?.startsWith('image/')) throw new Error(`${file?.name || 'File'} is not an image`);
  const image = await loadImage(file);
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  if (scale === 1 && file.size <= 900 * 1024) return file;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Image processing is not supported on this device');
  context.drawImage(image, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, 'image/jpeg', JPEG_QUALITY);
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'property-photo';
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
}

async function uploadOnce(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) throw new Error('Image upload configuration is missing');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);
  try {
    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', uploadPreset);
    body.append('folder', 'mtboss/properties');
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body,
      signal: controller.signal,
    });
    const data = await response.json();
    if (!response.ok || !data.secure_url) throw new Error(data.error?.message || 'Image upload failed');
    return data.secure_url;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Image upload timed out. Please check your connection.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function uploadWithRetry(file) {
  try {
    return await uploadOnce(file);
  } catch (firstError) {
    try {
      return await uploadOnce(file);
    } catch {
      throw firstError;
    }
  }
}

export async function uploadPropertyImages(files, onProgress) {
  const selectedFiles = Array.from(files || []).slice(0, 10);
  if (selectedFiles.length === 0) return [];
  const optimizedFiles = [];
  for (let index = 0; index < selectedFiles.length; index += 1) {
    optimizedFiles.push(await optimizePropertyImage(selectedFiles[index]));
    onProgress?.(Math.max(2, Math.round(((index + 1) / selectedFiles.length) * 20)));
  }

  let cursor = 0;
  let completed = 0;
  const urls = new Array(selectedFiles.length);

  async function worker() {
    while (cursor < optimizedFiles.length) {
      const index = cursor;
      cursor += 1;
      urls[index] = await uploadWithRetry(optimizedFiles[index]);
      completed += 1;
      onProgress?.(20 + Math.round((completed / optimizedFiles.length) * 80));
    }
  }

  await Promise.all(Array.from({ length: Math.min(UPLOAD_CONCURRENCY, optimizedFiles.length) }, () => worker()));
  return urls;
}
