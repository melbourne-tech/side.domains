import AddDomain from '~/components/add-domain'
import DomainCard from '~/components/domain-card'
import AppLayout from '~/components/layouts/AppLayout'
import { DomainName, useDomainNamesQuery } from '~/lib/data/domain-names-query'
import { withAuth } from '~/lib/hocs/with-auth'
import { withPurchased } from '~/lib/hocs/with-purchased'
import { NextPageWithLayout } from '~/lib/types'

const IndexPage: NextPageWithLayout = () => {
  const {
    data: domainNames,
    isLoading,
    isSuccess,
    isError,
  } = useDomainNamesQuery()

  const apexDomains = domainNames?.filter(
    (domainName) => !domainName.domain_name.startsWith('www.')
  )

  const groupedDomains = apexDomains?.map((domainName) =>
    [
      domainName,
      domainNames?.find(
        (d) => d.domain_name === `www.${domainName.domain_name}`
      ),
    ].filter(Boolean)
  ) as [DomainName, DomainName | undefined][] | undefined

  return (
    <div>
      <AddDomain />

      {isSuccess &&
        groupedDomains?.map(([domainName, wwwDomainName]) => (
          <DomainCard
            key={domainName.id}
            domain={domainName.domain_name}
            wwwDomain={wwwDomainName?.domain_name}
          />
        ))}
    </div>
  )
}

IndexPage.getLayout = (page) => <AppLayout title="Domains">{page}</AppLayout>

export default withAuth(withPurchased(IndexPage))
