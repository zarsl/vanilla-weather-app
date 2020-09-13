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

  console.log(response);
}

let apiKey = "4fb8f394cc5f2d439df6249cf258d6a4";
let root = "https://api.openweathermap.org/data/2.5/weather?";
let city = "Paris";
let units = "metric";
let apiUrl = `${root}q=${city}&appid=${apiKey}&units=${units}`;

axios.get(apiUrl).then(searchCity);
