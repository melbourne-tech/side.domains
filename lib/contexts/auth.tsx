import { Session } from '@supabase/supabase-js'
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import supabase from '../supabase'
import { useQueryClient } from '@tanstack/react-query'

export type AuthContextValue = {
  session: Session | null
  isLoading: boolean
  refreshSession: () => Promise<Session | null>
}

export const AuthContext = createContext<AuthContextValue>({
  isLoading: true,
  session: null,
  refreshSession: async () => null,
})

export const AuthContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [state, setState] = useState<
    Pick<AuthContextValue, 'session' | 'isLoading'>
  >({
    session: null,
    isLoading: true,
  })

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setState({
        session,
        isLoading: false,
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const refreshSession = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.refreshSession()

    if (session) {
      setState({
        session,
        isLoading: false,
      })
    }

    return session
  }, [])

  const value = useMemo(
    () => ({ ...state, refreshSession }),
    [state, refreshSession]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function getInitialSession() {
  return new Promise((resolve) => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        subscription.unsubscribe()
        resolve(session)
      }
    })
  })
}

export function useAuthContext() {
  return useContext(AuthContext)
}

export function useUser() {
  return useAuthContext().session?.user ?? null
}

export function useUserId() {
  return useUser()?.id ?? null
}

export function useIsSignedIn() {
  return Boolean(useAuthContext().session)
}
