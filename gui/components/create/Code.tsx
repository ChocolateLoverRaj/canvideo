import { FC } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import Props from './Props'

const Code: FC<Props> = ({ code: [code, setCode] }) => {
  return (
    <CodeMirror
      value={code}
      extensions={[javascript()]}
      onChange={code => setCode(code)}
    />
  )
}

export default Code
