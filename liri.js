var dotenv = require('dotenv').config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");
var keys = require("./keys.js");

// //keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var APIkey = keys.OMDB;

var theCommand = process.argv[2];

if(theCommand === "my-tweets"){
  //twitter
  var params = {screen_name: 'Oprah_FTW_free'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {

      for (var i=0; i < tweets.length; i++){
        console.log(tweets[i].text);
        console.log(tweets[i].created_at);
      }    
    }
  });
}

if(theCommand === "spotify-this-song"){

  var theQueryArray =[];
  var theQueryString ="";

  for(var i = 3; i<process.argv.length; i++){
    theQueryString = theQueryString + process.argv[i] + " ";
  }

  theQueryString = JSON.stringify(theQueryString);
  console.log(typeof theQueryString);
  console.log(theQueryString);
  //spotify with promises
  spotify.search({ type: 'track', query: theQueryString })
  .then(function(response) {
    console.log(JSON.stringify(response.tracks.items[0], null, 4));
    // console.log(JSON.stringify(response.tracks.items[0].album.name));
  })
  .catch(function(err) {
    console.log(err);
  });

}

if(theCommand === "movie-this"){
   var theQueryString ="";

   if(!process.argv[3]){
     theQueryString = "Mr Nobody";
    }
   else{
      for(var i = 3; i<process.argv.length; i++){
        theQueryString = theQueryString + process.argv[i] + " ";
      }
    }
  
  theQueryString = JSON.stringify(theQueryString);
  
  var queryURL = "http://www.omdbapi.com/?apikey="+ APIkey +"&t=" + theQueryString;
 
  request(queryURL, function (error, response, body){
    if(!error && response.statusCode === 200){
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language(s): " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    }
    if (error){
      console.log(error);
    }
  })

}

if(theCommand === "do-what-it-says"){



}
