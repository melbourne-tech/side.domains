import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { z } from 'zod'
import DomainsBackground from '~/components/domains-background'
import SellForm from '~/components/sell/SellForm'
import supabaseAdmin from '~/lib/supabase-admin'

const formSchema = z.object({
  email: z.string().email(),
  offer: z.coerce.number().min(0).or(z.literal('')),
})

export const getStaticPaths: GetStaticPaths = async () => {
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

const ForSalePage = ({
  domain: domainName,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <DomainsBackground domainName={domainName} />

      <div className="bg-white shadow-lg rounded-lg p-4 space-y-6 z-10">
        <h1 className="text-4xl font-semibold leading-none tracking-tight">
          {domainName} may be for sale
        </h1>

        <p>Send an offer using the form below</p>

        <SellForm domainName={domainName} />
      </div>

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
    </div>
  )
}

export default ForSalePage
