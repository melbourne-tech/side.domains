import Head from 'next/head'

import Footer from '~/components/home/footer'
import Hero from '~/components/home/hero'
import HomeNav from '~/components/home/nav'
import Pricing from '~/components/home/pricing'
import Support from '~/components/home/support'

const HomePage = () => {
  return (
    <>
      <Head>
        <title>side.domains</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomeNav />
      <Hero />
      <Pricing />
      <Support />

      <Footer />
    </>
  )
}

export default HomePage
