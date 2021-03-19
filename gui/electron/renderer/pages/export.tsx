import ExportStates from 'gui/lib/ExportStates'
import BasePage from 'gui/pages/export'
import { FC } from 'react'
import mainPage from '../lib/mainPage'

const Page: FC = () => (
  // TODO: Actually get progress
  <BasePage
    mainPage={mainPage}
    exportState={ExportStates.REJECTED}
  />
)

export default Page
