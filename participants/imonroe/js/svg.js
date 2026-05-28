// Pure SVG builders. Each returns an accessible SVG string (role="img" with a
// title + desc) to be injected into a container. Hand-rolled so the bone-dry
// flatline and the pinned-draining gauge look exactly as deadpan as intended.

let uid = 0;
function nextId(prefix) {
	uid += 1;
	return `${prefix}-${uid}`;
}

function esc(str) {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function polar(cx, cy, r, deg) {
	const rad = (deg * Math.PI) / 180;
	return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function round(n) {
	return Math.round(n * 100) / 100;
}

// --- 30-day trend area chart ----------------------------------------------

export function areaChart(series, opts = {}) {
	const {
		width = 720,
		height = 240,
		threshold = 10,
		domainMax = 12,
		title = 'Water level, last 30 days',
		desc = 'A flatline at 0.00 feet. The recreational threshold, last achieved in 2001, sits far above and is never reached.',
	} = opts;

	const left = 10;
	const right = 12;
	const top = 18;
	const bottom = 26;
	const plotW = width - left - right;
	const plotH = height - top - bottom;
	const n = series.length;

	const xFor = (i) => left + (n <= 1 ? 0 : (i / (n - 1)) * plotW);
	const yFor = (v) => top + (1 - v / domainMax) * plotH;
	const baseY = yFor(0);

	const linePts = series.map((v, i) => `${round(xFor(i))} ${round(yFor(v))}`);
	const linePath = `M ${linePts.join(' L ')}`;
	const areaPath =
		`M ${round(xFor(0))} ${round(baseY)} ` +
		`L ${linePts.join(' L ')} ` +
		`L ${round(xFor(n - 1))} ${round(baseY)} Z`;

	const thresholdY = round(yFor(threshold));

	// A few faint horizontal gridlines across the domain.
	const gridValues = [0, domainMax * 0.25, domainMax * 0.5, domainMax * 0.75];
	const grid = gridValues
		.map(
			(v) =>
				`<line class="chart-grid" x1="${left}" y1="${round(yFor(v))}" x2="${
					width - right
				}" y2="${round(yFor(v))}" />`
		)
		.join('');

	const xLabels = [
		{ i: 0, t: '30d ago' },
		{ i: Math.floor(n / 3), t: '20d' },
		{ i: Math.floor((2 * n) / 3), t: '10d' },
		{ i: n - 1, t: 'today' },
	]
		.map(
			(p) =>
				`<text x="${round(xFor(p.i))}" y="${
					height - 8
				}" font-family="var(--font-mono)" font-size="9" letter-spacing="1" fill="var(--color-stone-700)" text-anchor="middle">${esc(
					p.t.toUpperCase()
				)}</text>`
		)
		.join('');

	const titleId = nextId('chart-title');
	const descId = nextId('chart-desc');

	return `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" width="100%" height="${height}" role="img" aria-labelledby="${titleId} ${descId}">
<title id="${titleId}">${esc(title)}</title>
<desc id="${descId}">${esc(desc)}</desc>
${grid}
<line class="chart-axis" x1="${left}" y1="${round(baseY)}" x2="${
		width - right
	}" y2="${round(baseY)}" />
<path class="chart-area" d="${areaPath}" />
<path class="chart-line" d="${linePath}" />
<line class="chart-threshold" x1="${left}" y1="${thresholdY}" x2="${
		width - right
	}" y2="${thresholdY}" />
<text x="${width - right}" y="${
		thresholdY - 6
	}" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="var(--color-stone-700)" text-anchor="end">RECREATIONAL THRESHOLD · 2001</text>
${xLabels}
</svg>`;
}

// --- Sparkline -------------------------------------------------------------

export function sparkline(series, opts = {}) {
	const { width = 132, height = 30, label = '24-hour micro-trend' } = opts;
	const n = series.length;
	const max = Math.max(0.01, ...series);
	const pad = 2;
	const xFor = (i) => pad + (n <= 1 ? 0 : (i / (n - 1)) * (width - 2 * pad));
	const yFor = (v) => height - pad - (v / max) * (height - 2 * pad);
	const pts = series.map((v, i) => `${round(xFor(i))} ${round(yFor(v))}`);

	return `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${esc(
		label
	)}"><path d="M ${pts.join(
		' L '
	)}" fill="none" stroke="var(--color-cardinal-700)" stroke-width="1.5" stroke-linejoin="round" /></svg>`;
}

// --- Radial gauge (180-degree sweep, value pinned) -------------------------

export function radialGauge(value, opts = {}) {
	const {
		min = -1000,
		max = 0,
		unit = 'gal/min',
		label = 'Seepage rate',
		decimals = 0,
	} = opts;

	const cx = 110;
	const cy = 116;
	const r = 92;
	const clamped = Math.min(max, Math.max(min, value));
	const frac = (clamped - min) / (max - min || 1);
	const angle = 180 - frac * 180; // 180deg (left) .. 0deg (right)

	const startPt = polar(cx, cy, r, 180);
	const endPt = polar(cx, cy, r, 0);
	const valPt = polar(cx, cy, r, angle);
	const needlePt = polar(cx, cy, r - 14, angle);

	const display = Number.isFinite(value) ? value.toFixed(decimals) : '—';

	const titleId = nextId('gauge-title');

	// Faint downward chevrons reinforcing the perpetual drain.
	const drain = `<g class="gauge__drain" stroke="var(--color-cardinal-700)" stroke-width="1.5" fill="none" opacity="0.6">
<path d="M ${cx - 10} ${cy + 8} L ${cx} ${cy + 16} L ${cx + 10} ${cy + 8}" />
<path d="M ${cx - 10} ${cy + 18} L ${cx} ${cy + 26} L ${cx + 10} ${cy + 18}" />
</g>`;

	return `<svg viewBox="0 0 220 150" width="100%" height="150" role="img" aria-labelledby="${titleId}">
<title id="${titleId}">${esc(label)}: ${esc(display)} ${esc(unit)}</title>
<path d="M ${round(startPt.x)} ${round(startPt.y)} A ${r} ${r} 0 0 1 ${round(
		endPt.x
	)} ${round(endPt.y)}" fill="none" stroke="var(--color-line)" stroke-width="10" stroke-linecap="round" />
<path d="M ${round(startPt.x)} ${round(startPt.y)} A ${r} ${r} 0 0 1 ${round(
		valPt.x
	)} ${round(
		valPt.y
	)}" fill="none" stroke="var(--color-cardinal-700)" stroke-width="10" stroke-linecap="round" />
<line x1="${cx}" y1="${cy}" x2="${round(needlePt.x)}" y2="${round(
		needlePt.y
	)}" stroke="var(--color-stone-900)" stroke-width="2.5" stroke-linecap="round" />
<circle cx="${cx}" cy="${cy}" r="4.5" fill="var(--color-stone-900)" />
${drain}
</svg>`;
}

// --- Official seal (topographic contours + salamander + ring text) ---------

export function seal(opts = {}) {
	const { ringText = 'LAKE LAGUNITA · FIELD OBSERVATORY · EST. 1870s' } = opts;
	const pathId = nextId('seal-ring');
	const titleId = nextId('seal-title');

	// Concentric, slightly offset ellipses = a dry-lakebed contour map.
	const contours = [
		[60, 60, 30, 22],
		[60, 60, 38, 29],
		[61, 59, 46, 35],
		[59, 61, 53, 41],
	]
		.map(
			([x, y, rx, ry]) =>
				`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="var(--color-cardinal-700)" stroke-width="0.8" opacity="0.45" />`
		)
		.join('');

	// Minimal salamander glyph at the center.
	const salamander = `<g fill="var(--color-cardinal-700)">
<ellipse cx="60" cy="60" rx="13" ry="5" />
<circle cx="73" cy="60" r="4.5" />
<path d="M47 60 q-9 -1 -13 -7 q6 4 13 3 z" />
<path d="M55 64 l-4 6 M65 64 l4 6 M53 56 l-4 -6 M67 56 l4 -6" stroke="var(--color-cardinal-700)" stroke-width="2" stroke-linecap="round" />
</g>`;

	return `<svg viewBox="0 0 120 120" width="100%" height="100%" role="img" aria-labelledby="${titleId}">
<title id="${titleId}">${esc(ringText)}</title>
<circle cx="60" cy="60" r="58" fill="var(--color-paper)" stroke="var(--color-cardinal-700)" stroke-width="2" />
<circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-cardinal-700)" stroke-width="0.75" />
${contours}
${salamander}
<defs><path id="${pathId}" d="M 60 60 m -42 0 a 42 42 0 1 1 84 0 a 42 42 0 1 1 -84 0" /></defs>
<text font-family="var(--font-mono)" font-size="7.2" letter-spacing="1.6" fill="var(--color-cardinal-900)"><textPath href="#${pathId}" startOffset="2%">${esc(
		ringText
	)}</textPath></text>
</svg>`;
}
