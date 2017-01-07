var cheerio = require('cheerio');
var express = require('express');
var request = require('request');
var moment = require('moment');
var fs = require('fs');

var app = express();

const DATE_FORMAT = 'DD/MM/YYYY | HH:mm';

var getFixtures = function(url) {
    return new Promise(function(resolve, reject) {
        request(url, function(error, response, html) {
            if (error) {
                reject(`Failed to access ${url}`);
            }

            console.log(`Successfully accessed ${url}`);

            var fixtures = [];
            var $ = cheerio.load(html);

            $('.titulo-rodada').each(function(i, elem) {
                var round = i + 1;
                $(this).nextUntil('.titulo-rodada').filter('.jogos-da-rodada').each(function(i, elem) {
                    var rawDate = $(this).find('.data').last().html().split('<br>')[0];
                    var date = moment(rawDate, DATE_FORMAT);
                    var img = $(this).find('.data').last().children('img');
                    var tv = null;
                    if (img.length > 0) {
                        tv = img.attr('src').indexOf('sportv') >= 0 ? 'SportTV' : 'RedeTV';
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

                    fixtures.push({
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

            if (fixtures.length === 0) {
                reject('No fixtures found. I problem may have occurred.');
            }

            var gender = url.indexOf('Feminino') >= 0 ? 'women' : 'men';
            fs.writeFile(`data/fixtures-${gender}.json`, JSON.stringify(fixtures, null, 2), function(err) {
                if (err) return console.log(err);
                console.log(`fixtures > data/fixtures-${gender}.json`);
            });

            resolve(fixtures);
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
                var teamUrl = $(this).attr('href');
                var code = teamUrl.replace(teamUrl.substr(-7), '').substr(-3);

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

            if (teams.length === 0) {
                reject('No teams found. I problem may have occurred.');
            }

            var gender = url.indexOf('equipes-fem') >= 0 ? 'women' : 'men';
            fs.writeFile(`data/teams-${gender}.json`, JSON.stringify(teams, null, 2), function(err) {
                if (err) return console.log(err);
                console.log(`teams > data/teams-${gender}.json`);
            });

            resolve(teams);
        });
    });
}

app.put('/v1/men/fixtures', function(req, res) {
    getFixtures("http://superliga.cbv.com.br/tabela-jogos/Masculino")
        .then(function(schedule) {
            res.send(schedule);
        }).catch(function(error) {
            res.sendError(error);
        });
});

app.put('/v1/men/teams', function(req, res) {
    getTeams("http://superliga.cbv.com.br/equipes-masc")
        .then(function(teams) {
            res.send(teams);
        }).catch(function(error) {
            res.sendError(error);
        });
});

app.put('/v1/women/fixtures', function(req, res) {
    getFixtures("http://superliga.cbv.com.br/tabela-jogos/Feminino")
        .then(function(schedule) {
            res.send(schedule);
        }).catch(function(error) {
            res.sendError(error);
        });
});

app.put('/v1/women/teams', function(req, res) {
    getTeams("http://superliga.cbv.com.br/equipes-fem")
        .then(function(teams) {
            res.send(teams);
        }).catch(function(error) {
            res.sendError(error);
        });
});

app.get('/v1/:gender/fixtures', function(req, res) {
    var gender = req.params.gender;
    var team = req.query.team;
    var home = req.query.home === 'true';
    var future = req.query.future === 'true';

    var fixtures = JSON.parse(fs.readFileSync(`data/fixtures-${gender}.json`, 'utf8'));

    if (team) {
        fixtures = fixtures.filter(function(fixture) {
            return fixture.home.indexOf(team) >= 0 || (!home && fixture.away.indexOf(team) >= 0);
        });
    }

    if (future) {
        fixtures = fixtures.filter(function(fixture) {
            return moment(fixture.date, DATE_FORMAT).isAfter(moment());
        });
    }

    res.send(fixtures);
});

app.get('/v1/:gender/teams', function(req, res) {
    var gender = req.params.gender;
    var teams = JSON.parse(fs.readFileSync(`data/teams-${gender}.json`, 'utf8'));

    res.send(teams);
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Service running on port ' + (process.env.PORT || 3000));
});

exports = module.exports = app;
