import { Domain } from '~/lib/data/domain-names-query'

interface DomainForSaleProps {
  domain: Domain
}

const DomainForSale = ({ domain }: DomainForSaleProps) => {
  return (
    <div className="my-3 text-left">
      <p className="my-5 text-sm">
        Set the following DNS records for your domain:
      </p>

      <div className="bg-gray-50 rounded-md p-4">
        {/* Headers */}
        <div className="flex justify-start items-start mb-4">
          <div className="w-20">
            <p className="text-sm font-bold">Type</p>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">Name</p>
          </div>
          <div className="w-32">
            <p className="text-sm font-bold">Value</p>
          </div>
        </div>

        {/* DNS Records */}
        <div className="flex flex-col gap-3">
          {/* Apex domain record */}
          <div className="flex justify-start items-center">
            <div className="w-20">
              <p className="text-sm font-mono">A</p>
            </div>
            <div className="flex-1">
              <p className="text-sm font-mono">{domain.domain_name}</p>
            </div>
            <div className="w-32">
              <p className="text-sm font-mono">209.38.6.142</p>
            </div>
          </div>

          <hr />

          {/* WWW record */}
          <div className="flex justify-start items-center">
            <div className="w-20">
              <p className="text-sm font-mono">A</p>
            </div>
            <div className="flex-1">
              <p className="text-sm font-mono">www.{domain.domain_name}</p>
            </div>
            <div className="w-32">
              <p className="text-sm font-mono">209.38.6.142</p>
            </div>
          </div>
        </div>
      </div>

      <p className="my-5 text-sm">
        If you&apos;re using Cloudflare, make sure you set your SSL setting to
        Full (strict). Otherwise you may experience redirect loops.
      </p>
    </div>
  )
}

export default DomainForSale
