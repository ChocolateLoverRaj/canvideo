import { Operations } from './operations'
import { createCanvas } from 'canvas'
import { emptyDir } from 'fs-extra'
import { createWriteStream, promises as fs } from 'fs'
import { join } from 'path'
import { once } from 'events'

export interface Options {
    width: number
    height: number
    outputFile: string
    tempDir?: string
}

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
            }
        }
        const outputPath = join(tempDir, `frame-${index}.png`)
        await once(
            canvas.createPNGStream()
                .pipe(createWriteStream(outputPath)),
            'close'
        )
    }))
}
