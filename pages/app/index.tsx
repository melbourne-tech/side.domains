import { PostgrestError } from '@supabase/supabase-js'
import AddDomain from '~/components/add-domain'
import DomainCard from '~/components/domain-card'
import DomainOverviewSkeleton from '~/components/domain-card-skeleton'
import AppLayout from '~/components/layouts/AppLayout'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { useDomainNamesQuery } from '~/lib/data/domain-names-query'
import { withAuth } from '~/lib/hocs/with-auth'
import { withPurchased } from '~/lib/hocs/with-purchased'
import { NextPageWithLayout } from '~/lib/types'

const IndexPage: NextPageWithLayout = () => {
  const {
    data: domainNames,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useDomainNamesQuery()

  return (
    <div className="flex flex-col gap-4">
      <AddDomain />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading && (
          <>
            <DomainOverviewSkeleton />
            <DomainOverviewSkeleton />
            <DomainOverviewSkeleton />
            <DomainOverviewSkeleton />
          </>
        )}

        {isError && (
          <Alert variant="destructive" className="col-span-2">
            <AlertTitle>Couldn&apos;t load domains</AlertTitle>
            <AlertDescription>
              {(error as PostgrestError)?.message ?? 'Something went wrong'}
            </AlertDescription>
          </Alert>
        )}

        {isSuccess && (
          <>
            {domainNames.length > 0 ? (
              domainNames.map((domainName) => (
                <DomainCard key={domainName.id} domain={domainName} />
              ))
            ) : (
              <Alert className="col-span-2">
                <AlertTitle>No domains</AlertTitle>
                <AlertDescription>
                  You don&apos;t have any domains yet. Add one to get started.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </div>
    </div>
  )
}

IndexPage.getLayout = (page) => <AppLayout title="Domains">{page}</AppLayout>

export default withAuth(withPurchased(IndexPage))
