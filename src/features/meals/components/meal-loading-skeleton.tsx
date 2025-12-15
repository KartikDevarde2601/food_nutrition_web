import { Skeleton } from '@/components/ui/skeleton'

export function MealLoadingSkeleton() {
    return (
        <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column: Image Skeleton */}
                <div className="h-full">
                    <Skeleton className="w-full h-[400px] rounded-md" />
                </div>

                {/* Right Column: Tables Skeleton */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-[200px] w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-[200px] w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}
