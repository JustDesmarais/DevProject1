// API URL = https://api.rawg.io/api/
// API Key = 7aa60114ee68416ca8c8f9423e2bd0d3

$(function () {
  
  $('input').siblings('button').click(function (e) {
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
        })
        .catch(err => {
            console.error(err);
        });
    });
});
