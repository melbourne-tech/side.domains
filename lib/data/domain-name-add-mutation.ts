import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAPI } from '../fetcher'

export interface DomainAddVariables {
  domainName: string
}

export function useDomainAddMutation() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ domainName }: DomainAddVariables) => {
      await fetchAPI('/domains', 'POST', {
        domainName,
      })
    },
    {
      async onSuccess() {
        await queryClient.invalidateQueries(['domain-names'])
      },
    }
  )
}
