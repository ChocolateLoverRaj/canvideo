import { AppProps } from 'next/app'
import 'antd/dist/antd.css'
import { FC } from 'react'
import Header from '../components/Header'
import Head from 'next/head'
import useExports from '../effects/useExports'
import ExportsContext from '../contexts/Exports'

const App: FC<AppProps> = props => {
  const { Component, pageProps } = props

  const exportsState = useExports()

  return (
    <ExportsContext.Provider value={exportsState}>
      <Head>
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='msapplication-TileColor' content='#603cba' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      <Header />
      <Component {...pageProps} />
    </ExportsContext.Provider>
  )
}

export default App
