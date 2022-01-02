import { createContext, Context } from 'react'
import VideoPlayerStore from './VideoPlayerStore'
import { VideoRenderer } from './VideoRenderer'

export interface IVideoPlayerContext {
  renderer?: VideoRenderer
  playerStore: VideoPlayerStore
}

const VideoPlayerContext = (createContext as Function)() as Context<IVideoPlayerContext>

export default VideoPlayerContext
