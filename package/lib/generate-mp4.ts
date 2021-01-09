import { Operations } from './operations'
import global from './global'
import { createCanvas } from 'canvas'
import { emptyDir } from 'fs-extra'
import { createWriteStream, promises as fs } from 'fs'
import { join } from 'path'
import { once } from 'events'
import { exec } from 'child_process'

export interface Options {
  fps: number
  width: number
  height: number
  outputFile: string
  tempDir?: string
  prefix?: string | number
}

export default async (frames: Operations[][], options: Options): Promise<void> => {
  let tempDir: string
  if (options.tempDir !== undefined) {
    await emptyDir(options.tempDir)
    tempDir = options.tempDir
  } else {
    tempDir = await fs.mkdtemp('canvideo')
  }

  const getPrefix = (): string => join(tempDir, `canvideo-${options.prefix !== undefined ? `${options.prefix}-` : ''}frame-`)
  const getFrameFileName = (frameNumber: number): string => `${getPrefix()}${frameNumber}.png`

  await Promise.all(frames.map(async (frame, index) => {
    const canvas = createCanvas(options.width, options.height)
    const ctx = canvas.getContext('2d')
    for (const operation of frame) {
      if (operation[0] === 'fillRect') {
        ctx.fillRect(...operation[1])
      } else {
        ctx.fillStyle = operation[1][0]
      }
    }
    const outputPath = getFrameFileName(index)
    await once(
      canvas.createPNGStream()
        .pipe(createWriteStream(outputPath)),
      'close'
    )
  }))
  const frameInputs = `${getPrefix()}%01d.png`
  const command = `${global.ffmpegPath} -r ${options.fps} -i ${frameInputs} -an -vcodec libx264 -pix_fmt yuv420p -progress pipe:1 -y "${options.outputFile}"`
  await new Promise<void>((resolve, reject) => {
    const ffmpeg = exec(command)
    ffmpeg.stderr?.on('data', data => {
      process.stdout.write(data)
    })
    ffmpeg.once('exit', code => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(code !== null
          ? `ffmpeg exited with code: ${code}`
          : 'ffmpeg exited with no code'
        ))
      }
    })
  })
  await Promise.all(new Array<null>(frames.length).fill(null).map(async (empty, index) => (
    await fs.unlink(getFrameFileName(index))
  )))
  if (options.tempDir === undefined) {
    await fs.rmdir(tempDir)
  }
}
