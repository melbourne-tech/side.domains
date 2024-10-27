import { Building, Globe, Phone, Shield, User } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { Badge } from './ui/badge'

type ContactInfo = {
  id?: string
  fax?: string
  city?: string
  name?: string
  email?: string
  phone?: string
  street?: string
  country?: string
  province?: string
  postal_code?: string
  organization?: string
}

type DomainInfo = {
  id?: string
  name?: string
  domain?: string
  status?: string[]
  punycode?: string
  extension?: string
  created_date?: string
  name_servers?: string[]
  updated_date?: string
  whois_server?: string
  expiration_date?: string
  created_date_in_time?: string
  updated_date_in_time?: string
  expiration_date_in_time?: string
}

type RegistrarInfo = {
  id?: string
  name?: string
  email?: string
  phone?: string
  referral_url?: string
}

type WhoisData = {
  domain?: DomainInfo
  registrar?: RegistrarInfo
  technical?: ContactInfo
  registrant?: ContactInfo
  administrative?: ContactInfo
}

interface WhoisInfoProps {
  data: WhoisData
}

const WhoisInfo = ({ data }: WhoisInfoProps) => {
  const renderSection = useCallback(
    (data: Record<string, any> | undefined, excludeFields: string[] = []) => {
      if (!data) return null
      return Object.entries(data)
        .filter(([key]) => !excludeFields.includes(key))
        .map(([key, value]) => (
          <div key={key} className="flex flex-col gap-1 py-1.5 break-all">
            <dt className="text-xs font-semibold text-gray-600 capitalize">
              {key.replace(/_/g, ' ')}
            </dt>
            <dd className="text-sm text-gray-900">
              {Array.isArray(value) ? (
                <div className="flex flex-wrap gap-1">
                  {value.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              ) : (
                value || 'N/A'
              )}
            </dd>
          </div>
        ))
    },
    []
  )

  const primarySection = useMemo(() => {
    if (!data?.domain) return null

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-4 w-4" />
          <h3 className="text-sm font-semibold">Domain Information</h3>
        </div>
        <dl className="divide-y divide-gray-100">
          {renderSection(data.domain, [
            'created_date_in_time',
            'updated_date_in_time',
            'expiration_date_in_time',
          ])}
        </dl>
      </div>
    )
  }, [data.domain, renderSection])

  const contactSections = useMemo(
    () => [
      {
        title: 'Registrar',
        icon: Building,
        data: data?.registrar,
      },
      {
        title: 'Technical Contact',
        icon: Shield,
        data: data?.technical,
      },
      {
        title: 'Registrant',
        icon: User,
        data: data?.registrant,
      },
      {
        title: 'Administrative Contact',
        icon: Phone,
        data: data?.administrative,
      },
    ],
    [data]
  )

  return (
    <div className="space-y-4">
      {primarySection}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contactSections.map(
          ({ title, icon: Icon, data: sectionData }) =>
            sectionData && (
              <div
                key={title}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="h-4 w-4" />
                  <h3 className="text-sm font-semibold">{title}</h3>
                </div>
                <dl className="divide-y divide-gray-100">
                  {renderSection(sectionData)}
                </dl>
              </div>
            )
        )}
      </div>
    </div>
  )
}

export default WhoisInfo
