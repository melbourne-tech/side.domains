import AddDomain from '~/components/add-domain'
import DomainCard from '~/components/domain-card'
import AppLayout from '~/components/layouts/AppLayout'
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
  } = useDomainNamesQuery()

  return (
    <div>
      <AddDomain />

      {isSuccess &&
        domainNames.map((domainName) => (
          <DomainCard key={domainName.id} domain={domainName.domain_name} />
        ))}
    </div>
  )
}

IndexPage.getLayout = (page) => <AppLayout title="Domains">{page}</AppLayout>

export default withAuth(withPurchased(IndexPage))
