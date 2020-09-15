function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
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
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let formattedTime = `${day} ${hours}:${minutes}`;

  return formattedTime;
}
function getTime(offset) {
  let date = new Date();
  let utc = date.getTime() + date.getTimezoneOffset() * 60000;
  let localTime = new Date(utc + offset * 1000); //offset in seconds from api, convert to miliseconds
  let formattedLocalTime = formatTime(localTime);
  let formattedLastUpdate = formatTime(date);

  let localTimeElement = document.querySelector("#local-time");
  localTimeElement.innerHTML = formattedLocalTime;

  let lastUpdateElement = document.querySelector("#last-update");
  lastUpdateElement.innerHTML = formattedLastUpdate;
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
  getTime(response.data.timezone);
}
function convertToCelsius() {
  let temperatureElement = document.querySelector("#temperature");
  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

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
      <div class="header">
        ${formatHours(forecast.dt * 1000)}
      </div>
        <img src="https://ssl.gstatic.com/onebox/weather/48/partly_cloudy.png" alt="Partly cloudy icon"/>
      <div class="footer">
        <span class="daily-high">
          ${Math.round(forecast.main.temp_max)}°
        </span><span class="daily-low">
        ${Math.round(forecast.main.temp_min)}°
      </span>
    </div>
  `;
  }
}
function formatWeeklyDate(date) {
  let dateArray = date.split("-");
  let month = dateArray[1];
  let monthDate = dateArray[2];
  return `${month}/${monthDate}`;
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
        <span class="daily-high">
          ${Math.round(forecastWeekly.app_max_temp)}°
        </span><span class="daily-low">
        ${Math.round(forecastWeekly.app_min_temp)}°
      </span>
    </div>
  `;
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
function getCurrentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiUrl = `${root}weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;

  axios.get(apiUrl).then(displayCityOverview);
  //need to handle this for hourly and weekly as well
}
function handleCurrentLocationSearch() {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentLocation);
}

let fahrenheitTemperature = null;
let windSpeedImperial = null;

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

searchCity("New York");
