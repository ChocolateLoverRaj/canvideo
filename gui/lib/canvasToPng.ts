const canvasToPng = async (canvas: HTMLCanvasElement): Promise<Uint8Array> => await new Promise((resolve, reject) => {
  canvas.toBlob(blob => {
    if (blob !== null) {
      blob.arrayBuffer()
        .then(arrayBuffer => new Uint8Array(arrayBuffer))
        .then(resolve, reject)
    } else {
      reject(new Error('No blob'))
    }
  })
})

export default canvasToPng
