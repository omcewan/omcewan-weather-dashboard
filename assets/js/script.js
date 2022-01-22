var inputEl = document.getElementById("city");
var submitBtn = document.getElementById("submit-search");
var currentCityEl = document.querySelector(".current-city")
// var searchCity = "NewYork";
var currentDate = moment().format("(M/D/YYYY)")
console.log(currentDate)

function getCityWeather() {
    var cityWeatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=minutely,hourly,alerts&units=imperial&appid=f4d4536da514f2ce7b14e71927f09061`;
    fetch(cityWeatherApi).then((response) =>{
        response.json().then((data) => {
            console.log(data);
            currentCityEl.innerHTML =  "<h3>" + data["timezone"] + " " + currentDate
            currentCityEl.innerHTML += "<p> Temp: " + data.current.temp + "℉"
            currentCityEl.innerHTML += "<p> Wind: " + data.current.wind_speed + " MPH"
            currentCityEl.innerHTML += "<p> Humidity: " + data.current.humidity + " %"
            currentCityEl.innerHTML += "<p id='uvi'> UV Index: " + data.current.uvi
        })
    }) 
}

getCityWeather();