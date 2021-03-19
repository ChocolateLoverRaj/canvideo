import BasePage from 'gui/pages/create'
import { FC } from 'react'
import { promises as fs } from 'fs'

const Page: FC = () => (
  <BasePage
    create={async () => {
      console.log('Creating')
      console.log(await fs.stat('c:/'))
      return 0
    }}
  />
)

export default Page
