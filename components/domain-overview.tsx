import { format, isPast } from 'date-fns'
import { Calendar, Globe } from 'lucide-react'
import { Domain } from '~/lib/data/domain-names-query'
import { Badge } from './ui/badge'
import { cn } from '~/lib/utils'

interface DomainOverviewProps {
  domain: Domain
}

const getStatusColor = (status: Domain['status']) => {
  switch (status) {
    case 'registered':
      return 'bg-green-500'
    case 'available':
      return 'bg-blue-500'
    case 'unknown':
    default:
      return 'bg-gray-500'
  }
}

const DomainOverview = ({ domain }: DomainOverviewProps) => {
  const expiryDate = domain.expires_at !== null && new Date(domain.expires_at)
  const isExpired = expiryDate && isPast(expiryDate)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{domain.domain_name}</span>
        </div>
        <Badge className={cn(getStatusColor(domain.status), 'text-white')}>
          {domain.status}
        </Badge>
      </div>
      {expiryDate && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>
            Expires: {format(expiryDate, 'MMM d, yyyy')}
            {isExpired && (
              <span className="ml-2 text-red-500 font-medium">(Expired)</span>
            )}
          </span>
        </div>
      )}
    </div>
  )
}

export default DomainOverview
