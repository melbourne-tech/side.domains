import Head from 'next/head'
import Footer from '~/components/footer'
import Features from '~/components/home/features'
import Hero from '~/components/home/hero'
import HomeNav from '~/components/home/nav'
import Pricing from '~/components/home/pricing'
import Support from '~/components/home/support'

const title = 'side.domains — Your toolkit for side project domains'
const description =
  'Get notified when your dream domain expires, create simple sales pages for your unused domains, and easily track whois information. Features include: Email Domain expiry alerts, For sale pages for your unused domains, Easy Whois lookup & watching, and more.'

const HomePage = () => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@melb_dot_tech" />
        <meta property="og:url" content="https://side.domains/" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content="https://side.domains/side-domains-og.png"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="side.domains" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <HomeNav />
      <Hero />
      <Features />
      <div className="text-center py-12 px-4 bg-gray-900 text-white">
        <h2 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Bought another domain? Us too.
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-100">
          Helping you to justify your domain-buying habit.
        </p>
      </div>
      <Pricing />
      <Support />

      <Footer />
    </>
  )
}

export default HomePage
