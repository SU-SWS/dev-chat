// Pure unit conversion + number formatting. Internally every measurement is
// stored in imperial base units; this module projects them into whichever
// system the reader has chosen. No DOM, no state — easy to reason about.

export const SYSTEMS = ['imperial', 'metric'];

// quantity -> per-system unit label, multiplicative factor from the imperial
// base, and a sensible default number of decimals.
const QUANTITIES = {
	depth: {
		imperial: { unit: 'ft', factor: 1, decimals: 2 },
		metric: { unit: 'm', factor: 0.3048, decimals: 2 },
	},
	discharge: {
		imperial: { unit: 'cfs', factor: 1, decimals: 1 },
		metric: { unit: 'm³/s', factor: 0.0283168, decimals: 3 },
	},
	volume: {
		imperial: { unit: 'gal', factor: 1, decimals: 0 },
		metric: { unit: 'L', factor: 3.78541, decimals: 0 },
	},
	seepage: {
		imperial: { unit: 'gal/min', factor: 1, decimals: 0 },
		metric: { unit: 'L/min', factor: 3.78541, decimals: 0 },
	},
	distance: {
		imperial: { unit: 'mi', factor: 1, decimals: 1 },
		metric: { unit: 'km', factor: 1.60934, decimals: 1 },
	},
};

function normalizeSystem(system) {
	return system === 'metric' ? 'metric' : 'imperial';
}

// Convert an imperial-base value into the target system.
// Temperature is offset-based and handled separately from the factor table.
export function convert(value, quantity, system) {
	const sys = normalizeSystem(system);

	if (quantity === 'temperature') {
		const unit = sys === 'metric' ? '°C' : '°F';
		if (!Number.isFinite(value)) return { value, unit, decimals: 0 };
		const out = sys === 'metric' ? ((value - 32) * 5) / 9 : value;
		return { value: out, unit, decimals: 0 };
	}

	const spec = QUANTITIES[quantity]?.[sys];
	if (!spec) throw new Error(`Unknown quantity: ${quantity}`);
	const out = Number.isFinite(value) ? value * spec.factor : value;
	return { value: out, unit: spec.unit, decimals: spec.decimals };
}

// Format a number with fixed decimals, optional thousands grouping, and an
// optional forced sign. Non-finite input renders as an em dash.
export function formatNumber(value, opts = {}) {
	const { decimals = 0, group = false, signDisplay = 'auto' } = opts;
	if (!Number.isFinite(value)) return '—';
	// Avoid "-0.00" — a draining gauge can round a tiny value to negative zero.
	const safe = value === 0 ? 0 : value;
	return new Intl.NumberFormat('en-US', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
		useGrouping: group,
		signDisplay,
	}).format(safe);
}

// Convenience: convert + format in one call. Returns the formatted string, the
// unit label, and the raw converted number.
export function formatMeasure(value, quantity, system, opts = {}) {
	const { value: out, unit, decimals } = convert(value, quantity, system);
	const decimalsToUse = opts.decimals ?? decimals;
	const text = formatNumber(out, { ...opts, decimals: decimalsToUse });
	return { text, unit, value: out };
}
