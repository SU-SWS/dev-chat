// Conditions ticker. Renders an animated marquee for sighted users (paused on
// hover/focus via CSS) plus an equivalent screen-reader list. The animated
// strip is aria-hidden so assistive tech reads the list, not the duplicated
// scrolling copy. Under prefers-reduced-motion the CSS makes the strip a
// user-scrollable static row instead of animating.

export function initTicker(container, bulletins) {
	const region = document.createElement('div');
	region.className = 'ticker';
	region.setAttribute('role', 'region');
	region.setAttribute('aria-label', 'Current lake conditions');
	region.tabIndex = 0;

	const srList = document.createElement('ul');
	srList.className = 'sr-only';

	const track = document.createElement('div');
	track.className = 'ticker__track';
	track.setAttribute('aria-hidden', 'true');

	function render(list) {
		srList.replaceChildren(
			...list.map((text) => {
				const li = document.createElement('li');
				li.textContent = text;
				return li;
			})
		);
		// Duplicate the run so the -50% scroll loops seamlessly.
		const doubled = [...list, ...list];
		track.replaceChildren(
			...doubled.map((text) => {
				const span = document.createElement('span');
				span.className = 'ticker__item';
				span.textContent = text;
				return span;
			})
		);
	}

	render(bulletins);
	region.append(srList, track);
	container.replaceChildren(region);

	return {
		setBulletins(list) {
			render(list);
		},
	};
}
