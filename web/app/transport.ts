import { Event, Response, SentryRequest, Session } from '@sentry/types';

import { FetchTransport } from '@sentry/browser/esm/transports/fetch';

export class SpecialFetchTransport extends FetchTransport {
  protected _sendRequest(sentryRequest: SentryRequest, originalPayload: Event | Session): PromiseLike<Response> {
    sentryRequest.url = sentryRequest.url.replace("/?sentry_key", "/?_&sentry_key");
    return super._sendRequest(sentryRequest, originalPayload);
  }
}
