import { ArrowRightIcon, CheckIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

const features = [
  'Check domain availability',
  'Watch unlimited domains',
  'Email notifications for expiry',
  'For-sale pages with SSL',
]

const tiers = [
  {
    name: 'Monthly Plan',
    id: 'monthly',
    href: `${process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_URL}/checkout/buy/${process.env.NEXT_PUBLIC_LEMON_SQUEEZY_VARIANT_ID}`,
    price: '$5',
    period: '/month',
    description: 'Pay monthly, cancel anytime',
    ctaText: 'Start Monthly Plan',
    featured: false,
  },
  {
    name: 'Lifetime Access',
    id: 'lifetime',
    href: `${process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_URL}/checkout/buy/${process.env.NEXT_PUBLIC_LEMON_SQUEEZY_VARIANT_ID}`,
    price: '$49',
    period: 'one-time',
    description: 'Pay once, use forever',
    ctaText: 'Get Lifetime Access',
    featured: true,
  },
]

const Pricing = () => {
  return (
    <div
      className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8"
      id="pricing"
    >
      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Simple pricing, complete toolkit
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          All features included. Choose how you want to pay.
        </p>
      </div>

      {/* Features */}
      <div className="mx-auto mt-8 max-w-2xl">
        <div className="rounded-3xl bg-gray-50 p-8 ring-1 ring-gray-200">
          <h3 className="text-sm font-semibold leading-7 text-gray-900">
            Everything included in both plans:
          </h3>
          <ul
            role="list"
            className="mt-4 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2"
          >
            {features.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <CheckIcon
                  className="h-6 w-5 flex-none text-indigo-600"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto mt-16 grid max-w-xl grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-4xl lg:grid-cols-2 lg:gap-x-8">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={cn(
              'rounded-3xl p-8 ring-1',
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
                'mt-6 text-sm leading-6',
                tier.featured ? 'text-gray-300' : 'text-gray-600'
              )}
            >
              {tier.description}
            </p>
            <Button
              asChild
              variant={tier.featured ? 'secondary' : 'outline'}
              className="w-full mt-6"
            >
              <a href={tier.href} aria-describedby={tier.id}>
                {tier.ctaText} <ArrowRightIcon size={16} />
              </a>
            </Button>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-500 mt-8">
        Want to self-host?{' '}
        <a
          href="https://github.com/alaister/side.domains"
          className="text-indigo-600 hover:text-indigo-500"
        >
          The code is on GitHub
        </a>
      </p>
    </div>
  )
}

export default Pricing
