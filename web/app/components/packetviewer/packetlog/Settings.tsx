import * as React from "react";
import { Slider, FormGroup } from "@blueprintjs/core";

interface Props {
  timeWindow: number;
  setTimeWindow: (time: number) => void;
  timeOffset: number;
  setTimeOffset: (offset: number) => void;
}

export const Settings = ({ timeWindow, setTimeWindow, timeOffset, setTimeOffset }: Props) => {
  return (
    <React.Fragment>
      <FormGroup
        helperText="Number of seconds of history to show."
        label="Time Window"
      >
        <div style={{ margin: "16px" }}>
          <Slider
            value={timeWindow}
            onChange={setTimeWindow}
            min={0}
            max={25}
            stepSize={0.1}
            labelStepSize={5.0}
          />
        </div>
      </FormGroup>
      <FormGroup
        helperText="Amount of time offset to use."
        label="Time Offset"
      >
        <div style={{ margin: "16px" }}>
          <Slider
            value={timeOffset}
            onChange={setTimeOffset}
            min={-100}
            max={100}
            stepSize={0.1}
            labelStepSize={25.0}
          />
        </div>
      </FormGroup>
    </React.Fragment>
  );
};
