import { GetStaticProps } from 'next'

const App = (): JSX.Element => <h1>Canvideo GUI</h1>

export default App

export const getStaticProps: GetStaticProps = async () => {
  console.log(process.env)
  return {
    props: {}
  }
}
