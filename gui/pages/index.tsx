import ApiProps from '../lib/api-props'
import api from '../lib/api'
import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const App = (props: ApiProps): JSX.Element => {
  const [res, setRes] = useState<Promise<Response>>()
  const [id, setId] = useState<number>()
  // Handle response
  useEffect(() => {
    if (res) {
      res.then(async res => {
        const { id } = await res.json()
        setId(id)
      })
    }
  }, [res])
  return (
    <>
      <h1>Canvideo GUI</h1>
      <button
        onClick={() => {
          setRes(fetch(props.api, {
            method: 'POST',
            body: JSON.stringify({
              fps: 24,
              width: 200,
              height: 200,
              frames: new Array(100).fill(null).map((v, index) => [
                ['setFillStyle', ['pink']],
                ['fillRect', [index, index, 100, 100]]
              ])
            }),
            headers: [
              ['Content-Type', 'application/json']
            ]
          }))
        }}
        disabled={res !== undefined}
      >Test video creating
      </button>
      {id !== undefined && (
        <>
          <br />
          <Link href={`/exports/${id}/progress`}>View Progress</Link>
        </>
      )}
    </>
  )
}

export default App

export const getStaticProps: GetStaticProps<ApiProps> = async () => ({
  props: {
    api: api
  }
})
