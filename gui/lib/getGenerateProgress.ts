import { FFmpeg } from '@ffmpeg/ffmpeg'

const getGenerateProgress = async (ffmpeg: FFmpeg): Promise<number> => await new Promise(resolve => {
  ffmpeg.setProgress(({ ratio }) => {
    resolve(ratio)
  })
})

export default getGenerateProgress
