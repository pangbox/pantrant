import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "react-mosaic-component/react-mosaic-component.css";

import * as React from "react";
import { render } from "react-dom";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

import { App } from "./components/App";
import { Cassette } from "./cassette";
import { SpecialFetchTransport } from "./transport";

Sentry.init({
  dsn: "https://b65027c09a1540f7af89932989800b69@errors.jchw.io/6238367",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  transport: SpecialFetchTransport,
});

let request: Promise<any>;
declare var process: { env: { NODE_ENV: string } };

if (process.env.NODE_ENV === "development") {
  request = import("./testdata/democassettes").then(m => m.default);
} else {
  request = fetch("/cassettes.json").then(r => r.json());
}

request
  .then((data: any[]) => data.map(n => new Cassette(n)))
  .then(cassettes =>
    render(
      <React.StrictMode>
        <App appData={{ cassettes: cassettes, currentCassette: cassettes[0] }} />
      </React.StrictMode>,
      document.getElementById("app")
    )
  )
  .catch(err => () => {
    alert("App failed to load: " + err);
    console.error(err)
  });
