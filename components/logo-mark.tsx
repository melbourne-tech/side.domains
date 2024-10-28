interface LogoMarkProps {
  size?: number
  className?: string
}

const LogoMark = ({ size = 48, className }: LogoMarkProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <radialGradient id="a" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stopColor="#1e293b"></stop>
          <stop offset="100%" stopColor="#0f172a"></stop>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#a)" rx="16" />
      <path
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
        d="M30 20h20l20 30-20 30H30"
      />
    </svg>
  )
}

export default LogoMark
