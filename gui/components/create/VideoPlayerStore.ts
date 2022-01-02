import { computed, makeObservable, observable } from 'mobx'
import { now } from 'mobx-utils'

class VideoPlayerStore {
  /**
   * The computer's time when the video was unpaused. Will be `undefined` if video is not playing
   */
  dateAtStart?: number = undefined
  /**
   * The time in the video which the video is paused in (ms). Will be `undefined` if video is not paused
   */
  pausedAtTime? = 0

  constructor () {
    makeObservable(this, {
      dateAtStart: observable,
      pausedAtTime: observable,
      time: computed,
      paused: computed
    })
  }

  /**
   * The current time in the video, whether it is playing or paused (ms)
   */
  get time (): number {
    // If the video is playing, calculate the time in the video
    // If the video is paused, we've already stored the time it's at
    // console.log(now('frame'), this.dateAtStart, this.pausedAtTime)
    return this.dateAtStart !== undefined
      ? now('frame') - this.dateAtStart
      : this.pausedAtTime as number
  }

  set time (time) {
    // If the video is playing, shift the time started so the computed time is the set time
    // If the video is paused, set the paused time
    if (this.dateAtStart !== undefined) {
      this.dateAtStart -= time - this.time
    } else {
      this.pausedAtTime = time
    }
  }

  get paused (): boolean {
    return this.pausedAtTime !== undefined
  }

  set paused (paused: boolean) {
    if (paused) {
      // Set the video to be paused
      console.log(this.time)
      this.pausedAtTime = this.time
      this.dateAtStart = undefined
    } else {
      // Set the video to be playing, starting now
      this.dateAtStart = now('frame') - (this.pausedAtTime as number)
      this.pausedAtTime = undefined
    }
  }
}

export default VideoPlayerStore
