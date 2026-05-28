// The brutally honest hydrology model. It knows the lake hasn't been filled
// for recreation since 2001 and that the lakebed leaks ~500 gal/min, so it
// reports zero with total confidence — unless the creek genuinely floods.

import {
	FLOOD_THRESHOLD_FT,
	TRACE_PRECIP_MM,
	TRACE_DEPTH_FT,
	DESIGNED_CAPACITY_GAL,
	SEEPAGE_GAL_PER_MIN,
	CHART_DAYS,
	CHART_THRESHOLD_FT,
	CHART_DOMAIN_MAX_FT,
	HISTORIC_FILL_DEPTH_FT,
	HISTORIC_FILL_UTIL_PCT,
} from './config.js';
import { TIDE_EVENTS } from './lore.js';

const STATUS = {
	dry: 'BONE_DRY',
	fill: 'HISTORIC_FILL',
};

// --- Deterministic tide times ---------------------------------------------
// Same date -> same gravely precise nonsense times, so the table is stable
// across refreshes but believable.

function dateKey(now) {
	const d = new Date(now);
	return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function mulberry32(seed) {
	let a = seed >>> 0;
	return function () {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function seedFrom(str) {
	let h = 2166136261;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

function fmtTime(minutes) {
	const h = Math.floor(minutes / 60) % 24;
	const m = minutes % 60;
	return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Each event lives in a plausible window; the seed jitters it by a few minutes.
const TIDE_WINDOWS = {
	high1: 4 * 60, // pre-dawn
	low1: 10 * 60, // mid-morning
	high2: 16 * 60, // late afternoon
	low2: 22 * 60, // late evening
};

function computeTides(now) {
	const rng = mulberry32(seedFrom(dateKey(now)));
	return TIDE_EVENTS.map((ev) => {
		const base = TIDE_WINDOWS[ev.key] ?? 12 * 60;
		const jitter = Math.floor(rng() * 119) - 30; // +/- ~1h, deterministic
		return {
			key: ev.key,
			label: ev.label,
			time: fmtTime(((base + jitter) % 1440) + (base + jitter < 0 ? 1440 : 0)),
			heightFt: 0,
		};
	});
}

// --- Forecast --------------------------------------------------------------
// A rainy day grudgingly bumps the projected depth to a 0.01 ft trace; every
// other day is a flat zero.

function computeForecast(openMeteo, now) {
	if (Array.isArray(openMeteo) && openMeteo.length) {
		return openMeteo.map((d) => {
			const trace = d.precipMm >= TRACE_PRECIP_MM;
			return {
				date: d.date,
				precipMm: d.precipMm,
				depthFt: trace ? TRACE_DEPTH_FT : 0,
				trace,
			};
		});
	}
	// No forecast data: synthesize 7 dry days so the module still renders.
	const out = [];
	const start = new Date(now);
	for (let i = 0; i < 7; i++) {
		const d = new Date(start);
		d.setDate(start.getDate() + i);
		out.push({
			date: d.toISOString().slice(0, 10),
			precipMm: 0,
			depthFt: 0,
			trace: false,
		});
	}
	return out;
}

// --- 30-day level series for the trend chart -------------------------------

function drySeries() {
	return new Array(CHART_DAYS).fill(0);
}

function fillSeries(peak) {
	const s = drySeries();
	// A late-window spike crossing the unreachable threshold.
	const ramp = [0.4, 1.6, 4.2, 7.8, peak];
	for (let i = 0; i < ramp.length; i++) {
		s[CHART_DAYS - ramp.length + i] = ramp[i];
	}
	return s;
}

// --- Main entry ------------------------------------------------------------

export function computeConditions({
	usgs = null,
	openMeteo = null,
	now = Date.now(),
	overrides = {},
} = {}) {
	const gaugeHeightFt = usgs?.gaugeHeight?.value ?? null;
	const realFlood =
		Number.isFinite(gaugeHeightFt) && gaugeHeightFt >= FLOOD_THRESHOLD_FT;
	const floodActive = overrides.fill === true || realFlood;

	const depthFt = floodActive
		? realFlood
			? gaugeHeightFt
			: HISTORIC_FILL_DEPTH_FT
		: 0;

	const utilizationPct = floodActive ? HISTORIC_FILL_UTIL_PCT : 0;
	const currentContentsGal = Math.round(
		(utilizationPct / 100) * DESIGNED_CAPACITY_GAL
	);

	const creekOnline = !!(usgs && (usgs.discharge || usgs.gaugeHeight));

	const series = floodActive ? fillSeries(depthFt) : drySeries();

	return {
		status: floodActive ? STATUS.fill : STATUS.dry,
		floodActive,
		depthFt,
		// 24h trend: flat when dry, rising during a fill.
		depthTrendFt: floodActive ? depthFt : 0,
		utilizationPct,
		currentContentsGal,
		designedCapacityGal: DESIGNED_CAPACITY_GAL,
		// Honest output: the diversion that once fed the lake hasn't run since
		// 2001, so projected inflow is zero regardless of the creek.
		projectedInflowGal: 0,
		seepageGalMin: SEEPAGE_GAL_PER_MIN,
		creek: {
			discharge: usgs?.discharge ?? null,
			gaugeHeight: usgs?.gaugeHeight ?? null,
			online: creekOnline,
		},
		tides: computeTides(now),
		forecast: computeForecast(openMeteo, now),
		chart: {
			series,
			threshold: CHART_THRESHOLD_FT,
			domainMax: CHART_DOMAIN_MAX_FT,
		},
		spark: series.slice(-14),
	};
}
