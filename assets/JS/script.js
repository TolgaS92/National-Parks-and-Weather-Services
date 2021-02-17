function render() {
  $("#searchResults").hide();

  /* Function to cycle through the images on the homepage */
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

  /* Setting global variables */
  let state;
  let parkPicked = "";
  /* Getting the localstorage */
  let cityCodeSearched = JSON.parse(localStorage.getItem("city-code")) || [];
  //statecode function it calls the parks
  function trailFind() {
    const requestUrl = "https://developer.nps.gov/api/v1/parks?stateCode=" + state + "&api_key=egaEomzHPAgI7vA1qMt3Hl0c3Po2WGueGNbdExWh";

    fetch(requestUrl)
      .then(function (data) {
        return data.json();
      }).then(function (data) {
        for (let i = 0; i < data.data.length; i++) {
          let response = data.data[i];
          latitude = response.latitude;
          longitude = response.longitude;
          let imgParkCode = response.parkCode
          let divCell = $("<div>").addClass("cell");
          $(divCell).click(function () {
            //when I click on a park image then the recent adventures div is visible
            $(".recent-adventures").css("visibility", "visible");
          })
          /* creating the cards for the park results */
          let card = $("<div>").addClass("card");
          /* connecting the latitude and longitude to the images for the weather api */
          let imgSrc = $(`<img data-park="${imgParkCode}">`).addClass("image-Park").attr({
            "data-lati": latitude,
            "data-long": longitude
          });
          /* these if statements are grabbing images from the nps api */
          if (response.images[0] && response.images[0].url) {
            imgSrc.attr("src", response.images[0].url)
          }
          if (!response.images[0]) {
            imgSrc.attr("src", "./images/img_34.png")
          }
          let span = $("<span>").text("Click on image for details>>>");
          let divCardSection = $("<div>").addClass("card-section");
          let pTag = $("<a>").addClass("park-pointer").text(response.fullName).attr({
            href: response.url,
            target: '_blank'
          });
          /* appending park result card to the page */
          divCell.append(card);
          card.append(span, imgSrc, divCardSection);
          divCardSection.append(pTag);
          $("#parks").append(divCell);
        }
      })
  }

  /* Getting weather with the latitude and longitude from the park api */
  function weatherLatLon(parkLongtitude, parkLatitude) {
    let requestWeatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + parkLatitude + "&lon=" + parkLongtitude + "&units=imperial&appid=ca7c03ab6ebfee5c7d96f4deeccbecc0";

    fetch(requestWeatherUrl)
      .then(function (response) {
        return response.json();
      }).then(function (response) {
        for (let i = 0; i < 40; i += 8) {
          let days = response.list[i];
          let cardInit = $("<div>").addClass("whole");
          let cardDay = $("<div>").text(days.dt_txt.slice(0, 10));
          let degree = $("<p>").text(Math.round(days.main.temp) + "˚F");
          let humid = $("<p>").text("Humidity: " + days.main.humidity + "%");
          let wind = $("<p>").text("wind Speed: " + Math.round(days.wind.speed) + " mph");
          let icon = $("<img>");
          icon.attr("src", "http://openweathermap.org/img/wn/" + days.weather[0].icon + "@2x.png");
          $("#weather-for-park").append(cardInit.append(cardDay, degree, icon, humid, wind));
        }
      })
  }
  /* getting the park info from the chosen park */
  function trailChosen(parkPicked) {
    let chosenUrl = "https://developer.nps.gov/api/v1/parks?parkCode=" + parkPicked + "&stateCode=" + state + "&api_key=egaEomzHPAgI7vA1qMt3Hl0c3Po2WGueGNbdExWh";

    fetch(chosenUrl)
      .then(function (response) {
        return response.json();
      }).then(function (response) {
        $("#parkName").empty();
        $("#park-picture").empty();
        $("#operating-hours").empty();
        $("#entrance-fee").empty();
        $("#act-you-can").empty();
        $("#weather-for-park").empty();
        for (i = 0; i < response.data.length; i++) {
          let pickedParkName = $("<p>").text(response.data[i].fullName);
          $("#parkName").append(pickedParkName);
          let imageOfPark = $("<img>");
          if (response.data[i].images.length === 0
          ) {
            imageOfPark.attr("src", "./images/img_34.png")
          }
          else {
            imageOfPark.attr("src", response.data[i].images[0].url);
          }
          $("#park-picture").append(imageOfPark);
          let operatingHours = $("<p>").text(response.data[i].operatingHours[i].description);
          $("#operating-hours").append(operatingHours);
          let entFee = $("<p>");
          if (response.data[i].entranceFees[i].cost.length === 0) {
            entFee.text("There is No Fee information found")
          } else {
            entFee.text("$ " + response.data[i].entranceFees[i].cost);
          }
          $("#entrance-fee").append(entFee);
          let thingsToDo = response.data[i].activities;
          for (a = 0; a < thingsToDo.length; a++) {
            let activitiesLi = $("<li>").addClass("act-list").text(thingsToDo[a].name);
            $("#act-you-can").append(activitiesLi);
          }
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

  $("#SubmitBtn").on("click", function (event) {
    event.preventDefault();
    $("#recent-adv").css("display", "block");
    $("#searched").css("display", "block");
    $("#slide-show").hide();
    $("#search-bar").hide();
    $("#parks").empty();
    $("#searchResults").hide();
    $("#parks").show();
    state = $("#given-input").val().trim().toUpperCase();
    /* Adding the code that searched last into the searched list */
    if (!cityCodeSearched.includes(state)) {
      /* pushes the statecode you searched */
      (cityCodeSearched).push(state);
    }
    /* deletes the state code more than 4 */
    if (cityCodeSearched.length > 4) {
      /* pushes out the statecode you searched last more than 3 */
      cityCodeSearched.shift();
    }

    searchedStates()
    trailFind();
    /* Local Storage Stores for Searched States */
    localStorage.setItem("city-code", JSON.stringify(cityCodeSearched));
    $("#given-input").val("");
  })
  /* It makes the searched statecode as links */
  $(document).on("click", ".city-code", function () {
    state = $(this).text();
    $("#searchResults").hide();
    $("#parks").empty();
    $("#parkName").empty();
    $("#park-picture").empty();
    $("#act-you-can").empty();
    $("#operating-hours").empty();
    $("#entrance-fee").empty();
    $("#weather-for-park").empty();
    $("#parks").show();
    $(state).on("click", trailFind);
    trailFind();
  });

  /* hiding homepage elements and showing trail and weather infomation */
  $(document).on("click", ".image-Park", function () {
    $("#slide-show").hide();
    $("#parks").hide();
    $("#searchResults").show();
    let parkLatitude = $(this).data("lati");
    let parkLongtitude = $(this).data("long");
    let parkPicked = $(this).data("park");
    weatherLatLon(parkLongtitude, parkLatitude);
    trailChosen(parkPicked);
  })
  /* hides park info and shows homepage elements */
  $("#go-back-button").on("click", function () {
    $("#searchResults").hide();
    $("#parks").show();
    $("#parkName").empty();
    $("#park-picture").empty();
    $("#act-you-can").empty();
    $("#operating-hours").empty();
    $("#entrance-fee").empty();
    $("#weather-for-park").empty();
    $("#searchMat").css("display", "block");
  })
}
$(document).ready(render);