import { FC, useState, useEffect } from 'react'
import router from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { MainPageProps } from '../lib/MainPageProps'
import ApiProps from '../lib/api-props'

enum States {
  FETCHING = 'fetching',
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected'
}

export type Props = MainPageProps & ApiProps

const App: FC<Props> = props => {
  const {mainPage, api} = props

  const [req, setReq] = useState<Promise<Response>>()
  const [state, setState] = useState<States>(States.FETCHING)
  
  const id = router.router?.query.id?.toString()

  // Fetch
  useEffect(() => {
    if (req === undefined && id !== undefined) {
      setReq(fetch(`${api}/progress?id=${id}`, {
        headers: [['Accept', 'application/json']]
      }))
    }
    req
      ?.then(async res => {
        const { state } = await res.json()
        setState(state)
      })
      .catch(() => {
        setState(States.REJECTED)
      })
  }, [req, id])
  return (
    <>
      <Head>
        <title>Export {'\u2022'} Canvideo</title>
      </Head>
      {id !== undefined
        ? (
          <>
            <h1>Generating Video</h1>
            <p>State: {state}</p>
            {state === States.RESOLVED && (
              <video controls>
                <source src={`${api}/output?id=${id}`} type='video/mp4' />
                Your browser does not support the video tag
              </video>
            )}
          </>
        )
        : (
          <>
            <p>No id given.</p>
            <Link href={mainPage}>Return to main page</Link>
          </>
        )}
    </>
  )
}

export default App

export { getStaticProps } from '../lib/apiGetStaticProps'
