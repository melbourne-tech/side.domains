import { useQuery } from '@tanstack/react-query'
import { useIsInitialLoadFinished } from '../contexts/preloaded'
import supabase from '../supabase'

export async function getSessionStatus(sessionId?: string) {
  if (!sessionId) {
    throw new Error('sessionId is required')
  }

  const query = supabase.functions.invoke('stripe-session-status', {
    body: { sessionId },
  })

  const { data, error } = await query
  if (error) {
    throw error
  }

  return data?.status as string | undefined
}

export function useSessionStatusQuery(sessionId?: string) {
  const isFinishedLoading = useIsInitialLoadFinished()

  return useQuery({
    queryKey: ['stripe-session-status', sessionId],
    queryFn: () => getSessionStatus(sessionId),
    enabled: isFinishedLoading && Boolean(sessionId),
    refetchInterval: 1000,
  })
}
