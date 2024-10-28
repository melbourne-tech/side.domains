import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import * as Fathom from 'fathom-client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Toaster } from '~/components/ui/toaster'
import { AuthContextProvider } from '~/lib/contexts/auth'
import { PreloadedContextProvider } from '~/lib/contexts/preloaded'
import '~/lib/globals.css'
import { useRootQueryClient } from '~/lib/query-client'
import { AppPropsWithLayout } from '~/lib/types'
import { identity } from '~/lib/void'

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter()
  const queryClient = useRootQueryClient()

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FATHOM_SITE_ID) {
      return
    }

    Fathom.load(process.env.NEXT_PUBLIC_FATHOM_SITE_ID, {
      includedDomains: ['side.domains', 'www.side.domains', 'app.side.domains'],
    })

    function onRouteChangeComplete() {
      Fathom.trackPageview()
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getLayout = Component.getLayout ?? identity

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <PreloadedContextProvider>
          {getLayout(<Component {...pageProps} />)}
        </PreloadedContextProvider>
      </AuthContextProvider>

      <Toaster />
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default CustomApp
