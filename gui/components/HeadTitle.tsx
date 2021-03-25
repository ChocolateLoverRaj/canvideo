import Head from 'next/head'
import { FC } from 'react'

interface Props {
  paths: string[]
}

const HeadTitle: FC<Props> = props => {
  const { paths } = props

  return (
    <Head>
      <title>{paths.join(' \u00b7 ')}</title>
    </Head>
  )
}

export default HeadTitle
