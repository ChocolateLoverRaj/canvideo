import { createContext, Context } from 'react'
import VideoPlayerStore from './VideoPlayerStore'
import { VideoRenderer } from './VideoRenderer'
import { ObservablePromise } from 'mobx-observable-promise'

export interface IVideoPlayerContext {
  renderer: ObservablePromise<() => Promise<VideoRenderer>>
  playerStore: VideoPlayerStore
}

const VideoPlayerContext = (createContext as Function)() as Context<IVideoPlayerContext>

export default VideoPlayerContext
