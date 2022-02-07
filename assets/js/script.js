// Declarations
var searchInput = document.querySelector("#cityName");
var searchBtn = document.querySelector(".btn-info");
var oldCities = document.querySelector("#list-card");
var weather_icon = "http://openweathermap.org/img/w/";

// Create persistence
if (localStorage.getItem("key") && localStorage.getItem("key").length > 0) {
  var valueArr = [...localStorage.getItem("key").split(",")];
} else {
  var valueArr = [];
}
// Get Weather Data API
var getUserCity = function (cityName) {
  // Format the github API url
  var apiUrl =
    `https://api.openweathermap.org/data/2.5/weather?q=` +
    cityName +
    `&units=imperial&appid=4b9cf619ade932d30706497fcf318e67`;

  // Make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      //Request was successful
      if (response.ok) {
        response.json().then(function (data) {
          displayWeather(data);
          oneCall(data);
        });
      } else {
        alert("Error: GitHub User Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to GitHub");
    });
};

var displayWeather = function (data) {
  $(".current-weather")
    .children("#city-date")
    .html(`${data.name} (${moment().format("MM/DD/YYYY")})`);
  $("#weather-icon").attr("src", `${weather_icon}${data.weather[0].icon}.png`);
  $(".current-weather").children("#temp-dash").html(`Temp: ${data.main.temp}`);
  $(".current-weather")
    .children("#wind-dash")
    .html(`Wind: ${data.wind.speed} MPH`);
  $(".current-weather")
    .children("#humidity-dash")
    .html(`Humidity: ${data.main.humidity} %`);
};

// One Call API
var oneCall = function (data) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude={current,minutely,hourly,alerts}&units=imperial&appid=4b9cf619ade932d30706497fcf318e67`;

  //Make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      //Request was successful
      if (response.ok) {
        response.json().then(function (data) {
          $("#uv-dash")
            .html(`UV Index: ${data.current.uvi}`)
            .addClass("btn-success");
          for (let i = 1; i < data.daily.length - 2; i++) {
            $("#date-0" + i).html(
              "<h6>" + moment().add(i, "days").format("L") + "</h6>"
            );
            $("#icon-0" + i).attr(
              "src",
              `${weather_icon}${data.daily[i].weather[0].icon}.png`
            );
            $("#temp-0" + i).html(`Temp: ${data.daily[i].temp.day} °F`);
            $("#wind-0" + i).html(`Wind: ${data.daily[i].wind_speed} MPH`);
            $("#humidity-0" + i).html(`Humidity: ${data.daily[i].humidity} %`);
          }
          jsonData = data;
        });
      } else {
        alert("Error: GitHub User Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to GitHub");
    });
};

// save data to local storage
var saveLocalStorage = function (city) {
  valueArr.unshift(city);
  localStorage.setItem(`key`, valueArr);
};

// Click listener
function formHandler() {
  searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    var cityName = searchInput.value.trim();
    if (cityName) {
      $("#list-card").append(
        `<button class="search-hist col-12 btn btn-secondary mb-2" data-city="${cityName}">${cityName}</button>`
      );
      getUserCity(cityName);
      saveLocalStorage(cityName);
      searchInput.value = "";
    } else {
      alert("Sorry, please enter a valid city name!");
    }
  });
}

// backwards compatibility for past rendered cities
oldCities.addEventListener("click", function (event) {
  const city = event.target.textContent;
  getUserCity(city);
});

// load local storage data
var loadLocalStorage = function () {
  var getValue = localStorage.getItem("key");
  if (!getValue) {
    return false;
  }
  getValue = getValue.split(",");

  // loop through array and create search history buttons
  getValue.forEach(function (item) {
    $("#list-card").append(
      `<button class="search-hist col-12 btn btn-secondary mb-2" data-language="${item}">${item}</button>`
    );
  });
};

loadLocalStorage();
formHandler();
