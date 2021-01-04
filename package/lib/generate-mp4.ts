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
}

const getFrameFileName = (tempDir: string, frameNumber: number) => join(tempDir, `frame-${frameNumber}.png`)

export default async (frames: Array<Array<Operations>>, options: Options) => {
    let tempDir: string
    if (options.tempDir) {
        await emptyDir(options.tempDir)
        tempDir = options.tempDir
    } else {
        tempDir = await fs.mkdtemp('canvideo')
    }
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
        const outputPath = getFrameFileName(tempDir, index)
        await once(
            canvas.createPNGStream()
                .pipe(createWriteStream(outputPath)),
            'close'
        )
    }))
    const frameInputs = join(tempDir, 'frame-%01d.png')
    const command = `${global.ffmpegPath} -r ${options.fps} -i ${frameInputs} -an -vcodec libx264 -pix_fmt yuv420p -progress pipe:1 -y "${options.outputFile}"`
    await new Promise<void>((resolve, reject) => {
        const ffmpeg = exec(command)
        ffmpeg.stderr?.on('data', data => {
            process.stdout.write(data)
        })
        ffmpeg.once('exit', code => {
            if (!code) {
                resolve()
            } else {
                reject(new Error(`ffmpeg exited with code: ${code}`))
            }
        })
    })
    await Promise.all(new Array<null>(frames.length).fill(null).map(async (empty, index) => (
        fs.rm(getFrameFileName(tempDir, index))
    )))
    if (!options.tempDir) {
        await fs.rmdir(tempDir)
    }
}
