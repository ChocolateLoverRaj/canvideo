import ApiProps from '../../../lib/api-props'
import api from '../../../lib/api'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'

interface Props extends ApiProps {
  id: string
}

enum States {
  FETCHING = 'fetching',
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected'
}

const App = (props: Props): JSX.Element => {
  const [req, setReq] = useState<Promise<Response>>()
  const [state, setState] = useState<States>(States.FETCHING)
  // Fetch
  useEffect(() => {
    if (req === undefined) {
      setReq(fetch(`${props.api}/${props.id}`))
    } else {
      req.then(async res => {
        const { state } = await res.json()
        setState(state)
      })
    }
  }, [req])
  return (
    <>
      <h1>Generating Video</h1>
      <p>State: {state}</p>
    </>
  )
}

export default App

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => ({
  props: {
    id: params?.id as string,
    api: api
  }
})