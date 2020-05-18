import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "react-mosaic-component/react-mosaic-component.css";

import * as React from "react";
import { render } from "react-dom";

import { App } from "./components/App";
import { Cassette } from "./cassette";

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
      <App appData={{ cassettes: cassettes, currentCassette: cassettes[0] }} />,
      document.getElementById("app")
    )
  )
  .catch(err => console.error(err));
