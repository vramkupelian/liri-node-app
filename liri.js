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
var theQueryString ="";

for(var i = 3; i<process.argv.length; i++){
  theQueryString = theQueryString + process.argv[i] + " ";
}

theQueryString = JSON.stringify(theQueryString);

var switchboard = function(theCommand){
  switch (theCommand){
    case "my-tweets":
      getTweets();
      break;
    case "spotify-this-song":
      getSpotify();
      break;
    case "movie-this":
      getOMDB();
      break;
    case "do-what-it-says":
      doThingFromRandomTxt();
      break;
    default: 
      console.log("HUH?! WHAT?! COME AGAIN?!?!");        
  }
}

function getTweets(){
   var params = {screen_name: 'Oprah_FTW_free'};
      client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {

      for (var i=0; i < tweets.length; i++){
        console.log(tweets[i].text);
        console.log(tweets[i].created_at);
      }    
    }
  });
};

function getSpotify(){
   //spotify with promises
   spotify.search({ type: 'track', query: theQueryString })
   .then(function(response) {
     console.log("Song: " + JSON.stringify(response.tracks.items[0].name, null, 4));
     console.log("Artist: " + JSON.stringify(response.tracks.items[0].artists[0].name, null, 4));
     console.log("Album: " + JSON.stringify(response.tracks.items[0].album.name, null, 4));
     console.log("Preview URL: " + JSON.stringify(response.tracks.items[0].preview_url, null, 4));
 
     // console.log(JSON.stringify(response.tracks.items[0].album.name));
   })
   .catch(function(err) {
     console.log(err);
   });
};

function getOMDB(){
   if(!process.argv[3] ){
     theQueryString = "Mr Nobody";
   }
    console.log( theQueryString);
  var queryURL = "http://www.omdbapi.com/?apikey="+ APIkey +"&t=" + theQueryString;
 console.log(queryURL);
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

};

function doThingFromRandomTxt(){
  
  fs.readFile("random.txt" , "utf8", function (error, data){
      if(error){
        console.log(error);
        console.log("There was an error.");
      }

      var infoFromRandom = data.split(",");

      if(!infoFromRandom.length){
        console.log("infoFromRandom is empty");
      }
      
      theCommand = infoFromRandom[0];
      for(var i = 1; i<infoFromRandom.length; i++){
        theQueryString = theQueryString + infoFromRandom[1];
      }

      switchboard(theCommand);
    });
};


switchboard(theCommand);