import { FC, useContext } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import CreateContext from './CreateContext'

const Code: FC = () => {
  const [code, setCode] = useContext(CreateContext)

  return (
    <CodeMirror
      value={code}
      extensions={[javascript()]}
      onChange={code => setCode(code)}
    />
  )
}

export default Code
