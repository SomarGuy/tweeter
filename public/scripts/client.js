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
  const createTweetElement = tweetData => {
    const { user, content } = tweetData;
    const $tweet = $(`
      <article class="tweet">
        <header class="tweet-header">
          <div class="user-profile">
            <img class="user-icon" src="${escape(user.avatars)}">
            <h4 class="user-name">${escape(user.name)}</h4>
          </div>
          <div>
            <h4 class="user-handle">${escape(user.handle)}</h4>
          </div>
        </header>
        <div class="tweet-text">${escape(content.text)}</div>
        <footer class="tweet-footer">
          <span class="tweet-date">${timeago.format(tweetData['created_at'])}</span>
          <div class="tweet-response">
            <i class="fas fa-flag"></i>
            <i class="fas fa-retweet"></i>
            <i class="fas fa-heart"></i>
          </div>
        </footer>
      </article>
    `);
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
  const loadTweets = () => {
    $.ajax({
      url: '/tweets',
      method: 'GET',
    }).then(renderTweets);
  };
  

  //Adds new tweet when clicking submit
  $('form').submit(function(event) {
    event.preventDefault();
    const maxChar = 140;
    const input = $(this).find("#tweet-text").val();
    const inputLength = input.length;
    const errorEmpty = $("#error-message-empty");
    const errorTooLong = $("#error-message-tooLong");
  
    errorEmpty.slideUp("slow");
    errorTooLong.slideUp("slow");
  
    if (!inputLength) {
      errorEmpty.slideDown("slow");
      errorTooLong.hide();
    } else if (inputLength - maxChar > 0) {
      errorTooLong.slideDown("slow");
      errorEmpty.hide();
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

