/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//function to ensure that the tweets are loaded as soon as the page is ready.
$(document).ready(function() {

  //Hide error messages temporarily
  $("#error-message-empty").hide();
  $("#error-message-tooLong").hide();

  //takes a string as input and returns an escaped version of the string with any potentially dangerous characters converted to HTML entities. This is used to ensure that user input is properly sanitized before being displayed on the page.
  const escape = function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //takes a tweet object as input and returns an HTML element representing the tweet. The HTML element is constructed using a template string and the properties of the tweet object, such as the user's name and the tweet text.
  const createTweetElement = function(tweetData) {
    let $tweet = $(`<article class="tweet">
          <header class="tweet-header">
            <div class="user-profile">
              <img class="user-icon" src="${escape(tweetData.user.avatars)}"></img> 
              <h4 class="user-name">${escape(tweetData.user.name)}</h4>
            </div>
            <div>
              <h4 class="user-handle">${escape(tweetData.user.handle)}</h4>
            </div>
          </header>
          <div class="tweet-text">
            ${escape(tweetData.content.text)}
          </div>
          <footer class="tweet-footer">
            <span class="tweet-date">${timeago.format(tweetData['created_at'])}</span>
            <div class="tweet-response">
              <i class="fas fa-flag"></i>
              <i class="fas fa-retweet"></i>
              <i class="fas fa-heart"></i>
            </div>
          </footer>
        </article>`);
    return $tweet;
  };

//takes an array of tweet objects as input and renders them to the page by appending each tweet's HTML element to a container element on the page.
const renderTweets = tweets => {
  const $tweetsContainer = $('#tweets-container');
  $tweetsContainer.empty();

  tweets.forEach(tweet => {
    const $tweet = createTweetElement(tweet);
    $tweetsContainer.append($tweet);
  });
};


  //makes an AJAX GET request to the server to retrieve a list of tweets, and then passes the retrieved data to the renderTweets function to display the tweets on the page.
  const loadTweets = function() {
    $.ajax({
      url: "/tweets",
      method: "GET",
    })
      .then(data => {
        renderTweets(data);
      });
  };

  //Adds new tweet when clicking submit
  $('form').submit(function(event) {
    event.preventDefault();
    const maxChar = 140;
    const inputLength = $(this).find("#tweet-text").val().length;
    $("#error-message-empty").slideUp("slow");
    $("#error-message-tooLong").slideUp("slow");
    if (!inputLength) {
      $("#error-message-empty").slideDown("slow");
      $("#error-message-tooLong").hide();
    } else if (inputLength - maxChar > 0) {
      $("#error-message-tooLong").slideDown("slow");
      $("#error-message-empty").hide();
    } else {
      $.ajax({
        url: "/tweets",
        method: "POST",
        data: $('form').serialize()
      })
        .then(loadTweets);
      $(this).children().find('textarea').val('');
      $('.counter').text(140);
    }
  });
  loadTweets();
});

