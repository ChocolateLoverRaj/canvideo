import never from 'never'
import Link from 'next/link'
import { FC } from 'react'
import ExportStates from '../lib/ExportStates'
import { MainPageProps } from '../lib/MainPageProps'

export interface ExportProps extends MainPageProps {
  exportState: ExportStates
  videoSrc?: string
}

const Export: FC<ExportProps> = props => {
  const { exportState, videoSrc, mainPage } = props

  switch (exportState) {
    case ExportStates.NO_ID:
      return (
        <>
          <p>No id given.</p>
          <Link href={mainPage}>Return to main page</Link>
        </>
      )
    case ExportStates.FETCHING:
      return <p>Fetching video status</p>
    case ExportStates.PENDING:
      return <p>Generating video</p>
    case ExportStates.RESOLVED:
      return (
        <>
          <p>Video generated</p>
          <video controls>
            <source src={videoSrc ?? never('Video is resolved, but no videoSrc given')} type='video/mp4' />
              Your browser does not support the video tag
          </video>
        </>
      )
    case ExportStates.REJECTED:
      return <p>There was an error generating your video.</p>
  }
}

export default Export
