import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import { useEffect } from 'react'
import { useIsInitialLoadFinished } from '../contexts/preloaded'
import { Database } from '../database.types'
import { getRange } from '../pagination'
import supabase from '../supabase'

export type Domain = Database['public']['Tables']['domain_names']['Row']

const LIMIT = 30

export async function getDomainNames(page: number, signal?: AbortSignal) {
  const [from, to] = getRange(page, LIMIT)
  let query = supabase
    .from('domain_names')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (signal) {
    query = query.abortSignal(signal)
  }

  const { data, error, count } = await query
  if (error) {
    throw error
  }

  return { domainNames: data, count }
}

export function useDomainNamesLiveQuery() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('public:domain_names:UPDATE')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'domain_names',
        },
        (payload) => {
          const updated = payload.new

          queryClient.setQueryData(['domain-names'], (old: any) =>
            produce(old, (draft) => {
              for (let page of draft.pages) {
                for (let domain of page.domainNames) {
                  if (domain.id === updated.id) {
                    Object.assign(domain, updated)
                    return
                  }
                }
              }
            })
          )
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const isFinishedLoading = useIsInitialLoadFinished()

  return useInfiniteQuery({
    queryKey: ['domain-names'],
    queryFn: async ({ pageParam, signal }) => getDomainNames(pageParam, signal),
    enabled: isFinishedLoading,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const lastPageDomainNames = lastPage.domainNames
      if (lastPageDomainNames.length < LIMIT) {
        return undefined
      }

      return allPages.length
    },
  })
}
