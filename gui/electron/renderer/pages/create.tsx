import BasePage from 'gui/pages/create'
import { FC, useEffect } from 'react'
import { promises as fs } from 'fs'
import { ipcRenderer } from 'electron'

const Page: FC = () => {
  useEffect(() => {
    console.log(ipcRenderer.sendSync('myEvent'))
  }, [])
  return (
    <BasePage
      create={async () => {
        console.log('Creating')
        console.log(await fs.stat('c:/'))
        return 0
      }}
    />
  )
}

export default Page
