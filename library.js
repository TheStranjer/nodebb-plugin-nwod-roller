var posts = require('../../src/posts');

// Dice roller formats
// /roll # [\d{1,2}|]
// 1: Number of dice, 2, What to roll again on, defaults to 10
var Roller = {};

Roller.diceRegex = /\/roll (\d+)( \d{1,2}|)/i;

Roller.init = function (params, callback) {
  Roller.app = params.app;

  callback();
};

Roller.roll = function (pool, again) {
  results = [];

  for (i = 0; i < pool; i++) {
    do {
      result = Math.floor((Math.random() * 10) + 1);
      results.push(result);
    } while (result >= again);
  }

  return results;
};

Roller.successes = function(results) {
  return results.filter(function (result) { return result >= 8 } ).length;
};

Roller.rollHTML = function(query, results, again, pool, callback) {
  var renderData = {
    "pool" : pool,
    "query" : query,
    "results" : results,
    "again" : again,
    "differentAgain" : (again != 10),
    "noRerolling" : (again > 10),
    "results" : results.join(" "),
    "successes" : Roller.successes(results)
  };

  Roller.app.render("partials/nwod-roll", renderData, function (err, html) {
    callback(html);
  });
};

Roller.parse = function(data, callback) {
  if (!data || !data.postData || !data.postData.content) {
    return callback(null, data);
  }

  if (data.postData.content.match(Roller.diceRegex)) {
    posts.getPostField(data.postData.pid, "rollResults", function(err, results) {
      if (!results) {
        match = Roller.diceRegex.exec(data.postData.content);
        query = match[0];
        pool = parseInt(match[1]);
        again = (match[2] == "" ? 10 : parseInt(match[2]));
        newResults = Roller.roll(pool, again);
        posts.setPostField(data.postData.pid, "rollResults", newResults, function() {});
        posts.setPostField(data.postData.pid, "rollAgain", again, function() {});
        posts.setPostField(data.postData.pid, "rollQuery", query, function() {});
        posts.setPostField(data.postData.pid, "rollPool", pool, function() {});

        Roller.rollHTML(query, newResults, again, pool, function (html) {
          data.postData.content = data.postData.content.replace(Roller.diceRegex, html);
          callback(null, data);
        });
      } else {
        posts.getPostFields(data.postData.pid, ["rollQuery", "rollAgain", "rollPool"], function(err, fields) {
          query = fields["rollQuery"];
          again = fields["rollAgain"];
          pool = fields["rollPool"];
          Roller.rollHTML(query, results, again, pool, function (html) {
            data.postData.content = data.postData.content.replace(Roller.diceRegex, html);
            callback(null, data);
          })
        });
      }
    });
  } else {
    callback(null, data);
  }
};

module.exports = Roller;