import { format, formatDistance, isPast } from 'date-fns'
import {
  BadgeDollarSign,
  Calendar,
  Check,
  CircleDot,
  CircleHelp,
  Globe,
  Lock,
  RefreshCw,
  Settings2,
  TriangleAlert,
} from 'lucide-react'
import { useDomainUpdateMutation } from '~/lib/data/domain-name-update-mutation'
import { Domain } from '~/lib/data/domain-names-query'
import { useUpdateWhoisMutation } from '~/lib/data/update-whois-mutation'
import { cn } from '~/lib/utils'
import DomainForSale from './domain-for-sale'
import DomainSettings from './domain-settings'
import { Badge } from './ui/badge'
import { BlurOverlay } from './ui/blur-overlay'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import DomainInfo from './WhoisInfo'

interface DomainCardProps {
  domain: Domain
}

const getStatusDetails = (status: Domain['status']) => {
  switch (status) {
    case 'registered':
      return {
        color: 'bg-blue-600',
        icon: Lock,
      }
    case 'available':
      return {
        color: 'bg-green-600',
        icon: Check,
      }
    case 'unknown':
    default:
      return {
        color: 'bg-gray-600',
        icon: CircleHelp,
      }
  }
}

const DomainCard = ({ domain }: DomainCardProps) => {
  const { mutate: updateDomain, isPending: isUpdatingDomain } =
    useDomainUpdateMutation()
  const { mutate: updateWhois, isPending: isUpdatingWhois } =
    useUpdateWhoisMutation()

  const expiryDate = domain.expires_at !== null && new Date(domain.expires_at)
  const isExpired = expiryDate && isPast(expiryDate)
  const daysUntilExpiry = expiryDate
    ? Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null
  const statusDetails = getStatusDetails(domain.status)
  const StatusIcon = statusDetails.icon

  return (
    <Sheet>
      <SheetTrigger className="rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
        <Card className="h-full transition transform hover:scale-[1.01] hover:shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-baseline gap-2">
              <Globe className="w-4 h-4 text-gray-600" />
              <CardTitle className="text-2xl">{domain.domain_name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <CircleDot className="w-4 h-4 text-gray-600" />
                <Badge
                  className={cn(
                    statusDetails.color,
                    'text-white flex items-center gap-1.5 shadow-md'
                  )}
                >
                  <StatusIcon className="w-3 h-3" />
                  {domain.status}
                </Badge>
                {isExpired && (
                  <Badge className="bg-orange-600 text-white flex items-center gap-1.5 shadow-md">
                    <TriangleAlert className="w-3 h-3" />
                    Expired
                  </Badge>
                )}
              </div>
            </div>
            {expiryDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">
                  Expires on {format(expiryDate, 'MMM d, yyyy')}
                  {daysUntilExpiry !== null && ` (${daysUntilExpiry} days)`}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </SheetTrigger>

      <SheetContent className="w-full max-w-3xl flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">{domain.domain_name}</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="whois">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="whois" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>Whois</span>
            </TabsTrigger>
            <TabsTrigger
              value="for_sale_page"
              className="flex items-center gap-1"
            >
              <BadgeDollarSign className="h-4 w-4" />
              <span>For Sale Page</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings2 className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whois" className="flex flex-col gap-2">
            <div className="flex items-center justify-end gap-2 my-2">
              {domain.whois_updated_at && (
                <span className="text-sm font-medium text-gray-700">
                  Last updated{' '}
                  {formatDistance(
                    new Date(domain.whois_updated_at),
                    new Date(),
                    {
                      includeSeconds: true,
                      addSuffix: true,
                    }
                  )}
                </span>
              )}

              <Button
                size="xs"
                onClick={() => {
                  updateWhois({ id: domain.id })
                }}
                isLoading={isUpdatingWhois}
                disabled={isUpdatingWhois}
              >
                <RefreshCw className="h-3 w-3" />
                Refresh Whois
              </Button>
            </div>

            {domain.whois_data ? (
              <DomainInfo data={domain.whois_data as unknown as any} />
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold">Whois Information</h3>
                </div>
                <p className="text-sm">No whois information available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="for_sale_page">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BadgeDollarSign className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-semibold">For Sale Page</h3>
              </div>

              <BlurOverlay
                isBlurred={!domain.is_owned}
                title="Domain must be owned to enable for sale page"
                buttonText="Mark as Owned"
                onClick={() => {
                  updateDomain({
                    id: domain.id,
                    isOwned: true,
                  })
                }}
                isLoading={isUpdatingDomain}
              >
                <DomainForSale domain={domain} />
              </BlurOverlay>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <DomainSettings domain={domain} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

export default DomainCard
