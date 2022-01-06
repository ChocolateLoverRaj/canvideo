
import { transform } from '@babel/standalone'
import never from 'never'
import babelPlugin from './babelPlugin'

const moduleToWorker = (moduleString: string): string => {
  const { code } = transform(moduleString, {
    plugins: [babelPlugin]
  })
  return code ?? never()
}

export default moduleToWorker
