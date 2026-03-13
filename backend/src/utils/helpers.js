import { v4 as uuidv4 } from 'uuid';

export function makeId(prefix) {
  return `${prefix}_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
}

export function nowIso() {
  return new Date().toISOString();
}

export function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeText(value = '') {
  return String(value).trim();
}
