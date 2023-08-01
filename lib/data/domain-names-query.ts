import { useQuery } from '@tanstack/react-query'
import { useIsInitialLoadFinished } from '../contexts/preloaded'
import supabase from '../supabase'

export async function getDomainNames(signal?: AbortSignal) {
  const query = supabase
    .from('domain_names')
    .select('*')
    .order('updated_at', { ascending: false })
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
    }
  )
}
