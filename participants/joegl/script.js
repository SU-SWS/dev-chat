const BUREAU_NAME = "Stanford Bureau of Useful Metrics";
const BUREAU_DISCLAIMER = "This is a parody office. It is not affiliated with or endorsed by Stanford University.";

const PRESET_LOCATIONS = {
  "redwood-city": {
    latitude: 37.4852,
    longitude: -122.2364,
    label: "Redwood City, CA"
  },
  stanford: {
    latitude: 37.4275,
    longitude: -122.1697,
    label: "Stanford, CA"
  },
  "palo-alto": {
    latitude: 37.4419,
    longitude: -122.143,
    label: "Palo Alto, CA"
  },
  "menlo-park": {
    latitude: 37.453,
    longitude: -122.1817,
    label: "Menlo Park, CA"
  },
  "san-francisco": {
    latitude: 37.7749,
    longitude: -122.4194,
    label: "San Francisco, CA"
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
    officeNote: "Taskmaster-grade scrutiny for conditions that objectively do not require this level of ceremony.",
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
      theatricsCaption: "Selected Taskmaster flourish:",
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
    officeNote: "Taskmaster logic, but applied to the wildly serious matter of standing behind other people.",
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
  setStatus(`Switching jurisdiction to ${appState.location.label}...`);
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
        label: "Your current location"
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
  setStatus(`Loading live conditions for ${appState.location.label}...`);

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
    setStatus(`Conditions loaded for ${appState.location.label}. The judgments are now official.`);
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

  return {
    score,
    rank: hardshipRank(score),
    summary: hardshipSummary(score, weather),
    breakdown: [
      {
        label: "Solar burden",
        text: `A UV index of ${round(weather.uvIndexMax, 1)} justifies performative sighing.`
      },
      {
        label: "Emotional load",
        text: `Fragility, composure, and theatrics combine into a ${Math.round(emotionalBonus)}-point personal complication.`
      },
      {
        label: "Atmospheric theatrics",
        text: `${round(weather.displayWindSpeed)} mph winds and ${round(weather.precipitationProbability)}% rain odds make the outing feel narratively expensive.`
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
    rank: `${mode} conditions are in effect.`,
    summary: `The Bureau finds that current conditions are ${mode.toLowerCase()} with a weather code of ${describeWeatherCode(weather.weatherCode).toLowerCase()}. Proceed as if your errands are part of a montage.`,
    breakdown: [
      {
        label: "Cloud dramaturgy",
        text: `${round(weather.cloudCover)}% cloud cover contributes measurable atmosphere.`
      },
      {
        label: "Breeze credibility",
        text: `${round(weather.displayWindSpeed)} mph winds are enough to suggest internal conflict without causing paperwork.`
      },
      {
        label: "Administrative interference",
        text: `Urgency reduces your available vibes budget by ${Math.round(adminSuppression)} points, even after your theatrics allowance.`
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
    rank,
    summary: `This bureau concludes that your present ability to look as though you belong somewhere is ${score >= 74 ? "robust" : score >= 48 ? "fragile but serviceable" : "administratively weak"}.`,
    breakdown: [
      {
        label: "Thermal composure",
        text: `A feels-like temperature of ${round(weather.displayApparentTemperature)}°F supports moderate stillness.`
      },
      {
        label: "Intent simulation",
        text: `Administrative urgency and clipboard-free composure contribute ${Math.round(fakePurpose)} points of apparent legitimacy.`
      },
      {
        label: "Public optics",
        text: `${round(weather.cloudCover)}% cloud cover and a UV index of ${round(weather.uvIndexMax, 1)} determine whether you seem deliberate or merely stranded.`
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
    rank,
    summary: `Based on local hour ${padHour(weather.localHour)}, current atmospheric drag, and your declared emotional state, this Bureau predicts that any line you enter will feel approximately ${score >= 80 ? "mythic" : score >= 55 ? "personally rude" : "annoying in a usable way"}.`,
    breakdown: [
      {
        label: "Rush-hour inflation",
        text: `The local time contributes ${Math.round(commutePressure)} points of imaginary crowd density.`
      },
      {
        label: "Atmospheric queue drag",
        text: `${round(weather.humidity)}% humidity and ${round(weather.precipitationProbability)}% rain odds make waiting feel clerically hostile.`
      },
      {
        label: "Personal erosion",
        text: `Urgency, fragility, composure loss, and hydration combine into ${Math.round(urgencyPenalty + fragilityMultiplier + dignityLeak + composurePenalty)} points of avoidable suffering.`
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
    rank,
    summary: `The forecast indicates ${score >= 78 ? "rarely transferable authority" : score >= 52 ? "situational authority" : "limited executive presence"}. Current ${describeWeatherCode(weather.weatherCode).toLowerCase()} conditions provide the backdrop for either a commanding entrance or an overcommitted errand.`,
    breakdown: [
      {
        label: "Cloud authority",
        text: `${round(weather.cloudCover)}% cloud cover supplies a measurable amount of overhead seriousness.`
      },
      {
        label: "Coat movement potential",
        text: `${round(weather.displayWindSpeed)} mph wind is enough to imply plans, even if none exist.`
      },
      {
        label: "Narrative posture",
        text: `Urgency, composure, and self-mythologizing add ${Math.round(narrativeWeight)} points of apparent importance.`
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
    rank,
    summary: `After reviewing temperature, wind, rain probability, and your stated personal limitations, the Bureau rates today's task burden as ${score >= 82 ? "ceremonially oppressive" : score >= 57 ? "inconvenient enough to mention twice" : "unfortunately ordinary"}.`,
    breakdown: [
      {
        label: "Exposure tax",
        text: `UV and gusts contribute ${Math.round(exposureTax)} points of outdoor bureaucracy.`
      },
      {
        label: "Wet sock scenario planning",
        text: `${round(weather.precipitationProbability)}% rain odds create an unnecessarily vivid errand narrative.`
      },
      {
        label: "Personal resistance filing",
        text: `Fragility, hydration, and character markup account for ${Math.round(personalResistance + characterMarkup)} points of subjective burden.`
      }
    ]
  };
}

function hardshipRank(score) {
  if (score >= 82) {
    return "Heroic conditions. You deserve a tiny plaque for leaving the house.";
  }

  if (score >= 56) {
    return "Respectable adversity. Complaining is fully available to you.";
  }

  return "Low-grade hardship. You may still dramatize it if needed.";
}

function hardshipSummary(score, weather) {
  const descriptor = describeWeatherCode(weather.weatherCode).toLowerCase();

  if (score >= 82) {
    return `Current ${descriptor} conditions produce a severe optional outing burden. Your bravery will be noted by nobody, but it remains real.`;
  }

  if (score >= 56) {
    return `The Bureau recognizes today's ${descriptor} conditions as moderately character-building, especially for anyone with feelings.`;
  }

  return `Today's ${descriptor} conditions are manageable, which should not prevent you from making them part of your narrative.`;
}

function buildCertificateText(tool, result) {
  const breakdownLines = result.breakdown.map((item) => `- ${item.label}: ${item.text}`).join("\n");

  return [
    BUREAU_NAME.toUpperCase(),
    "Office of Publicly Useful Determinations",
    "",
    `Tool: ${tool.eyebrow}`,
    `Location: ${appState.location.label}`,
    `Recorded: ${formatRecordedTime(appState.weather)}`,
    `Score: ${result.score}`,
    `Rank: ${result.rank}`,
    "",
    `Summary: ${result.summary}`,
    "",
    "Breakdown:",
    breakdownLines,
    "",
    "Filed with complete sincerity and no practical benefit.",
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