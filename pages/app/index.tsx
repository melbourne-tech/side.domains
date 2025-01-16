import { PostgrestError } from '@supabase/supabase-js'
import { useMemo } from 'react'
import AddDomain from '~/components/add-domain'
import DomainCard from '~/components/domain-card'
import DomainOverviewSkeleton from '~/components/domain-card-skeleton'
import AppLayout from '~/components/layouts/AppLayout'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { useDomainNamesLiveQuery } from '~/lib/data/domain-names-query'
import { withAuth } from '~/lib/hocs/with-auth'
import { NextPageWithLayout } from '~/lib/types'

const IndexPage: NextPageWithLayout = () => {
  const {
    data,
    isPending,
    isSuccess,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useDomainNamesLiveQuery()

  const count = data?.pages[0]?.count
  const domainNames = useMemo(
    () => data?.pages.flatMap((page) => page.domainNames) ?? [],
    [data]
  )

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight py-6">
        Domains{isSuccess && ` (${count})`}
      </h2>

      <div className="flex flex-col gap-4">
        <AddDomain />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isPending && (
            <>
              <DomainOverviewSkeleton />
              <DomainOverviewSkeleton />
              <DomainOverviewSkeleton />
              <DomainOverviewSkeleton />
            </>
          )}

          {isError && (
            <Alert variant="destructive" className="md:col-span-2">
              <AlertTitle>Couldn&apos;t load domains</AlertTitle>
              <AlertDescription>
                {(error as unknown as PostgrestError)?.message ??
                  'Something went wrong'}
              </AlertDescription>
            </Alert>
          )}

          {isSuccess &&
            (domainNames.length > 0 ? (
              <>
                {domainNames.map((domainName) => (
                  <DomainCard key={domainName.id} domain={domainName} />
                ))}

                <div className="md:col-span-2">
                  {hasNextPage && (
                    <Button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      isLoading={isFetchingNextPage}
                      variant="secondary"
                    >
                      Load more
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <Alert className="md:col-span-2">
                <AlertTitle>No domains</AlertTitle>
                <AlertDescription>
                  You don&apos;t have any domains yet. Add one to get started.
                </AlertDescription>
              </Alert>
            ))}
        </div>
      </div>
    </>
  )
}

IndexPage.getLayout = (page) => <AppLayout title="Dashboard">{page}</AppLayout>

export default withAuth(IndexPage)
