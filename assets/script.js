
var timerEl = document.querySelector('#timer');
var messageEl = document.querySelector('#message');
var zipB = document.querySelector("#zipButton");
var zipI = document.querySelector("#zipInput");
var radioButtons = document.querySelectorAll(".songs");
var audioEl = document.querySelector("#audio-element");

var testButton = document.querySelector("#testButton");

const audioFiles = ["./assets/assets_forestAudio.mp3",
      "./assets/beachWavesAudio.wav",
      "./assets/pianoAudio.wav",
      "./assets/rainAudio.mp3"];

var songChoice = 0;
var audioObject = new Audio(audioFiles[songChoice]);

var lat=9000;
var long=9000;
var sunsetTime="";

radioButtons.forEach( song => {
  song.addEventListener("click" , function() {
    songChoice = this.value;
    audioObject = new Audio(audioFiles[songChoice]);
  });
});

zipB.addEventListener("click", function() {
  var zipString = "" + zipI.value;
  var zipAcceptable = true;
  if(!(zipString.length===5)){
    zipAcceptable = false;
  } else{
    var numChars = "0123456789";
    
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
        console.log("Zip Code Unacceptable");
      }
    }
  }
    if(zipAcceptable){
      var requestUrl ='http://api.positionstack.com/v1/forward?access_key=350b866358a2286c00d4e76f6864d744&query='+zipString;

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
    } else {
      openBadZipModal();
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
      clearInterval(timerInterval);
      soundAlarm(songChoice);
    }

  }, 1000);
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

function openBadZipModal(){
  $("html").addClass("is-clipped");
  $("#bad-zip-modal").addClass("is-active");
}

function openAudioModal(){
  $("html").addClass("is-clipped");
  $("#sound-player-modal").addClass("is-active");
  audioObject.play();
}

$(".modal-close").click( function() {
  $("html").removeClass("is-clipped");
  $(this).parent().removeClass("is-active");
  audioObject.pause();
  audioObject.currentTime=0;
});

$(".modal-background").click( function() {
  $("html").removeClass("is-clipped");
  $(this).parent().removeClass("is-active");
  audioObject.pause();
  audioObject.currentTime=0;
});


// -----------------TESTING-REMOVE-------------
$("#testButton").click( function() {
  openAudioModal();
  console.log("testbtn click")
});
// -------------------------------------------------