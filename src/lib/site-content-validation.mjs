import { faqPages } from './faq-defaults.mjs';
export function validateFaq(body) {
  const q = String(body.q || '').trim();
  const a = String(body.a || '').trim();
  const sort_order = Number(body.sort_order ?? 0);
  if (!faqPages.includes(body.page)) return { error: 'Select a valid FAQ page.' };
  if (!q || q.length > 300 || !a || a.length > 4000) return { error: 'Question (up to 300 characters) and answer (up to 4000 characters) are required.' };
  if (!Number.isInteger(sort_order) || sort_order < 0 || sort_order > 10000 || typeof body.is_active !== 'boolean') return { error: 'Invalid order or visibility.' };
  return { data: { page: body.page, q, a, sort_order, is_active: body.is_active } };
}
export function validateReview(body) {
  const data = Object.fromEntries(['name', 'email', 'service', 'message'].map(key => [key, String(body[key] || '').trim()]));
  data.email = data.email.toLowerCase();
  data.rating = Number(body.rating);
  if (data.name.length < 2 || data.name.length > 120 || data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { error: 'Enter your name and a valid email address.' };
  if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) return { error: 'Select a rating from 1 to 5.' };
  if (!['Construction', 'Home Services', 'Materials', 'Property', 'Other'].includes(data.service)) return { error: 'Select a service.' };
  if (data.message.length < 10 || data.message.length > 2000) return { error: 'Write a review between 10 and 2000 characters.' };
  if (body.consent !== true || body.website) return { error: 'Please confirm your consent.' };
  return { data };
}
