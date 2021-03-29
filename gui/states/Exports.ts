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
  GENERATING_VIDEO
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

  // For LOADING_FFMPEG
  loadPromise?: Promise<unknown>

  // For CREATING_PNG
  canvas?: HTMLCanvasElement
  renderPromise?: Promise<Uint8Array>

  // For GENERATING_VIDEO
  progress?: number
  progressPromise?: Promise<number>
}

export enum ExportTypes {
  MEDIA_RECORDER,
  FFMPEG
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

export type Export = RecorderExport | FfmpegExport

export type Exports = Set<Export>
