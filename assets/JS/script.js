//when i enter the homepage, I have the drop menu for each state
//an event listener for dropdown that populates a list for each state
//when i click on the state I want then i get a list of every park within my state
//populate the list with the info you get from the API, likely state and park as queries
//the park names become links to a new page that gives me the weather for that location and a picture and a link to the NPS park site
//we need the weather api to find the location of the chosen park and populate that data into the weatherBox on the html... somehow mapquest helps with this
//stored locally are 'Your recent adventures' which are the parks you looked at already
//at the bottom of the page you will always see 'Your recent adventures' to help you plan your vacation, recents populates of the picture of that park you looked at

//image carousel, not finished
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
  setTimeout(carousel, 2000); // Change image every 2 seconds
}

let state = "";
//statecode function it calls the parks
function trailFind() {
  const requestUrl = "https://developer.nps.gov/api/v1/parks?stateCode=" + state + "&api_key=egaEomzHPAgI7vA1qMt3Hl0c3Po2WGueGNbdExWh";

  fetch(requestUrl)
    .then(function (data) {
      return data.json();
    }).then(function (data) {
      console.log(data);
      console.log(data.data);
      for (let i = 0; i < data.data.length; i++) {
        console.log(data.data.length);
      }
    })
}

$("#SubmitBtn").on("click", function () {
  state = $("#given-input").val().trim();
  trailFind();
})


//weather api

//we need the weather api to find the location of the chosen park and populate that data into the weatherBox on the html... somehow mapquest helps with this
var longitude = "";
var latitude = "";

function weatherLatLon(){
  const requestWeatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lon=" + longitude + "&lat=" + latitude + "&appid=ca7c03ab6ebfee5c7d96f4deeccbecc0";

  fetch(requestWeatherUrl)
  .then(function(data){
    return data.json();
  }) .then(function(data){
    console.log(data);
  })
}

weatherLatLon();

//


//stored locally are 'Your recent adventures' which are the parks you looked at already
//at the bottom of the page you will always see 'Your recent adventures' to help you plan your vacation, recents populates of the picture of that park you looked at

 
