import dynamic from 'next/dynamic'
import Server from './Server'

const Dynamic = dynamic(async () => await import('./Client'), {
  loading: () => <Server />,
  ssr: false
})

export default Dynamic
