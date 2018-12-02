var fs = require("fs");
require("dotenv").config();


var keys = require('./keys');
var moment = require('moment');

var request = require('request');
var rp = require('request-promise');

var nodeArgs = process.argv[2];
var nodeArgs2 = process.argv[3];
// take in concert-this
var concertThis = "";
// take in spotify-this-song
var spotifyThisSong = "";
// take in movie-this
var movieThis = "";
// take in do-what-it-says
var doWhatItSays = "";




// concert this
var concertThis = function (nodeArgs) {
    request("https://rest.bandsintown.com/artists/" + nodeArgs + "/events?app_id=codingbootcamp", function (error, response, body) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode);
            // var results = response;
        } else {
            var commandLine = "Node Command Action: node concert-this " + nodeArgs;
            var arr = JSON.parse(body);
            var divider = "\n------====--------====-------====------\n\n";
            var currentTime = "Time of log: " + moment().format("dddd, MM/DD/YYYY, HH:mm A") + "\n\n";
            var dataResults = `Venue Name: ${arr[0].venue.name}
        Venue Location: ${arr[0].venue.city}, ${arr[0].venue.region}, ${arr[0].venue.country}
        Event Date: ${moment(arr[0].datetime).format("MM/DD/YYYY")}`;

            console.log(`    =====-------=======-----======---===
    ${dataResults}
    =====--------=========-----====---===`);
        }
        //console.log(nodeArgs);
        let fileName = "log.txt";
        fs.appendFile(fileName, currentTime + commandLine + "\n\n" + dataResults + divider, function (err) {
            if (err) throw err;
            console.log('Your data was appended to the log.txt file');
        })
    });
};



var movieThis = function (nodeArgs) {

    request("http://www.omdbapi.com/?t=" + nodeArgs + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (error || (response.statusCode !== 200)) {
            var errorStr1 = 'ERROR: Retrieving OMDB entry -- ' + error;

            // Append the error string to the log file
            fs.appendFile('./log.txt', errorStr1, (err) => {
                if (err) throw err;
                console.log(errorStr1);
            });
            return;

        }
        else {
            var data = JSON.parse(body);
            if (!data.Title) {
                var errorStr2 = 'ERROR: No movie info retrieved, please check the spelling of the movie name!';

                // Append the error string to the log file
                fs.appendFile('./log.txt', errorStr2, function (err) {
                    if (err) throw err;
                    console.log(errorStr2);
                });
                return;
            }
            else {
                var outputStr = '------------------------\n' +
                    'Movie Information:\n' +
                    '------------------------\n\n' +
                    'Movie Title: ' + data.Title + '\n' +
                    'Year Released: ' + data.Released + '\n' +
                    'IMBD Rating: ' + data.imdbRating + '\n' +
                    'Rotten Tomatoes Rating: ' + data.tomatoRating + '\n' +
                    'Rotten Tomatoes URL: ' + data.tomatoURL + '\n'
                'Country Produced: ' + data.Country + '\n' +
                    'Language: ' + data.Language + '\n' +
                    'Plot: ' + data.Plot + '\n' +
                    'Actors: ' + data.Actors + '\n';


                // Append the output to the log file
                fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
                    if (err) throw err;
                    console.log(outputStr);
                })
            }
        };
    }
};





var spotifyThisSong = function (nodeArgs) {
    var spotify = new Spotify(keys.spotify);
    var spotify = require('spotify');

    spotify.search({ type: "track", limit: 1, query: nodeArgs }, function (err, data) {
        if (err) {
            var errorStr1 = ("ERROR: Retrieving Spotify track --  " + err);

            fs.appendFile('./log.txt', errorStr1, (err) => {
                if (err) throw err;
                console.log(errorStr1);
            });
            return;

        } else {
            var commandLine = "Node Command Action: spotify-this-song " + nodeArgs;
            var divider = "\n------====--------====-------====------\n\n";
            var currentTime = "Time of log: " + moment().format("dddd, MM/DD/YYYY, HH:mm A") + "\n\n";
            var results = data.track.items[0];
            var dataResults = `Artist(s): ${results.artist[0].name}
        Song Name: ${results.name}
        Link: ${reults.href}
        Album Name: ${results.album.name}`

            console.log(`    =====-------=======-----======---===
        ${dataResults}
        =====--------=========-----====---===`);
        }
        let fileName = "log.txt";
        fs.appendFile(fileName, currentTime + commandLine + "\n\n" + dataResults + divider, function (err) {
            if (err) throw err;
            console.log('Your data was appended to the log.txt file');
        })
    });
};

function conditions(a, b) {
    // console.log(b);
    // console.log(a);
    if (a === "concert-this") {
        concertThis(b);
    }
    if (a === "spotify-this-song") {
        spotifyThisSong(b);
    }
    if (a === "movie-this") {
        movieThis(b);
    }

    // if movie
    // if do

};
conditions(nodeArgs, nodeArgs2);
