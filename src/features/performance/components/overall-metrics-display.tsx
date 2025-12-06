import { CheckCircle2, Percent, TrendingDown, Activity, Database } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type OverallMetrics } from '../data/schema'

interface OverallMetricsDisplayProps {
    metrics: OverallMetrics | null
    isLoading?: boolean
}

export function OverallMetricsDisplay({ metrics, isLoading }: OverallMetricsDisplayProps) {
    if (isLoading) {
        return (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                <div className='h-4 w-24 animate-pulse rounded bg-muted' />
                            </CardTitle>
                            <div className='h-4 w-4 animate-pulse rounded bg-muted' />
                        </CardHeader>
                        <CardContent>
                            <div className='h-8 w-16 animate-pulse rounded bg-muted' />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (!metrics) {
        return (
            <div className='flex h-32 items-center justify-center rounded-md border border-dashed'>
                <p className='text-sm text-muted-foreground'>No metrics available</p>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                        Dish Matches
                    </CardTitle>
                    <CheckCircle2 className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{metrics['#dMatch']}</div>
                    <p className='text-xs text-muted-foreground'>
                        # of matching dishes
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                        Match Rate
                    </CardTitle>
                    <Percent className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>
                        {metrics['%dMatch']}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                        % of dishes matched
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                        MAE
                    </CardTitle>
                    <TrendingDown className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{metrics.MAE.toFixed(2)}</div>
                    <p className='text-xs text-muted-foreground'>
                        Mean absolute error
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                        RMSE
                    </CardTitle>
                    <Activity className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{metrics.RMSE.toFixed(2)}</div>
                    <p className='text-xs text-muted-foreground'>
                        Root mean squared error
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                        Unique Dishes
                    </CardTitle>
                    <Database className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{metrics.totalUniqueDishes}</div>
                    <p className='text-xs text-muted-foreground'>
                        Total unique dishes
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
