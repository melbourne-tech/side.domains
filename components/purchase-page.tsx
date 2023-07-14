import { useUser } from '~/lib/contexts/auth'
import { Button } from './ui/button'

const PurchasePage = () => {
  const user = useUser()

  return (
    <div>
      <Button asChild>
        <a
          href={`${process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_URL}/checkout/buy/${process.env.NEXT_PUBLIC_LEMON_SQUEEZY_VARIANT_ID}?checkout[custom][user_id]=${user?.id}&checkout[email]=${user?.email}`}
        >
          Buy
        </a>
      </Button>
    </div>
  )
}

export default PurchasePage
