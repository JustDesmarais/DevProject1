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

    
  // Event listeners and function for searching to pull in game options for user
  $('#search-button').click(handleSearch);
  $('#gameInput').submit(handleSearch);
    
  function handleSearch(e) {
    e.preventDefault();
    let apiURL = 'https://api.rawg.io/api/games?key=7aa60114ee68416ca8c8f9423e2bd0d3&search=' + $('input').val();
    $('input').val('');

    console.log(apiURL);

    $('#search-button').toggleClass('is-hidden');
    $('#cancel-button').toggleClass('is-hidden');

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

            $('#search-results').slideToggle('fast'); // Show search list
            $('[id*="game-selector"]').click(selectGame); // Add event listener to generated buttons
        })
        .catch(err => {
            console.error(err);
        });
    };
        
  $('#cancel-button').click(function (e) {
    e.stopPropagation();
    e.preventDefault();
    
    $('#search-results').slideToggle().empty();
    $('#gameInput').val('');
    $('#search-button').toggleClass('is-hidden');
    $('#cancel-button').toggleClass('is-hidden');
  })

  // Function following click of final game option
  function selectGame (e) {
    e.preventDefault();
    e.stopPropagation();

    let finalURL = 'https://api.rawg.io/api/games/' + $(this).data('id') + '?key=7aa60114ee68416ca8c8f9423e2bd0d3';

    $('#description').empty();
    $('#search-results').slideToggle().empty();
    $('#gameInput').val('');
    $('#search-button').toggleClass('is-hidden');
    $('#cancel-button').toggleClass('is-hidden');
    $('#add-button').prop('disabled', false);
    $('#timer').empty();

    fetch(finalURL)
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

            $('h3').text(data.name).attr('class', 'active has-text-centered is-size-3 has-text-weight-bold');
            $('#game-img').attr('src', data.background_image).attr('class', 'active');
            $('#genre').text('Genre: ' + data.genres[0].name).attr('class', 'active');
            $('#released').attr('class', 'active').attr('data-release', data.released).text('Release Date: ' + dayjs(data.released).format('MMMM D, YYYY'));
            $('#description').attr('class', 'active').append(description.shift() + '</p>');
            $('#add-button').attr('class', 'button fa-solid fa-heart active').attr('data-id', data.id);
            $('#timer').attr('class', 'has-text-centered is-size-4 has-text-weight-medium').append(dayAppend);

            
          console.log(dayAppend);

        })
        .catch(err => {
            console.error(err);
        });
  };
 
  // function to add elements to favorite list
  $('#add-button').click(function (event) {    
    event.stopPropagation();
    event.preventDefault();

    let gameID = $('#add-button')[0].dataset.id;
    let gameRelease = $('#released')[0].dataset.release;
    let gameName = $('h3').text();

    storedGames.push({gameID, gameRelease, gameName});
    localStorage.setItem('gameData', JSON.stringify(storedGames));
    
    console.log(storedGames);  
    retrieveGameData();
  });    

  function favoriteGame (e) {
    e.stopPropagation();
    e.preventDefault();

    let favoriteURL = 'https://api.rawg.io/api/games/' + $(this).data('id') + '?key=7aa60114ee68416ca8c8f9423e2bd0d3';
    console.log(favoriteURL);

    $('#timer').empty();
    $('#timer').attr('class', 'has-text-centered is-size-4 has-text-weight-medium');
    $('#description').empty();
    $('#add-button').prop('disabled', true);

    fetch(favoriteURL)
        .then (function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            let description = data.description.split('</p>');

            let targetDate = dayjs(data.released);
            let today = dayjs().format('YYYY-MM-DD');
            let days = Math.abs(targetDate.diff(today, 'day'));


            if (dayjs().isAfter(targetDate)) {
              $('#timer').text('Released: ' + days + ' days ago');
            } else if (dayjs().isSame(targetDate)) {
              $('#timer').text('Released: ' + ' TODAY!');
            } else {
              $('#timer').text(days + ' Days Until Release!');
            } 
          

            $('h3').text(data.name).attr('class', 'active has-text-centered is-size-3 has-text-weight-bold');
            $('#game-img').attr('src', data.background_image).attr('class', 'active');
            $('#genre').text('Genre: ' + data.genres[0].name).attr('class', 'active');
            $('#released').attr('class', 'active').attr('data-release', data.released).text('Release Date: ' + dayjs(data.released).format('MMMM D, YYYY'));
            $('#description').attr('class', 'active').append(description.shift() + '</p>');
            $('#add-button').attr('class', 'button fa-solid fa-heart active').attr('data-id', data.id);
            
        });
  };

  // function to pull game data from local storage
  function retrieveGameData () {
    $('.savedGames').empty();
    let retrievedGames = JSON.parse(localStorage.getItem('gameData'));

    if (retrievedGames !== null) {
      storedGames = retrievedGames;

      for (i = 0; i < storedGames.length; i++) {
        const savedSection = $('.savedGames');
        const gameList = $('<div>');
        const listElement = $('<li>');
        let targetDate = dayjs(storedGames[i].gameRelease);
        let today = dayjs().format('YYYY-MM-DD');
        let days = Math.abs(targetDate.diff(today, 'day'));
        let trackedDays = '';

        if (dayjs().isAfter(targetDate)) {
          trackedDays = 'Released: ' + days + ' days ago';
        } else if (dayjs().isSame(targetDate)) {
          trackedDays = 'Released: ' + ' TODAY!';
        } else {
          trackedDays = days + ' Days Until Release!';
        } 

        let clickButton = $('<button>').attr('class', 'button is-secondary is-medium m-3 is-size-6 has-text-weight-bold').attr('data-id', storedGames[i].gameID).attr('id', 'favorite' + [i]).text(storedGames[i].gameName + ' (' + trackedDays + ')');

        listElement.append(clickButton);
        listElement.append($('<span>').attr('data-id', storedGames[i].id).attr('class', 'remove-button button is-size-7').text('X'));
        gameList.append(listElement);
        savedSection.append(gameList);

      }
    } else return;

    $('.remove-button').click(removeFavorite); //event listener for remove buttons
    $('[id*="favorite"]').click(favoriteGame); //event listener for clicking on game in favorite section
  }

  function removeFavorite (event) {
    event.preventDefault();
    event.stopPropagation();
    

    let removeID = $(this).siblings().data('id');
    for (i=0; i < storedGames.length; i++) {
      if (removeID == storedGames[i].gameID) {
        storedGames.splice(i, 1);
        break;
      };
    };

    localStorage.setItem('gameData', JSON.stringify(storedGames));
    retrieveGameData ();
    
    console.log(storedGames);
  };

  retrieveGameData (); // Call function to pull data from local storage
  // diffDay ();
});
