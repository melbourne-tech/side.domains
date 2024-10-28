import Link from 'next/link'
import LogoMark from './logo-mark'

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <LogoMark size={28} />
      <div className="flex flex-col">
        <span className="font-medium leading-5">side.domains</span>
        <span className="text-[11px] leading-none text-gray-600 font-light">
          by Melbourne Tech
        </span>
      </div>
    </Link>
  )
}

export default Logo
