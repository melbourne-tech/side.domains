import { ComponentType } from 'react'
import PurchasePage from '~/components/purchase-page'
import { useUserDataQuery } from '../data/user-data-query'
import { isNextPageWithLayout } from '../types'

export function withPurchased<TProps extends object>(
  Component: ComponentType<TProps>
) {
  function PurchasedWrapper(props: TProps) {
    const { data, isSuccess } = useUserDataQuery()

    if (isSuccess && !data.hasPurchased) {
      return <PurchasePage />
    }

    return <Component {...props} />
  }

  PurchasedWrapper.displayName = `withPurchased(${
    Component.displayName ?? Component.name
  })`

  if (isNextPageWithLayout(Component)) {
    PurchasedWrapper.getLayout = Component.getLayout
  }

  return PurchasedWrapper
}
