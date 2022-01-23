var inputEl = document.getElementById("city");
var submitBtn = document.getElementById("submit-search");
var currentCityEl = document.querySelector(".current-city");
var fiveDayForcastEl = document.querySelector(".five-day-forecast");
var latitude;
var longitude;
var searchCity = "";
var currentDate = moment().format("(M/D/YYYY)");

function getLatLon(searcCity) {
  var latLonApiUrl = `http://api.positionstack.com/v1/forward?access_key=0384ffba1373feef9d41f185c9d4d012&query=${searchCity}&country=US`;
  fetch(latLonApiUrl).then((response) => {
    response.json().then((data) => {
        console.log(data)
      latitude = data.data[0].latitude;
      longitude = data.data[0].longitude;
      getWeatherInfo(latitude, longitude);
    });
  });
}

function getWeatherInfo(latitude, longitude) {
  var cityWeatherApi =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&exclude=minutely,hourly,alerts&units=imperial&appid=f4d4536da514f2ce7b14e71927f09061";
  fetch(cityWeatherApi).then((response) => {
    response.json().then((data) => {
      console.log(data);
      currentCityEl.innerHTML = "<h2>" + searchCity + " " + currentDate + "<img src=http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png>" 
      currentCityEl.innerHTML += "<p> Description: " + data.current.weather[0].description
      currentCityEl.innerHTML += "<p> Temp: " + data.current.temp + "℉";
      currentCityEl.innerHTML +=
        "<p> Wind: " + data.current.wind_speed + " MPH";
      currentCityEl.innerHTML +=
        "<p> Humidity: " + data.current.humidity + " %";
      currentCityEl.innerHTML += "<p id='uvi'> UV Index: " + data.current.uvi;
      fiveDayForcastEl.innerHTML += "<h2> 5-Day Forecast:";
      for (let i = 0; i < 5; i++) {
        fiveDayForcastEl.innerHTML += `<div id=${i}>`;
      }
      for (let j = 0; j < 5; j++) {
        document.getElementById(j).innerHTML ="<h3>" + moment().add(j+1, "day").format("(M/D/YYYY)");
        document.getElementById(j).innerHTML += "<img src=http://openweathermap.org/img/wn/" + data.daily[j].weather[0].icon + "@2x.png>" 
        document.getElementById(j).innerHTML += "<p> Description: " + data.daily[j].weather[0].description
        document.getElementById(j).innerHTML += "<p> Temp: " + data.daily[j].temp.day + "℉"
        document.getElementById(j).innerHTML += "<p> Humidity: " + data.daily[j].humidity + " %"
        document.getElementById(j).innerHTML += "<p> Wind: " + data.daily[j].wind_speed + " MPH"
      }
    });
  });
}

function setSearchCityValue() {
  searchCity = inputEl.value.trim();
  searchCity = searchCity.toLowerCase();
  searchCity = searchCity.split("");
  searchCity[0] = searchCity[0].toUpperCase();
  searchCity = searchCity.join("");
}

function displayWeather() {
  while (fiveDayForcastEl.firstChild) {
    fiveDayForcastEl.removeChild(fiveDayForcastEl.firstChild);
  }
  while (currentCityEl.firstChild) {
    currentCityEl.removeChild(currentCityEl.firstChild);
  }
  setSearchCityValue();
  getLatLon(searchCity);
}

submitBtn.addEventListener("click", displayWeather);
