// Static configuration for LAGUNITA. No secrets, no server — everything the
// dashboard needs to run entirely in the browser lives here as constants.

// USGS National Water Information System — Instantaneous Values service.
// Gauge 11164500 = San Francisquito Creek at Stanford University.
// 00060 = discharge (cfs), 00065 = gauge height (ft).
export const USGS_SITE = '11164500';
export const USGS_URL =
	'https://waterservices.usgs.gov/nwis/iv/?format=json&sites=11164500&parameterCd=00060,00065&siteStatus=all';

// USGS reports missing values with a large negative sentinel.
export const USGS_SENTINEL = -999999;

// Open-Meteo — keyless, CORS-friendly forecast at the lake's coordinates.
export const LAKE_LAT = 37.4232;
export const LAKE_LON = -122.176;
export const OPEN_METEO_URL =
	'https://api.open-meteo.com/v1/forecast?latitude=37.4232&longitude=-122.1760&daily=precipitation_sum&hourly=precipitation&timezone=America%2FLos_Angeles';

// NOAA Advanced Hydrologic Prediction Service river page for this creek.
// Pure flavor — linked, never parsed.
export const NOAA_AHPS_URL = 'https://water.noaa.gov/gauges/SFCC1';

// The creek's flood stage runs ~11–14 ft of gauge height. At/above this we
// flip the whole UI into the HISTORIC FILL state.
export const FLOOD_THRESHOLD_FT = 11.0;

// A rainy forecast day grudgingly bumps the projected depth to a 0.01 ft trace.
export const TRACE_PRECIP_MM = 2.0;
export const TRACE_DEPTH_FT = 0.01;

// Live data refresh cadence and per-request timeout.
export const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
export const FETCH_TIMEOUT_MS = 8000;

// Baked-in lore figures (all real, none hallucinated).
export const DESIGNED_CAPACITY_GAL = 115_000_000; // ~115M-gal 1870s reservoir
export const SEEPAGE_GAL_PER_MIN = -500; // permeable lakebed, always draining
export const PERIMETER_TRAIL_MI = 0.9;
export const LAST_RECREATIONAL_FILL_YEAR = 2001;
export const LAST_MEANINGFUL_WATER_EVENT = 'January 2023';

// Trend chart geometry. The dashed "recreational threshold" line sits near the
// top of the domain so the bone-dry flatline reads as forever out of reach.
export const CHART_DAYS = 30;
export const CHART_THRESHOLD_FT = 10.0;
export const CHART_DOMAIN_MAX_FT = 12.0;

// The one time it isn't zero: canonical figures for the HISTORIC FILL state.
export const HISTORIC_FILL_DEPTH_FT = 11.42;
export const HISTORIC_FILL_UTIL_PCT = 2.41;

// localStorage keys (all namespaced).
export const STORAGE_KEYS = {
	units: 'lagunita.units',
	usgsCache: 'lagunita.usgs.cache',
	openMeteoCache: 'lagunita.openmeteo.cache',
	sealClicks: 'lagunita.sealClicks',
};

// Cached payloads older than this are still shown (offline resilience) but are
// flagged stale in the UI.
export const CACHE_STALE_MS = 30 * 60 * 1000;
