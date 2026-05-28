// Defensive localStorage wrapper. Everything is wrapped in try/catch so the
// dashboard keeps working in private-mode browsers or when storage is full —
// it just loses persistence, never functionality.

import { STORAGE_KEYS } from './config.js';
import { SYSTEMS } from './units.js';

export function getJSON(key, fallback = null) {
	try {
		const raw = localStorage.getItem(key);
		if (raw == null) return fallback;
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}

export function setJSON(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch {
		return false;
	}
}

// --- Unit preference -------------------------------------------------------
export function getUnits() {
	const stored = getJSON(STORAGE_KEYS.units);
	return SYSTEMS.includes(stored) ? stored : 'imperial';
}

export function setUnits(system) {
	const safe = SYSTEMS.includes(system) ? system : 'imperial';
	setJSON(STORAGE_KEYS.units, safe);
	return safe;
}

// --- Seal-click counter (drives the 5-click easter egg) --------------------
export function getSealClicks() {
	const n = getJSON(STORAGE_KEYS.sealClicks, 0);
	return Number.isInteger(n) && n >= 0 ? n : 0;
}

export function bumpSealClicks() {
	const next = getSealClicks() + 1;
	setJSON(STORAGE_KEYS.sealClicks, next);
	return next;
}

export function resetSealClicks() {
	setJSON(STORAGE_KEYS.sealClicks, 0);
}
