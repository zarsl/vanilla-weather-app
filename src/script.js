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

  let localTimeElement = document.querySelector("#local-time");
  localTimeElement.innerHTML = formattedTime;
}

function getLocalTime(offset) {
  let date = new Date();
  let utc = date.getTime() + date.getTimezoneOffset() * 60000;
  let localTime = new Date(utc + offset * 1000); //offset in seconds from api, convert to miliseconds
  formatTime(localTime);
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
  getLocalTime(response.data.timezone);
}

function convertToCelsius() {
  let temperatureElement = document.querySelector("#temperature");
  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
  temperature.innerHTML = Math.round(celsiusTemperature);

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
  temperature.innerHTML = Math.round(fahrenheitTemperature);

  let windUnitsElement = document.querySelector("#wind-units");
  windUnitsElement.innerHTML = "mi/hr";

  let windSpeedElement = document.querySelector("#wind");
  windSpeedElement.innerHTML = Math.round(windSpeedImperial);
}

function searchCity(city) {
  let apiUrl = `${root}q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayCityOverview);
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

  let apiUrl = `${root}lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;

  axios.get(apiUrl).then(displayCityOverview);
}

function handleCurrentLocationSearch() {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentLocation);
}

let fahrenheitTemperature = null;
let windSpeedImperial = null;

let apiKey = "4fb8f394cc5f2d439df6249cf258d6a4";
let root = "https://api.openweathermap.org/data/2.5/weather?";
let units = "imperial";

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
