require("dotenv").config();
const axios = require("axios");
const Spotify = require('node-spotify-api');
const moment = require('moment');
const keys = require('./keys.js');
const spotify = new Spotify(keys.spotify);
const liriCommand = process.argv[2];
const liriParam = process.argv[3];

switch(liriCommand) {
    case 'concert-this':
        axios.get("https://rest.bandsintown.com/artists/" + liriParam + "/events?app_id=codingbootcamp")
            .then(function(response) {
                if (response.data.length > 0) {
                    for (i=0; i<response.data.length; i++) {
                        console.log('\n-----------------\n');
                        console.log('Venue: ' + JSON.stringify(response.data[i].venue.name).replace(/^"(.+)"$/,'$1')
                            + '\nLocation: ' + JSON.stringify(response.data[i].venue.city).replace(/^"(.+)"$/,'$1') + ', ' + JSON.stringify(response.data[i].venue.region).replace(/^"(.+)"$/,'$1')
                            + '\nDate: ' + moment(JSON.stringify(response.data[i].datetime), 'YYYY-MM-DD-HH-mm-ss').format('MM/DD/YYYY'));
                        console.log('\n-----------------\n');
                    }
                }
                else {
                    console.log('\n-----------------\n');
                    console.log('No dates found for ' + liriParam + '.');
                    console.log('\n-----------------\n');
                }
            });
        break;

    case 'spotify-this-song':
        spotify
            .search({ type: 'track', query: liriParam })
            .then(function(response) {
                for (i=0; i < response.tracks.items.length; i++) {
                    let responseSongName = JSON.stringify(response.tracks.items[i].name);
                    if (responseSongName.toUpperCase().replace(/^"(.+)"$/,'$1').includes(liriParam.toUpperCase())) {
                        let previewUrl = JSON.stringify(response.tracks.items[i].preview_url);
                        if (previewUrl === 'null') {
                            previewUrl = 'Sorry, this song has no preview available.';
                        }
                        console.log('\n-----------------\n');
                        console.log('Artist: ' + JSON.stringify(response.tracks.items[i].artists[0].name).replace(/^"(.+)"$/,'$1')
                            + '\nSong: ' + JSON.stringify(response.tracks.items[i].name).replace(/^"(.+)"$/,'$1')
                            + '\nPreview URL: ' + previewUrl.replace(/^"(.+)"$/,'$1')
                            + '\nAlbum: ' + JSON.stringify(response.tracks.items[i].album.name).replace(/^"(.+)"$/,'$1'));
                        console.log('\n-----------------\n');
                        return;
                    }
                }
                spotify
                    .request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
                    .then(function(data) {
                        console.log('\n-----------------\n');
                        console.log('Sorry, couldn\'t find the song you are looking for. Enjoy this instead.\n'
                            + '\nArtist: ' + data.artists[0].name
                            + '\nSong: ' + data.name
                            + '\nPreview URL: ' + data.preview_url
                            + '\nAlbum: ' + data.album.name);
                        console.log('\n-----------------\n');
                    })
                    .catch(function(err) {
                        console.error('Error occurred: ' + err); 
                    });
                // console.log(JSON.stringify(response.tracks.items, null, 2));
                })
                .catch(function(err) {
                console.log(err);
            });
        break;

    case 'movie-this':
        break;

    case 'do-what-it-says':
        break;
    default:
        console.log('Sorry, your request could not be processed. Please try again');
}