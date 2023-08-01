import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import supabase from '../supabase'

export function useSignOutMutation(shouldRedirect = true) {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation(
    async () => {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }
    },
    {
      async onSuccess() {
        if (shouldRedirect) {
          await router.push('/sign-in')
        }

        await queryClient.resetQueries()
      },
    }
  )
}
