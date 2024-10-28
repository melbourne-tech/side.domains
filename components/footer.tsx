import { GithubIcon, TwitterIcon } from 'lucide-react'

const SOCIAL = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/melb_dot_tech',
    icon: <TwitterIcon className="h-6 w-6" aria-hidden="true" />,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/melbourne-tech/side.domains',
    icon: <GithubIcon className="h-6 w-6" aria-hidden="true" />,
  },
]

const CURRENT_YEAR = new Date().getFullYear()

const Footer = () => {
  return (
    <div className="mt-16 border-t border-gray-950/10 p-4 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24">
      <div className="flex space-x-6 md:order-2">
        {SOCIAL.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-gray-500 hover:text-gray-400"
          >
            <span className="sr-only">{item.name}</span>
            {item.icon}
          </a>
        ))}
      </div>
      <p className="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
        &copy; {CURRENT_YEAR}{' '}
        <a
          href="https://www.melbournetech.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Melbourne Tech, LLC
        </a>
        . All rights reserved.
      </p>
    </div>
  )
}

export default Footer
