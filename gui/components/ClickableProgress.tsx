import { FC, MouseEventHandler, useCallback, useRef } from 'react'
import styles from '../styles/ClickableProgress.module.css'
import { Progress } from 'antd'

interface Props {
  progress: number
  onChange: (newProgress: number) => void
}

const ClickableProgress: FC<Props> = props => {
  const { progress, onChange } = props

  const ref = useRef<HTMLDivElement>(null)
  const otherRef = useRef<Progress>(null)

  const handleClick = useCallback<MouseEventHandler<HTMLDivElement>>(({ clientX }) => {
    onChange(clientX / (ref.current as HTMLDivElement).offsetWidth)
    console.log(otherRef)
  }, [onChange])

  return (
    <div onClick={handleClick} ref={ref}>
      {/* TODO: Progress ref and onClick */}
      <Progress
        percent={progress * 100}
        showInfo={false}
        ref={otherRef}
        className={styles.bar}
      />
    </div>
  )
}

export default ClickableProgress
