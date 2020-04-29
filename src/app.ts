import { Container, HttpServer, injectable } from "@msiviero/knit";
import { Converter } from "./api/converter";

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
  Container.getInstance().resolve(Application).run();
};
