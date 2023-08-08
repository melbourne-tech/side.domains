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
        <title>side.domains — Sales pages for your side project domains</title>
        <meta
          name="description"
          content="Receive offers on your side project domains with simple sales pages. No commissions, no subscriptions. Secured with SSL/TLS."
        />
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
