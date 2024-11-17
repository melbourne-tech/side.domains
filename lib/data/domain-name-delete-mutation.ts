import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '../supabase'

export interface DomainDeleteVariables {
  id: string
}

export function useDomainDeleteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DomainDeleteVariables) => {
      const { data, error } = await supabase
        .from('domain_names')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return data
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['domain-names'] })
    },
  })
}
