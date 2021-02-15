//when i enter the homepage, I have the drop menu for each state
//an event listener for dropdown that populates a list for each state
//when i click on the state I want then i get a list of every park within my state
//populate the list with the info you get from the API, likely state and park as queries
//the park names become links to a new page that gives me the weather for that location and a picture and a link to the NPS park site
//we need the weather api to find the location of the chosen park and populate that data into the weatherBox on the html... somehow mapquest helps with this
//stored locally are 'Your recent adventures' which are the parks you looked at already
//at the bottom of the page you will always see 'Your recent adventures' to help you plan your vacation, recents populates of the picture of that park you looked at

/* Function below cycles through homepage photos */
let slideIndex = 0;
carousel();

function carousel() {
  var i;
  var x = document.getElementsByClassName("mySlides");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > x.length) { slideIndex = 1 }
  x[slideIndex - 1].style.display = "block";
  setTimeout(carousel, 6000); 
}

$(document).foundation();
// Global variables
let latitude;
let longitude;
let state;
/* Getting the localstorage */
let cityCodeSearched = JSON.parse(localStorage.getItem("city-code")) || [];
//statecode function it calls the parks
function trailFind() {
  const requestUrl = "https://developer.nps.gov/api/v1/parks?stateCode=" + state + "&api_key=egaEomzHPAgI7vA1qMt3Hl0c3Po2WGueGNbdExWh";
  /* Getting latitude and longitude for use in the weather api */
  fetch(requestUrl)
    .then(function (data) {
      return data.json();
    }).then(function (data) {
      $("#parks").empty();
      $("#fetch-weather").on("click", function () {
        weatherLatLon();
        $("#fetch-weather").css('display', 'none')
      })
      for (let i = 0; i < data.data.length; i++) {
        latitude = data.data[i].latitude;
        longitude = data.data[i].longitude;

        let response = data.data[i];
        localStorage.setItem(`nationalName-${i}`, response.fullName); 
        let divCell = $("<div>").addClass("cell");        
        let card = $("<div>").addClass("card");
        let imgSrc = $("<img>");
        //put id tag that goes on the img so that when it calls park chosen you can pass the id of what clicked into the park chosen function (this is the park code)
        
         
        if (response.images[0] && response.images[0].url) {
          imgSrc.attr("src", response.images[0].url);
          //how many images we have
          //math.floor.random
          //images.length
        }
        let divCardSection = $("<div>").addClass("card-section");
        let pTag = $("<a>").addClass("park-pointer").text(response.fullName).attr({
          href: response.url,
          target: '_blank'
        });
        /* Appending search results to the page */
        divCell.append(card);
        card.append(imgSrc, divCardSection);
        divCardSection.append(pTag);
        $("#parks").append(divCell);      
      }
      weatherLatLon();
    })
}


$("#SubmitBtn").on("click", function (event) {
  event.preventDefault();
  state = $("#given-input").val().trim().toUpperCase();
  /* Adding the code that searched last into the searched list */
  if (!cityCodeSearched.includes(state)) {
    /* pushes the statecode you searched */
    (cityCodeSearched).push(state);
  }
  /* deletes the state code more than 5 */
  if (cityCodeSearched.length > 3) {
    /* pushes out the statecode you searched last more than 3 */
    cityCodeSearched.shift();
  }
  searchedStates()
  $("#fetch-weather").css('display', 'block');
  trailFind();

  /* Local Storage Stores for Searched States */
  localStorage.setItem("city-code", JSON.stringify(cityCodeSearched));
  $("#given-input").val("");
})

/*Getting weather with the longitude and latitude obtained from the parks api */
function weatherLatLon() {
  const requestWeatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lon=" + longitude + "&lat=" + latitude + "&units=imperial&appid=ca7c03ab6ebfee5c7d96f4deeccbecc0";

  fetch(requestWeatherUrl)
    .then(function (data) {
      return data.json();
    }).then(function (data) {
      console.log(data);
      $("#fetch-five").empty();
      for (let i = 0; i < 40; i += 8) {
        let days = data.list[i];

        let cardInit = $("<div>").addClass("whole");
        let cardDay = $("<div>").text(days.dt_txt.slice(0, 10));
        let degree = $("<p>").text(Math.round(days.main.temp) + "˚F");
        let humid = $("<p>").text("Humidity: " + days.main.humidity + "%");
        let wind = $("<p>").text("wind Speed: " + Math.round(days.wind.speed) + " mph");
        let icon = $("<img>");
        icon.attr("src", "http://openweathermap.org/img/wn/" + days.weather[0].icon + "@2x.png");
        $("#fetch-five").append(cardInit.append(cardDay, degree, icon, humid, wind));
      }

    })
}

/* Seacrhed state code functıon appears ın the asıde )index.html */
function searchedStates() {
  $("#searched").empty();
  for (let i = 0; i < cityCodeSearched.length; i++) {
    let el = $("<p class='city-code'>").text("You have recently visited: ");
    el.attr("data", cityCodeSearched[i]);
    el.text(cityCodeSearched[i]);
    $("#searched").append(el);

  }

}

searchedStates();
/* It makes the searched statecode as links */
$(document).on("click", ".city-code", function () {
  state = $(this).text();
  $(state).on("click", trailFind)
  trailFind();
});
  //stored locally are 'Your recent adventures' which are the parks you looked at already