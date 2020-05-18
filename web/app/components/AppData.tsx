import * as React from "react";
import { Cassette } from "../cassette";

export interface AppData {
  currentCassette: Cassette;
  cassettes: Cassette[];
}

export const AppDataContext = React.createContext<AppData|null>(null);
