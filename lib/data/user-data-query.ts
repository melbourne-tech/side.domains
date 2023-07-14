import { useQuery } from '@tanstack/react-query'
import { useIsInitialLoadFinished } from '../contexts/preloaded'
import { getQueryClient } from '../query-client'
import supabase from '../supabase'

export type UserData = {
  hasPurchased: boolean
  showBranding: boolean
}

export async function getUserData(signal?: AbortSignal) {
  const query = supabase.from('user_data').select('data')
  if (signal) {
    query.abortSignal(signal)
  }

  const { data, error } = await query.single()
  if (error) {
    throw error
  }

  return {
    hasPurchased: data.data?.['has_purchased'] ?? false,
    showBranding: data.data?.['show_branding'] ?? true,
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
