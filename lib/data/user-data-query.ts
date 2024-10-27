import { useQuery } from '@tanstack/react-query'
import { useIsInitialLoadFinished } from '../contexts/preloaded'
import { getQueryClient } from '../query-client'
import supabase from '../supabase'

export type UserData = {
  isSubscribed: boolean
  isLifetime: boolean
}

export async function getUserData(signal?: AbortSignal) {
  const query = supabase
    .from('user_data')
    .select('user_id,is_subscribed,stripe_subscription_id')
  if (signal) {
    query.abortSignal(signal)
  }

  const { data, error } = await query.single()
  if (error) {
    throw error
  }

  return {
    isSubscribed: data.is_subscribed,
    isLifetime: data.stripe_subscription_id === null,
  } as UserData
}

export function useUserDataQuery() {
  const isFinishedLoading = useIsInitialLoadFinished()

  return useQuery(['user-data'], async ({ signal }) => getUserData(signal), {
    enabled: isFinishedLoading,
  })
}

export function prefetchUserData() {
  const queryClient = getQueryClient()

  return queryClient.prefetchQuery(['user-data'], ({ signal }) =>
    getUserData(signal)
  )
}
