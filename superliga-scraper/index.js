var cheerio = require('cheerio');
var express = require('express');
var request = require('request');
var moment = require('moment');

var app = express();

var getSchedule = function(url) {
    return new Promise(function(resolve, reject) {
        request(url, function(error, response, html) {
            if (error) {
                reject(`Failed to access ${url}`);
            }

            console.log(`Successfully accessed ${url}`);

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
                    var sets = $(this).find('.sets').text().trim().replace(/\s+/g, '');

                    var result = null;

                    if (sets.length > 1) {
                        result = {
                            homeSets: sets.substr(0, 3).split('X')[0],
                            awaySets: sets.substr(0, 3).split('X')[1],
                            partials: sets.substr(3).split('|')
                        };
                    }

                    games.push({
                        id: (round - 1) * 6 + i + 1,
                        round: round,
                        date: date,
                        tv: tv,
                        home: home,
                        away: away,
                        result: result
                    });
                });
            });

            console.log('Finished scraping schedule');
            resolve(games);
        });
    });
}

var getTeams = function(url) {
    return new Promise(function(resolve, reject) {
        request(url, function(error, response, html) {
            if (error) {
                reject(`Failed to access ${url}`);
            }

            console.log(`Successfully accessed ${url}`);

            var teams = [];
            var $ = cheerio.load(html);

            $('.processo').children('a').each(function(i, elem) {
                var name = $(this).attr('title').trim();
                var code = $(this).attr('href').substr(-3);

                var regex = /.*background: url\('(.*)'\).*/g
                var logo = regex.exec($(this).attr('style'))[1].slice(0, -9);

                teams.push({
                    id: (i + 1),
                    name: name,
                    code: code,
                    logo: logo
                });
            });

            console.log('Finished scraping teams');
            resolve(teams);
        });
    });
}

app.get('/men/fixtures', function(req, res) {
    getSchedule("http://superliga.cbv.com.br/tabela-jogos/Masculino")
        .then(function(schedule) {
            res.send(schedule);
        }).catch(function(error) {
            res.sendError(error);
        });
});

app.get('/men/teams', function(req, res) {
    getTeams("http://superliga.cbv.com.br/equipes-masc")
        .then(function(teams) {
            res.send(teams);
        }).catch(function(error) {
            res.sendError(error);
        });
});

app.get('/women/fixtures', function(req, res) {
    getSchedule("http://superliga.cbv.com.br/tabela-jogos/Feminino")
        .then(function(schedule) {
            res.send(schedule);
        }).catch(function(error) {
            res.sendError(error);
        });
});

app.get('/women/teams', function(req, res) {
    getTeams("http://superliga.cbv.com.br/equipes-fem")
        .then(function(teams) {
            res.send(teams);
        }).catch(function(error) {
            res.sendError(error);
        });
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Service running on port ' + (process.env.PORT || 3000));
});

exports = module.exports = app;
