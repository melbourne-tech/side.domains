import { useQuery } from '@tanstack/react-query'
import { useIsInitialLoadFinished } from '../contexts/preloaded'
import supabase from '../supabase'
import { Database } from '../database.types'

export type Domain = Database['public']['Tables']['domain_names']['Row']

export async function getDomainNames(signal?: AbortSignal) {
  const query = supabase
    .from('domain_names')
    .select('*')
    .order('created_at', { ascending: false })
  if (signal) {
    query.abortSignal(signal)
  }

  const { data, error } = await query
  if (error) {
    throw error
  }

  return data
}

export function useDomainNamesQuery() {
  const isFinishedLoading = useIsInitialLoadFinished()

  return useQuery(
    ['domain-names'],
    async ({ signal }) => getDomainNames(signal),
    {
      enabled: isFinishedLoading,
      refetchInterval(data) {
        if (data?.some((d) => d.status === 'unknown')) {
          return 5000
        }

        return false
      },
    }
  )
}
