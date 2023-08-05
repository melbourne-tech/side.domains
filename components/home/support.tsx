import { MailIcon } from 'lucide-react'

const Support = () => {
  return (
    <div className="flex flex-col gap-4 mx-auto max-w-2xl text-center lg:max-w-4xl">
      <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Any questions?
      </h2>

      <p className="text-lg text-gray-600">
        We&apos;d love to hear from you. Get in touch and we&apos;ll get back to
        you as soon as we can.
      </p>

      <a
        href="mailto:support@side.domains"
        className="flex gap-2 items-center justify-center text-blue-600 group-hover:underline group-hover:text-blue-700 transition-colors"
      >
        <MailIcon size={18} />
        <span>support@side.domains</span>
      </a>
    </div>
  )
}

export default Support
