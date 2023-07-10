import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from '~/components/ui/toaster'
import '~/lib/globals.css'
import { useRootQueryClient } from '~/lib/query-client'

function MyApp({ Component, pageProps }) {
  const queryClient = useRootQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />

      <Toaster />
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default MyApp
