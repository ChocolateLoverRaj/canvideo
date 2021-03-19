import ApiProps from '../lib/api-props'
import BasePage from 'gui/pages/export'
import { FC, useEffect, useState } from 'react'
import mainPage from '../lib/mainPage'
import { useRouter } from 'next/router'
import getId from 'gui/lib/getId'
import ExportStates from 'gui/lib/ExportStates'
import never from 'never'

const resMap = {
  pending: ExportStates.PENDING,
  resolved: ExportStates.RESOLVED,
  rejected: ExportStates.REJECTED
}

const App: FC<ApiProps> = props => {
  const { api } = props

  const router = useRouter()

  const [req, setReq] = useState<Promise<Response>>()
  const [exportState, setExportState] = useState<ExportStates>(ExportStates.NO_ID)

  const id = getId(router)

  // Fetch progress
  useEffect(() => {
    if (id !== undefined) {
      setReq(fetch(`${api}/progress?id=${id}`))
      setExportState(ExportStates.FETCHING)
    }
  }, [api, id])

  // Handle req response
  useEffect(() => {
    let canceled = false
    req
      ?.then(async res => {
        if (canceled) return
        const { state } = await res.json()
        if (canceled) return
        setExportState(resMap[state])
        setReq(undefined)
      })
      .catch(() => {
        alert('Error fetching progress')
      })
    return () => {
      canceled = true
    }
  }, [req])

  const videoSrc = exportState === ExportStates.RESOLVED
    ? `${api}/output?id=${id ?? never('No id')}`
    : undefined

  return (
    <BasePage
      {...props}
      mainPage={mainPage}
      exportState={exportState}
      videoSrc={videoSrc}
    />
  )
}

export default App

export { getStaticProps } from '../lib/apiGetStaticProps'
