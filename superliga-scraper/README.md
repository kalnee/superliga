<h1 align="center">superliga-scraper</h1>

<h5 align="center">Web scraper to collect data from the Superliga's website.</h5>

## Usage

- `$ npm install`
- `$ node index.js`

## Endpoints

`$ curl http://localhost:3000/men/fixtures`

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

`$ curl http://localhost:3000/women/fixtures`

```json
[{
  "id": "cad43500-c217-11e6-9ca6-ebbf66ff569a",
  "round": 1,
  "date": "2016-10-27 19:00",
  "tv": null,
  "home": "RENATA VALINHOS / COUNTRY ",
  "away": "DENTIL/PRAIA CLUBE"
}]
```
