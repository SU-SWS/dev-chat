// Live data layer: pure parsers for the USGS and Open-Meteo payloads, plus
// thin fetch wrappers that cache the last-good response in localStorage so the
// page degrades gracefully when a source is unreachable.

import {
	USGS_URL,
	OPEN_METEO_URL,
	USGS_SENTINEL,
	FETCH_TIMEOUT_MS,
	STORAGE_KEYS,
	CACHE_STALE_MS,
} from './config.js';
import { getJSON, setJSON } from './store.js';

// --- Pure parsers ----------------------------------------------------------

// USGS Instantaneous Values -> latest discharge (00060) and gauge height
// (00065). Sentinels and non-numeric values map to null.
export function parseUsgs(json) {
	const series = json?.value?.timeSeries ?? [];
	const result = { discharge: null, gaugeHeight: null };

	for (const ts of series) {
		const code = ts?.variable?.variableCode?.[0]?.value;
		const points = ts?.values?.[0]?.value ?? [];
		if (!points.length) continue;

		const latest = points[points.length - 1];
		const num = Number.parseFloat(latest?.value);
		const time = latest?.dateTime ?? null;

		if (!Number.isFinite(num) || num <= USGS_SENTINEL) continue;

		if (code === '00060') {
			result.discharge = { value: num, unit: 'cfs', time };
		} else if (code === '00065') {
			result.gaugeHeight = { value: num, unit: 'ft', time };
		}
	}

	return result;
}

// Open-Meteo daily precipitation -> [{ date, precipMm }] for up to 7 days.
export function parseOpenMeteo(json) {
	const dates = json?.daily?.time ?? [];
	const sums = json?.daily?.precipitation_sum ?? [];
	const out = [];

	for (let i = 0; i < Math.min(dates.length, 7); i++) {
		const mm = Number.parseFloat(sums[i]);
		out.push({ date: dates[i], precipMm: Number.isFinite(mm) ? mm : 0 });
	}

	return out;
}

// --- Fetch + cache ---------------------------------------------------------

async function fetchJson(url, timeoutMs = FETCH_TIMEOUT_MS) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const res = await fetch(url, {
			signal: controller.signal,
			headers: { Accept: 'application/json' },
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return await res.json();
	} finally {
		clearTimeout(timer);
	}
}

function readCache(key) {
	const entry = getJSON(key);
	if (!entry || typeof entry.fetchedAt !== 'number') return null;
	return entry;
}

function writeCache(key, parsed) {
	setJSON(key, { fetchedAt: Date.now(), parsed });
}

// Returns { parsed, fetchedAt, fromCache, stale, ok }. On network failure it
// falls back to the last cached parse if one exists.
async function loadSource(url, cacheKey, parser, now = Date.now()) {
	try {
		const json = await fetchJson(url);
		const parsed = parser(json);
		writeCache(cacheKey, parsed);
		return {
			parsed,
			fetchedAt: now,
			fromCache: false,
			stale: false,
			ok: true,
		};
	} catch {
		const cached = readCache(cacheKey);
		if (cached) {
			return {
				parsed: cached.parsed,
				fetchedAt: cached.fetchedAt,
				fromCache: true,
				stale: now - cached.fetchedAt > CACHE_STALE_MS,
				ok: false,
			};
		}
		return {
			parsed: null,
			fetchedAt: null,
			fromCache: false,
			stale: false,
			ok: false,
		};
	}
}

export function loadUsgs(now = Date.now()) {
	return loadSource(USGS_URL, STORAGE_KEYS.usgsCache, parseUsgs, now);
}

export function loadOpenMeteo(now = Date.now()) {
	return loadSource(
		OPEN_METEO_URL,
		STORAGE_KEYS.openMeteoCache,
		parseOpenMeteo,
		now
	);
}
