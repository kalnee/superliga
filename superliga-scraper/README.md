<h1 align="center">superliga-scraper</h1>

<h5 align="center">Web scraper to collect data from the Superliga's website.</h5>

## Usage

- `$ npm install`
- `$ node index.js`

## Endpoints

`$ curl http://localhost:3000/v1/men/fixtures`

```json
[{
    "id": 1,
    "round": 1,
    "date": "2016-10-26 20:00",
    "tv": null,
    "home": "JF VÔLEI",
    "away": "VÔLEI BRASIL KIRIN",
    "result": {
      "homeSets": "1",
      "awaySets": "3",
      "partials": [
        "25-23",
        "17-25",
        "21-25",
        "17-25"
      ]
    }
}]
```

`$ curl http://localhost:3000/v1/women/teams`

```json
[{
    "id": 1,
    "name": "SESI-SP",
    "code": "SES",
    "logo": "http://superliga.cbv.com.br/img/equipes/fem_10.png"
}]
```
