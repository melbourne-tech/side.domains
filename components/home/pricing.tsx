import { ArrowRightIcon, CheckIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

const tiers = [
  {
    name: 'Open Source',
    id: 'open-source',
    href: 'https://github.com/alaister/side.domains',
    price: 'Free',
    description: 'Run your own side.domains for free!',
    features: ['Self-Hosted', 'Same Great Features'],
    featured: false,
  },
  {
    name: 'Lifetime Unlimited',
    id: 'lifetime-unlimited',
    href: 'https://app.side.domains/sign-in',
    price: '$50',
    description: 'Everything you need to get offers on your domains.',
    features: [
      'Hosted for You',
      'Unlimited Domain Names',
      '0% Commission',
      'Included SSL/TLS',
      'Remove side.domains Branding',
    ],
    featured: true,
  },
]

const Pricing = () => {
  return (
    <div
      className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8"
      id="pricing"
    >
      <div
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
        aria-hidden="true"
      >
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          One time fee, no commissions.
        </h2>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
        No subscription here! Pay once, and you&apos;re done. No commissions, no
        hidden fees.
      </p>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={cn(
              tier.featured
                ? 'relative bg-gray-900 shadow-2xl'
                : 'bg-white/60 sm:mx-8 lg:mx-0',
              tier.featured
                ? ''
                : tierIdx === 0
                ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
                : 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none',
              'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10'
            )}
          >
            <h3
              id={tier.id}
              className={cn(
                tier.featured ? 'text-indigo-400' : 'text-indigo-600',
                'text-base font-semibold leading-7'
              )}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={cn(
                  tier.featured ? 'text-white' : 'text-gray-900',
                  'text-5xl font-bold tracking-tight'
                )}
              >
                {tier.price}
              </span>
              {tier.price !== 'Free' && (
                <span
                  className={cn(
                    tier.featured ? 'text-gray-400' : 'text-gray-500',
                    'text-base'
                  )}
                >
                  one-time payment
                </span>
              )}
            </p>
            <p
              className={cn(
                tier.featured ? 'text-gray-300' : 'text-gray-600',
                'mt-6 text-base leading-7'
              )}
            >
              {tier.description}
            </p>
            <ul
              role="list"
              className={cn(
                tier.featured ? 'text-gray-300' : 'text-gray-600',
                'mt-8 space-y-3 text-sm leading-6 sm:mt-10'
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className={cn(
                      tier.featured ? 'text-indigo-400' : 'text-indigo-600',
                      'h-6 w-5 flex-none'
                    )}
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              asChild
              variant={tier.featured ? 'secondary' : 'outline'}
              className="w-full mt-8"
            >
              <a href={tier.href} aria-describedby={tier.id}>
                Get started now <ArrowRightIcon size={16} />
              </a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Pricing
