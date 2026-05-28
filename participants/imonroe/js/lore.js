// Static editorial copy. The whole joke lives in the deadpan, so every string
// here is written in the voice of an over-serious hydrology field station.

export const SITE = {
	title: 'LAGUNITA',
	subtitle: 'Real-Time Lake Conditions & Tide Tracker',
	station: 'USGS-adjacent Field Observatory · Stanford, California',
	tagline: 'El lago que casi no existe.',
	mission: 'Monitoring the absence of water since 2001.',
};

// Continuous conditions ticker — deadpan bulletins for the bone-dry state.
export const TICKER_BULLETINS = [
	'Lakebed optimal for jogging',
	'0.9-mi perimeter trail fully operational',
	'Gopher activity: NOMINAL',
	'Salamanders: unbothered',
	'Dust accumulation: within seasonal norms',
	'Visibility across basin: UNLIMITED',
	'Recommended watercraft: none',
	'Wind chop: 0.00 ft',
	'Algae bloom risk: not applicable',
	'Last verified puddle: under review',
];

// Emergency ticker — only ever seen during the HISTORIC FILL easter egg.
export const TICKER_EMERGENCY = [
	'⚠ HISTORIC FILL EVENT IN PROGRESS',
	'Water detected — repeat, water detected',
	'Salamander advisory elevated to ACTIVE',
	'Perimeter trail partially submerged',
	'Last comparable event: January 2023',
	'Recreational threshold: APPROACHING',
	'All available staff to the lakebed',
];

// Salamander Breeding Advisory module.
export const SALAMANDER = {
	species: 'California tiger salamander (Ambystoma californiense)',
	statusDry: 'DORMANT',
	statusFill: 'ACTIVE',
	noteDry:
		'No standing water. Breeding conditions not met. Population estivating in upland burrows. Advisory level nominal.',
	noteFill:
		'Standing water detected in basin. Breeding conditions possible. Field crews advised to observe posted habitat protections.',
};

// Tide table — labels for the gravely precise nonsense tide times. Heights are
// always 0.00 ft; the times are generated deterministically from the date.
export const TIDE_EVENTS = [
	{ key: 'high1', label: 'Morning High' },
	{ key: 'low1', label: 'Midday Low' },
	{ key: 'high2', label: 'Evening High' },
	{ key: 'low2', label: 'Overnight Low' },
];

// Deadpan strings shown when a live source can't be reached.
export const OFFLINE = {
	creek: 'Gauge unreachable. The creek persists regardless.',
	forecast: 'Forecast service unreachable. Outlook remains dry.',
	stale: 'Showing last verified reading.',
};

// Hover/aria copy for the unreachable recreational-threshold line.
export const THRESHOLD_LABEL = 'Recreational threshold · last achieved 2001';

// Footer attributions — the sources are real and worth crediting.
export const SOURCES = [
	{ label: 'USGS NWIS · Gauge 11164500', kind: 'data' },
	{ label: 'Open-Meteo · Daily precipitation', kind: 'data' },
	{ label: 'NOAA AHPS · Station SFCC1', kind: 'link' },
];
