import { ArrowLeft, ArrowRightIcon, CheckIcon } from 'lucide-react'
import { useState } from 'react'
import { useAuthContext } from '~/lib/contexts/auth'
import { cn } from '~/lib/utils'
import CheckoutForm from './checkout-form'
import { Button } from './ui/button'

const sharedFeatures = [
  'Domain Expiry Alerts',
  'Whois Lookup',
  'Sales Pages with SSL/TLS',
  'No Commissions on Sold Domains',
]

const tiers = [
  {
    name: 'Monthly Plan',
    id: 'MONTHLY' as const,
    price: '$5',
    period: '/month',
    description: 'Pay monthly, cancel anytime',
    ctaText: 'Start Monthly Plan',
    featured: false,
    features: [...sharedFeatures],
  },
  {
    name: 'Lifetime Access',
    id: 'LIFETIME' as const,
    price: '$49',
    period: 'one-time',
    description: 'Pay once, use forever',
    ctaText: 'Get Lifetime Access',
    featured: true,
    features: [...sharedFeatures, 'No subscription'],
  },
]

const PurchasePlans = () => {
  const { session } = useAuthContext()
  const isSignedIn = Boolean(session)

  const [planType, setPlanType] = useState<'MONTHLY' | 'LIFETIME' | null>(null)

  if (planType !== null) {
    return (
      <div className="flex flex-col gap-4 mt-4">
        <Button
          variant="outline"
          size="xs"
          className="self-start"
          onClick={() => setPlanType(null)}
        >
          <ArrowLeft size={14} />
          Back to plans
        </Button>
        <CheckoutForm planType={planType} />
      </div>
    )
  }

  return (
    <div className="mx-auto mt-16 grid max-w-xl grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-4xl lg:grid-cols-2 lg:gap-x-8">
      {tiers.map((tier) => (
        <div
          key={tier.id}
          className={cn(
            'rounded-3xl p-8 ring-1 relative flex flex-col',
            tier.featured
              ? 'bg-gray-900 ring-gray-900 text-white'
              : 'ring-gray-200 bg-white'
          )}
        >
          <h3
            className={cn(
              'text-lg font-semibold leading-8',
              tier.featured ? 'text-white' : 'text-gray-900'
            )}
          >
            {tier.name}
          </h3>
          <p className="mt-4 flex items-baseline gap-x-2">
            <span className="text-4xl font-bold tracking-tight">
              {tier.price}
            </span>
            <span
              className={cn(
                'text-sm',
                tier.featured ? 'text-gray-400' : 'text-gray-500'
              )}
            >
              {tier.period}
            </span>
          </p>
          <p
            className={cn(
              'mt-2 text-sm leading-6',
              tier.featured ? 'text-gray-300' : 'text-gray-600'
            )}
          >
            {tier.description}
          </p>

          <ul className="mt-8 space-y-3 flex-1">
            {tier.features.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <CheckIcon
                  className={cn(
                    'h-6 w-5 flex-none',
                    tier.featured ? 'text-gray-300' : 'text-blue-600'
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'text-sm leading-6',
                    tier.featured ? 'text-gray-300' : 'text-gray-600'
                  )}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {isSignedIn ? (
            <Button
              variant={tier.featured ? 'secondary' : 'outline'}
              className="w-full mt-8"
              onClick={() => setPlanType(tier.id)}
            >
              {tier.ctaText} <ArrowRightIcon size={16} />
            </Button>
          ) : (
            <Button
              asChild
              variant={tier.featured ? 'secondary' : 'outline'}
              className="w-full mt-8"
            >
              <a href="https://app.side.domains/" aria-describedby={tier.id}>
                {tier.ctaText} <ArrowRightIcon size={16} />
              </a>
            </Button>
          )}

          {tier.featured && (
            <div className="absolute -top-[6px] -right-3 rotate-[8deg]">
              <div className="bg-blue-600 border-2 border-white text-white px-3 py-1 text-xs uppercase font-semibold rounded-full shadow-lg">
                Most Popular!
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default PurchasePlans
