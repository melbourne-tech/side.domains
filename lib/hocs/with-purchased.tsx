import { ComponentType } from 'react'
import PurchasePlans from '~/components/purchase-plans'
import { useUserDataQuery } from '../data/user-data-query'
import { isNextPageWithLayout } from '../types'

export function withPurchased<TProps extends object>(
  Component: ComponentType<TProps>
) {
  function PurchasedWrapper(props: TProps) {
    const { data, isSuccess } = useUserDataQuery()

    if (isSuccess && !data.isSubscribed) {
      return (
        <div className="flex flex-col mt-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Subscribe to get started
          </h2>

          <PurchasePlans />
        </div>
      )
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
