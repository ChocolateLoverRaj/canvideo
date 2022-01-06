import { FC, useEffect } from 'react'

export interface CanvasErrorProps {
  error: Error
}

const CanvasError: FC<CanvasErrorProps> = ({ error }) => {
  useEffect(() => {
    console.error(error)
  }, [error])

  return <>Error Rendering Video. View console to see error.</>
}

export default CanvasError
