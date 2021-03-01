import ApiProps from '../lib/api-props'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Props extends ApiProps {
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
      <h1>Canvideo GUI</h1>
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
