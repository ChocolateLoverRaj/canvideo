import { FC } from 'react'
import { Empty } from 'antd'
import Link from 'next/link'

const NoExports: FC = () => (
  <Empty
    description={<>No exports. Click <Link href='/create'>here</Link> to export a video.</>}
  />)

export default NoExports
