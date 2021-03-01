import ApiProps from 'gui/lib/api-props'
import BasePage from 'gui/pages/index'
import { FC } from 'react'
import { promises as fs } from 'fs'

const Page: FC<ApiProps> = props => (
  <BasePage
    {...props}
    create={async () => {
      console.log('Creating')
      console.log(await fs.stat('c:/'))
      return 0
    }}
  />
)

export default Page

export { getStaticProps } from 'gui/pages/index'
