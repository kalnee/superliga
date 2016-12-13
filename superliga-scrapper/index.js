let cheerio = require('cheerio');
let express = require('express');
let request = require('request');
let uuid = require('uuid/v1');
let app = express();

app.get('/games', function(req, res) {
    var url = "http://superliga.cbv.com.br/tabela-jogos/Masculino";

    request(url, function(error, response, html) {
        if (error) {
            return res.sendError(`Failed to access ${url}`);
        }

        var games = [];
        var $ = cheerio.load(html);

        $('.titulo-rodada').each(function(i, elem) {
            var round = i + 1;
            $(this).nextUntil('.titulo-rodada').each(function(i, elem) {
                var date = $(this).find('.data').last().html().split('<br>')[0];
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

    });

});

app.listen(3000, function() {
    console.log('Service running on port 3000');
});

exports = module.exports = app;
