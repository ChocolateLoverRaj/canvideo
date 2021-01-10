import ApiProps from '../../../lib/api-props'
import api from '../../../lib/api'
import { GetServerSideProps } from 'next'
import Link from 'next/link'

interface Props extends ApiProps {
  id: string
}

const App = (props: Props): JSX.Element => (
  <>
    <p>If video is not working <Link href={`/exports/${props.id}/progress`}>check if it is done being exported</Link></p>
    <video controls>
      <source src={`${props.api}/${props.id}/output`} type='video/mp4' />
      Your browser does not support the video tag
    </video>
  </>
)

export default App

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => ({
  props: {
    id: params?.id as string,
    api: api
  }
})
