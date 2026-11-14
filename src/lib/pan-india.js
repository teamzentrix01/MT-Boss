export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export function cleanLocationText(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

export function isValidIndianPincode(pincode) {
  return /^[1-9][0-9]{5}$/.test(String(pincode || '').trim());
}

export function isValidIndianState(state) {
  const cleaned = cleanLocationText(state).toLowerCase();
  return INDIAN_STATES.some((s) => s.toLowerCase() === cleaned);
}

export function validatePanIndiaLocation({ city, state, pincode }) {
  const cleanCity = cleanLocationText(city);
  if (!cleanCity) {
    return { ok: false, error: 'City is required.' };
  }
  if (pincode && !isValidIndianPincode(pincode)) {
    return { ok: false, error: 'Please enter a valid 6-digit PIN code.' };
  }
  return {
    ok: true,
    data: {
      city: cleanCity,
      state: state ? cleanLocationText(state) : null,
      pincode: pincode ? String(pincode).trim() : null,
    },
  };
}

