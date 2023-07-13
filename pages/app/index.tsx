import { withAuth } from '~/lib/auth'
import { NextPageWithLayout } from '~/lib/types'

const IndexPage: NextPageWithLayout = () => {
  return <div>need auth</div>
}

export default withAuth(IndexPage)
