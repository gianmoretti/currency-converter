# Currency Converter

The Currency Converter implements an online currency converter, providing a Web API endpoint called convert. The endpoint accepts HTTP GET requests.

About the technologies, the implementation is based on NodeJS and the source code is written in Typescript.

## Project dependencies

The implementation is based on these external libraries:

- a dependency injection framework called Knit that allows the method annotation
- [fastify](https://www.fastify.io/) as http server
- winston for logging
- typed-rest-client as rest client
- typemoq as mocking framework into the unit tests

## Related projects

For the exchange calculation, the project loads the exchange rates by calling the API exposed by the external project [Exchange Rates API](https://exchangeratesapi.io/)

## API documentation

The project exposes only one method `/convert` has to be called by HTTP GET with these query params:

- _amount_: the amount to convert (e.g. 12.35)
- _src_currency_: ISO currency code for the source currency to convert (e.g. EUR,
  USD, GBP)
- _dest_currency_: ISO currency code for the destination currency to convert (e.g. EUR,
  USD, GBP)
- _reference_date_: reference date for the exchange rate, in YYYY-MM-DD format

Call sample:

```
http://localhost:8080/convert?amount=1&src_currency=EUR&dest_currency=USD&reference_date=2020-04-30
```

## Env Vars

List of enviroment variables:

- `PORT`: set the http port (default 8080)
- `LOG_LEVEL`: set the log level (default debug)
- `NODE_ENV`: set the environment (default empty that means development)
- `CLUSTERING`: define if we want to use clustering configuration or not (default false)
- `DECIMAL_APPROXIMATION`: define the number of decimals to consider (default 10000 that means 4 digit)
- `BACKWARD_MONTHS`: define the window size to consider during the exchange config loading (default 4)

## How to launch

Follow these instruction for installing dependencies, build, launch the tests, verify the source code format and starting the application.

```sh
$ npm install
$ npm run-script build
$ npm run-script test
$ npm run-script lint
$ npm run-script docker-build
```
