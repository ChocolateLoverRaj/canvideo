export interface Size {
  width: number
  height: number
}

const maximizeWithRatio = (aspectRatio: Size, availableSpace: Size): Size => {
  const scaleIfMaximizeWidth = availableSpace.width / aspectRatio.width
  const scaleIfMaximizeHeight = availableSpace.height / aspectRatio.height
  const scaleToUse = Math.min(scaleIfMaximizeWidth, scaleIfMaximizeHeight)
  return {
    width: aspectRatio.width * scaleToUse,
    height: aspectRatio.height * scaleToUse
  }
}

export default maximizeWithRatio
