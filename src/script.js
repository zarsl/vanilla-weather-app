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

function searchCity(response) {
  let cityElement = document.querySelector("#city-header");
  cityElement.innerHTML = response.data.name;

  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(response.data.main.temp);

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = Math.round(response.data.main.humidity);

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);

  let descriptionElement = document.querySelector("#weather-description");
  descriptionElement.innerHTML = response.data.weather[0].description;

  getLocalTime(response.data.timezone);
}

let apiKey = "4fb8f394cc5f2d439df6249cf258d6a4";
let root = "https://api.openweathermap.org/data/2.5/weather?";
let city = "Paris";
let units = "metric";
let apiUrl = `${root}q=${city}&appid=${apiKey}&units=${units}`;

axios.get(apiUrl).then(searchCity);
