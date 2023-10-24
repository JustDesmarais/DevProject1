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

  // function updateTime() {
  //   var today = dayjs();
  //   $('#timer').text(today.format('dddd, MMMM D, YYYY h:mm:ss A'));
  //   const currentDate = dayjs().format('dddd, MMMM D, YYYY h:mm:ss A');
  // }
  // setInterval(updateTime, 1000);


  /**function to pull game data from local storage
   * CAN BE BASE FOR DYNAMICALLY GENERATED GAME LIST
   */
  // function retrieveGameData () {
  //   let retrievedGames = JSON.parse(localStorage.getItem('gameData'));


  //   if (retrievedGames !== null) {
  //     storedGames = retrievedGames;
      
  //   } else return;

  //   console.log(storedGames)
  // }

  
  // Event listener and function for searching to pull in game options for user
  $('#search-button').click(function (e) {
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

            let targetDate = dayjs(data.released);
            let today = dayjs().format('YYYY-MM-DD');
            let days = Math.abs(targetDate.diff(today, 'day'));

            function dayAppend () {
              if (dayjs().isAfter(targetDate)){
                $('#timer').append('Released: ' + days + ' Days ago');
              } else if (dayjs().isSame(targetDate)) {
                $('#timer').append('Released: ' + ' TODAY!');
              } else {
                $('#timer').append(days + ' Days Until Release!');
              } 
            }

            $('h3').text(gameName).attr('class', 'active has-text-centered is-size-3 has-text-weight-bold');
            $('#game-img').attr('src', data.background_image).attr('class', 'active');
            $('#genre').text('Genre: ' + data.genres[0].name).attr('class', 'active');
            $('#released').attr('class', 'active').text('Release Date: ' + dayjs(data.released).format('MMMM D, YYYY'));
            $('#description').attr('class', 'active').append(description.shift() + '</p>');
            $('#add-button').attr('class', 'button fa-solid fa-heart active');
            $('#timer').attr('class', 'has-text-centered is-size-4 has-text-weight-medium').append(dayAppend);

            
          console.log(dayAppend);
          

        $('#add-button').click(function addGamesList (event) {
          event.stopPropagation();
          event.preventDefault();
          
          const savedSection = document.querySelector('.savedGames');
          const gameList = document.createElement('div');
          const listElement = document.createElement('li');
          const clickButton = document.createElement('button');
          clickButton.setAttribute('class', 'button is-small is-fullwidth is-info is-outlined mt-3');

          // var gameSaved = JSON.parse(localStorage.getItem('gameData'));

          
          listElement.appendChild(clickButton).innerHTML = gameName + ' (' + days + ')';
          gameList.appendChild(listElement);
          savedSection.appendChild(gameList);
          
  
        });

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
    document.getElementById("gameInput").value = "";
    console.log(storedGames);
    retrieveGameData();
    $('#search-results').empty();
  }


  function retrieveGameData () {
    let retrievedGames = JSON.parse(localStorage.getItem('gameData'));


    if (retrievedGames !== null) {
      storedGames = retrievedGames;
      
    } else return;

    console.log(storedGames)
  }


   
  retrieveGameData (); // Call function to pull data from local storage
  // diffDay ();
});
