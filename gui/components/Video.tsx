import { FC } from 'react'

interface Props {
  className?: string
}

const Video: FC<Props> = props => {
  const { className } = props

  return (
    <div className={className}>
      Preview coming soon
    </div>
  )
}

export default Video
