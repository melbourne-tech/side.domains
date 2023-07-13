import { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import {
  ComponentType,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import supabase from './supabase'

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
  const [state, setState] = useState({
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

export function withAuth<TProps extends object>(
  Component: ComponentType<TProps>
) {
  function AuthWrapper(props: TProps) {
    const { push } = useRouter()
    const { isLoading, session } = useAuthContext()
    const isSignedIn = Boolean(session)

    useEffect(() => {
      if (!isLoading && !isSignedIn) {
        push('/sign-in')
      }
    }, [isLoading, isSignedIn, push])

    return <Component {...props} />
  }

  AuthWrapper.displayName = `withAuth(${
    Component.displayName ?? Component.name
  })`

  return AuthWrapper
}
