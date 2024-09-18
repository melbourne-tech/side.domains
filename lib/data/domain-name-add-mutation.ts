import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAPI } from '../fetcher'
import supabase from '../supabase'

export interface DomainAddVariables {
  domainName: string
}

export function useDomainAddMutation() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ domainName }: DomainAddVariables) => {
      const { data, error } = await supabase.from('domain_names').insert({
        domain_name: domainName,
      })

      if (error) {
        throw error
      }

      return data
    },
    {
      async onSuccess() {
        await queryClient.invalidateQueries(['domain-names'])
      },
    }
  )
}
