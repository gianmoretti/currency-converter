import { RestClient } from "typed-rest-client";
import { logger } from "../logger";
import { injectable } from "@msiviero/knit";

export interface RestClientResponse<T> {
  readonly statusCode: number;
  readonly body: T | null;
}

@injectable()
export class Client {
  public constructor(private readonly client: RestClient) {}

  public async get<T>(
    uri: string,
    contentTypeAccepted: string
  ): Promise<RestClientResponse<T | null>> {
    let statusCode = 0;
    try {
      logger.debug(`Call rest Api GET: [endpoint=${uri}]`);
      const response = await this.client.get<T>(uri, {
        acceptHeader: contentTypeAccepted,
      });
      logger.debug(`API response: ${response.statusCode}`);
      statusCode = response.statusCode;
      return {
        statusCode,
        body: response.result,
      };
    } catch (error) {
      logger.error(
        `Error while invoking API [message=${error.message}, stack=${error.stack}]`
      );
      return {
        statusCode: 0,
        body: null,
      };
    }
  }
}
