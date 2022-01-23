var inputEl = document.getElementById("city");
var submitBtn = document.getElementById("submit-search");
var currentCityEl = document.querySelector(".current-city");
var fiveDayForcastEl = document.querySelector(".five-day-forecast");
var historyEl = document.querySelector(".history");
var latitude;
var longitude;
var searchCity;
var currentDate = moment().format("(M/D/YYYY)");
var prevWeatherCities = [];
var localStorageData = [];

function savePrevHistory() {
  if (!prevWeatherCities.includes(searchCity)) {
    prevWeatherCities.push(searchCity);
  }
  if (prevWeatherCities.length === 11) {
    prevWeatherCities.shift();
  }
  localStorage.setItem("prevCities", JSON.stringify(prevWeatherCities));
}

function getPrevHistory() {
  if (localStorage.getItem("prevCities") != null) {
    localStorageData = JSON.parse(localStorage.getItem("prevCities"));
  }
//   console.log(localStorageData);
  loadPrevHistory();
  prevWeatherCities = localStorageData;
}
getPrevHistory();

function loadPrevHistory() {
  localStorageData.forEach((element) => {
    historyEl.innerHTML +=
      "<button type='submit' data-city=" + element + ">" + element;
  });
}

function getLatLon() {
  var latLonApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchCity},US&limit=1&appid=f4d4536da514f2ce7b14e71927f09061`;
  fetch(latLonApiUrl).then((response) => {
    response.json().then((data) => {
      if (data.length === 0) {
        currentCityEl.innerHTML =
          "<h2>This is not a valid city! Please enter a valid city! </h2>";
          loadPrevHistory()
      } else {
        // console.log(data);
        latitude = data[0].lat;
        longitude = data[0].lon;
        searchCity = data[0].name;
        getWeatherInfo(latitude, longitude);
        savePrevHistory(searchCity);
        loadPrevHistory();
      }
    });
  });
}

function getWeatherInfo(latitude, longitude) {
  var cityWeatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=imperial&appid=f4d4536da514f2ce7b14e71927f09061`;
  fetch(cityWeatherApi).then((response) => {
    response.json().then((data) => {
    //   console.log(data);
      currentCityEl.innerHTML =
        "<h2>" +
        searchCity +
        " " +
        currentDate +
        "<img src=http://openweathermap.org/img/wn/" +
        data.current.weather[0].icon +
        "@2x.png>";
      currentCityEl.innerHTML +=
        "<p> Description: " + data.current.weather[0].description;
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
        document.getElementById(j).innerHTML =
          "<h3>" +
          moment()
            .add(j + 1, "day")
            .format("(M/D/YYYY)");
        document.getElementById(j).innerHTML +=
          "<img src=http://openweathermap.org/img/wn/" +
          data.daily[j].weather[0].icon +
          "@2x.png>";
        document.getElementById(j).innerHTML +=
          "<p> Description: " + data.daily[j].weather[0].description;
        document.getElementById(j).innerHTML +=
          "<p> Temp: " + data.daily[j].temp.day + "℉";
        document.getElementById(j).innerHTML +=
          "<p> Humidity: " + data.daily[j].humidity + " %";
        document.getElementById(j).innerHTML +=
          "<p> Wind: " + data.daily[j].wind_speed + " MPH";
      }
    });
  });
}

function displayWeatherHandler(event) {
  event.preventDefault();
  fiveDayForcastEl.innerHTML = "";
  currentCityEl.innerHTML = "";
  historyEl.innerHTML = "";
  searchCity = inputEl.value.trim();
  getLatLon();
}

function displayHistoryHandler(event) {
  event.preventDefault();
  var city = event.target.getAttribute("data-city");
  if (city) {
    searchCity = city;
    fiveDayForcastEl.innerHTML = "";
    currentCityEl.innerHTML = "";
    historyEl.innerHTML = "";
    getLatLon();
  }
}

submitBtn.addEventListener("click", displayWeatherHandler);
historyEl.addEventListener("click", displayHistoryHandler);
