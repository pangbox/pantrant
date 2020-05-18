import * as React from "react";
import { VideoProvider } from "./VideoControl";

interface Props {
  src: string;
}

export const VideoView = ({ src }: Props) => {
  return (
    <React.Fragment>
      <VideoProvider>
        {videoRef =>
          <video style={{width: '100%', height: '100%', background: 'black'}} controls={true} ref={videoRef}>
          <source src={src} type="video/mp4" />
          </video>
        }
      </VideoProvider>
    </React.Fragment>
  );
};
