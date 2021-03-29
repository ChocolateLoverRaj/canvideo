import { FC } from 'react'
import { MenuStep, MenuSteps } from '../components/menu-steps'

const App: FC = () => {
  return (
    <MenuSteps current={1} percent={50}>
      <MenuStep title='Step 1'>Content Shown for Step 1 Tab</MenuStep>
      <MenuStep title='Step 2'>Content Shown for Step 2 Tab</MenuStep>
      <MenuStep title='Step 3'>Content Shown for Step 3 Tab</MenuStep>
    </MenuSteps>
  )
}

export default App
