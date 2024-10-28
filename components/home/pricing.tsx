import PurchasePlans from '../purchase-plans'

const Pricing = () => {
  return (
    <div
      className="relative isolate bg-gray-50 px-6 pt-24 pb-12 lg:px-8 overflow-hidden"
      id="pricing"
    >
      <svg
        className="absolute top-0 invisible transform select-none md:visible right-full translate-x-1/4 lg:translate-x-[70%] -translate-y-[65%]"
        width={404}
        height={404}
        fill="none"
        viewBox="0 0 404 404"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="ad119f34-7694-4c31-947f-5c9d249b21f3"
            x={0}
            y={0}
            width={20}
            height={20}
            patternUnits="userSpaceOnUse"
          >
            <rect
              x={0}
              y={0}
              width={4}
              height={4}
              className="text-gray-200"
              fill="currentColor"
            />
          </pattern>
        </defs>
        <rect
          width={404}
          height={404}
          fill="url(#ad119f34-7694-4c31-947f-5c9d249b21f3)"
        />
      </svg>

      <svg
        className="absolute top-0 invisible transform select-none md:visible left-full -translate-x-1/4 lg:-translate-x-[70%] -translate-y-[65%]"
        width={404}
        height={404}
        fill="none"
        viewBox="0 0 404 404"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="c6876a5a-c877-4512-9e4e-cfc87c75d27c"
            x={0}
            y={0}
            width={20}
            height={20}
            patternUnits="userSpaceOnUse"
          >
            <rect
              x={0}
              y={0}
              width={4}
              height={4}
              className="text-gray-200"
              fill="currentColor"
            />
          </pattern>
        </defs>
        <rect
          width={404}
          height={404}
          fill="url(#c6876a5a-c877-4512-9e4e-cfc87c75d27c)"
        />
      </svg>

      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <p className="text-base font-semibold leading-7 text-blue-600">
          Pricing Plans
        </p>
        <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Get started today
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Choose the plan that works best for you. All features included.
        </p>
      </div>

      {/* Pricing Cards */}
      <PurchasePlans />

      <p className="mt-8 text-center text-sm text-gray-500">
        Want to self-host for free?{' '}
        <a
          href="https://github.com/melbourne-tech/side.domains"
          className="text-blue-600 hover:text-blue-500"
        >
          The code is on GitHub
        </a>
      </p>
    </div>
  )
}

export default Pricing
