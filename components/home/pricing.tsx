import { CheckIcon } from 'lucide-react'
import PurchasePlans from '../purchase-plans'

const features = [
  'Check domain availability',
  'Watch unlimited domains',
  'Email notifications for expiry',
  'For-sale pages with SSL',
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
      <PurchasePlans />

      <p className="text-center text-sm text-gray-500 mt-8">
        Want to self-host?{' '}
        <a
          href="https://github.com/melbourne-tech/side.domains"
          className="text-indigo-600 hover:text-indigo-500"
        >
          The code is on GitHub
        </a>
      </p>
    </div>
  )
}

export default Pricing
