import { cleanCityName, resolveManagedCity } from '@/lib/cities';
import { cleanText, normalizePhone, validateContactFields } from '@/lib/validation';

const ALLOWED_SPECIALIZATIONS = ['payments', 'labor', 'vendor', 'construction'];

export function cleanAgentSpecializations(specs) {
  if (!specs || !Array.isArray(specs)) return [];
  return specs.filter((s) => ALLOWED_SPECIALIZATIONS.includes(s));
}

/**
 * Validates public/admin agent application payloads for POST /api/agents.
 * Returns { ok: true, data } or { ok: false, error, status }.
 */
export async function validateAgentApplicationBody(body = {}) {
  const {
    name,
    email,
    phone,
    city,
    state,
    occupation,
    agentType,
    agent_type,
    experience,
    network,
    message,
    specializations,
    has_project_management_access,
  } = body;

  const cleanName = cleanText(name);
  const cleanEmail = cleanText(email).toLowerCase();
  const cleanPhone = normalizePhone(phone);
  const cleanState = cleanText(state);
  const cleanAgentType = cleanText(agentType || agent_type);
  const cleanedCityInput = cleanCityName(city);

  if (!cleanName) {
    return { ok: false, error: 'Full name is required.', status: 400 };
  }
  if (!cleanEmail) {
    return { ok: false, error: 'Email address is required.', status: 400 };
  }
  if (!cleanPhone) {
    return { ok: false, error: 'Phone number is required.', status: 400 };
  }
  if (!cleanedCityInput) {
    return { ok: false, error: 'City is required.', status: 400 };
  }
  if (!cleanState) {
    return { ok: false, error: 'State is required.', status: 400 };
  }
  if (!cleanAgentType) {
    return { ok: false, error: 'Agent type is required.', status: 400 };
  }

  const contactError = validateContactFields({
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    nameLabel: 'Full name',
  });
  if (contactError) {
    return { ok: false, error: contactError, status: 400 };
  }

  const canonicalCity = (await resolveManagedCity(cleanedCityInput)) || cleanedCityInput;
  if (!canonicalCity) {
    return {
      ok: false,
      error: 'City is required.',
      status: 400,
    };
  }

  const validSpecs = cleanAgentSpecializations(specializations);
  const pmAccess = Boolean(has_project_management_access || validSpecs.length > 0);

  return {
    ok: true,
    data: {
      cleanName,
      cleanEmail,
      cleanPhone,
      canonicalCity,
      cleanState,
      cleanAgentType,
      occupation: cleanText(occupation) || null,
      experience: cleanText(experience) || null,
      network: cleanText(network) || null,
      message: cleanText(message) || null,
      validSpecs,
      pmAccess,
    },
  };
}

export const AGENT_DUPLICATE_EMAIL_MESSAGE =
  'This email already has an active agent application. Please use a different email or contact MTBOSS support if you need help.';
