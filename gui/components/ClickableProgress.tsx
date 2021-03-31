import { FC, MouseEventHandler, useCallback, useRef } from 'react'
import ProgressBar from '@ramonak/react-progress-bar'
import styles from '../styles/ClickableProgress.module.css'

interface Props {
  progress: number
  onChange: (newProgress: number) => void
}

const ClickableProgress: FC<Props> = props => {
  const { progress, onChange } = props

  const ref = useRef<HTMLDivElement>(null)

  const handleClick = useCallback<MouseEventHandler<HTMLDivElement>>(({ clientX }) => {
    onChange(clientX / (ref.current as HTMLDivElement).offsetWidth)
  }, [onChange])

  return (
    // TODO: Contribute to @ramonak/react-progress-bar and make it clickable / add className property.
    <div className={styles.bar} onClick={handleClick} ref={ref}>
      <ProgressBar
        completed={progress * 100}
        isLabelVisible={false}
      />
    </div>
  )
}

export default ClickableProgress
