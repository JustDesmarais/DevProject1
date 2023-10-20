// API URL = https://api.rawg.io/api/
// API Key = 7aa60114ee68416ca8c8f9423e2bd0d3
// idURL = https://api.rawg.io/api/games/{id}?key=7aa60114ee68416ca8c8f9423e2bd0d3

//test API to keep visible in console
fetch('https://api.rawg.io/api/games?key=7aa60114ee68416ca8c8f9423e2bd0d3&search=hades')
        .then (function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
        .catch(err => {
            console.error(err);
        });

let storedGames = []; //array for stored game data

// js code wrapper to ensure everything loads properly
$(function () {

  /**function to pull game data from local storage
   * CAN BE BASE FOR DYNAMICALLY GENERATED GAME LIST
   */
  function retrieveGameData () {
    let retrievedGames = JSON.parse(localStorage.getItem('gameData'));

    if (retrievedGames !== null) {
      storedGames = retrievedGames;
    } else return;

    console.log(storedGames)
  }
  
  // Event listener and function for searching to pull in game options for user
  $(':button').click(function (e) {
    e.preventDefault();
    let apiURL = 'https://api.rawg.io/api/games?key=7aa60114ee68416ca8c8f9423e2bd0d3&search=' + $('input').val();
    $('input').val('');

    console.log(apiURL);
    fetch(apiURL)
        .then (function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            // Dynamically generate 10 options for user to choose from
            for(i=0; i < 10; i++) {
              let gameOption = $('<button>');

              gameOption.text(data.results[i].name + ", " + dayjs(data.results[i].released).format('YYYY'));
              gameOption.attr('data-id', data.results[i].id).attr('class', 'has-text-centered m-1').attr('id', 'game-selector' + [i]).attr('data-id', data.results[i].id).attr('data-release', data.results[i].released);

              $('#search-results').append(gameOption);              
            };

            $('#search-results').slideToggle('slow'); // Show search list
            $('[id*="game-selector"]').click(selectGame); // Add event listener to generated buttons
        })
        .catch(err => {
            console.error(err);
        });
    });

  // Function following click of final game option
  function selectGame (e) {
    e.preventDefault();

    let apiURL = 'https://api.rawg.io/api/games/' + $(this).data('id') + '?key=7aa60114ee68416ca8c8f9423e2bd0d3';
    $('#search-results').slideToggle('fast'); 

    fetch(apiURL)
        .then (function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            let description = data.description.split('</p>');

            $('h3').text(gameName);
            $('#game-img').attr('src', data.background_image);
            $('#genre').text('Genre: ' + data.genres[0].name);
            $('#released').text('Release Date: ' + dayjs(data.released).format('MMMM D, YYYY'));
            $('#description').append(description.shift() + '</p>');
        })
        .catch(err => {
            console.error(err);
        });

    // variables and function to add data to local storage
    let gameID = $(this).data('id');
    let gameRelease = $(this).data('release');
    let gameName = $(this).text();

    storedGames.push({gameID, gameRelease, gameName});
    localStorage.setItem('gameData', JSON.stringify(storedGames));
    console.log(storedGames);
    retrieveGameData();
    $('#search-results').empty();
  }

  retrieveGameData (); // Call function to pull data from local storage
});

//