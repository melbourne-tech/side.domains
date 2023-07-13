import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from '~/components/ui/toaster'
import { AuthContextProvider } from '~/lib/auth'
import '~/lib/globals.css'
import { useRootQueryClient } from '~/lib/query-client'
import { AppPropsWithLayout } from '~/lib/types'
import { identity } from '~/lib/void'

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const queryClient = useRootQueryClient()

  const getLayout = Component.getLayout ?? identity

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        {getLayout(<Component {...pageProps} />)}
      </AuthContextProvider>

      <Toaster />
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default MyApp
