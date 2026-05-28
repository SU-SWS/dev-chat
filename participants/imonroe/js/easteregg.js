// HISTORIC FILL easter egg. Three ways in: a real creek flood (handled by the
// model via gauge height), a manual ?fill=1 query param, or five quick clicks
// on the official seal. The state is purely a body class + a model override,
// so it's always reversible by reloading without the trigger.

const FILL_CLASS = 'is-historic-fill';

// Read the manual override from the URL. ?fill=1 (or ?fill=true) forces it on.
export function readUrlOverride() {
	try {
		const params = new URLSearchParams(window.location.search);
		const fill = params.get('fill');
		return { fill: fill === '1' || fill === 'true' };
	} catch {
		return { fill: false };
	}
}

// Five clicks on the seal in quick succession trips the egg. The counter
// resets if the clicks are too slow, so it stays a deliberate gesture.
export function attachSealTrigger(sealEl, onTrigger, clicksNeeded = 5) {
	if (!sealEl) return;
	let count = 0;
	let timer = null;

	sealEl.addEventListener('click', () => {
		count += 1;
		clearTimeout(timer);
		timer = setTimeout(() => {
			count = 0;
		}, 1500);
		if (count >= clicksNeeded) {
			count = 0;
			onTrigger();
		}
	});
}

export function applyFillState(on) {
	document.body.classList.toggle(FILL_CLASS, !!on);
}

export function isFillState() {
	return document.body.classList.contains(FILL_CLASS);
}
