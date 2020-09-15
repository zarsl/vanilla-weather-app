function formatWeeklyDate(date) {
  let dateArray = date.split("-");
  let month = dateArray[1];
  let monthDate = dateArray[2];
  return `${month}/${monthDate}`;
}
function formatHours(timestamp) {
  let date = new Date(timestamp + offsetTimezone * 1000);
  let hours = date.getHours();

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let period = "AM";

  if (hours > 12) {
    hours = hours - 12;
    period = "PM";
  }

  return `${hours}:${minutes} ${period}`;
}
function formatTime(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  let hours = date.getHours();

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let period = "AM";

  if (hours > 12) {
    hours = hours - 12;
    period = "PM";
  }

  let formattedTime = `${day} ${hours}:${minutes} ${period}`;

  return formattedTime;
}
function getTime(offset) {
  let date = new Date();
  let utc = date.getTime() + date.getTimezoneOffset() * 60000;
  let localTime = new Date(utc + offset * 1000); //offset in seconds from api, convert to miliseconds
  let formattedLocalTime = formatTime(localTime);
  twelveHourLocalTime = formattedLocalTime;

  let formattedLastUpdate = formatTime(date);
  twelveHourLastUpdateTime = formattedLastUpdate;

  let localTimeElement = document.querySelector("#local-time");
  localTimeElement.innerHTML = formattedLocalTime;

  let lastUpdateElement = document.querySelector("#last-update");
  lastUpdateElement.innerHTML = formattedLastUpdate;
}
function convertToCelsius() {
  let temperatureElement = document.querySelector("#temperature");
  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  for (let index = 0; index < 6; index++) {
    let hourlyMaxElement = document.querySelector(
      `#forecast-hourly-max-${index}`
    );
    hourlyMaxElement.innerHTML = Math.round(
      ((forecastHourlyMax[index] - 32) * 5) / 9
    );
    let hourlyMinElement = document.querySelector(
      `#forecast-hourly-min-${index}`
    );
    hourlyMinElement.innerHTML = Math.round(
      ((forecastHourlyMin[index] - 32) * 5) / 9
    );
  }

  for (let index = 0; index < 7; index++) {
    let dailyMaxElement = document.querySelector(
      `#forecast-daily-max-${index}`
    );
    dailyMaxElement.innerHTML = Math.round(
      ((forecastDailyMax[index] - 32) * 5) / 9
    );
    let dailyMinElement = document.querySelector(
      `#forecast-daily-min-${index}`
    );
    dailyMinElement.innerHTML = Math.round(
      ((forecastDailyMin[index] - 32) * 5) / 9
    );
  }

  let windUnitsElement = document.querySelector("#wind-units");
  windUnitsElement.innerHTML = "m/s";

  let windSpeedElement = document.querySelector("#wind");
  windSpeedElement.innerHTML = Math.round(0.44704 * windSpeedImperial);
}
function convertToFahrenheit() {
  let temperatureElement = document.querySelector("#temperature");
  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

  for (let index = 0; index < 6; index++) {
    let hourlyMaxElement = document.querySelector(
      `#forecast-hourly-max-${index}`
    );
    hourlyMaxElement.innerHTML = Math.round(forecastHourlyMax[index]);

    let hourlyMinElement = document.querySelector(
      `#forecast-hourly-min-${index}`
    );
    hourlyMinElement.innerHTML = Math.round(forecastHourlyMin[index]);
  }

  for (let index = 0; index < 7; index++) {
    let dailyMaxElement = document.querySelector(
      `#forecast-daily-max-${index}`
    );
    dailyMaxElement.innerHTML = Math.round(forecastDailyMax[index]);

    let dailyMinElement = document.querySelector(
      `#forecast-daily-min-${index}`
    );
    dailyMinElement.innerHTML = Math.round(forecastDailyMin[index]);
  }

  let windUnitsElement = document.querySelector("#wind-units");
  windUnitsElement.innerHTML = "mi/hr";

  let windSpeedElement = document.querySelector("#wind");
  windSpeedElement.innerHTML = Math.round(windSpeedImperial);
}
function displayHourlyForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
    <div class="col-2 hourly-summary">
      <div class="header"><span id="hour-${index}">
        ${formatHours(forecast.dt * 1000)}</span>
      </div>
        <img src="https://ssl.gstatic.com/onebox/weather/48/partly_cloudy.png" alt="Partly cloudy icon"/>
      <div class="footer">
        <span class="daily-high"><span id="forecast-hourly-max-${index}">
          ${Math.round(forecast.main.temp_max)}</span>°
        </span><span class="daily-low"> <span id="forecast-hourly-min-${index}">
        ${Math.round(forecast.main.temp_min)}</span>°
      </span>
    </div>
  `;
    forecastHour[index] = formatHours(forecast.dt * 1000);
    forecastHourlyMax[index] = Math.round(forecast.main.temp_max);
    forecastHourlyMin[index] = Math.round(forecast.main.temp_min);
  }
}
function displayWeeklyForecast(response) {
  let forecastWeeklyElement = document.querySelector("#forecast-weekly");
  forecastWeeklyElement.innerHTML = null;
  let forecastWeekly = null;

  for (let index = 0; index < 7; index++) {
    forecastWeekly = response.data.data[index];
    forecastWeeklyElement.innerHTML += `
    <div class="daily-summary">
      <div class="header">
        ${formatWeeklyDate(forecastWeekly.datetime)}
      </div>
        <img src="https://ssl.gstatic.com/onebox/weather/48/partly_cloudy.png" alt="Partly cloudy icon"/>
      <div class="footer">
        <span class="daily-high"><span id="forecast-daily-max-${index}">
          ${Math.round(forecastWeekly.app_max_temp)}</span>°
        </span><span class="daily-low"><span id="forecast-daily-min-${index}">
        ${Math.round(forecastWeekly.app_min_temp)}</span>°
      </span>
    </div>
  `;
    forecastDailyMax[index] = Math.round(forecastWeekly.app_max_temp);
    forecastDailyMin[index] = Math.round(forecastWeekly.app_min_temp);
  }
}
function searchCity(city) {
  let apiUrl = `${root}weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayCityOverview);

  apiUrl = `${root}forecast?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayHourlyForecast);

  apiUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${apiKeyWeeklyForecast}&units=${unitsWeekly}`;
  axios.get(apiUrl).then(displayWeeklyForecast);
}
function handleCitySearch() {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let city = cityInput.value;
  city = city.trim().toLowerCase();
  searchCity(city);
}
function displayCityOverview(response) {
  let cityElement = document.querySelector("#city-header");
  cityElement.innerHTML = response.data.name;

  let temperatureElement = document.querySelector("#temperature");
  fahrenheitTemperature = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = Math.round(response.data.main.humidity);

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);
  windSpeedImperial = response.data.wind.speed;

  let descriptionElement = document.querySelector("#weather-description");
  descriptionElement.innerHTML = response.data.weather[0].description;
  offsetTimezone = response.data.timezone;
  getTime(response.data.timezone);
}
function getCurrentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiUrl = `${root}weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;

  axios.get(apiUrl).then(displayCityOverview);
}
function handleCurrentLocationSearch() {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentLocation);
}

function handleTwelveHourConversion(response) {
  let twelveHourElement = document.querySelector("#twelve-hr");
  let twentyFourHourElement = document.querySelector("#twenty-four-hr");
  twelveHourElement.classList.add("active");
  twentyFourHourElement.classList.remove("active");

  for (let index = 0; index < 6; index++) {
    let hourElement = document.querySelector(`#hour-${index}`);
    hourElement.innerHTML = forecastHour[index];
  }

  let localTimeElement = document.querySelector("#local-time");
  localTimeElement.innerHTML = twelveHourLocalTime;

  let lastUpdateElement = document.querySelector("#last-update");
  lastUpdateElement.innerHTML = twelveHourLastUpdateTime;
}

function handleTwentyFourHourConversion(response) {
  let twelveHourElement = document.querySelector("#twelve-hr");
  let twentyFourHourElement = document.querySelector("#twenty-four-hr");
  twelveHourElement.classList.remove("active");
  twentyFourHourElement.classList.add("active");

  for (let index = 0; index < 6; index++) {
    let hourElement = document.querySelector(`#hour-${index}`);
    let hours = forecastHour[index].split(":")[0];

    if (hours < 12 && forecastHour[index].split(" ")[1] === "PM") {
      hours = parseInt(hours) + 12;
    } else if (hours < 10) {
      hours = `0${hours}`;
    }

    let mins = forecastHour[index].split(":")[1];
    mins = mins.substring(0, 2);

    hourElement.innerHTML = `${hours}:${mins}`;
  }

  let localTimeElement = document.querySelector("#local-time");
  let hours = twelveHourLocalTime.split(" ")[1].split(":")[0];
  if (hours < 12 && twelveHourLocalTime.split(" ")[2] === "PM") {
    hours = parseInt(hours) + 12;
  } else if (hours < 10) {
    hours = `0${hours}`;
  }

  let mins = twelveHourLocalTime.split(" ")[1].split(":")[1];

  let day = twelveHourLocalTime.split(" ")[0];

  localTimeElement.innerHTML = `${day} ${hours}:${mins}`;

  let lastUpdateElement = document.querySelector("#last-update");

  hours = twelveHourLastUpdateTime.split(" ")[1].split(":")[0];
  if (hours < 12 && twelveHourLastUpdateTime.split(" ")[2] === "PM") {
    hours = parseInt(hours) + 12;
  } else if (hours < 10) {
    hours = `0${hours}`;
  }

  mins = twelveHourLastUpdateTime.split(" ")[1].split(":")[1];

  day = twelveHourLastUpdateTime.split(" ")[0];

  lastUpdateElement.innerHTML = `${day} ${hours}:${mins}`;
}
let fahrenheitTemperature = null;
let windSpeedImperial = null;
let forecastHourlyMax = [];
let forecastHourlyMin = [];
let forecastDailyMax = [];
let forecastDailyMin = [];
let forecastHour = [];
let twelveHourLocalTime = [];
let twelveHourLastUpdateTime = null;
let offsetTimezone = null;

let apiKey = "4fb8f394cc5f2d439df6249cf258d6a4";
let apiKeyWeeklyForecast = "e7fcc27adc98427b8d2d01e1ce75ad7e";
let root = "https://api.openweathermap.org/data/2.5/";
let units = "imperial";
let unitsWeekly = "i";

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let citySearchElement = document.querySelector("#city-search-button");
citySearchElement.addEventListener("click", handleCitySearch);

let currentLocationSearchElement = document.querySelector(
  "#current-location-button"
);
currentLocationSearchElement.addEventListener(
  "click",
  handleCurrentLocationSearch
);

let twelveHourElement = document.querySelector("#twelve-hr");
twelveHourElement.addEventListener("click", handleTwelveHourConversion);

let twentyFourHourElement = document.querySelector("#twenty-four-hr");
twentyFourHourElement.addEventListener("click", handleTwentyFourHourConversion);

searchCity("New York");
