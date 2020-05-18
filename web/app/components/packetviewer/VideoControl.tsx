import * as React from "react";
import { fromEvent, Subject, BehaviorSubject } from "rxjs";
import { map, takeUntil, distinctUntilChanged, startWith } from "rxjs/operators";
import { Subscriber } from "../Subscriber";

export class VideoControl {
  private element?: HTMLMediaElement;
  readonly timeUpdates = new BehaviorSubject<number>(0);

  setVideoElement(element?: HTMLMediaElement) {
    this.element = element;

    if (!element) {
      return;
    }

    fromEvent(element, "timeupdate")
      .pipe(
        map(() => element.currentTime),
        startWith(element.currentTime),
        distinctUntilChanged(),
      )
      .subscribe(this.timeUpdates);
  }

  get currentTime(): number {
    return this.element ? this.element.currentTime : 0;
  }

  set currentTime(value: number) {
    if (!this.element) {
      return;
    }

    this.element.currentTime = value;
  }
}

const VideoControlContext = React.createContext<VideoControl | undefined>(
  undefined
);

export const VideoContext = VideoControlContext.Provider;

export const VideoConsumer = ({
  children
}: {
  children: (
    videoControl: VideoControl,
    currentTime: number
  ) => React.ReactNode;
}) => {
  return (
    <VideoControlContext.Consumer>
      {videoControl => {
        return videoControl ? (
          <Subscriber observable={videoControl.timeUpdates}>
            {currentTime => children(videoControl, currentTime || 0)}
          </Subscriber>
        ) : null;
      }}
    </VideoControlContext.Consumer>
  );
};

export const VideoProvider = ({
  children
}: {
  children: (videoRef: (instance: HTMLVideoElement | null) => void) => React.ReactNode;
}) => {
  return (
    <VideoControlContext.Consumer>
      {videoControl => {
        return videoControl
          ? children(el => videoControl.setVideoElement(el ? el : undefined))
          : null;
      }}
    </VideoControlContext.Consumer>
  );
};
