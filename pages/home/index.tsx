import Head from 'next/head'
import Hero from '~/components/home/hero'
import HomeNav from '~/components/home/nav'

const HomePage = () => {
  return (
    <>
      <Head>
        <title>side.domains</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomeNav />
      <Hero />
    </>
  )
}

export default HomePage
