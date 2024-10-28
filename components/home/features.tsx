import { BellIcon, DollarSignIcon, EyeIcon } from 'lucide-react'
import FeatureSection from './feature-section'

const Features = () => {
  return (
    <>
      <FeatureSection
        id="alerts"
        icon={<BellIcon size={32} />}
        title="Domain Expiry Alerts"
        description="Receive email alert when domains you are watching expire. Get your dream domain at the market price."
        imageUrl="/expiry-notification-email.jpg"
        variant="one"
      />
      <FeatureSection
        id="sell"
        icon={<DollarSignIcon size={32} />}
        title="Sales Pages"
        description="Receive offers on your side project domains with simple sales pages. No commissions, no subscriptions. Secured with SSL/TLS."
        imageUrl="/sales-pages.jpg"
        variant="two"
      />
      <FeatureSection
        id="whois"
        icon={<EyeIcon size={32} />}
        title="Whois Lookup"
        description="Easily lookup and track whois information for any domain name."
        imageUrl="/whois.jpg"
        variant="one"
      />
    </>
  )
}

export default Features
