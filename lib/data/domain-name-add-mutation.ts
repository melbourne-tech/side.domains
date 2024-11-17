import { FunctionsHttpError } from '@supabase/supabase-js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '../supabase'

export interface DomainAddVariables {
  domainName: string
}

export function useDomainAddMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ domainName }: DomainAddVariables) => {
      const { data, error } = await supabase.functions.invoke('add-domain', {
        body: { domainName },
      })

      if (error) {
        if (error instanceof FunctionsHttpError) {
          const { code, message } = await error.context.json()
          if (code === 'INVALID_DOMAIN') {
            throw new Error('Invalid domain')
          }
          if (message) {
            throw new Error(message)
          }
        }

        throw error
      }

      return data
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['domain-names'] })
    },
  })
}
