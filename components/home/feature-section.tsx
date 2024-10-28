import { cn } from '~/lib/utils'

export type FeatureSectionProps = {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  cta?: React.ReactNode
  variant?: 'one' | 'two'
  imageUrl: string
}

const FeatureSection = ({
  id,
  icon,
  title,
  description,
  cta,
  variant = 'one',
  imageUrl,
}: FeatureSectionProps) => {
  return (
    <section
      id={id}
      className={cn(
        'flex justify-center featureSection',
        variant === 'one' && 'bg-gray-50',
        variant === 'two' && 'bg-white'
      )}
    >
      <div
        className={cn(
          'max-w-7xl px-4 flex w-full py-8 lg:py-0 xl:translate-y-24',
          variant === 'one' && 'flex-col-reverse lg:flex-row',
          variant === 'two' && 'flex-col-reverse lg:flex-row-reverse'
        )}
      >
        <div className="flex items-start flex-1 p-4 lg:items-center xl:items-start">
          <div className="flex items-start space-x-4">
            <div className="flex items-center justify-center p-3 text-white -translate-y-1.5 bg-slate-900 rounded-full">
              {icon}
            </div>

            <div className="flex flex-col space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {title}
              </h2>

              <p>{description}</p>

              {cta}
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-xl p-4 mx-auto lg:max-w-none">
          <div className="overflow-hidden bg-white rounded-lg shadow-lg xl:-translate-y-14 aspect-[16/9]">
            <img
              src={imageUrl}
              alt={`Image of ${title}`}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureSection
