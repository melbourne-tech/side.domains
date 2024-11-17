import { Settings2, Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { Switch } from '~/components/ui/switch'
import { useDomainDeleteMutation } from '~/lib/data/domain-name-delete-mutation'
import { useDomainUpdateMutation } from '~/lib/data/domain-name-update-mutation'
import { Domain } from '~/lib/data/domain-names-query'

interface DomainSettingsProps {
  domain: Domain
}

const DomainSettings = ({ domain }: DomainSettingsProps) => {
  const { mutate: updateDomain, isPending: isUpdatingDomain } =
    useDomainUpdateMutation()
  const { mutate: deleteDomain, isPending: isDeletingDomain } =
    useDomainDeleteMutation()

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-semibold">Settings</h3>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="owns-domain">I own this domain</Label>
            <p className="text-sm text-gray-500">
              Mark this domain as owned and optionally enable for sale page for
              this domain
            </p>
          </div>
          <Switch
            id="owns-domain"
            checked={domain.is_owned}
            onCheckedChange={() => {
              updateDomain({
                id: domain.id,
                isOwned: !domain.is_owned,
              })
            }}
            disabled={isUpdatingDomain}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Status change notifications</Label>
            <p className="text-sm text-gray-500">
              Receive alerts when domain status changes
            </p>
          </div>
          <Switch
            id="notifications"
            checked={domain.status_change_notifications_enabled}
            onCheckedChange={() => {
              updateDomain({
                id: domain.id,
                statusChangeNotificationsEnabled:
                  !domain.status_change_notifications_enabled,
              })
            }}
            disabled={isUpdatingDomain}
          />
        </div>

        <Separator className="my-4" />

        <div className="pt-2">
          <Button
            onClick={() => deleteDomain({ id: domain.id })}
            disabled={isDeletingDomain}
            isLoading={isDeletingDomain}
            variant="destructive"
            className="w-full"
          >
            <Trash2 className="h-4 w-4" />
            Remove Domain
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DomainSettings
