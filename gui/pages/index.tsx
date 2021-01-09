import { GetStaticProps } from 'next'

interface Props {
  api: string
}

const App = (props: Props): JSX.Element => {
  console.log(props.api)
  return <h1>Canvideo GUI</h1>
}

export default App

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      api: process.env.NODE_ENV === 'production'
        ? process.env.VERCEL_ENV === 'production'
          ? 'https://canvideo.herokuapp.com'
          : `https://canvideo-br-${process.env.VERCEL_GIT_COMMIT_REF}.herokuapp.com`
        : 'localhost:2990'
    }
  }
}
