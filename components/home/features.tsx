import { BellIcon, CheckCircle2Icon, EyeIcon, TagIcon } from 'lucide-react'

const features = [
  {
    name: 'Check & Watch Domains',
    description:
      "Check if a domain is available. If it's taken, we'll watch it and let you know when it expires.",
    icon: EyeIcon,
  },
  {
    name: 'Get Notified',
    description:
      "Email notifications when domains you're watching become available. No more manual checking.",
    icon: BellIcon,
  },
  {
    name: 'Sell Your Domains',
    description:
      "Create landing pages for domains you're not using. Includes SSL and a contact form. 0% commissions.",
    icon: TagIcon,
  },
  {
    name: 'Complete Toolkit',
    description:
      'Everything you need to manage domains for your side projects, all in one place.',
    icon: CheckCircle2Icon,
  },
]

const Features = () => {
  return (
    <div className="bg-white py-24 sm:py-32" id="how-it-works">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            How it works
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your domain toolkit workflow
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            From checking availability to selling unused domains, everything you
            need for managing side project domains is right here.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon
                    className="h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

export default Features
