import { useRouter } from 'next/router'
import { ComponentType, useEffect } from 'react'
import { useAuthContext } from '../contexts/auth'

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
