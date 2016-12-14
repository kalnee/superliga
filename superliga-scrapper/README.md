<h1 align="center">superliga-scrapper</h1>

<h5 align="center">Web scrapper to collect data from the Superliga's website.</h5>

## Usage

- `$ npm install`
- `$ node index.js`

## Endpoints

`$ curl http://localhost:3000/men/schedule`

```json
[{  
   "id":"249ffa20-c14f-11e6-859d-43475c136a54",
   "round":10,
   "date":"2016-12-17 19:30",
   "tv":"SportTV",
   "home":"SADA CRUZEIRO VÔLEI",
   "away":"FUNVIC TAUBATÉ"
}]
```

`$ curl http://localhost:3000/women/schedule`

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
