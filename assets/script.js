var timerEl = $('#timer');
var messageEl = $('#message');

function getApi() {
  // fetch request gets a list of all the repos for the node.js organization
  var requestUrl ='http://api.positionstack.com/v1/forward?access_key=350b866358a2286c00d4e76f6864d744&query=17025';

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
        }
      }
     
    });
}
getApi()