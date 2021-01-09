import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Props {
  api: string
}

const App = (props: Props): JSX.Element => {
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
              fps: 1,
              width: 200,
              height: 200,
              frames: [
                [
                  ['setFillStyle', ['pink']],
                  ['fillRect', [0, 0, 100, 100]]
                ],
                [
                  ['setFillStyle', ['pink']],
                  ['fillRect', [25, 25, 100, 100]]
                ],
                [
                  ['setFillStyle', ['pink']],
                  ['fillRect', [50, 50, 100, 100]]
                ],
                [
                  ['setFillStyle', ['pink']],
                  ['fillRect', [75, 75, 100, 100]]
                ]
              ]
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

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      api: process.env.NODE_ENV === 'production'
        ? process.env.VERCEL_ENV === 'production'
          ? 'https://canvideo.herokuapp.com'
          : `https://canvideo-br-${process.env.VERCEL_GIT_COMMIT_REF}.herokuapp.com`
        : 'http://localhost:2990'
    }
  }
}
