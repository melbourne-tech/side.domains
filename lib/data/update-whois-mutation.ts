import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '../supabase'

export interface UpdateWhoisVariables {
  id: string
}

export function useUpdateWhoisMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: UpdateWhoisVariables) => {
      const { data, error } = await supabase.functions.invoke('update-whois', {
        body: { id },
      })

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
