import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import { useEffect } from 'react'
import { useIsInitialLoadFinished } from '../contexts/preloaded'
import { Database } from '../database.types'
import { getRange } from '../pagination'
import supabase from '../supabase'

export type Domain = Database['public']['Tables']['domain_names']['Row']

export type DomainSort =
  | 'created_at_desc'
  | 'expiry_date_asc'
  | 'name_asc'
  | 'available'

const LIMIT = 30

export async function getDomainNames(
  page: number,
  sort: DomainSort = 'created_at_desc',
  search?: string,
  signal?: AbortSignal
) {
  const [from, to] = getRange(page, LIMIT)
  let query = supabase.from('domain_names').select('*', { count: 'exact' })

  if (search) {
    query = query.ilike('domain_name', `%${search}%`)
  }

  switch (sort) {
    case 'created_at_desc':
      query = query.order('created_at', { ascending: false, nullsFirst: false })
      break
    case 'expiry_date_asc':
      query = query.order('expires_at', { ascending: true, nullsFirst: false })
      break
    case 'name_asc':
      query = query.order('domain_name', { ascending: true, nullsFirst: false })
      break
    case 'available':
      query = query
        .order('status', { ascending: false, nullsFirst: false })
        .order('expires_at', { ascending: true, nullsFirst: false })
      break
  }

  query = query.range(from, to)

  if (signal) {
    query = query.abortSignal(signal)
  }

  const { data, error, count } = await query
  if (error) {
    throw error
  }

  return { domainNames: data, count }
}

export function useDomainNamesLiveQuery(
  sort: DomainSort = 'created_at_desc',
  search?: string
) {
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

          queryClient.setQueriesData(
            { queryKey: ['domain-names', sort, search] },
            (old: any) =>
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
    queryKey: ['domain-names', sort, search],
    queryFn: async ({ pageParam, signal }) =>
      getDomainNames(pageParam, sort, search, signal),
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
