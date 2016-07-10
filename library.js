var posts = require('../../src/posts');
var RandomOrg = require('random-org');
var d10source = new RandomOrg({ apiKey: 'your key here' });

// Dice roller formats
// /roll # [\d{1,2}|]
// 1: Number of dice, 2, What to roll again on, defaults to 10

(function (Roller) {
  Roller.diceRegex = /\/roll (\d+)( \d{1,2}|)/i;

  Roller.resultsBuffer = [];

  Roller.init = function (params, callback) {
    Roller.app = params.app;

    Roller.maintainResultsBuffer();

    callback();
  };

  Roller.maintainResultsBuffer = function () {
    if (Roller.resultsBuffer.length < 100) {
      d10source.generateIntegers({ min: 1, max: 10, n: 100 })
      .then(function(result) {
        Roller.resultsBuffer = Roller.resultsBuffer.concat(result.random.data);
      });
    }
  };

  Roller.roll = function (pool, again) {
    results = [];

    for (i = 0; i < pool; i++) {
      do {
        result = Roller.resultsBuffer.pop();
        results.push(result);
      } while (result >= again);
    }

    Roller.maintainResultsBuffer();

    return results;
  };

  Roller.successes = function(results) {
    return results.filter(function (result) { return result >= 8 } ).length;
  };

  Roller.processResultsForView = function(results) {
    processedResults = [];
    for (i = 0; i < results.length; i++) {
      processedResults.push({
        "numeric" : results[i],
        "successful" : results[i] >= 8
      });
    }

    return processedResults;
  };

  Roller.rollHTML = function(query, results, again, pool, callback) {
    var renderData = {
      "pool" : pool,
      "query" : query,
      "results" : results,
      "again" : again,
      "differentAgain" : (again != 10),
      "noRerolling" : (again > 10),
      "results" : Roller.processResultsForView(results),
      "emptyParameter" : "",
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
          if (again < 8) {
            again = 8;
          }
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
})(exports);