import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '../supabase'

export interface DomainUpdateVariables {
  id: string
  isOwned?: boolean
  statusChangeNotificationsEnabled?: boolean
}

export function useDomainUpdateMutation() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({
      id,
      isOwned,
      statusChangeNotificationsEnabled,
    }: DomainUpdateVariables) => {
      const { data, error } = await supabase
        .from('domain_names')
        .update({
          is_owned: isOwned,
          status_change_notifications_enabled: statusChangeNotificationsEnabled,
        })
        .eq('id', id)

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
