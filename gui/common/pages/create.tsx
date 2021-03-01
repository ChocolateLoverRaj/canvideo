import ApiProps from '../lib/api-props'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'

export interface Props extends ApiProps {
  create: () => Promise<number>
}

const App = (props: Props): JSX.Element => {
  const { create } = props

  const [creating, setCreating] = useState<Promise<number>>()
  const [id, setId] = useState<number>()
  // Handle response
  useEffect(() => {
    creating
      ?.then(setId)
      .catch(() => {
        alert('Error creating video')
      })
  }, [creating])
  return (
    <>
      <Head>
        <title>Create a video with Canvideo</title>
      </Head>
      <h1>Create a video (editor coming soon)</h1>
      <Link href='/'>Main Page</Link>
      <button
        onClick={() => {
          setCreating(create())
        }}
        disabled={creating !== undefined}
      >Test video creating
      </button>
      {id !== undefined && (
        <>
          <br />
          <Link href={`/export?id=${id}`}>View Progress</Link>
        </>
      )}
    </>
  )
}

export default App

export { getStaticProps } from '../lib/apiGetStaticProps'
