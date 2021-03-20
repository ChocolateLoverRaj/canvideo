import {Operations} from 'canvideo/lib/operations'
import generate from 'canvideo/dist/generate-mp4'
import { join} from 'path'
import { emptyDir, ensureDir } from 'fs-extra'
import getState, { StateObj } from './getState'
import {promises as fs} from 'fs'

interface Options {
  fps: number
  width: number
  height: number
}

class Generator {
  videos = new Map<number, StateObj<number>>()
  latestId = 0
  generatedDir: string
  outputDir: string
  tempDir: string
  ready: Promise<unknown>

  constructor (generatedDir: string) {
    this.generatedDir = generatedDir
    this.outputDir = join(generatedDir, 'output')
    this.tempDir = join(generatedDir, 'temp')
    this.ready = ensureDir(generatedDir).then(async () => await Promise.all([
      emptyDir(this.outputDir),
      emptyDir(this.tempDir)
    ]))
  }

  getVideoPath (id: string | number): string {
    return join(this.outputDir, `${id}.mp4`)
  }

  generate(operations: Operations[][], options: Options): number {
    const id = this.latestId++
    const outputFile = this.getVideoPath(id)
    this.videos.set(id, getState(this.ready.then(() => generate(operations, {
      ...options,
      outputFile: outputFile,
      tempDir: this.tempDir,
      prefix: id
    }))
      .then(async () => await fs.stat(outputFile))
      .then(({ size }) => size)))
    return id
  }
}

export default Generator
