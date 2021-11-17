// Declarations 
var searchInput = document.querySelector("#cityName");
var searchBtn = document.querySelector(".btn-info");

// var current = moment().add(day, 'days').format('L')
// console.log(current);




// Get Weather Data API
var getUserCity = function(cityName) {
// Format the github API url
var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=` + cityName + `&units=imperial&appid=4b9cf619ade932d30706497fcf318e67`; 
// console.log(apiUrl);

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
}

var displayWeather = function(data) {
$(".current-weather").children("h2").html(data.name);
$(".current-weather").children("#temp-dash").html(`Temp: ${data.main.temp}`);
$(".current-weather").children("#wind-dash").html(`Wind: ${data.wind.speed} MPH`);
$(".current-weather").children("#humidity-dash").html(`Humidity: ${data.main.humidity} %`)
}

 // One Call API
var oneCall = function(data){
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude={current,minutely,hourly,alerts}&units=imperial&appid=4b9cf619ade932d30706497fcf318e67`;
    
    //Make a request to the url
    fetch(apiUrl)
    .then(function (response) {
        //Request was successful
        if (response.ok) {
            response.json().then(function (data) {
                $('#uv-dash').html(`UV Index: ${data.current.uvi}`).addClass('btn-success');
                for (let i=1; i<data.daily.length -2; i++){
                    $('#date-0'+i).html('<h6>' + moment().add(i, 'days').format('L')  + '</h6>');
                    $('#temp-0'+i).html(`Temp: ${data.daily[i].temp.day} °F`);
                    $('#wind-0'+i).html(`Wind: ${data.daily[i].wind_speed} MPH`);
                    $('#humidity-0'+i).html(`Humidity: ${data.daily[i].humidity} %`)
                };
                jsonData = data;
                console.log(data);
    });
  } else {
    alert("Error: GitHub User Not Found");
  }
})
.catch(function (error) {
  alert("Unable to connect to GitHub");
});
}

// Event Delegation
/*var searchHistory = function(storage) {
    
    $("#city-buttons").on('click', function(){
    //if(storage.key === storage.value) {
        console.log(storage);
   // }
    })
}*/


// Click listener 
function formHandler() {
searchBtn.addEventListener("click", function(event){
event.preventDefault();
var cityName = searchInput.value.trim();
i = Math.floor(Math.random()* 3000);
if (cityName) {
    $("#city-buttons").append(`<button class="search-hist col-12 btn btn-secondary mb-2" data-language="${cityName}">${cityName}</button>`);
    var storage = localStorage.setItem(`key-${i}`, cityName);
    searchHistory(storage);
    getUserCity(cityName);
    searchInput.value = "";
}
else {
    alert("Sorry, please enter a valid city name!")
}
})
}

formHandler();