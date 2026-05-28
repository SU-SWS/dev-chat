const BUREAU_NAME = "Stanford Bureau of Useful Metrics";
const BUREAU_DISCLAIMER = "This is a parody office. It is not affiliated with or endorsed by Stanford University.";

const PRESET_LOCATIONS = {
  "redwood-city": {
    latitude: 37.4852,
    longitude: -122.2364,
    label: "Redwood City, CA",
    jurisdiction: "Peninsula Optional Burdens Annex"
  },
  stanford: {
    latitude: 37.4275,
    longitude: -122.1697,
    label: "Stanford, CA",
    jurisdiction: "Ceremonial Metrics Registrar"
  },
  "san-francisco": {
    latitude: 37.7749,
    longitude: -122.4194,
    label: "San Francisco, CA",
    jurisdiction: "Fog Compliance Desk"
  },
  geneva: {
    latitude: 46.2044,
    longitude: 6.1432,
    label: "Geneva, Switzerland",
    jurisdiction: "Office of Multilateral Mild Inconvenience"
  },
  oxford: {
    latitude: 51.752,
    longitude: -1.2577,
    label: "Oxford, United Kingdom",
    jurisdiction: "Committee on Ancient Procedural Gravitas"
  },
  singapore: {
    latitude: 1.3521,
    longitude: 103.8198,
    label: "Singapore",
    jurisdiction: "Equatorial Efficiency Secretariat"
  },
  reykjavik: {
    latitude: 64.1466,
    longitude: -21.9426,
    label: "Reykjavik, Iceland",
    jurisdiction: "North Atlantic Resilience Registry"
  },
  tokyo: {
    latitude: 35.6762,
    longitude: 139.6503,
    label: "Tokyo, Japan",
    jurisdiction: "Metropolitan Timeliness Tribunal"
  },
  "buenos-aires": {
    latitude: -34.6037,
    longitude: -58.3816,
    label: "Buenos Aires, Argentina",
    jurisdiction: "Department of Spirited Delays"
  }
};

const FALLBACK_LOCATION = PRESET_LOCATIONS["redwood-city"];

const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

const appState = {
  activeTool: "hardship",
  location: { ...FALLBACK_LOCATION },
  weather: null,
  certificateText: "Awaiting certification.",
  hasPendingChanges: false,
  formValues: {
    fragility: 6,
    hydration: 4,
    urgency: 3,
    composure: 5,
    theatrics: 5,
    character: 6
  }
};

const toolConfigs = {
  hardship: {
    eyebrow: "Outdoor Hardship Calculator",
    title: "Live courage quantification for optional outings",
    officeCode: "SUM-01",
    officeName: "Office of Optional Outdoor Burdens",
    officeNote: "Excessive scrutiny for conditions that objectively do not require this level of ceremony.",
    controls: {
      fragilityLabel: "Emotional fragility",
      fragilityCaption: "Selected sensitivity:",
      hydrationLabel: "Hydration confidence",
      hydrationCaption: "Selected preparedness:",
      urgencyLabel: "Administrative urgency",
      urgencyCaption: "Selected obligation pressure:",
      composureLabel: "Outdoor stoicism",
      composureCaption: "Selected refusal to complain:",
      theatricsLabel: "Heroic self-mythology",
      theatricsCaption: "Selected heroic flourish:",
      characterLabel: "Are you pretending this outing builds character?",
      characterOptions: [
        { value: 0, label: "No. This is just a walk and I resent the framing" },
        { value: 3, label: "Barely. I might mention it once" },
        { value: 6, label: "Somewhat. I contain narratives" },
        { value: 9, label: "Yes. This outing deserves witness statements" },
        { value: 12, label: "Absolutely. I expect ceremonial recognition" }
      ],
      buttonLabel: "Recalculate Officially"
    },
    evaluate: evaluateHardship
  },
  vibes: {
    eyebrow: "Vibes Audit Engine",
    title: "An unnecessary atmospheric mood inspection",
    officeCode: "SUM-14",
    officeName: "Office of Ambient Main Character Affairs",
    officeNote: "A ceremonially overqualified panel for deciding whether the moment feels cinematic enough to continue.",
    controls: {
      fragilityLabel: "Introspection susceptibility",
      fragilityCaption: "Selected internal weather:",
      hydrationLabel: "Beverage elegance",
      hydrationCaption: "Selected composure reserve:",
      urgencyLabel: "Calendar interference",
      urgencyCaption: "Selected admin contamination:",
      composureLabel: "Side-profile readiness",
      composureCaption: "Selected poise level:",
      theatricsLabel: "Montage willingness",
      theatricsCaption: "Selected slow-pan potential:",
      characterLabel: "Are you willing to treat errands like cinema?",
      characterOptions: [
        { value: 0, label: "No. I reject the premise of mood" },
        { value: 3, label: "Only if the lighting helps" },
        { value: 6, label: "Yes, but tastefully" },
        { value: 9, label: "Yes. Everything is a scene change" },
        { value: 12, label: "Completely. I am already in the trailer" }
      ],
      buttonLabel: "Audit The Vibes"
    },
    evaluate: evaluateVibes
  },
  loitering: {
    eyebrow: "Official Loitering Certification Exam",
    title: "Formal permission to stand around with intent",
    officeCode: "SUM-27",
    officeName: "Office of Stationary Legitimacy",
    officeNote: "A grave interdepartmental review of whether you can remain somewhere without attracting questions.",
    controls: {
      fragilityLabel: "Unstructured drifting tendency",
      fragilityCaption: "Selected drift potential:",
      hydrationLabel: "Beverage-based legitimacy",
      hydrationCaption: "Selected cover story strength:",
      urgencyLabel: "Visible purpose simulation",
      urgencyCaption: "Selected legitimacy level:",
      composureLabel: "Clipboard-free confidence",
      composureCaption: "Selected standing still competence:",
      theatricsLabel: "Purposeful nod frequency",
      theatricsCaption: "Selected fake-business energy:",
      characterLabel: "Are you prepared to look mildly expected somewhere?",
      characterOptions: [
        { value: 0, label: "No. I look lost immediately" },
        { value: 3, label: "Perhaps if I hold a beverage" },
        { value: 6, label: "I can manage vague legitimacy" },
        { value: 9, label: "Yes. I project sanctioned waiting" },
        { value: 12, label: "Completely. I could loiter before a committee" }
      ],
      buttonLabel: "Issue Loitering Ruling"
    },
    evaluate: evaluateLoitering
  },
  queue: {
    eyebrow: "Queue Suffering Index",
    title: "A spiritually inflated estimate of waiting pain",
    officeCode: "SUM-33",
    officeName: "Office of Queue Hardship and Delay Narratives",
    officeNote: "Procedural overreach, but applied to the wildly serious matter of standing behind other people.",
    controls: {
      fragilityLabel: "Patience instability",
      fragilityCaption: "Selected queue tolerance:",
      hydrationLabel: "Snack-and-water resilience",
      hydrationCaption: "Selected survival reserve:",
      urgencyLabel: "Need-to-be-somewhere else factor",
      urgencyCaption: "Selected resentment pressure:",
      composureLabel: "Line-standing dignity",
      composureCaption: "Selected anti-sigh strength:",
      theatricsLabel: "Minor inconvenience escalation",
      theatricsCaption: "Selected complaint monologue:",
      characterLabel: "Are you ready to make a minor delay your whole story?",
      characterOptions: [
        { value: 0, label: "No. I will behave proportionally" },
        { value: 3, label: "I may text one person about it" },
        { value: 6, label: "Somewhat. This line is personally rude" },
        { value: 9, label: "Yes. I intend to retell this hardship" },
        { value: 12, label: "Absolutely. This queue will enter family history" }
      ],
      buttonLabel: "Quantify The Queue"
    },
    evaluate: evaluateQueue
  },
  gravitas: {
    eyebrow: "Personal Gravitas Forecaster",
    title: "Live authority conditions for unnecessary entrances",
    officeCode: "SUM-52",
    officeName: "Office of Executive-Seeming Presence",
    officeNote: "A solemn bureau for deciding whether you can enter a room as though minutes are being taken.",
    controls: {
      fragilityLabel: "Ego permeability",
      fragilityCaption: "Selected aura stability:",
      hydrationLabel: "Polished professional hydration",
      hydrationCaption: "Selected executive reserve:",
      urgencyLabel: "Importance projection",
      urgencyCaption: "Selected perceived busyness:",
      composureLabel: "Corridor glide control",
      composureCaption: "Selected hallway authority:",
      theatricsLabel: "Dramatic entrance appetite",
      theatricsCaption: "Selected boardroom flourish:",
      characterLabel: "Are you prepared to enter as if a board is waiting?",
      characterOptions: [
        { value: 0, label: "No. I bring intern energy" },
        { value: 3, label: "Only if nobody looks directly at me" },
        { value: 6, label: "Moderately. I can imply a meeting" },
        { value: 9, label: "Yes. I project agenda ownership" },
        { value: 12, label: "Completely. I am the mysterious agenda item" }
      ],
      buttonLabel: "Forecast Gravitas"
    },
    evaluate: evaluateGravitas
  },
  errand: {
    eyebrow: "Official Errand Difficulty Bureau",
    title: "Institutional sympathy for trivial obligations",
    officeCode: "SUM-68",
    officeName: "Office of Domestic Burden Recognition",
    officeNote: "A dead-serious hearing on whether today’s tiny obligation deserves outsized sympathy and a certificate.",
    controls: {
      fragilityLabel: "Domestic task resistance",
      fragilityCaption: "Selected reluctance level:",
      hydrationLabel: "Functional adulthood reserves",
      hydrationCaption: "Selected operating margin:",
      urgencyLabel: "Must-do-today pressure",
      urgencyCaption: "Selected obligation severity:",
      composureLabel: "Errand-face stability",
      composureCaption: "Selected grocery-line resilience:",
      theatricsLabel: "Sympathy procurement instinct",
      theatricsCaption: "Selected injustice narration:",
      characterLabel: "Will you narrate this errand as unfair hardship?",
      characterOptions: [
        { value: 0, label: "No. I will complete it with ordinary dignity" },
        { value: 3, label: "I may mention the inconvenience once" },
        { value: 6, label: "Somewhat. I deserve gentle recognition" },
        { value: 9, label: "Yes. Witnesses should hear of this" },
        { value: 12, label: "Absolutely. This errand is institutional adversity" }
      ],
      buttonLabel: "File Sympathy Request"
    },
    evaluate: evaluateErrand
  }
};

const elements = {
  statusText: document.querySelector("#status-text"),
  locateButton: document.querySelector("#locate-button"),
  locationSelect: document.querySelector("#location-select"),
  toolTabs: Array.from(document.querySelectorAll(".tool-tab")),
  controlsForm: document.querySelector("#controls-form"),
  conditionsList: document.querySelector("#conditions-list"),
  resultEyebrow: document.querySelector("#result-eyebrow"),
  resultTitle: document.querySelector("#result-title"),
  resultScore: document.querySelector("#result-score"),
  resultRank: document.querySelector("#result-rank"),
  resultSummary: document.querySelector("#result-summary"),
  resultBreakdown: document.querySelector("#result-breakdown"),
  officeCode: document.querySelector("#office-code"),
  officeName: document.querySelector("#office-name"),
  officeNote: document.querySelector("#office-note"),
  resultsCard: document.querySelector("#results-card"),
  certificateText: document.querySelector("#certificate-text"),
  copyCertificateButton: document.querySelector("#copy-certificate-button"),
  fragilityLabel: document.querySelector("#fragility-label"),
  fragilityCaption: document.querySelector("#fragility-caption"),
  hydrationLabel: document.querySelector("#hydration-label"),
  hydrationCaption: document.querySelector("#hydration-caption"),
  urgencyLabel: document.querySelector("#urgency-label"),
  urgencyCaption: document.querySelector("#urgency-caption"),
  composureLabel: document.querySelector("#composure-label"),
  composureCaption: document.querySelector("#composure-caption"),
  theatricsLabel: document.querySelector("#theatrics-label"),
  theatricsCaption: document.querySelector("#theatrics-caption"),
  characterLabel: document.querySelector("#character-label"),
  recalculateButton: document.querySelector("#recalculate-button"),
  fragilityInput: document.querySelector("#fragility-input"),
  hydrationInput: document.querySelector("#hydration-input"),
  urgencyInput: document.querySelector("#urgency-input"),
  composureInput: document.querySelector("#composure-input"),
  theatricsInput: document.querySelector("#theatrics-input"),
  characterSelect: document.querySelector("#character-select"),
  fragilityOutput: document.querySelector("#fragility-output"),
  hydrationOutput: document.querySelector("#hydration-output"),
  urgencyOutput: document.querySelector("#urgency-output"),
  composureOutput: document.querySelector("#composure-output"),
  theatricsOutput: document.querySelector("#theatrics-output")
};

boot();

function boot() {
  bindEvents();
  syncFormOutputs();
  applyToolPresentation();
  loadWeather();
}

function bindEvents() {
  elements.locateButton.addEventListener("click", handleLocateClick);
  elements.copyCertificateButton.addEventListener("click", handleCopyCertificate);
  elements.locationSelect.addEventListener("change", handleLocationChange);

  elements.toolTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      appState.activeTool = tab.dataset.tool;
      updateToolTabs();
      applyToolPresentation();
      renderResult({ reveal: true });
    });
  });

  [
    [elements.fragilityInput, elements.fragilityOutput, "fragility"],
    [elements.hydrationInput, elements.hydrationOutput, "hydration"],
    [elements.urgencyInput, elements.urgencyOutput, "urgency"],
    [elements.composureInput, elements.composureOutput, "composure"],
    [elements.theatricsInput, elements.theatricsOutput, "theatrics"]
  ].forEach(([input, output, key]) => {
    input.addEventListener("input", () => {
      output.value = input.value;
      appState.formValues[key] = Number(input.value);
      markPendingChanges();
    });
  });

  elements.characterSelect.addEventListener("change", () => {
    appState.formValues.character = Number(elements.characterSelect.value);
    markPendingChanges();
  });

  elements.controlsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderResult({ reveal: true, scroll: true });
  });
}

function syncFormOutputs() {
  elements.fragilityOutput.value = elements.fragilityInput.value;
  elements.hydrationOutput.value = elements.hydrationInput.value;
  elements.urgencyOutput.value = elements.urgencyInput.value;
  elements.composureOutput.value = elements.composureInput.value;
  elements.theatricsOutput.value = elements.theatricsInput.value;
  updateRangeCaptions();
}

function handleLocationChange() {
  const nextLocation = PRESET_LOCATIONS[elements.locationSelect.value] || FALLBACK_LOCATION;
  appState.location = { ...nextLocation };
  setStatus(`Switching jurisdiction to ${appState.location.label} via the ${appState.location.jurisdiction}...`);
  loadWeather();
}

function markPendingChanges() {
  appState.hasPendingChanges = true;
  elements.resultsCard.classList.add("is-pending");
  setStatus("Inputs staged. Submit the case file when you are ready for a ruling.");
}

function applyToolPresentation() {
  const tool = toolConfigs[appState.activeTool];
  const controls = tool.controls;

  document.body.dataset.tool = appState.activeTool;
  elements.officeCode.textContent = tool.officeCode;
  elements.officeName.textContent = tool.officeName;
  elements.officeNote.textContent = tool.officeNote;
  elements.fragilityLabel.textContent = controls.fragilityLabel;
  elements.hydrationLabel.textContent = controls.hydrationLabel;
  elements.urgencyLabel.textContent = controls.urgencyLabel;
  elements.composureLabel.textContent = controls.composureLabel;
  elements.theatricsLabel.textContent = controls.theatricsLabel;
  elements.characterLabel.textContent = controls.characterLabel;
  elements.recalculateButton.textContent = controls.buttonLabel;
  renderCharacterOptions(controls.characterOptions);
  updateRangeCaptions();
}

function updateRangeCaptions() {
  const controls = toolConfigs[appState.activeTool].controls;
  elements.fragilityCaption.innerHTML = `${controls.fragilityCaption} <output id="fragility-output">${elements.fragilityInput.value}</output>/10`;
  elements.hydrationCaption.innerHTML = `${controls.hydrationCaption} <output id="hydration-output">${elements.hydrationInput.value}</output>/10`;
  elements.urgencyCaption.innerHTML = `${controls.urgencyCaption} <output id="urgency-output">${elements.urgencyInput.value}</output>/10`;
  elements.composureCaption.innerHTML = `${controls.composureCaption} <output id="composure-output">${elements.composureInput.value}</output>/10`;
  elements.theatricsCaption.innerHTML = `${controls.theatricsCaption} <output id="theatrics-output">${elements.theatricsInput.value}</output>/10`;
  elements.fragilityOutput = document.querySelector("#fragility-output");
  elements.hydrationOutput = document.querySelector("#hydration-output");
  elements.urgencyOutput = document.querySelector("#urgency-output");
  elements.composureOutput = document.querySelector("#composure-output");
  elements.theatricsOutput = document.querySelector("#theatrics-output");
}

function renderCharacterOptions(options) {
  const currentValue = String(appState.formValues.character);
  elements.characterSelect.innerHTML = options
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join("");

  const matching = options.some((option) => String(option.value) === currentValue);
  const nextValue = matching ? currentValue : String(options[Math.floor(options.length / 2)].value);
  elements.characterSelect.value = nextValue;
  appState.formValues.character = Number(nextValue);
}

async function handleLocateClick() {
  if (!navigator.geolocation) {
    setStatus(`This browser does not expose location access. Continuing with ${appState.location.label}.`);
    return;
  }

  setStatus("Requesting browser location for unnecessary evaluation...");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      appState.location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        label: "Your current location",
        jurisdiction: "Unscheduled Field Investigation Unit"
      };
      elements.locationSelect.value = "redwood-city";
      await loadWeather();
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        setStatus(`Browser location was denied. Continuing with ${appState.location.label}.`);
        return;
      }

      setStatus(`Browser location was unavailable. Continuing with ${appState.location.label}.`);
    },
    { enableHighAccuracy: false, timeout: 10000 }
  );
}

async function loadWeather() {
  setStatus(`Loading live conditions for ${appState.location.label} through the ${appState.location.jurisdiction}...`);

  try {
    const params = new URLSearchParams({
      latitude: String(appState.location.latitude),
      longitude: String(appState.location.longitude),
      current: [
        "temperature_2m",
        "apparent_temperature",
        "relative_humidity_2m",
        "wind_speed_10m",
        "wind_gusts_10m",
        "precipitation",
        "cloud_cover",
        "weather_code",
        "is_day"
      ].join(","),
      daily: ["uv_index_max", "precipitation_probability_max", "sunshine_duration"].join(","),
      forecast_days: "1",
      temperature_unit: "fahrenheit",
      wind_speed_unit: "mph",
      precipitation_unit: "inch",
      timezone: "auto"
    });

    const response = await fetch(`${WEATHER_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Weather request failed with ${response.status}`);
    }

    const payload = await response.json();
    appState.weather = normalizeWeather(payload);
    renderConditions();
    renderResult();
    setStatus(`${appState.location.jurisdiction} has authenticated conditions for ${appState.location.label}. The judgments are now official.`);
  } catch (error) {
    console.error(error);
    setStatus("Weather lookup failed, which is inconveniently real. Try again in a moment.");
    renderConditionsError();
    renderResultError();
  }
}

function normalizeWeather(payload) {
  const localHour = Number(payload.current.time.split("T")[1].slice(0, 2));
  const temperatureF = payload.current.temperature_2m;
  const apparentTemperatureF = payload.current.apparent_temperature;
  const windSpeedMph = payload.current.wind_speed_10m;
  const windGustsMph = payload.current.wind_gusts_10m;
  const precipitationInches = payload.current.precipitation;

  return {
    temperature: fahrenheitToCelsius(temperatureF),
    apparentTemperature: fahrenheitToCelsius(apparentTemperatureF),
    humidity: payload.current.relative_humidity_2m,
    windSpeed: mphToKmh(windSpeedMph),
    windGusts: mphToKmh(windGustsMph),
    precipitation: inchesToMillimeters(precipitationInches),
    displayTemperature: temperatureF,
    displayApparentTemperature: apparentTemperatureF,
    displayWindSpeed: windSpeedMph,
    displayWindGusts: windGustsMph,
    displayPrecipitation: precipitationInches,
    cloudCover: payload.current.cloud_cover,
    isDay: Boolean(payload.current.is_day),
    weatherCode: payload.current.weather_code,
    uvIndexMax: payload.daily.uv_index_max[0],
    precipitationProbability: payload.daily.precipitation_probability_max[0],
    sunshineDurationSeconds: payload.daily.sunshine_duration[0],
    localHour,
    timezone: payload.timezone,
    fetchedAt: payload.current.time
  };
}

function renderConditions() {
  if (!appState.weather) {
    return;
  }

  const sunlightHours = (appState.weather.sunshineDurationSeconds / 3600).toFixed(1);
  const weatherLabel = describeWeatherCode(appState.weather.weatherCode);

  const metrics = [
    ["Location", appState.location.label],
    ["Jurisdiction", appState.location.jurisdiction],
    ["Temperature", `${round(appState.weather.displayTemperature)}°F`],
    ["Feels Like", `${round(appState.weather.displayApparentTemperature)}°F`],
    ["UV Threat", `${round(appState.weather.uvIndexMax, 1)} / 11`],
    ["Wind", `${round(appState.weather.displayWindSpeed)} mph`],
    ["Rain Odds", `${round(appState.weather.precipitationProbability)}%`],
    ["Cloud Cover", `${round(appState.weather.cloudCover)}%`],
    ["Weather Code", weatherLabel],
    ["Humidity", `${round(appState.weather.humidity)}%`],
    ["Sunshine Budget", `${sunlightHours} h`]
  ];

  elements.conditionsList.innerHTML = metrics
    .map(
      ([label, value]) => `
        <div>
          <dt>${label}</dt>
          <dd>${value}</dd>
        </div>
      `
    )
    .join("");
}

function renderConditionsError() {
  elements.conditionsList.innerHTML = `
    <div>
      <dt>Service status</dt>
      <dd>Temporarily denied</dd>
    </div>
    <div>
      <dt>Official explanation</dt>
      <dd>The atmosphere is not cooperating</dd>
    </div>
  `;
}

function renderResult(options = {}) {
  const { reveal = false, scroll = false } = options;
  const tool = toolConfigs[appState.activeTool];
  elements.resultEyebrow.textContent = tool.eyebrow;
  elements.resultTitle.textContent = tool.title;

  if (!appState.weather) {
    renderResultError();
    return;
  }

  const result = tool.evaluate(appState.weather, appState.formValues);

  elements.resultScore.textContent = result.score;
  elements.resultRank.textContent = result.rank;
  elements.resultSummary.textContent = result.summary;
  elements.resultBreakdown.innerHTML = result.breakdown
    .map(
      (item) => `
        <li>
          <strong>${item.label}</strong>
          <span>${item.text}</span>
        </li>
      `
    )
    .join("");

  appState.certificateText = buildCertificateText(tool, result);
  elements.certificateText.textContent = appState.certificateText;
  elements.copyCertificateButton.textContent = "Copy Certificate";
  appState.hasPendingChanges = false;
  elements.resultsCard.classList.remove("is-pending");
  setStatus(`${tool.officeCode} has issued a finding for ${appState.location.label}.`);

  if (reveal) {
    triggerResultReveal(scroll);
  }
}

function createVariantSeed(weather, formValues, score = 0, salt = 0) {
  const locationBias = Math.round((appState.location.latitude + 90) * 10) + Math.round((appState.location.longitude + 180) * 10);
  const values = [
    Math.round(score),
    Math.round(weather.displayTemperature),
    Math.round(weather.displayApparentTemperature),
    Math.round(weather.displayWindSpeed * 10),
    Math.round(weather.precipitationProbability),
    Math.round(weather.cloudCover),
    Math.round(weather.uvIndexMax * 10),
    Math.round(weather.humidity),
    formValues.fragility * 11,
    formValues.hydration * 13,
    formValues.urgency * 17,
    formValues.composure * 19,
    formValues.theatrics * 23,
    formValues.character * 29,
    locationBias,
    salt
  ];

  return values.reduce((seed, value, index) => (seed * 131 + value + index) % 10000019, 17);
}

function pickVariant(options, weather, formValues, score = 0, salt = 0) {
  return options[createVariantSeed(weather, formValues, score, salt) % options.length];
}

function renderResultError() {
  elements.resultScore.textContent = "--";
  elements.resultRank.textContent = "Awaiting a working relationship with the weather service.";
  elements.resultSummary.textContent =
    "Without current conditions, the Bureau cannot fabricate its findings to Stanford-adjacent standards.";
  elements.resultBreakdown.innerHTML = "";
  appState.certificateText = "Awaiting certification.";
  elements.certificateText.textContent = appState.certificateText;
  elements.copyCertificateButton.textContent = "Copy Certificate";
  elements.resultsCard.classList.remove("is-pending");
}

function triggerResultReveal(scroll) {
  elements.resultsCard.classList.remove("is-revealed");
  void elements.resultsCard.offsetWidth;
  elements.resultsCard.classList.add("is-revealed");

  if (scroll) {
    elements.resultsCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

async function handleCopyCertificate() {
  const text = appState.certificateText;

  if (!text || text === "Awaiting certification.") {
    setStatus("No certificate is available to copy yet.");
    return;
  }

  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard API unavailable");
    }

    await navigator.clipboard.writeText(text);
    elements.copyCertificateButton.textContent = "Copied";
    setStatus("Official certificate copied to clipboard.");
  } catch (error) {
    console.error(error);
    elements.copyCertificateButton.textContent = "Copy Failed";
    setStatus("Clipboard access failed. The certificate is still visible for manual copying.");
  }
}

function evaluateHardship(weather, formValues) {
  const heatStrain = clamp(weather.apparentTemperature - 20, 0, 18) * 1.6;
  const uvStrain = weather.uvIndexMax * 3;
  const windStrain = weather.windSpeed * 0.35;
  const rainDread = weather.precipitationProbability * 0.1 + weather.precipitation * 8;
  const emotionalBonus =
    formValues.fragility * 2.8 +
    (10 - formValues.hydration) * 2 +
    formValues.character * 0.8 +
    formValues.theatrics * 1.4 +
    (10 - formValues.composure) * 1.2;
  const urgencyDiscount = formValues.urgency * 2;

  const score = Math.round(clamp(heatStrain + uvStrain + windStrain + rainDread + emotionalBonus - urgencyDiscount, 7, 96));
  const rank = pickVariant(
    score >= 82
      ? [
          "Heroic conditions. You deserve a tiny plaque for leaving the house.",
          "Catastrophically optional conditions. This outing now qualifies as an anecdote.",
          "Serious ceremonial adversity. A witness should initial your departure.",
          "Outdoor bravery has entered the record. Nobody asked for this, but it counts."
        ]
      : score >= 56
        ? [
            "Respectable adversity. Complaining is fully available to you.",
            "Moderate hardship. A dramatic sigh would be institutionally defensible.",
            "Visible inconvenience. You may describe this as character-building with a straight face.",
            "Officially annoying conditions. The Bureau will allow one overly formal grievance."
          ]
        : [
            "Low-grade hardship. You may still dramatize it if needed.",
            "Mild conditions. Your narrative will need assistance from tone alone.",
            "Administrative discomfort only. A tasteful overreaction remains available.",
            "Below-threshold suffering. You can still make it weird through performance."
          ],
    weather,
    formValues,
    score,
    11
  );

  return {
    score,
    rank,
    summary: hardshipSummary(score, weather, formValues),
    breakdown: [
      {
        label: pickVariant(["Solar burden", "Ultraviolet paperwork", "Sunlight grievance", "Daystar liability"], weather, formValues, score, 12),
        text: pickVariant([
          `A UV index of ${round(weather.uvIndexMax, 1)} justifies performative sighing.`,
          `The ultraviolet situation currently sits at ${round(weather.uvIndexMax, 1)}, which is high enough to support formal muttering.`,
          `${round(weather.uvIndexMax, 1)} on the UV ledger means the sun has joined the case as an unhelpful witness.`,
          `At ${round(weather.uvIndexMax, 1)}, the sky is behaving with enough confidence to warrant a memorandum.`
        ], weather, formValues, score, 13)
      },
      {
        label: pickVariant(["Emotional load", "Internal petition", "Personal complication filing", "Spirit overhead"], weather, formValues, score, 14),
        text: pickVariant([
          `Fragility, composure, and theatrics combine into a ${Math.round(emotionalBonus)}-point personal complication.`,
          `Your inner paperwork currently totals ${Math.round(emotionalBonus)} points of self-authored difficulty.`,
          `Between fragility and theatrical self-regard, you have filed ${Math.round(emotionalBonus)} points of subjective burden.`,
          `Your declared emotional settings contribute ${Math.round(emotionalBonus)} points of entirely preventable complexity.`
        ], weather, formValues, score, 15)
      },
      {
        label: pickVariant(["Atmospheric theatrics", "Meteorological staging", "Outdoor narrative cost", "Weather-related overproduction"], weather, formValues, score, 16),
        text: pickVariant([
          `${round(weather.displayWindSpeed)} mph winds and ${round(weather.precipitationProbability)}% rain odds make the outing feel narratively expensive.`,
          `The current mix of ${round(weather.displayWindSpeed)} mph wind and ${round(weather.precipitationProbability)}% rain odds suggests weather with opinions.`,
          `With ${round(weather.displayWindSpeed)} mph wind and rain odds at ${round(weather.precipitationProbability)}%, the atmosphere is clearly freelancing.`,
          `Wind at ${round(weather.displayWindSpeed)} mph plus ${round(weather.precipitationProbability)}% rain risk gives this trip a needlessly prestige tone.`
        ], weather, formValues, score, 17)
      }
    ]
  };
}

function evaluateVibes(weather, formValues) {
  const daylightMystique = weather.isDay ? 14 : 27;
  const cloudDrama = weather.cloudCover * 0.34;
  const breezeCinema = Math.min(weather.windSpeed, 26) * 1.1;
  const humidityOppression = weather.humidity * 0.2;
  const introspectionFuel = formValues.fragility * 3 + formValues.character * 1.4 + formValues.theatrics * 2 + formValues.composure * 1.2;
  const adminSuppression = formValues.urgency * 2.5;

  const score = Math.round(clamp(daylightMystique + cloudDrama + breezeCinema + humidityOppression + introspectionFuel - adminSuppression, 9, 98));
  const mode = score >= 72 ? "Cinematic" : score >= 46 ? "Complicatedly Main Character" : "Operationally Bland";

  return {
    score,
    rank: pickVariant([
      `${mode} conditions are in effect.`,
      `${mode} atmospheric permissions have been granted.`,
      `${mode} treatment is currently available without prior approval.`,
      `${mode} energy has passed administrative review.`
    ], weather, formValues, score, 31),
    summary: `${pickVariant([
      "The Bureau finds that the current mood is",
      "After reviewing the air, this panel classifies the day as",
      "Administrative mood review confirms conditions are",
      "The ambient record now reflects a"
    ], weather, formValues, score, 32)} ${mode.toLowerCase()} with ${describeWeatherCode(weather.weatherCode).toLowerCase()} in circulation. ${pickVariant([
      "Proceed as if your errands are part of a montage.",
      "You may now look out of one window and become briefly unavailable.",
      "A slow turn toward the horizon would not be challenged by this office.",
      "The atmosphere supports unnecessary introspection at this time."
    ], weather, formValues, score, 33)}`,
    breakdown: [
      {
        label: pickVariant(["Cloud dramaturgy", "Sky texture", "Overhead mood budget", "Cinematic ceiling"], weather, formValues, score, 34),
        text: pickVariant([
          `${round(weather.cloudCover)}% cloud cover contributes measurable atmosphere.`,
          `${round(weather.cloudCover)}% cloud cover gives the sky enough texture to imply history.`,
          `With cloud cover at ${round(weather.cloudCover)}%, the heavens are doing visible production design.`,
          `${round(weather.cloudCover)}% cloud presence supplies a respectable amount of overhead melancholy.`
        ], weather, formValues, score, 35)
      },
      {
        label: pickVariant(["Breeze credibility", "Hair movement authority", "Wind-borne subtext", "Minor gust dramaturgy"], weather, formValues, score, 36),
        text: pickVariant([
          `${round(weather.displayWindSpeed)} mph winds are enough to suggest internal conflict without causing paperwork.`,
          `${round(weather.displayWindSpeed)} mph wind supports a respectable amount of side-profile seriousness.`,
          `At ${round(weather.displayWindSpeed)} mph, the breeze is fully capable of implying a subplot.`,
          `${round(weather.displayWindSpeed)} mph wind creates just enough movement to suggest unspoken feelings.`
        ], weather, formValues, score, 37)
      },
      {
        label: pickVariant(["Administrative interference", "Calendar vandalism", "Scheduling contamination", "Bureaucratic mood leakage"], weather, formValues, score, 38),
        text: pickVariant([
          `Urgency reduces your available vibes budget by ${Math.round(adminSuppression)} points, even after your theatrics allowance.`,
          `Your calendar is currently deducting ${Math.round(adminSuppression)} points from the day's cinematic potential.`,
          `Administrative urgency has confiscated ${Math.round(adminSuppression)} points of otherwise usable atmosphere.`,
          `Even now, scheduling concerns are siphoning ${Math.round(adminSuppression)} points from your montage reserves.`
        ], weather, formValues, score, 39)
      }
    ]
  };
}

function evaluateLoitering(weather, formValues) {
  const shadeAdvantage = weather.cloudCover * 0.24;
  const thermalComposure = clamp(24 - Math.abs(weather.apparentTemperature - 19), 0, 24) * 1.8;
  const suspiciousSun = weather.uvIndexMax * -2.3;
  const fakePurpose = formValues.urgency * 4.5 + formValues.composure * 1.8;
  const innerDrift = formValues.fragility * 2.7 + formValues.character * 1.1 + formValues.theatrics * 1.4;

  const score = Math.round(clamp(thermalComposure + shadeAdvantage + suspiciousSun + fakePurpose + innerDrift, 4, 97));
  const rank =
    score >= 74
      ? "Certified to stand around with convincing intent."
      : score >= 48
        ? "Provisionally approved for mild drifting."
        : "Not licensed to linger without a beverage.";

  return {
    score,
    rank: pickVariant([
      rank,
      score >= 74 ? "Approved for lingering with professional-looking ambiguity." : score >= 48 ? "Temporary standing-around permission has been granted." : "Loitering credentials remain weak and mostly aspirational.",
      score >= 74 ? "Your posture now meets the threshold for sanctioned waiting." : score >= 48 ? "You may remain on site if you nod occasionally." : "You currently require a beverage or folder to survive scrutiny.",
      score >= 74 ? "The Bureau accepts your right to occupy space with confidence." : score >= 48 ? "Mild stationary legitimacy has been issued." : "Your stillness lacks paperwork and conviction."
    ], weather, formValues, score, 51),
    summary: `${pickVariant([
      "This bureau concludes that your present ability to look as though you belong somewhere is",
      "After review, your public standing-around legitimacy is",
      "The present record indicates your stationary credibility is",
      "Official observation suggests your ability to remain somewhere is"
    ], weather, formValues, score, 52)} ${score >= 74 ? "robust" : score >= 48 ? "fragile but serviceable" : "administratively weak"}. ${pickVariant([
      "Witnesses may assume you are waiting for something real.",
      "The optics are acceptable provided you do not overperform them.",
      "This remains a body-language problem more than a legal one.",
      "You may continue to stand there, but the margins are thin."
    ], weather, formValues, score, 53)}`,
    breakdown: [
      {
        label: pickVariant(["Thermal composure", "Temperature alibi", "Climate-assisted lingering", "Stillness support"], weather, formValues, score, 54),
        text: pickVariant([
          `A feels-like temperature of ${round(weather.displayApparentTemperature)}°F supports moderate stillness.`,
          `At ${round(weather.displayApparentTemperature)}°F, the air is cooperative enough to permit strategic pausing.`,
          `A feels-like reading of ${round(weather.displayApparentTemperature)}°F makes lingering technically survivable.`,
          `${round(weather.displayApparentTemperature)}°F is within the Bureau's acceptable range for standing somewhere with purpose-adjacent energy.`
        ], weather, formValues, score, 55)
      },
      {
        label: pickVariant(["Intent simulation", "Purpose projection", "Legitimacy posture", "Official-looking drift control"], weather, formValues, score, 56),
        text: pickVariant([
          `Administrative urgency and clipboard-free composure contribute ${Math.round(fakePurpose)} points of apparent legitimacy.`,
          `You have assembled ${Math.round(fakePurpose)} points of visible purpose from urgency and posture alone.`,
          `Composure plus urgency currently generate ${Math.round(fakePurpose)} points of plausible business.`,
          `${Math.round(fakePurpose)} points of legitimacy have been fabricated from stance, timing, and nerve.`
        ], weather, formValues, score, 57)
      },
      {
        label: pickVariant(["Public optics", "Suspicion management", "Ambient legitimacy", "Witness interpretation risk"], weather, formValues, score, 58),
        text: pickVariant([
          `${round(weather.cloudCover)}% cloud cover and a UV index of ${round(weather.uvIndexMax, 1)} determine whether you seem deliberate or merely stranded.`,
          `Current sky conditions leave a ${round(weather.cloudCover)}% chance you read as purposeful rather than abandoned.`,
          `With cloud cover at ${round(weather.cloudCover)}% and UV at ${round(weather.uvIndexMax, 1)}, your optics remain under administrative review.`,
          `The overhead environment is currently deciding whether your stillness looks intentional or just optimistic.`
        ], weather, formValues, score, 59)
      }
    ]
  };
}

function evaluateQueue(weather, formValues) {
  const commutePressure = queuePressure(weather.localHour);
  const rainAggravation = weather.precipitationProbability * 0.12 + weather.precipitation * 10;
  const humidityStall = weather.humidity * 0.08;
  const urgencyPenalty = formValues.urgency * 3.4;
  const fragilityMultiplier = formValues.fragility * 2.2 + formValues.theatrics * 1.8;
  const dignityLeak = (10 - formValues.hydration) * 1.5;
  const composurePenalty = (10 - formValues.composure) * 2.1;

  const score = Math.round(
    clamp(commutePressure + rainAggravation + humidityStall + urgencyPenalty + fragilityMultiplier + dignityLeak + composurePenalty, 8, 99)
  );
  const rank =
    score >= 80
      ? "Severe queue suffering. You are entitled to stare into the middle distance."
      : score >= 55
        ? "Moderate queue damage. Passive-aggressive pacing is justified."
        : "Manageable delay conditions. You may still overstate the story later.";

  return {
    score,
    rank: pickVariant([
      rank,
      score >= 80 ? "Queue conditions are now severe enough to mention at dinner." : score >= 55 ? "This line will feel targeted." : "Delay remains tolerable, but your retelling rights are preserved.",
      score >= 80 ? "A high-grade wait has been certified." : score >= 55 ? "Moderate line trauma has been preliminarily approved." : "Only low-level standing irritation is expected.",
      score >= 80 ? "The Bureau recognizes this as a queue with literary ambitions." : score >= 55 ? "This delay is rude but not yet legendary." : "The line is ordinary, which may actually offend you more."
    ], weather, formValues, score, 61),
    summary: `${pickVariant([
      `Based on local hour ${padHour(weather.localHour)}, current atmospheric drag, and your declared emotional state, this Bureau predicts that any line you enter will feel`,
      `After reviewing the hour ${padHour(weather.localHour)} and your personal tolerance filings, the Bureau expects queue conditions to feel`,
      `The waiting forecast for ${padHour(weather.localHour)} currently reads`,
      `Filed under delay assessment: any queue encountered near ${padHour(weather.localHour)} will likely feel`
    ], weather, formValues, score, 62)} approximately ${score >= 80 ? "mythic" : score >= 55 ? "personally rude" : "annoying in a usable way"}.`,
    breakdown: [
      {
        label: pickVariant(["Rush-hour inflation", "Chronological congestion", "Clock-based crowd fiction", "Time-slot hostility"], weather, formValues, score, 63),
        text: pickVariant([
          `The local time contributes ${Math.round(commutePressure)} points of imaginary crowd density.`,
          `At ${padHour(weather.localHour)}, the clock alone adds ${Math.round(commutePressure)} points of queue melodrama.`,
          `The current hour produces ${Math.round(commutePressure)} points of time-certified waiting pressure.`,
          `Your position in the day contributes ${Math.round(commutePressure)} points of crowd-related fiction.`
        ], weather, formValues, score, 64)
      },
      {
        label: pickVariant(["Atmospheric queue drag", "Humidity-assisted resentment", "Weather stall factor", "Clerical hostility index"], weather, formValues, score, 65),
        text: pickVariant([
          `${round(weather.humidity)}% humidity and ${round(weather.precipitationProbability)}% rain odds make waiting feel clerically hostile.`,
          `${round(weather.humidity)}% humidity gives this hypothetical line a damp administrative energy.`,
          `Humidity at ${round(weather.humidity)}% plus ${round(weather.precipitationProbability)}% rain risk creates textbook delay resentment.`,
          `The atmosphere is supplying enough moisture and uncertainty to make standing behind people feel personal.`
        ], weather, formValues, score, 66)
      },
      {
        label: pickVariant(["Personal erosion", "Inner queue collapse", "Patience leakage", "Self-authored delay damage"], weather, formValues, score, 67),
        text: pickVariant([
          `Urgency, fragility, composure loss, and hydration combine into ${Math.round(urgencyPenalty + fragilityMultiplier + dignityLeak + composurePenalty)} points of avoidable suffering.`,
          `Your personal settings contribute ${Math.round(urgencyPenalty + fragilityMultiplier + dignityLeak + composurePenalty)} points of line-specific deterioration.`,
          `${Math.round(urgencyPenalty + fragilityMultiplier + dignityLeak + composurePenalty)} points of your suffering are unfortunately homegrown.`,
          `Between urgency and internal instability, you have generated ${Math.round(urgencyPenalty + fragilityMultiplier + dignityLeak + composurePenalty)} points of queue damage before the queue even exists.`
        ], weather, formValues, score, 68)
      }
    ]
  };
}

function evaluateGravitas(weather, formValues) {
  const cloudAuthority = weather.cloudCover * 0.14;
  const breezeAuthority = Math.min(weather.windSpeed, 28) * 0.7;
  const thermalAuthority = clamp(22 - Math.abs(weather.apparentTemperature - 18), 0, 22) * 1.1;
  const twilightBonus = weather.isDay ? (weather.localHour >= 16 ? 9 : 2) : 14;
  const narrativeWeight = formValues.character * 1.6 + formValues.urgency * 1.4 + formValues.composure * 2 + formValues.theatrics * 1.3;

  const score = Math.round(
    clamp(cloudAuthority + breezeAuthority + thermalAuthority + twilightBonus + narrativeWeight, 11, 99)
  );
  const rank =
    score >= 78
      ? "Exceptional gravitas window. Enter a room as though minutes are being kept."
      : score >= 52
        ? "Moderate authority conditions. You can plausibly seem booked and difficult."
        : "Low gravitas. Delay any dramatic entrance until the atmosphere improves.";

  return {
    score,
    rank: pickVariant([
      rank,
      score >= 78 ? "A premium gravitas window is open. Walk briskly and imply strategy." : score >= 52 ? "You may plausibly seem important from medium range." : "Authority remains provisional and lighting-dependent.",
      score >= 78 ? "Executive-seeming conditions have been fully certified." : score >= 52 ? "Some transferable seriousness has been detected." : "Your presence currently reads more errand than summit.",
      score >= 78 ? "The hallway belongs to you for the next several minutes." : score >= 52 ? "The atmosphere will help if you do most of the work." : "This is not a strong day for unearned gravitas."
    ], weather, formValues, score, 71),
    summary: `The forecast indicates ${score >= 78 ? "rarely transferable authority" : score >= 52 ? "situational authority" : "limited executive presence"}. Current ${describeWeatherCode(weather.weatherCode).toLowerCase()} conditions ${pickVariant([
      "provide the backdrop for either a commanding entrance or an overcommitted errand.",
      "may support a decisive corridor crossing if you maintain pace.",
      "are lending your entrance more credibility than it technically deserves.",
      "have been deemed useful for brief, borrowed authority."
    ], weather, formValues, score, 72)}`,
    breakdown: [
      {
        label: pickVariant(["Cloud authority", "Overhead seriousness", "Sky-backed seniority", "Atmospheric boardroom cover"], weather, formValues, score, 73),
        text: pickVariant([
          `${round(weather.cloudCover)}% cloud cover supplies a measurable amount of overhead seriousness.`,
          `${round(weather.cloudCover)}% cloud cover gives the day enough weight to support decisive nodding.`,
          `The current cloud load adds a useful layer of executive-looking gravity.`,
          `${round(weather.cloudCover)}% of the sky is actively helping you seem booked.`
        ], weather, formValues, score, 74)
      },
      {
        label: pickVariant(["Coat movement potential", "Entrance wind support", "Fabric authority", "Outerwear credibility"], weather, formValues, score, 75),
        text: pickVariant([
          `${round(weather.displayWindSpeed)} mph wind is enough to imply plans, even if none exist.`,
          `At ${round(weather.displayWindSpeed)} mph, the breeze can plausibly escort a dramatic arrival.`,
          `${round(weather.displayWindSpeed)} mph wind supplies enough motion to suggest you were expected.`,
          `The current breeze gives even ordinary walking a faintly strategic silhouette.`
        ], weather, formValues, score, 76)
      },
      {
        label: pickVariant(["Narrative posture", "Perceived importance", "Boardroom self-fiction", "Authority fabrication"], weather, formValues, score, 77),
        text: pickVariant([
          `Urgency, composure, and self-mythologizing add ${Math.round(narrativeWeight)} points of apparent importance.`,
          `Your posture settings currently generate ${Math.round(narrativeWeight)} points of transferable importance.`,
          `${Math.round(narrativeWeight)} points of executive-seeming presence have been fabricated from pacing, nerve, and myth.`,
          `You are carrying ${Math.round(narrativeWeight)} points of authority that may or may not survive a direct question.`
        ], weather, formValues, score, 78)
      }
    ]
  };
}

function evaluateErrand(weather, formValues) {
  const exposureTax = weather.uvIndexMax * 1.9 + weather.windGusts * 0.22;
  const wetSockRisk = weather.precipitationProbability * 0.14 + weather.precipitation * 10;
  const thermalComplaint = Math.abs(weather.apparentTemperature - 20) * 1.5;
  const personalResistance = formValues.fragility * 2.4 + (10 - formValues.hydration) * 1.7 + (10 - formValues.composure) * 1.9;
  const characterMarkup = formValues.character * 0.8 + formValues.theatrics * 1.4;

  const score = Math.round(
    clamp(exposureTax + wetSockRisk + thermalComplaint + personalResistance + characterMarkup, 10, 99)
  );
  const rank =
    score >= 82
      ? "Full sympathy granted for this errand, regardless of how small it is."
      : score >= 57
        ? "Partial sympathy granted. Witnesses should nod when you return."
        : "Errand difficulty denied. The Bureau believes you will probably be fine.";

  return {
    score,
    rank: pickVariant([
      rank,
      score >= 82 ? "Full errand sympathy is now on file." : score >= 57 ? "A mid-tier sympathy allowance has been granted." : "No significant pity allocation will be issued today.",
      score >= 82 ? "This obligation has achieved ceremonial hardship status." : score >= 57 ? "This task is annoying enough to become conversational material." : "The task remains disappointingly manageable.",
      score >= 82 ? "Witnesses should prepare compassionate expressions." : score >= 57 ? "You may return from this errand with modest grievance rights." : "The Bureau regrets your errand is normal."
    ], weather, formValues, score, 81),
    summary: `After reviewing temperature, wind, rain probability, and your stated personal limitations, the Bureau rates today's task burden as ${score >= 82 ? "ceremonially oppressive" : score >= 57 ? "inconvenient enough to mention twice" : "unfortunately ordinary"}. ${pickVariant([
      "This finding may be cited in future domestic complaints.",
      "The record now reflects a formal level of put-upon energy.",
      "Proceed knowing your inconvenience has been archived.",
      "A certificate-backed sigh is now available upon completion."
    ], weather, formValues, score, 82)}`,
    breakdown: [
      {
        label: pickVariant(["Exposure tax", "Outdoor bureaucracy", "Errand weather surcharge", "External nuisance assessment"], weather, formValues, score, 83),
        text: pickVariant([
          `UV and gusts contribute ${Math.round(exposureTax)} points of outdoor bureaucracy.`,
          `The external environment has added ${Math.round(exposureTax)} points of unnecessary administrative friction.`,
          `${Math.round(exposureTax)} points of this errand are being caused by sunlight and gusts behaving like policy.`,
          `Weather exposure currently imposes a ${Math.round(exposureTax)}-point surcharge on ordinary responsibility.`
        ], weather, formValues, score, 84)
      },
      {
        label: pickVariant(["Wet sock scenario planning", "Precipitation anxiety", "Rain contingency theater", "Damp outcome forecasting"], weather, formValues, score, 85),
        text: pickVariant([
          `${round(weather.precipitationProbability)}% rain odds create an unnecessarily vivid errand narrative.`,
          `${round(weather.precipitationProbability)}% rain probability is enough to make you pre-annoyed.`,
          `Rain odds of ${round(weather.precipitationProbability)}% give this obligation a fully avoidable dramatic contour.`,
          `The weather has supplied just enough uncertainty to make your shoes part of the story.`
        ], weather, formValues, score, 86)
      },
      {
        label: pickVariant(["Personal resistance filing", "Subjective burden ledger", "Domestic reluctance markup", "Self-reported task resentment"], weather, formValues, score, 87),
        text: pickVariant([
          `Fragility, hydration, and character markup account for ${Math.round(personalResistance + characterMarkup)} points of subjective burden.`,
          `Your internal settings have generated ${Math.round(personalResistance + characterMarkup)} points of errand opposition.`,
          `${Math.round(personalResistance + characterMarkup)} points of this hardship appear to be artisanal and self-supplied.`,
          `Between reluctance and narrative markup, you have assembled ${Math.round(personalResistance + characterMarkup)} points of resistance.`
        ], weather, formValues, score, 88)
      }
    ]
  };
}

function hardshipSummary(score, weather, formValues) {
  const descriptor = describeWeatherCode(weather.weatherCode).toLowerCase();

  if (score >= 82) {
    return `${pickVariant([
      `Current ${descriptor} conditions produce a severe optional outing burden.`,
      `The present ${descriptor} situation has crossed into full ceremonial adversity.`,
      `Today's ${descriptor} conditions are behaving like a challenge coin for the overcommitted.`,
      `This ${descriptor} pattern has escalated the outing into a formal test of temperament.`
    ], weather, formValues, score, 91)} ${pickVariant([
      "Your bravery will be noted by nobody, but it remains real.",
      "No medal will be issued, which arguably deepens the injustice.",
      "Witness statements are optional, though emotionally appropriate.",
      "The Bureau will not stop you from acting as though history occurred here."
    ], weather, formValues, score, 92)}`;
  }

  if (score >= 56) {
    return `${pickVariant([
      `The Bureau recognizes today's ${descriptor} conditions as moderately character-building,`,
      `Administrative review finds today's ${descriptor} conditions inconvenient in a respectable way,`,
      `This office classifies current ${descriptor} conditions as narratively useful,`,
      `Today's ${descriptor} weather has been deemed annoying enough to matter,`
    ], weather, formValues, score, 93)} ${pickVariant([
      "especially for anyone with feelings.",
      "particularly if you intend to mention them later.",
      "with enough edge to support tasteful complaining.",
      "while remaining safely below actual crisis."
    ], weather, formValues, score, 94)}`;
  }

  return `${pickVariant([
    `Today's ${descriptor} conditions are manageable,`,
    `The current ${descriptor} pattern is annoyingly survivable,`,
    `This ${descriptor} weather remains within ordinary operating tolerances,`,
    `Present ${descriptor} conditions fail to support major grievance claims,`
  ], weather, formValues, score, 95)} ${pickVariant([
    "which should not prevent you from making them part of your narrative.",
    "though performance can still improve the story.",
    "but the right tone can still extract value from them.",
    "and yet the Bureau respects your right to frame them dramatically."
  ], weather, formValues, score, 96)}`;
}

function buildCertificateText(tool, result) {
  const breakdownLines = result.breakdown.map((item) => `- ${item.label}: ${item.text}`).join("\n");
  const certificateType = pickVariant([
    "Registrar-Style Finding",
    "Administrative Determination",
    "Ceremonial Case Resolution",
    "Officially Unnecessary Ruling"
  ], appState.weather, appState.formValues, result.score, 101);
  const filingLine = pickVariant([
    "Filed with complete sincerity and no practical benefit.",
    "Entered into the record with absurd seriousness.",
    "Archived for future generations of unnecessary administrators.",
    "Certified in a tone suggesting there should have been a committee."
  ], appState.weather, appState.formValues, result.score, 102);

  return [
    BUREAU_NAME.toUpperCase(),
    "Office of Publicly Useful Determinations",
    "",
    `Document Type: ${certificateType}`,
    `Tool: ${tool.eyebrow}`,
    `Location: ${appState.location.label}`,
    `Jurisdiction: ${appState.location.jurisdiction}`,
    `Recorded: ${formatRecordedTime(appState.weather)}`,
    `Score: ${result.score}`,
    `Rank: ${result.rank}`,
    "",
    `Summary: ${result.summary}`,
    "",
    "Breakdown:",
    breakdownLines,
    "",
    filingLine,
    BUREAU_DISCLAIMER
  ].join("\n");
}

function queuePressure(localHour) {
  if ((localHour >= 7 && localHour <= 9) || (localHour >= 16 && localHour <= 18)) {
    return 12;
  }

  if ((localHour >= 11 && localHour <= 13) || (localHour >= 19 && localHour <= 21)) {
    return 7;
  }

  return 3;
}

function padHour(localHour) {
  return `${String(localHour).padStart(2, "0")}:00`;
}

function updateToolTabs() {
  elements.toolTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.tool === appState.activeTool);
  });
}

function describeWeatherCode(code) {
  if (code === 0) {
    return "Clear sky";
  }

  if ([1, 2, 3].includes(code)) {
    return "Partly cloudy";
  }

  if ([45, 48].includes(code)) {
    return "Fog";
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return "Drizzle";
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return "Rain";
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return "Snow";
  }

  if ([95, 96, 99].includes(code)) {
    return "Thunderstorm";
  }

  return "Meteorologically ambiguous";
}

function setStatus(message) {
  elements.statusText.textContent = message;
}

function fahrenheitToCelsius(value) {
  return (value - 32) * (5 / 9);
}

function mphToKmh(value) {
  return value * 1.60934;
}

function inchesToMillimeters(value) {
  return value * 25.4;
}

function formatRecordedTime(weather) {
  if (!weather) {
    return "Pending atmospheric disclosure";
  }

  return `${weather.fetchedAt} (${weather.timezone})`;
}

function round(value, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}