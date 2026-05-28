// Orchestration: render the static + cached state immediately, fetch live data,
// run the honest model, and hydrate every module. All side effects live here;
// the imported modules stay pure.

import { REFRESH_INTERVAL_MS } from './config.js';
import {
	SITE,
	TICKER_BULLETINS,
	TICKER_EMERGENCY,
	SALAMANDER,
	OFFLINE,
} from './lore.js';
import { formatMeasure, formatNumber } from './units.js';
import { getUnits, setUnits } from './store.js';
import { loadUsgs, loadOpenMeteo } from './data.js';
import { computeConditions } from './model.js';
import { areaChart, sparkline, radialGauge, seal } from './svg.js';
import { initTicker } from './ticker.js';
import {
	readUrlOverride,
	attachSealTrigger,
	applyFillState,
} from './easteregg.js';

const $ = (id) => document.getElementById(id);

const state = {
	usgs: null, // result from loadUsgs
	openMeteo: null, // result from loadOpenMeteo
	units: getUnits(),
	overrides: readUrlOverride(),
};

let ticker = null;

// --- Render helpers --------------------------------------------------------

function setText(id, text) {
	const el = $(id);
	if (el) el.textContent = text;
}

function weekdayLabel(dateStr, index) {
	if (index === 0) return 'Today';
	const d = new Date(`${dateStr}T00:00:00`);
	return Number.isNaN(d.getTime())
		? '—'
		: d.toLocaleDateString('en-US', { weekday: 'short' });
}

function renderHero(c, units) {
	const depth = formatMeasure(c.depthFt, 'depth', units);
	setText('hero-depth', depth.text);
	setText('hero-depth-unit', depth.unit);

	const trend = formatMeasure(Math.abs(c.depthTrendFt), 'depth', units);
	const arrow = c.depthTrendFt > 0 ? '▲' : '▼';
	setText('hero-trend', `${arrow} ${trend.text} ${trend.unit} (24h)`);

	const pill = $('hero-status');
	if (pill) {
		if (c.floodActive) {
			pill.textContent = 'Historic Fill';
			pill.className = 'status-pill status-pill--alarm';
		} else {
			pill.textContent = 'Bone Dry';
			pill.className = 'status-pill status-pill--dry';
		}
	}

	const spark = $('hero-spark');
	if (spark) spark.innerHTML = sparkline(c.spark);
}

function renderChart(c) {
	const el = $('chart');
	if (!el) return;
	const desc = c.floodActive
		? 'Water level spiking through the recreational threshold during a historic fill event.'
		: 'A flatline at 0.00 feet. The recreational threshold, last achieved in 2001, sits far above and is never reached.';
	el.innerHTML = areaChart(c.chart.series, {
		threshold: c.chart.threshold,
		domainMax: c.chart.domainMax,
		desc,
	});
}

function renderSeepage(c, units) {
	const v = formatMeasure(c.seepageGalMin, 'seepage', units, {
		signDisplay: 'never',
	});
	setText('seepage-value', `−${v.text}`);
	setText('seepage-unit', v.unit);

	const lo = formatMeasure(-1000, 'seepage', units).value;
	const gauge = $('gauge');
	if (gauge) {
		gauge.innerHTML = radialGauge(v.value, {
			min: lo,
			max: 0,
			unit: v.unit,
			label: 'Seepage rate',
		});
	}
}

function renderUtilization(c, units) {
	const contents = formatMeasure(c.currentContentsGal, 'volume', units, {
		group: true,
	});
	setText('contents', c.currentContentsGal === 0 ? '~0' : contents.text);
	setText('contents-unit', contents.unit);
	setText('utilization', `${c.utilizationPct.toFixed(4)}%`);
}

function renderCreek(c, units) {
	const dEl = $('creek-discharge');
	const gEl = $('creek-gauge');
	if (dEl) dEl.classList.remove('skeleton');
	if (gEl) gEl.classList.remove('skeleton');

	if (c.creek.online) {
		const disch = c.creek.discharge
			? formatMeasure(c.creek.discharge.value, 'discharge', units)
			: null;
		const gh = c.creek.gaugeHeight
			? formatMeasure(c.creek.gaugeHeight.value, 'depth', units)
			: null;
		setText('creek-discharge', disch ? disch.text : '—');
		setText('creek-discharge-unit', disch ? disch.unit : '');
		setText('creek-gauge', gh ? gh.text : '—');
		setText('creek-gauge-unit', gh ? gh.unit : '');
		setText(
			'creek-note',
			'Diversion inactive since 2001 · input observed, output honest'
		);
	} else {
		setText('creek-discharge', '—');
		setText('creek-discharge-unit', 'OFFLINE');
		setText('creek-gauge', '—');
		setText('creek-gauge-unit', 'OFFLINE');
		setText('creek-note', OFFLINE.creek);
	}

	const inflow = formatMeasure(c.projectedInflowGal, 'volume', units, {
		group: true,
	});
	setText('inflow', inflow.text);
	setText('inflow-unit', inflow.unit);
}

function renderTides(c, units) {
	const body = $('tide-table');
	if (!body) return;
	const h = formatMeasure(0, 'depth', units);
	body.replaceChildren(
		...c.tides.map((t) => {
			const tr = document.createElement('tr');
			tr.className = 'border-t border-line';
			tr.innerHTML = `<td class="py-2">${t.label}</td><td class="py-2">${t.time}</td><td class="py-2 text-right">${h.text} ${h.unit}</td>`;
			return tr;
		})
	);
}

function renderForecast(c, units) {
	const list = $('forecast');
	if (!list) return;
	list.replaceChildren(
		...c.forecast.map((d, i) => {
			const depth = formatMeasure(d.depthFt, 'depth', units);
			const icon = d.trace ? '🌧' : '☀';
			const li = document.createElement('li');
			li.className = 'rounded border border-line p-2 text-center';
			li.innerHTML = `<span class="mono-sm block">${weekdayLabel(
				d.date,
				i
			)}</span><span class="block text-lg" aria-hidden="true">${icon}</span><span class="tabular block text-sm">${depth.text} ${depth.unit}</span>`;
			return li;
		})
	);
}

function renderSalamander(c) {
	const status = $('salamander-status');
	if (status) {
		status.textContent = c.floodActive
			? SALAMANDER.statusFill
			: SALAMANDER.statusDry;
		status.className = c.floodActive
			? 'status-pill status-pill--alarm'
			: 'status-pill status-pill--ok';
	}
	setText(
		'salamander-note',
		c.floodActive ? SALAMANDER.noteFill : SALAMANDER.noteDry
	);
}

function renderStatusLine(c) {
	const result = state.usgs;
	let msg;
	if (!result || result.parsed == null) {
		msg = 'Live gauge unreachable · static lore holding the line.';
	} else if (result.fromCache) {
		msg = `${OFFLINE.stale} ${new Date(result.fetchedAt).toLocaleString()}`;
	} else {
		msg = `Live · updated ${new Date(result.fetchedAt).toLocaleTimeString()}`;
	}
	setText('last-updated', msg);
}

function render() {
	const c = computeConditions({
		usgs: state.usgs?.parsed ?? null,
		openMeteo: state.openMeteo?.parsed ?? null,
		now: Date.now(),
		overrides: state.overrides,
	});

	applyFillState(c.floodActive);
	renderHero(c, state.units);
	renderChart(c);
	renderSeepage(c, state.units);
	renderUtilization(c, state.units);
	renderCreek(c, state.units);
	renderTides(c, state.units);
	renderForecast(c, state.units);
	renderSalamander(c);
	renderStatusLine(c);

	if (ticker) {
		ticker.setBulletins(c.floodActive ? TICKER_EMERGENCY : TICKER_BULLETINS);
	}
}

// --- Unit toggle -----------------------------------------------------------

function syncUnitButtons() {
	const imp = $('unit-imperial');
	const met = $('unit-metric');
	if (imp) imp.setAttribute('aria-pressed', String(state.units === 'imperial'));
	if (met) met.setAttribute('aria-pressed', String(state.units === 'metric'));
}

function wireUnitToggle() {
	const choose = (system) => {
		state.units = setUnits(system);
		syncUnitButtons();
		render();
	};
	$('unit-imperial')?.addEventListener('click', () => choose('imperial'));
	$('unit-metric')?.addEventListener('click', () => choose('metric'));
	syncUnitButtons();
}

// --- Boot ------------------------------------------------------------------

async function refresh() {
	const [usgs, openMeteo] = await Promise.all([loadUsgs(), loadOpenMeteo()]);
	state.usgs = usgs;
	state.openMeteo = openMeteo;
	render();
}

function init() {
	document.title = `${SITE.title} — ${SITE.subtitle}`;

	const sealEl = $('seal');
	if (sealEl) sealEl.innerHTML = seal();

	ticker = initTicker($('ticker'), TICKER_BULLETINS);

	wireUnitToggle();

	attachSealTrigger(sealEl, () => {
		state.overrides = { fill: true };
		render();
	});

	// Render immediately from static defaults + any cached data, then go live.
	render();
	refresh();
	setInterval(refresh, REFRESH_INTERVAL_MS);
}

init();
