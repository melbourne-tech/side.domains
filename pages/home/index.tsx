import Head from 'next/head'

import Footer from '~/components/home/footer'
import Hero from '~/components/home/hero'
import HomeNav from '~/components/home/nav'
import Pricing from '~/components/home/pricing'
import Support from '~/components/home/support'

const title = 'side.domains — Sales pages for your side project domains'
const description =
  'Receive offers on your side project domains with simple sales pages. No commissions, no subscriptions. Secured with SSL/TLS.'

const HomePage = () => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@alaisteryoung" />
        <meta property="og:url" content="https://side.domains/" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content="https://side.domains/side-domains-og.png"
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
