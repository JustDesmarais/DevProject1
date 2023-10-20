// API URL = https://api.rawg.io/api/
// API Key = 7aa60114ee68416ca8c8f9423e2bd0d3
// idURL = https://api.rawg.io/api/games/{id}?key=7aa60114ee68416ca8c8f9423e2bd0d3

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

$(function () {
  
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

            for(i=0; i < 10; i++) {
              let gameOption = $('<button>');

              gameOption.text(data.results[i].name + ", " + dayjs(data.results[i].released).format('YYYY'));
              gameOption.attr('data-id', data.results[i].id).attr('class', 'has-text-centered m-1').attr('id', 'game-selector' + [i]);

              $('#search-results').append(gameOption);              
            };

            $('#search-results').slideToggle('slow');
            $('[id*="game-selector"]').click(selectGame);
            console.log($('#search-results'));
        })
        .catch(err => {
            console.error(err);
        });
    });

  function selectGame (e) {
    e.preventDefault();

    
    $('#game-info').children(2).empty()
    $('#search-results').slideToggle('fast'); 
    let apiURL = 'https://api.rawg.io/api/games/' + $(this).data('id') + '?key=7aa60114ee68416ca8c8f9423e2bd0d3';

    fetch(apiURL)
        .then (function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            let description = data.description.split('</p>');

            console.log(description);

            $('h3').text(data.name);
            $('#game-img').attr('src', data.background_image);
            $('#genre').text('Genre: ' + data.genres[0].name);
            $('#released').text('Release Date: ' + dayjs(data.released).format('MMMM D, YYYY'));
            $('#description').append(description.shift() + '</p>');
        })
        .catch(err => {
            console.error(err);
        });
    $('#search-results').empty();
  }
});

//