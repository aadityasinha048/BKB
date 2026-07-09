const MAX_TEXT_LENGTH = 5000;
const MAX_IMAGE_DATA_URL_LENGTH = 2_000_000;

export function cleanString(value, maxLength = 255) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isIndianMobile(value) {
  return /^[6-9]\d{9}$/.test(value);
}

export function isPinCode(value) {
  return /^\d{6}$/.test(value);
}

export function isOtp(value) {
  return /^\d{6}$/.test(value);
}

export function isUpiId(value) {
  return /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z0-9._-]{2,64}$/.test(value);
}

export function cleanText(value) {
  return cleanString(value, MAX_TEXT_LENGTH);
}

export function cleanStringArray(value, maxItems = 20) {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => cleanString(item, 80))
    .filter(Boolean)
    .slice(0, maxItems);
}

export function cleanImageSource(value, fallback = '') {
  const src = cleanString(value, MAX_IMAGE_DATA_URL_LENGTH);
  if (!src) return fallback;
  if (src.startsWith('/images/')) return src;
  if (/^data:image\/(png|jpeg|jpg|webp);base64,[a-z0-9+/=]+$/i.test(src)) return src;
  return fallback;
}

export function publicSeller(seller) {
  if (!seller) return null;
  const {
    aadhaarNumber,
    bankAccountNumber,
    bankIfsc,
    bankHolderName,
    upiId,
    ...safeSeller
  } = seller;
  return safeSeller;
}
