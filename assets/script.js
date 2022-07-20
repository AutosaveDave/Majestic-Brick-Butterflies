var timerEl = document.querySelector('#timer');
var messageEl = document.querySelector('#message');
var zipB = document.querySelector("#zipButton");
var zipI = document.querySelector("#zipInput");
var radioButtons = document.querySelectorAll(".songs");

var songChoice = 1;

var lat=9000;
var long=9000;
var sunsetTime="";

radioButtons.forEach( song => {
  song.addEventListener("click" , function() {
    songChoice = this.value;
    console.log(songChoice);
  });
});

zipB.addEventListener("click", function() {
  var zipString = "" + zipI.value;
  console.log(zipString);
  if(zipString.length===5){
    var numChars = "0123456789";
    var zipAcceptable = true;
    var digitAcceptable = false
    for(i = 0 ; i < zipString.length && zipAcceptable ; i++){
      digitAcceptable = false;
      for(j = 0 ; j < numChars.length && !digitAcceptable ; j++){
        if(zipString.charAt(i) === numChars.charAt(j)){
          digitAcceptable = true;
        }
      }
      if(!digitAcceptable){
        zipAcceptable = false;
        console.log("Zip Code Unacceptable")
      }
    }

    if(zipAcceptable){
      var requestUrl ='http://api.positionstack.com/v1/forward?access_key=350b866358a2286c00d4e76f6864d744&query='+zipString;

    
      // fetch request gets a list of all the repos for the node.js organization
      fetch(requestUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          var data = response.data
          //Loop over the data to generate a table, each table row will have a link to the repo url
          for (var i = 0; i < data.length; i++) {
            if ( data[i].country_code === 'USA') {
              var lat = data[i].latitude
              var long = data[i].longitude
              console.log(lat)
              console.log(long)
              getSunset(lat , long);
            }
          }
        
        });
      }
    }
});

function getSunset(latitude , longitude) {
  requestUrl ='https://api.sunrise-sunset.org/json?' + "lat=" + latitude + "&lng=" + longitude;
  console.log(requestUrl);
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var currentTime = new Date(Date.now());
      var currentTimeMs = currentTime.getTime();
      var sunsetTime = new Date(currentTime.toDateString() + " " + data.results.sunset+" UTC");
      var sunsetTimeMs = sunsetTime.getTime();
      localStorage.setItem("sunsetTimeMs", sunsetTimeMs);
      var timer = sunsetTimeMs - currentTimeMs;

      if(timer < 0){
        timer+=1000*60*60*24;
      }

      timer = Math.floor(timer/1000);
      
      initTimer(timer);
    });
}

function initTimer(countdown) {
  var timerInterval = setInterval(function() {
    countdown--;
    timerEl.textContent = "Sunset in " + timerString(countdown);
    if(countdown === 0) {
      clearInterval(countdown);
      soundAlarm(songChoice);
    }

  }, 1000);
}

function soundAlarm(songChoice) {
  switch(songChoice){
    case 1:

    break;

    case 2:

    break;

    case 3:

    break;

    case 4:

    break;

    default:

  }
}

function timerString(timer) {
  var timerSec = timer % 60;    timer = Math.floor(timer/60);
  var timerMin = timer % 60;    timer = Math.floor(timer/60);
  var timerHr = timer;

  var timerText = "";
  
  timerText += timerHr + ":";
  if(timerMin<10){
    timerText += "0";
  }
  timerText += timerMin + ":";
  if(timerSec<10){
    timerText += "0";
  }
  timerText += timerSec;
  
  return timerText;
}