$(document).ready( function () {
  $("#tweets").getTwitter({
    userName: "jberkel",
    numTweets: 2,
    slideIn: false,
    showHeading: false,
    showProfileLink: false,
    rejectRepliesOutOf: 20
  });

  // goodreads
  $.getJSON("http://pipes.yahoo.com/pipes/pipe.run?_id=xL8fCU4_3hGJGTah3nBDOQ&_render=json&_callback=?",
    function (payload) {

      var items = payload['value']['items'];
      for (var i=0; i<items.length; i++) {
        var rating = "";
        var rCount = parseInt(items[i]['user_rating'], 10);
        if (rCount > 0) {
          rating += " (";
          for (var r=0; r<rCount; r++) {
            rating += "&#9733;";
          }
          rating += ")";
        }

        $("#currently-reading").append("<a href='" + items[i]['link']  + "'><img src='" + items[i]['book_small_image_url'] + "' class='right-img' /></a>")
        $("#currently-reading").append("<p>&laquo;" + "<a href='" + items[i]['link'] + "'>" + items[i]['y:title'] + "</a>"+ "&raquo;" +
          " by " + items[i]['author_name']  + rating + "</p>");

        var review = items[i]['user_review'];
        if (review && review !== "") {
          $("#currently-reading").append("<blockquote>&ldquo;" + review + "&rdquo;</blockquote>");
        }

        $("#currently-reading").append("</div>");
        $("#currently-reading").append("<div class='clear'/>");
      }
    });

  // github
  $.getJSON("http://pipes.yahoo.com/pipes/pipe.run?_id=3991313993c87ab012f6b190f6b9c513&_render=json&_callback=?",
    function (payload) {

      var items = payload['value']['items'];
      if (items.length > 0) {
        $("#currently-coding").append("<ul>");
        var ul = $("#currently-coding > ul");

        for (var i=0; i<items.length; i++) {
          var matches = items[i].title.match(/(.+) pushed to (.+) at (.+)$/);
          if (matches) {
            ul.append("<li>" +
              "<a href='" + items[i].link + "'>" + matches[3] + "</a> " +
              "<span class='time'>" +
              $.fn.getTwitter.relative_time(Date.parseISO8601(items[i].published)) +
              "</span></li>");
          }
        }
        $("#currently-coding").append("</ul>");
      }

    });

  // posterous
  $.getJSON("http://pipes.yahoo.com/pipes/pipe.run?_id=e52ee258ff99ea75545cdbc8d14a51fc&_render=json&_callback=?",
    function (payload) {
      var items = payload['value']['items'];
      if (items.length > 0) {
        $("#my-eyez").append("<ul>");
        var ul = $("#my-eyez > ul");
        for (var i=0; i<items.length; i++) {
          ul.append("<li><a href='" + items[i].link + "'>" + items[i].title + "</a> " +
                     "<div class='time'>" +
                     $.fn.getTwitter.relative_time(new Date(items[i].pubDate)) +
                     "</div></li>");
        }
        $("#my-eyez").append("</ul>");
      }
  });
});



// taken&modified from http://dansnetwork.com/2008/11/01/javascript-iso8601rfc3339-date-parser/
Date.parseISO8601 = function(dString) {

  var regexp = /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/;
  var date = new Date;

  var d = dString.toString().match(regexp);
  if (d) {
    var offset = 0;

    date.setUTCDate(1);
    date.setUTCFullYear(parseInt(d[1],10));
    date.setUTCMonth(parseInt(d[3],10) - 1);
    date.setUTCDate(parseInt(d[5],10));
    date.setUTCHours(parseInt(d[7],10));
    date.setUTCMinutes(parseInt(d[9],10));
    date.setUTCSeconds(parseInt(d[11],10));
    if (d[12])
      date.setUTCMilliseconds(parseFloat(d[12]) * 1000);
    else
      date.setUTCMilliseconds(0);
      if (d[13] != 'Z') {
        offset = (d[15] * 60) + parseInt(d[17],10);
        offset *= ((d[14] == '-') ? -1 : 1);
        date.setTime(date.getTime() - offset * 60 * 1000);
      }
    }
  else {
    date.setTime(Date.parse(dString));
  }
  return date;
};



