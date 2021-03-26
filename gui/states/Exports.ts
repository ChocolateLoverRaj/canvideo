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

interface FfmpegBaseExport {
  state: FfmpegExportStates
  id: number
  frames: Operations[][]
  fps: number
  width: number
  height: number
  completedFrames: number
  ffmpeg: FFmpeg
}

interface FfmpegLoadingExport extends FfmpegBaseExport {
  state: FfmpegExportStates.LOADING_FFMPEG
  promise: Promise<unknown>
}

interface FfmpegCreatingExport extends FfmpegBaseExport {
  state: FfmpegExportStates.CREATING_PNG
  canvas: HTMLCanvasElement
  promise: Promise<Uint8Array>
}

interface FfmpegGeneratingExport extends FfmpegBaseExport {
  state: FfmpegExportStates.GENERATING_VIDEO
  promise: Promise<Uint8Array>
}

export type FfmpegExportData = FfmpegLoadingExport | FfmpegCreatingExport | FfmpegGeneratingExport

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
