import { Container, HttpServer, Scope } from "@msiviero/knit";
import * as supertest from "supertest";
import { Converter } from "../src/api/converter";
import { CalculatorService } from "../src/service/calculator";
import { ExchangeRateService } from "../src/service/rate";
import { ConfigProvider } from "../src/service/config";
import { Client } from "../src/client/http";
import { RestClient } from "typed-rest-client";

describe("Http server custom instance", () => {
  const container = new Container()
    .register(Converter, Scope.Singleton)
    .register(CalculatorService, Scope.Singleton)
    .register(ExchangeRateService, Scope.Singleton)
    .register(ConfigProvider, Scope.Singleton)
    .register(Client, Scope.Singleton)
    .register(RestClient, Scope.Singleton);

  const httpServer = new HttpServer(container).api(Converter);

  beforeAll(() => httpServer.start({ port: 0 }));
  afterAll(() => httpServer.stop());

  it("given EUR as src currency should register endpoint and serve requests", async () => {
    const amount: number = 1;
    const srcCurrency: string = "EUR";
    const destCurrency: string = "USD";
    const refDate: Date = new Date("2020/03/10");

    const response = await supertest(httpServer.getServer())
      .get(`/convert`)
      .query({
        amount,
        src_currency: srcCurrency,
        dest_currency: destCurrency,
        reference_date: refDate,
      })
      .expect(200);

    expect(response.text).toEqual(
      JSON.stringify({ amount: 1.139, currency: "USD" })
    );
  });

  it("given AUD as src currency should register endpoint and serve requests", async () => {
    const amount: number = 3.5;
    const srcCurrency: string = "AUD";
    const destCurrency: string = "USD";
    const refDate: Date = new Date("2020/03/10");

    const response = await supertest(httpServer.getServer())
      .get(`/convert`)
      .query({
        amount,
        src_currency: srcCurrency,
        dest_currency: destCurrency,
        reference_date: refDate,
      })
      .expect(200);

    expect(response.text).toEqual(
      JSON.stringify({ amount: 2.2941, currency: "USD" })
    );
  });

  it("when ref_date param is too old should serve requests and return an error", async () => {
    const amount: number = 1;
    const srcCurrency: string = "EUR";
    const destCurrency: string = "USD";
    const refDate: Date = new Date("2010/03/10");

    const response = await supertest(httpServer.getServer())
      .get(`/convert`)
      .query({
        amount,
        src_currency: srcCurrency,
        dest_currency: destCurrency,
        reference_date: refDate,
      })
      .expect(404);

    expect(response.text).toEqual(
      JSON.stringify({
        message: "exchange rate not found, amount not processable",
      })
    );
  });

  it("when src_currency param is missing should serve requests and return an error", async () => {
    const amount: number = 1;
    const destCurrency: string = "USD";
    const refDate: Date = new Date("2020/04/29");

    const response = await supertest(httpServer.getServer())
      .get(`/convert`)
      .query({
        amount,
        dest_currency: destCurrency,
        reference_date: refDate,
      })
      .expect(400);

    expect(response.text).toEqual(
      JSON.stringify({ message: "src_currency not present" })
    );
  });

  it("when dest_currency param is missing should serve requests and return an error", async () => {
    const amount: number = 1;
    const srcCurrency: string = "USD";
    const refDate: Date = new Date("2020/04/29");

    const response = await supertest(httpServer.getServer())
      .get(`/convert`)
      .query({
        amount,
        src_currency: srcCurrency,
        reference_date: refDate,
      })
      .expect(400);

    expect(response.text).toEqual(
      JSON.stringify({ message: "dest_currency not present" })
    );
  });

  it("when amount param is wrong should serve requests and return an error", async () => {
    const badAmount = "bad value";
    const srcCurrency: string = "EUR";
    const destCurrency: string = "USD";
    const refDate: Date = new Date("2020/04/29");

    const response = await supertest(httpServer.getServer())
      .get(`/convert`)
      .query({
        amount: badAmount,
        src_currency: srcCurrency,
        dest_currency: destCurrency,
        reference_date: refDate,
      })
      .expect(400);

    expect(response.text).toEqual(
      JSON.stringify({ message: "amount not valid" })
    );
  });

  it("when amount param is missing should serve requests and return an error", async () => {
    const srcCurrency: string = "EUR";
    const destCurrency: string = "USD";
    const refDate: Date = new Date("2020/04/29");

    const response = await supertest(httpServer.getServer())
      .get(`/convert`)
      .query({
        src_currency: srcCurrency,
        dest_currency: destCurrency,
        reference_date: refDate,
      })
      .expect(400);

    expect(response.text).toEqual(
      JSON.stringify({ message: "amount not valid" })
    );
  });

  it("when reference_date param is wrong should serve requests and return an error", async () => {
    const amount: number = 1;
    const srcCurrency: string = "EUR";
    const destCurrency: string = "USD";
    const refDate = "bad value";

    const response = await supertest(httpServer.getServer())
      .get(`/convert`)
      .query({
        amount,
        src_currency: srcCurrency,
        dest_currency: destCurrency,
        reference_date: refDate,
      })
      .expect(400);

    expect(response.text).toEqual(
      JSON.stringify({ message: "reference_date not valid" })
    );
  });

  it("when reference_data param is missing should serve requests and return an error", async () => {
    const amount: number = 1;
    const srcCurrency: string = "EUR";
    const destCurrency: string = "USD";

    const response = await supertest(httpServer.getServer())
      .get(`/convert`)
      .query({
        amount,
        src_currency: srcCurrency,
        dest_currency: destCurrency,
      })
      .expect(400);

    expect(response.text).toEqual(
      JSON.stringify({ message: "reference_date not valid" })
    );
  });
});
