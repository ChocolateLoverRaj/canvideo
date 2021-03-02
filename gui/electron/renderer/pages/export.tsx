import ApiProps from 'gui/lib/api-props'
import BasePage from 'gui/pages/export'
import { FC } from 'react'
import mainPage from '../lib/mainPage'

const Page: FC<ApiProps> = props => (
  <BasePage
    {...props}
    mainPage={mainPage}
  />
)

export default Page
