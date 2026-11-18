
const form = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const statusText = document.querySelector('#status');
const weatherCard = document.querySelector('#weather-card');
const searchButton = form.querySelector('button');

const weatherDescriptions = {
  0: ['Céu limpo', '☀️'],
  1: ['Predominantemente limpo', '🌤️'],
  2: ['Parcialmente nublado', '⛅'],
  3: ['Nublado', '☁️'],
  45: ['Nevoeiro', '🌫️'],
  48: ['Nevoeiro com geada', '🌫️'],
  51: ['Garoa leve', '🌦️'],
  53: ['Garoa moderada', '🌦️'],
  55: ['Garoa intensa', '🌧️'],
  61: ['Chuva leve', '🌦️'],
  63: ['Chuva moderada', '🌧️'],
  65: ['Chuva forte', '🌧️'],
  71: ['Neve leve', '🌨️'],
  73: ['Neve moderada', '🌨️'],
  75: ['Neve forte', '❄️'],
  80: ['Pancadas de chuva', '🌦️'],
  81: ['Pancadas moderadas', '🌧️'],
  82: ['Pancadas fortes', '⛈️'],
  95: ['Trovoadas', '⛈️'],
  96: ['Trovoadas com granizo', '⛈️'],
  99: ['Trovoadas fortes com granizo', '⛈️']
};

let requestNumber = 0;

function describeWeather(code) {
  return weatherDescriptions[code] ||
    ['Condição não identificada', '🌡️'];
}

function formatDay(dateString) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short'
  })
    .format(new Date(`${dateString}T12:00:00`))
    .replace('.', '');
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

async function getWeather(city, requestId) {
  const geoUrl = new URL(
    'https://geocoding-api.open-meteo.com/v1/search'
  );

  geoUrl.search = new URLSearchParams({
    name: city,
    count: '1',
    language: 'pt',
    format: 'json'
  });

  const geoResponse = await fetch(geoUrl);

  if (!geoResponse.ok) {
    throw new Error('Não foi possível pesquisar essa cidade.');
  }

  const geoData = await geoResponse.json();
  const place = geoData.results?.[0];

  if (!place) {
    throw new Error(
      'Cidade não encontrada. Confira a escrita e tente novamente.'
    );
  }

  const forecastUrl = new URL(
    'https://api.open-meteo.com/v1/forecast'
  );

  forecastUrl.search = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    forecast_days: '5',
    timezone: 'auto'
  });

  const forecastResponse = await fetch(forecastUrl);

  if (!forecastResponse.ok) {
    throw new Error(
      'Não foi possível carregar a previsão agora.'
    );
  }

  const data = await forecastResponse.json();

  // Impede que uma pesquisa antiga substitua a mais recente.
  if (requestId === requestNumber) {
    renderWeather(place, data);
  }
}

function renderWeather(place, data) {
  const current = data.current;

  const [description, icon] =
    describeWeather(current.weather_code);

  document.querySelector('#location').textContent =
    [place.name, place.admin1, place.country]
      .filter(Boolean)
      .join(', ');

  document.querySelector('#description').textContent =
    description;

  document.querySelector('#weather-icon').textContent =
    icon;

  document.querySelector('#temperature').textContent =
    `${Math.round(current.temperature_2m)}°`;

  document.querySelector('#feels-like').textContent =
    `${Math.round(current.apparent_temperature)}°C`;

  document.querySelector('#humidity').textContent =
    `${current.relative_humidity_2m}%`;

  document.querySelector('#wind').textContent =
    `${Math.round(current.wind_speed_10m)} km/h`;

  document.querySelector('#updated').textContent =
    `Atualizado em ${formatDateTime(current.time)}`;

  const forecast = document.querySelector('#forecast');

  forecast.replaceChildren();

  data.daily.time.forEach((date, index) => {
    const [dayDescription, dayIcon] =
      describeWeather(data.daily.weather_code[index]);

    const item = document.createElement('article');
    item.className = 'forecast-day';

    const day = document.createElement('span');
    day.className = 'day-name';
    day.textContent =
      index === 0 ? 'Hoje' : formatDay(date);

    const iconEl = document.createElement('span');
    iconEl.className = 'day-icon';
    iconEl.textContent = dayIcon;
    iconEl.setAttribute('aria-label', dayDescription);

    const label = document.createElement('small');
    label.className = 'day-desc';
    label.textContent = dayDescription;

    const temperatures = document.createElement('div');
    temperatures.className = 'day-temps';

    const max = document.createElement('span');
    max.className = 'max';
    max.textContent =
      `${Math.round(data.daily.temperature_2m_max[index])}°`;

    const min = document.createElement('span');
    min.className = 'min';
    min.textContent =
      `${Math.round(data.daily.temperature_2m_min[index])}°`;

    temperatures.append(max, min);

    item.append(day, iconEl, label, temperatures);

    forecast.append(item);
  });

  weatherCard.hidden = false;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) return;

  const requestId = ++requestNumber;

  searchButton.disabled = true;
  searchButton.textContent = 'Buscando...';

  statusText.classList.remove('error');
  statusText.textContent =
    'Consultando as condições do tempo...';

  try {
    await getWeather(city, requestId);

    if (requestId === requestNumber) {
      statusText.textContent = '';
    }
  } catch (error) {
    if (requestId === requestNumber) {
      statusText.textContent =
        error.message || 'Ocorreu um erro. Tente novamente.';

      statusText.classList.add('error');
    }
  } finally {
    if (requestId === requestNumber) {
      searchButton.disabled = false;
      searchButton.innerHTML =
        'Buscar <span aria-hidden="true">→</span>';
    }
  }
});

// Carrega São Paulo automaticamente ao abrir a página.
form.requestSubmit();
