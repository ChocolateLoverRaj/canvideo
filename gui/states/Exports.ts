import { FFmpeg } from '@ffmpeg/ffmpeg'
import { Operations } from 'canvideo/lib/operations'

export enum RecorderExportStates {
  WAITING_FOR_ANIMATION_FRAME,
  RECORDING_FRAME,
  WAITING_FOR_DATA,
  COMPLETE
}

interface RecorderBaseExport {
  canvas: HTMLCanvasElement
  recorder: any
  state: RecorderExportStates
  fps: number
  frames: Operations[][]
  currentFrame: number
  width: number
  height: number
  track: any
  url?: string
}

interface RecorderWaitingExport extends RecorderBaseExport {
  state: RecorderExportStates.WAITING_FOR_ANIMATION_FRAME
}

export interface RecorderRecordingExport extends RecorderBaseExport {
  state: RecorderExportStates.RECORDING_FRAME
  startTime: number
}

interface RecorderWaitingDataExport extends RecorderBaseExport {
  state: RecorderExportStates.WAITING_FOR_DATA
}

interface RecorderCompleteExport extends RecorderBaseExport{
  state: RecorderExportStates.COMPLETE
  url: string
}

export type RecorderExportData = RecorderWaitingExport | RecorderRecordingExport | RecorderWaitingDataExport | RecorderCompleteExport

export enum FfmpegExportStates {
  LOADING_FFMPEG,
  CREATING_PNG,
  GENERATING_VIDEO,
  COMPLETE
}

export interface FfmpegExportData {
  // Always need these properties
  state: FfmpegExportStates
  id: number
  frames: Operations[][]
  fps: number
  width: number
  height: number
  completedFrames: number
  ffmpeg: FFmpeg
  generateProgress: number

  // For LOADING_FFMPEG
  loadPromise?: Promise<unknown>

  // For CREATING_PNG
  canvas?: HTMLCanvasElement
  renderPromise?: Promise<Uint8Array>

  // For GENERATING_VIDEO
  progressPromise?: Promise<number>

  // For COMPLETE
  url?: string
}

export enum WebmExportStates {
  RENDERING_FRAMES,
  GENERATING_BLOB,
  COMPLETE
}

export interface WebmExportData {
  state: WebmExportStates
  canvas: HTMLCanvasElement
  width: number
  height: number
  videoWriter: any
  frames: Operations[][]
  completedFrames: number

  // For GENERATING_BLOB
  generatePromise?: Promise<Blob>

  // For COMPLETE
  url?: string
}

export enum ExportTypes {
  MEDIA_RECORDER,
  FFMPEG,
  WEBM_WRITER
}

interface BaseExport {
  type: ExportTypes
  data: any
}

export interface RecorderExport extends BaseExport {
  type: ExportTypes.MEDIA_RECORDER
  data: RecorderExportData
}

export interface FfmpegExport extends BaseExport {
  type: ExportTypes.FFMPEG
  data: FfmpegExportData
}

export interface WebmExport extends BaseExport {
  type: ExportTypes.WEBM_WRITER
  data: WebmExportData
}

export type Export = RecorderExport | FfmpegExport | WebmExport

export type Exports = Set<Export>
