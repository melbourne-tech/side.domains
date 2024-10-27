import { Card, CardContent, CardHeader } from './ui/card'
import { Skeleton } from './ui/skeleton'

const DomainOverviewSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full" /> {/* Globe icon */}
          <Skeleton className="h-6 w-32" /> {/* Domain name */}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full" /> {/* Status icon */}
            <Skeleton className="h-4 w-10" /> {/* "Status:" text */}
          </div>
          <Skeleton className="h-5 w-24" /> {/* Status badge */}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full" /> {/* Calendar icon */}
            <Skeleton className="h-4 w-10" /> {/* "Expires:" text */}
          </div>
          <Skeleton className="h-5 w-24" /> {/* Expires date */}
        </div>
      </CardContent>
    </Card>
  )
}

export default DomainOverviewSkeleton
