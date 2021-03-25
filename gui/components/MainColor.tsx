import { FC, ReactNode } from 'react'
import styles from '../styles/MainColor.module.css'

interface Props {
  isMainColor: boolean
  children: ReactNode
}

const MainColor: FC<Props> = props => {
  const { isMainColor, children } = props

  return isMainColor
    ? <span className={styles.mainColor}>{children}</span>
    : <>{children}</>
}

export default MainColor
