import { Container, HttpServer, injectable, Scope } from "@msiviero/knit";
import { Converter } from "./api/converter";
import { RestClient } from "typed-rest-client";

@injectable()
class Application {
  public run() {
    HttpServer.getInstance().api(Converter).start({ port: this.getPort() });
  }

  private getPort() {
    return parseInt(process.env.PORT || "8080", 10);
  }
}

export const runner = () => {
  Container.getInstance()
    .register(RestClient, Scope.Singleton)
    .resolve(Application)
    .run();
};
