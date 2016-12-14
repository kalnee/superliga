var cheerio = require('cheerio');
var express = require('express');
var request = require('request');
var uuid = require('uuid/v1');
var moment = require('moment');

var app = express();

var getSchedule = function(url) {
    return new Promise(function(resolve, reject) {
        request(url, function(error, response, html) {
            if (error) {
                reject(`Failed to access ${url}`);
            }

            var games = [];
            var $ = cheerio.load(html);

            $('.titulo-rodada').each(function(i, elem) {
                var round = i + 1;
                $(this).nextUntil('.titulo-rodada').each(function(i, elem) {
                    var rawDate = $(this).find('.data').last().html().split('<br>')[0];
                    var date = moment(rawDate, 'DD/MM/YYYY | HH:mm').format('YYYY-MM-DD HH:mm');
                    var img = $(this).find('.data').last().children('img');
                    var tv = null;
                    if (img.length > 0) {
                        tv = img.attr('src').indexOf('sportv') > 0 ? 'SportTV' : 'RedeTV';
                    }
                    var home = $(this).find('.equipes').children().first().children().last().text();
                    var away = $(this).find('.equipes').children().last().children().last().text();

                    games.push({
                        id: uuid(),
                        round: round,
                        date: date,
                        tv: tv,
                        home: home,
                        away: away
                    });
                });
            });

            console.log(JSON.stringify(games));

            resolve(games);
        });
    });
}

app.get('/men/schedule', function(req, res) {
    getSchedule("http://superliga.cbv.com.br/tabela-jogos/Masculino")
        .then(function(schedule) {
            res.send(schedule);
        }).catch(function(error) {
            res.sendError(error);
        });
});

app.get('/women/schedule', function(req, res) {
    getSchedule("http://superliga.cbv.com.br/tabela-jogos/Feminino")
        .then(function(schedule) {
            res.send(schedule);
        }).catch(function(error) {
            res.sendError(error);
        });
});

app.listen(3000, function() {
    console.log('Service running on port 3000');
});

exports = module.exports = app;
