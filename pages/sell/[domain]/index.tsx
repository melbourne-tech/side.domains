import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import DomainsBackground from '~/components/domains-background'
import SellForm from '~/components/sell/SellForm'
import { getSupabaseAdminClient } from '~/lib/supabase-admin'
import { NextPageWithLayout } from '~/lib/types'

export const getStaticPaths: GetStaticPaths = async () => {
  const supabaseAdmin = getSupabaseAdminClient()

  const { data, error } = await supabaseAdmin
    .from('domain_names')
    .select('domain_name')
  if (error) throw error

  return {
    paths: data.map(({ domain_name }) => ({
      params: { domain: domain_name },
    })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<{ domain: string }> = async ({
  params,
}) => {
  return {
    props: { domain: params?.domain as string },
  }
}

interface ForSalePageProps
  extends InferGetStaticPropsType<typeof getStaticProps> {
  showPoweredBy?: boolean
}

const ForSalePage: NextPageWithLayout<ForSalePageProps> = ({
  domain: domainName,
  showPoweredBy = true,
}) => {
  return (
    <>
      <DomainsBackground domainName={domainName} />

      <div className="bg-white shadow-lg rounded-lg p-4 space-y-6">
        <h1 className="text-4xl font-semibold leading-none tracking-tight">
          {domainName} may be for sale
        </h1>

        <p>Send an offer using the form below</p>

        <SellForm domainName={domainName} />
      </div>

      {showPoweredBy && (
        <a
          className="fixed bg-white shadow-lg bottom-0 left-8 py-1.5 px-3 rounded-t-lg font-medium group"
          href={`https://side.domains?utm_source=${domainName}&utm_medium=for-sale-page&utm_campaign=for-sale-page`}
          target="_blank"
        >
          ⚡️ Powered by{' '}
          <span className="text-blue-600 group-hover:underline group-hover:text-blue-700 transition-colors">
            side.domains
          </span>
        </a>
      )}
    </>
  )
}

ForSalePage.getLayout = (page) => (
  <div className="flex flex-col items-center justify-center min-h-screen relative">
    {page}
  </div>
)

export default ForSalePage
