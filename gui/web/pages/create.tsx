import ApiProps from '../lib/api-props'
import BasePage from 'gui/pages/create'
import { FC } from 'react'

const App: FC<ApiProps> = props => (
  <BasePage
    create={async () => (
      await (await fetch(props.api, {
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
      })).json()
    ).id}
  />
)

export default App

export { getStaticProps } from '../lib/apiGetStaticProps'
