import { withAuth } from '~/lib/hocs/with-auth'
import { withPurchased } from '~/lib/hocs/with-purchased'
import { NextPageWithLayout } from '~/lib/types'

const IndexPage: NextPageWithLayout = () => {
  return <div>Authenticated &amp; Purchased</div>
}

export default withAuth(withPurchased(IndexPage))
