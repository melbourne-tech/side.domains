import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { prefetchUserData } from '../data/user-data-query'
import { getInitialSession } from './auth'

const getPromises = () => [getInitialSession(), prefetchUserData()]

export const PreloadedContext = createContext(false)

export const PreloadedContextProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [isFinishedLoading, setIsFinishedLoading] = useState<boolean>(false)

  useEffect(() => {
    let mounted = true

    Promise.allSettled(getPromises()).then(() => {
      if (mounted) {
        setIsFinishedLoading(true)
      }
    })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <PreloadedContext.Provider value={isFinishedLoading}>
      {children}
    </PreloadedContext.Provider>
  )
}

export function usePreloadedContext() {
  return useContext(PreloadedContext)
}

export function useIsInitialLoadFinished() {
  const isFinishedLoading = usePreloadedContext()

  return isFinishedLoading
}
